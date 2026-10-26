"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Trophy, RotateCw, Check, Copy, Gift } from "lucide-react";
import { flavors } from "@/data/flavors";
import { usePack } from "./PackProvider";

// ─── Wheel slices ───────────────────────────────────────────────
type WheelSlice = {
  id: string;
  label: string;
  sub: string;
  color: string;
  textColor: string;
  isWin: boolean;
  prizeType: "drink" | "discount" | "perk" | "none";
  flavorId?: string;
  code?: string;
};

const WHEEL_SLICES: WheelSlice[] = [
  {
    id: "slice-1",
    label: "Coconut Shake",
    sub: "FREE BOTTLE",
    color: "#DDECEA",
    textColor: "#1F1A17",
    isWin: true,
    prizeType: "drink",
    flavorId: "coconut-milkshake",
  },
  {
    id: "slice-2",
    label: "15% VIP Off",
    sub: "PROMO CODE",
    color: "#D9922E",
    textColor: "#FFFFFF",
    isWin: true,
    prizeType: "discount",
    code: "VIP15",
  },
  {
    id: "slice-3",
    label: "Mango Shake",
    sub: "FREE BOTTLE",
    color: "#F9E3BE",
    textColor: "#1F1A17",
    isWin: true,
    prizeType: "drink",
    flavorId: "mango-milkshake",
  },
  {
    id: "slice-4",
    label: "Better Luck",
    sub: "NEXT SIP",
    color: "#1F1A17",
    textColor: "#F9F6F0",
    isWin: false,
    prizeType: "none",
  },
  {
    id: "slice-5",
    label: "Coco Blast",
    sub: "FREE BOTTLE",
    color: "#E8DCD0",
    textColor: "#1F1A17",
    isWin: true,
    prizeType: "drink",
    flavorId: "coco-blast",
  },
  {
    id: "slice-6",
    label: "Free 6th Bottle",
    sub: "ON 5-PACK",
    color: "#1E4D3A",
    textColor: "#FFFFFF",
    isWin: true,
    prizeType: "perk",
    code: "SIXTHFREE",
  },
  {
    id: "slice-7",
    label: "Banana Breeze",
    sub: "FREE BOTTLE",
    color: "#F4EEC8",
    textColor: "#1F1A17",
    isWin: true,
    prizeType: "drink",
    flavorId: "banana-breeze",
  },
  {
    id: "slice-8",
    label: "Sugarcane",
    sub: "FREE BOTTLE",
    color: "#E9F0DA",
    textColor: "#1F1A17",
    isWin: true,
    prizeType: "drink",
    flavorId: "sugarcane-splash",
  },
];

// ─── Web Audio Sound Helpers ────────────────────────────────────
// All sounds are synthesized via the Web Audio API — no external files needed.

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Short click/tick sound as the wheel passes each slice boundary */
function playTick() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800 + Math.random() * 400, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Silently fail if audio is unavailable
  }
}

/** Bright celebratory chime when a prize is won */
function playWinChime() {
  try {
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.5);
    });
  } catch {
    // Silently fail
  }
}

/** Descending "wah wah" for "Better Luck" */
function playLoseSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  } catch {
    // Silently fail
  }
}

// ─── Component ──────────────────────────────────────────────────

export default function GameSection() {
  const { add, openDrawer } = usePack();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSlice | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(2);
  const [copiedCode, setCopiedCode] = useState(false);

  // Confetti canvas
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Ref to track rotation for tick sounds
  const lastTickAngle = useRef(0);
  const animFrameRef = useRef(0);
  const wheelDivRef = useRef<HTMLDivElement>(null);

  // Tick sound engine: reads the current CSS rotation and plays a tick each time a slice boundary is crossed
  const startTickEngine = useCallback(() => {
    const sliceAngle = 360 / WHEEL_SLICES.length;
    lastTickAngle.current = rotation;

    const tick = () => {
      const div = wheelDivRef.current;
      if (!div) return;
      // Read the computed rotation from the element's transform style
      const style = window.getComputedStyle(div);
      const matrix = style.transform;
      if (matrix && matrix !== "none") {
        // parse rotation from matrix
        const values = matrix.split("(")[1]?.split(")")[0]?.split(",");
        if (values && values.length >= 2) {
          const a = parseFloat(values[0]);
          const b = parseFloat(values[1]);
          const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          const normalizedAngle = ((angle % 360) + 360) % 360;
          const lastNorm = ((lastTickAngle.current % 360) + 360) % 360;
          // Check if we crossed a slice boundary
          const lastSliceIdx = Math.floor(lastNorm / sliceAngle);
          const currentSliceIdx = Math.floor(normalizedAngle / sliceAngle);
          if (currentSliceIdx !== lastSliceIdx) {
            playTick();
          }
          lastTickAngle.current = normalizedAngle;
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [rotation]);

  const stopTickEngine = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTickEngine();
  }, [stopTickEngine]);

  // Confetti burst
  const burstConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const colors = ["#D9922E", "#1E4D3A", "#F3B04A", "#6FB5B3", "#E2DED5", "#4A352B"];
    const particles = Array.from({ length: 90 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01,
      rotation: Math.random() * 360,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25;
          p.alpha -= p.decay;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });
      if (alive) {
        requestAnimationFrame(render);
      }
    };
    render();
  };

  const spinWheel = () => {
    if (spinning || spinsLeft <= 0) return;
    setSpinning(true);
    setWonPrize(null);
    setCopiedCode(false);

    // Init audio context on user gesture (required by browsers)
    getAudioCtx();

    // Pick a winning index: bias towards actual prizes
    const winningIndices = [0, 1, 2, 4, 5, 6, 7];
    const targetIndex = winningIndices[Math.floor(Math.random() * winningIndices.length)];
    const sliceAngle = 360 / WHEEL_SLICES.length;

    const targetSliceCenter = targetIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const finalAngle = extraSpins + (360 - targetSliceCenter) + 270;

    setRotation((prev) => prev + finalAngle);

    // Start tick sounds
    // Slight delay so the CSS transition kicks in first
    setTimeout(() => startTickEngine(), 50);

    setTimeout(() => {
      stopTickEngine();
      setSpinning(false);
      setSpinsLeft((s) => Math.max(0, s - 1));
      const prize = WHEEL_SLICES[targetIndex];
      setWonPrize(prize);

      // Play win or lose sound
      if (prize.isWin) {
        playWinChime();
      } else {
        playLoseSound();
      }

      burstConfetti();
    }, 4500);
  };

  const claimDrinkPrize = (flavorId: string) => {
    add(flavorId);
    openDrawer();
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <section id="arcade" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      {/* Confetti celebration canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-sand/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-luxe text-ink">
            <Sparkles size={14} className="text-gold" /> The 1% Club Lucky Spin
          </div>
          <h2 className="mt-4 font-serif text-4xl font-medium uppercase leading-[1.05] tracking-[0.03em] sm:text-5xl lg:text-6xl text-ink">
            Spin &amp; <br />
            <em className="font-medium normal-case italic text-forest">Taste Your Luck.</em>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70 sm:text-base">
            Win a complimentary 1% Club drink or unlock exclusive VIP discounts for your preorder pack.
          </p>
        </div>

        {/* THE 1% LUCKY SPIN WHEEL */}
        <div className="mt-12 rounded-3xl border border-ink/10 bg-sand/25 p-6 shadow-sm sm:p-10 lg:p-12 animate-in fade-in">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Wheel Graphic */}
            <div className="relative mx-auto flex flex-col items-center justify-center lg:col-span-6">
              {/* Pointer indicator */}
              <div className="absolute -top-3 left-1/2 z-30 -translate-x-1/2">
                <div className="h-0 w-0 border-x-[14px] border-t-[24px] border-x-transparent border-t-gold drop-shadow-md" />
              </div>

              {/* The Rotating Wheel */}
              <div className="relative h-[320px] w-[320px] sm:h-[400px] sm:w-[400px]">
                <div
                  ref={wheelDivRef}
                  className="relative h-full w-full rounded-full border-[8px] border-gold/40 shadow-2xl overflow-hidden transition-transform ease-[cubic-bezier(0.15,0.9,0.25,1)]"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: spinning ? "4500ms" : "0ms",
                  }}
                >
                  {/* SVG Wheel Slices */}
                  <svg viewBox="0 0 400 400" className="h-full w-full">
                    {WHEEL_SLICES.map((slice, i) => {
                      const total = WHEEL_SLICES.length;
                      const angle = 360 / total;
                      const startAngle = (i * angle * Math.PI) / 180;
                      const endAngle = ((i + 1) * angle * Math.PI) / 180;

                      const x1 = 200 + 195 * Math.cos(startAngle);
                      const y1 = 200 + 195 * Math.sin(startAngle);
                      const x2 = 200 + 195 * Math.cos(endAngle);
                      const y2 = 200 + 195 * Math.sin(endAngle);

                      const midAngle = ((i + 0.5) * angle * Math.PI) / 180;
                      const textRadius = 135;
                      const tx = 200 + textRadius * Math.cos(midAngle);
                      const ty = 200 + textRadius * Math.sin(midAngle);
                      const deg = (i + 0.5) * angle + 90;

                      return (
                        <g key={slice.id}>
                          <path
                            d={`M 200 200 L ${x1} ${y1} A 195 195 0 0 1 ${x2} ${y2} Z`}
                            fill={slice.color}
                            stroke="#D4AF37"
                            strokeWidth="1.5"
                          />
                          <text
                            x={tx}
                            y={ty}
                            fill={slice.textColor}
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="var(--font-sans)"
                            textAnchor="middle"
                            dominantBaseline="central"
                            transform={`rotate(${deg}, ${tx}, ${ty})`}
                          >
                            {slice.label}
                          </text>
                          <text
                            x={tx}
                            y={ty + 13}
                            fill={slice.textColor}
                            opacity="0.75"
                            fontSize="8"
                            fontWeight="600"
                            letterSpacing="0.5"
                            fontFamily="var(--font-sans)"
                            textAnchor="middle"
                            dominantBaseline="central"
                            transform={`rotate(${deg}, ${tx}, ${ty})`}
                          >
                            {slice.sub}
                          </text>
                        </g>
                      );
                    })}
                    {/* Outer metallic ring */}
                    <circle cx="200" cy="200" r="195" fill="none" stroke="#D4AF37" strokeWidth="4" />
                  </svg>

                  {/* Center Knob */}
                  <div className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold bg-ink text-center text-cream shadow-xl">
                    <span className="font-serif text-xs font-semibold tracking-widest text-gold uppercase">
                      1% CLUB
                    </span>
                  </div>
                </div>
              </div>

              {/* Spin Button */}
              <div className="mt-8 mb-4 flex flex-col items-center gap-2 pb-6">
                <button
                  type="button"
                  onClick={spinWheel}
                  disabled={spinning || spinsLeft <= 0}
                  className="btn btn-dark !px-10 !py-4 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  <RotateCw size={17} className={spinning ? "animate-spin" : ""} />
                  {spinning ? "Spinning..." : spinsLeft > 0 ? "SPIN THE WHEEL" : "Out of Spins for Today"}
                </button>
                <span className="text-xs font-semibold text-ink/60">
                  {spinsLeft} complimentary spin{spinsLeft === 1 ? "" : "s"} remaining
                </span>
              </div>
            </div>

            {/* Prize & Result Card */}
            <div className="flex flex-col justify-center lg:col-span-6">
              {!wonPrize ? (
                <div className="rounded-2xl border border-ink/10 bg-cream p-7 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest">
                    <Gift size={16} /> Authentic Member Giveaway
                  </div>
                  <h3 className="mt-3 font-serif text-3xl font-medium text-ink">
                    Every spin has a taste of luxury.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">
                    Spin to win a free bottle of our Coconut Milkshake, Mango Milkshake, Coco Blast or unlock up to 15% VIP discounts for your preorder pack.
                  </p>
                  <ul className="mt-5 space-y-2.5 text-xs text-ink/80">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-forest" /> Instantly added to your preorder pack
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-forest" /> Zero purchase necessary to participate
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-forest" /> 100% natural small-batch kitchen recipe
                    </li>
                  </ul>

                  {/* Sound indicator */}
                  <div className="mt-5 flex items-center gap-2 rounded-full bg-sand/70 px-3 py-1.5 w-fit text-[10px] font-semibold text-ink/50">
                    🔊 Sound effects enabled — make sure your volume is on!
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-gold/60 bg-cream p-8 shadow-xl animate-in zoom-in-95 duration-500">
                  <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                    🎉 Lucky Spin Winner
                  </span>
                  <h3 className="mt-3 font-serif text-3xl font-bold text-ink">
                    {wonPrize.label}
                  </h3>
                  <p className="mt-2 text-sm text-forest font-medium">
                    {wonPrize.sub}
                  </p>

                  {wonPrize.prizeType === "drink" && wonPrize.flavorId && (
                    <div className="mt-5">
                      <p className="text-xs text-ink/70">
                        Congratulations! Your free bottle of <strong>{wonPrize.label}</strong> is ready to be claimed with your pack.
                      </p>
                      <button
                        type="button"
                        onClick={() => claimDrinkPrize(wonPrize.flavorId!)}
                        className="mt-4 btn btn-dark w-full !py-3.5"
                      >
                        Claim &amp; Add to My Pack →
                      </button>
                    </div>
                  )}

                  {wonPrize.prizeType === "discount" && wonPrize.code && (
                    <div className="mt-5">
                      <p className="text-xs text-ink/70">
                        Use code <strong>{wonPrize.code}</strong> when ordering to receive your exclusive 15% VIP discount!
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <code className="flex-1 rounded-xl bg-sand p-3 text-center text-sm font-bold tracking-widest text-ink">
                          {wonPrize.code}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyPromoCode(wonPrize.code!)}
                          className="btn btn-dark !py-3 !px-4"
                        >
                          {copiedCode ? <Check size={15} /> : <Copy size={15} />}
                          {copiedCode ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}

                  {wonPrize.prizeType === "perk" && (
                    <div className="mt-5">
                      <p className="text-xs text-ink/70">
                        Order any 5-pack and get your 6th bottle absolutely free! Mention code <strong>SIXTHFREE</strong> in your note.
                      </p>
                      <button
                        type="button"
                        onClick={openDrawer}
                        className="mt-4 btn btn-dark w-full !py-3.5"
                      >
                        Build Your 5-Pack Now →
                      </button>
                    </div>
                  )}

                  {wonPrize.prizeType === "none" && (
                    <div className="mt-5">
                      <p className="text-xs text-ink/70">
                        So close! Refresh your energy and spin again with your next complimentary spin.
                      </p>
                      <button
                        type="button"
                        onClick={spinWheel}
                        disabled={spinsLeft <= 0}
                        className="mt-4 btn btn-ghost w-full !py-3"
                      >
                        Spin Again ({spinsLeft} left)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
