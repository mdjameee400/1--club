"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { flavors } from "@/data/flavors";
import Bottle from "./Bottle";
import { usePack } from "./PackProvider";

/** index 0 is the intro panel; 1–5 are the bottles */
const tints = ["#F9F6F0", ...flavors.map((f) => f.tint)];

export default function Showcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { add, counts } = usePack();

  // Dynamic background tint follows the active bottle
  useEffect(() => {
    if (!section.current) return;
    gsap.to(section.current, {
      backgroundColor: tints[active],
      duration: 0.9,
      ease: "power2.out",
      overwrite: true,
    });
  }, [active]);

  useEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t) return;
    const mm = gsap.matchMedia();

    const setProgress = (p: number) => {
      setActive(Math.round(p * (tints.length - 1)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };

    // Desktop: pin the section and translate the track horizontally
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      t.style.overflow = "visible";
      t.style.scrollSnapType = "none";
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);

      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          pin: true,
          scrub: true,
          start: "top top",
          end: () => "+=" + dist(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      // Bottles drift against the track for depth
      t.querySelectorAll<HTMLElement>("[data-bottle]").forEach((b) => {
        gsap.fromTo(
          b,
          { x: 70 },
          {
            x: -70,
            ease: "none",
            scrollTrigger: {
              trigger: b.closest("[data-panel]"),
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });

      return () => {
        t.style.overflow = "";
        t.style.scrollSnapType = "";
      };
    });

    // Touch / small screens / reduced motion: native snap carousel
    mm.add("(max-width: 1023.98px), (prefers-reduced-motion: reduce)", () => {
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const max = t.scrollWidth - t.clientWidth;
          setProgress(max > 0 ? t.scrollLeft / max : 0);
        });
      };
      t.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        t.removeEventListener("scroll", onScroll);
      };
    });

    return () => mm.revert();
  }, []);

  const current = Math.max(active, 1);

  return (
    <section
      ref={section}
      id="flavors"
      aria-label="The lineup"
      className="relative overflow-hidden bg-cream py-20 lg:h-screen lg:py-0"
    >
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory items-center gap-[6vw] overflow-x-auto px-[8vw] will-change-transform lg:h-full lg:snap-none lg:gap-[5vw] lg:px-[7vw]"
      >
        {/* intro panel */}
        <div
          data-panel
          className="flex w-[84vw] shrink-0 snap-center flex-col justify-center sm:w-[60vw] lg:w-[34vw]"
        >
          <p className="eyebrow">The lineup</p>
          <h2 className="mt-5 font-serif text-5xl font-medium uppercase leading-[1.02] tracking-[0.03em] sm:text-6xl lg:text-7xl">
            Five bottles.
            <br />
            <em className="normal-case text-forest">One standard.</em>
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
            Each drink has its own number, its own colour and a recipe short
            enough to read on the label.
          </p>
          <p className="mt-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-luxe text-ink/60">
            <span className="lg:hidden">Swipe</span>
            <span className="hidden lg:inline">Scroll</span>
            <ArrowRight size={16} className="nudge" />
          </p>
        </div>

        {flavors.map((f) => {
          const qty = counts[f.id] ?? 0;
          return (
            <article
              key={f.id}
              data-panel
              className="group flex w-[84vw] shrink-0 snap-center flex-col items-center gap-8 sm:w-[70vw] lg:w-[min(60vw,900px)] lg:flex-row lg:gap-[5vw]"
            >
              <div
                data-bottle
                className="relative h-[44svh] shrink-0 sm:h-[50svh] lg:h-[64vh]"
                style={{ aspectRatio: "160 / 440" }}
              >
                <div
                  aria-hidden
                  className="absolute inset-x-[-22%] bottom-[-2%] top-[10%] rounded-t-[999px] opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ background: `linear-gradient(180deg, ${f.soft}, transparent 92%)` }}
                />
                <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-3 group-hover:-rotate-3">
                  <Bottle flavor={f} className="h-full w-full" />
                </div>
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-1/2 h-3 w-[80%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-md"
                />
              </div>

              <div className="max-w-md text-center lg:text-left">
                <div className="flex items-baseline justify-center gap-4 lg:justify-start">
                  <span
                    className="font-serif text-6xl leading-none text-transparent [-webkit-text-stroke:1px_var(--c)] lg:text-8xl"
                    style={{ "--c": f.accent } as CSSProperties}
                  >
                    {f.no}
                  </span>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-luxe"
                    style={{ color: f.accent }}
                  >
                    {f.type}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
                  {f.name}
                </h3>
                <p className="mt-2 font-serif text-xl italic text-forest sm:text-2xl">
                  {f.tagline}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-ink/70">{f.notes}</p>

                <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {f.ingredients.map((i) => (
                    <li
                      key={i}
                      className="rounded-full border border-ink/15 bg-cream/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/70"
                    >
                      {i}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center justify-center gap-5 lg:justify-start">
                  <span className="font-serif text-3xl font-semibold">
                    ৳{f.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(f.id)}
                    className="btn btn-dark !px-5 !py-3"
                    aria-label={`Add ${f.name} to your pack`}
                  >
                    <Plus size={15} />
                    {qty > 0 ? `In pack · ${qty}` : "Add to pack"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        <div className="w-[2vw] shrink-0 lg:w-[4vw]" aria-hidden />
      </div>

      {/* progress */}
      <div className="pointer-events-none absolute inset-x-[8vw] bottom-6 hidden items-center gap-5 lg:flex">
        <span className="text-[11px] font-semibold tabular-nums tracking-luxe text-ink/60">
          {String(current).padStart(2, "0")} / 05
        </span>
        <div className="h-px flex-1 bg-ink/15">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-ink" />
        </div>
      </div>
    </section>
  );
}
