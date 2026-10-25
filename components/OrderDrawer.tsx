"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Minus, Plus, X } from "lucide-react";
import { flavors } from "@/data/flavors";
import { site } from "@/lib/site";
import { getLenis } from "@/lib/lenis";
import Bottle from "./Bottle";
import { PACK_SIZES, usePack } from "./PackProvider";

export default function OrderDrawer() {
  const { open, closeDrawer, size, setSize, counts, total, price, add, remove, clear } =
    usePack();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  // Escape closes; focus moves into the dialog; page scroll is locked while open
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeDrawer]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const slots = useMemo(
    () => flavors.flatMap((f) => Array.from({ length: counts[f.id] ?? 0 }, () => f)),
    [counts],
  );

  const full = total === size;
  const message = useMemo(() => {
    const lines = flavors
      .filter((f) => (counts[f.id] ?? 0) > 0)
      .map((f) => `${counts[f.id]} × ${f.no} ${f.name}`);
    return `Hi The 1% Club! I'd like to preorder a pack of ${size}:\n${lines.join(
      "\n",
    )}\nTotal: ৳${price}`;
  }, [counts, size, price]);

  const submit = async () => {
    if (!full) return;
    if (site.whatsapp) {
      window.open(
        `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener",
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      window.prompt("Copy your order summary:", message);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="pack-title"
        className={`absolute bottom-0 right-0 flex max-h-[92svh] w-full flex-col rounded-t-[28px] bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] sm:top-0 sm:max-h-none sm:w-[470px] sm:rounded-l-[28px] sm:rounded-tr-none ${
          open
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-x-full sm:translate-y-0"
        }`}
      >
        <div className="flex items-start justify-between px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
          <div>
            <p className="eyebrow">Quick order</p>
            <h2 id="pack-title" className="mt-2 font-serif text-4xl font-semibold">
              Build your pack
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-cream"
          >
            <X size={18} />
          </button>
        </div>

        {/* pack size */}
        <div className="px-6 sm:px-8">
          <div role="radiogroup" aria-label="Pack size" className="grid grid-cols-3 gap-2 rounded-full bg-sand p-1">
            {PACK_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={size === n}
                onClick={() => setSize(n)}
                className={`rounded-full py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                  size === n ? "bg-ink text-cream shadow" : "text-ink/60 hover:text-ink"
                }`}
              >
                {n} bottles
              </button>
            ))}
          </div>

          {/* slots */}
          <div className="mt-5 flex flex-wrap gap-2" aria-label={`${total} of ${size} bottles chosen`}>
            {Array.from({ length: size }).map((_, i) => {
              const f = slots[i];
              return (
                <span
                  key={i}
                  className="h-3.5 flex-1 basis-6 rounded-full border border-ink/15 transition-colors duration-500"
                  style={{ background: f ? f.liquid2 : "transparent", maxWidth: 48 }}
                />
              );
            })}
          </div>
        </div>

        {/* flavors */}
        <ul
          data-lenis-prevent
          className="mt-5 flex-1 divide-y divide-ink/10 overflow-y-auto border-t border-ink/10 px-6 sm:px-8"
        >
          {flavors.map((f) => {
            const qty = counts[f.id] ?? 0;
            return (
              <li key={f.id} className="flex items-center gap-4 py-4">
                <div className="w-9 shrink-0">
                  <Bottle flavor={f} label={false} animate={false} className="block h-auto w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl font-semibold leading-tight">
                    <span className="mr-2 text-sm font-medium" style={{ color: f.accent }}>
                      {f.no}
                    </span>
                    {f.name}
                  </p>
                  <p className="text-xs text-ink/55">৳{f.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => remove(f.id)}
                    disabled={qty === 0}
                    aria-label={`Remove one ${f.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-cream disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(f.id)}
                    disabled={total >= size && !PACK_SIZES.some((s) => s > total)}
                    aria-label={`Add one ${f.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full bg-ink text-cream transition-colors hover:bg-forest disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* summary */}
        <div className="border-t border-ink/10 bg-sand/60 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Total</p>
              <p className="mt-1 font-serif text-4xl font-semibold tabular-nums">৳{price}</p>
            </div>
            <button
              type="button"
              onClick={clear}
              disabled={total === 0}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55 underline-offset-4 hover:text-ink hover:underline disabled:opacity-30"
            >
              Clear
            </button>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!full}
            className="btn btn-dark mt-5 w-full disabled:cursor-not-allowed disabled:bg-ink/25 disabled:text-cream/80"
          >
            {copied ? (
              <>
                <Check size={16} /> Summary copied
              </>
            ) : full ? (
              <>
                {site.whatsapp ? "Send preorder" : (<><Copy size={15} /> Copy order summary</>)}
              </>
            ) : (
              `Add ${size - total} more to complete`
            )}
          </button>
          {copied && (
            <p className="mt-3 text-center text-xs text-ink/60">
              Paste it in a message to The 1% Club to confirm your preorder.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
