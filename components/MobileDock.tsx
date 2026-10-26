"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { usePack } from "./PackProvider";

/**
 * Mobile-only floating order bar. Appears once the hero has scrolled away,
 * shows pack progress, and opens the order drawer with one thumb tap.
 */
export default function MobileDock() {
  const { open, openDrawer, total, size } = usePack();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = shown && !open;
  const safeSize = Number.isFinite(size) && size > 0 ? size : 6;
  const pct = safeSize > 0 ? Math.min(100, Math.max(0, (total / safeSize) * 100)) : 0;

  return (
    <div
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 md:hidden transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
      inert={!visible}
    >
      <button
        type="button"
        onClick={openDrawer}
        className="relative flex w-full items-center gap-3 overflow-hidden rounded-full bg-ink py-2 pl-3 pr-2 text-cream shadow-[0_14px_40px_-10px_rgba(31,26,23,.55)] active:scale-[0.985]"
        aria-label={`Open your pack, ${total} of ${size} bottles chosen`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream/10">
          <ShoppingBag size={18} strokeWidth={1.6} />
        </span>
        <span className="flex-1 text-left leading-tight">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/55">
            Your pack
          </span>
          <span className="block text-sm font-semibold tabular-nums">
            <span key={total} className="pop inline-block">
              {total}
            </span>{" "}
            / {size} bottles
          </span>
        </span>
        <span className="flex h-10 items-center gap-1.5 rounded-full bg-gold px-5 text-[12px] font-bold uppercase tracking-[0.16em] text-ink">
          Order <ArrowRight size={14} />
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gold/80 transition-transform duration-500"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </button>
    </div>
  );
}
