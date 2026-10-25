"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Minus, Plus, X } from "lucide-react";
import { flavors } from "@/data/flavors";
import { site } from "@/lib/site";
import { getLenis } from "@/lib/lenis";
import Bottle from "./Bottle";
import { MessengerIcon } from "./Social";
import { PACK_SIZES, usePack } from "./PackProvider";

const field =
  "w-full rounded-2xl border border-ink/15 bg-white/70 px-4 py-3 text-[16px] text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15";

export default function OrderDrawer() {
  const { open, closeDrawer, size, setSize, counts, total, price, add, remove, clear } =
    usePack();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<null | "copied" | "failed">(null);

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
    if (!open) setSent(null);
  }, [open]);

  // Editing the pack after sending invalidates the "sent" state
  useEffect(() => {
    setSent(null);
  }, [counts, size]);

  const slots = useMemo(
    () => flavors.flatMap((f) => Array.from({ length: counts[f.id] ?? 0 }, () => f)),
    [counts],
  );

  const full = total === size;
  const formOk = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 7;
  const ready = full && formOk;

  const message = useMemo(() => {
    const lines = flavors
      .filter((f) => (counts[f.id] ?? 0) > 0)
      .map((f) => `• ${counts[f.id]} × ${f.no} ${f.name} (৳${(counts[f.id] ?? 0) * f.price})`);
    return [
      "NEW PREORDER · The 1% Club",
      "──────────────",
      `Pack: ${size} bottles`,
      ...lines,
      "──────────────",
      `Total: ৳${price}`,
      "",
      `Name: ${name.trim() || "-"}`,
      `Phone: ${phone.trim() || "-"}`,
      note.trim() ? `Note: ${note.trim()}` : "",
    ]
      .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
      .join("\n")
      .trim();
  }, [counts, size, price, name, phone, note]);

  const send = () => {
    if (!ready) return;
    // Copy first (still inside the tap gesture), then open Messenger.
    // Messenger can't be pre-filled from a link, so the visitor pastes + sends.
    const copy = navigator.clipboard?.writeText(message);
    if (site.chatUrl) window.open(site.chatUrl, "_blank", "noopener,noreferrer");
    if (copy) {
      copy.then(() => setSent("copied")).catch(() => setSent("failed"));
    } else {
      setSent("failed");
    }
  };

  const copyAgain = () => {
    navigator.clipboard
      ?.writeText(message)
      .then(() => setSent("copied"))
      .catch(() => setSent("failed"));
  };

  const hint = !full
    ? `Add ${size - total} more to complete`
    : !formOk
      ? "Add your name & phone"
      : "";

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
        className={`absolute bottom-0 right-0 flex max-h-[94svh] w-full flex-col rounded-t-[28px] bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] sm:top-0 sm:max-h-none sm:w-[480px] sm:rounded-l-[28px] sm:rounded-tr-none ${
          open
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-x-full sm:translate-y-0"
        }`}
      >
        <span aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink/15 sm:hidden" />

        <div className="flex items-start justify-between px-5 pb-3 pt-4 sm:px-8 sm:pt-8">
          <div>
            <p className="eyebrow">Preorder</p>
            <h2 id="pack-title" className="mt-1.5 font-serif text-[2rem] font-semibold leading-none sm:text-4xl">
              Build your pack
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-cream"
          >
            <X size={18} />
          </button>
        </div>

        {/* everything scrolls; the total + button stay pinned */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 sm:px-8">
            <div
              role="radiogroup"
              aria-label="Pack size"
              className="grid grid-cols-3 gap-1.5 rounded-full bg-sand p-1"
            >
              {PACK_SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={size === n}
                  onClick={() => setSize(n)}
                  className={`rounded-full py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 sm:text-[12px] ${
                    size === n ? "bg-ink text-cream shadow" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {n} bottles
                </button>
              ))}
            </div>

            <div
              className="mt-4 flex gap-1.5"
              role="img"
              aria-label={`${total} of ${size} bottles chosen`}
            >
              {Array.from({ length: size }).map((_, i) => {
                const f = slots[i];
                return (
                  <span
                    key={i}
                    className="h-2.5 flex-1 rounded-full border border-ink/15 transition-colors duration-500"
                    style={{ background: f ? f.liquid2 : "transparent" }}
                  />
                );
              })}
            </div>
          </div>

          <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10 px-5 sm:px-8">
            {flavors.map((f) => {
              const qty = counts[f.id] ?? 0;
              return (
                <li key={f.id} className="flex items-center gap-3.5 py-3.5">
                  <div className="w-8 shrink-0">
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
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => remove(f.id)}
                      disabled={qty === 0}
                      aria-label={`Remove one ${f.name}`}
                      className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors active:bg-ink active:text-cream disabled:opacity-25"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => add(f.id)}
                      disabled={total >= size && !PACK_SIZES.some((s) => s > total)}
                      aria-label={`Add one ${f.name}`}
                      className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream transition-colors active:bg-forest disabled:opacity-25"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* contact details (included in the Messenger message) */}
          <div className="space-y-3 px-5 pb-5 pt-5 sm:px-8">
            <p className="eyebrow">Your details</p>
            <label className="block">
              <span className="sr-only">Name</span>
              <input
                className={field}
                placeholder="Full name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="sr-only">Phone number</span>
              <input
                className={field}
                placeholder="Phone number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="sr-only">Note</span>
              <input
                className={field}
                placeholder="Delivery area or note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* pinned summary */}
        <div className="border-t border-ink/10 bg-sand/70 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 sm:pb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Total</p>
              <p className="mt-0.5 font-serif text-[2rem] font-semibold leading-none tabular-nums">
                ৳{price}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                clear();
                setSent(null);
              }}
              disabled={total === 0}
              className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55 underline-offset-4 hover:text-ink hover:underline disabled:opacity-30"
            >
              Clear
            </button>
          </div>

          {sent ? (
            <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-ink/80">
              <p className="flex items-center gap-2 font-semibold text-forest">
                <Check size={16} />
                {sent === "copied" ? "Order copied" : "Couldn't copy automatically"}
              </p>
              {sent === "failed" ? (
                <textarea
                  readOnly
                  value={message}
                  rows={6}
                  onFocus={(e) => e.currentTarget.select()}
                  className="mt-2 w-full rounded-xl border border-ink/15 bg-cream p-3 text-xs"
                />
              ) : null}
              <p className="mt-1">
                {site.chatUrl
                  ? "Messenger should be open. Paste your order into the chat and press send."
                  : "Open our Messenger chat, paste your order and press send."}
              </p>
              <div className="mt-3 flex gap-2">
                {site.chatUrl && (
                  <a
                    href={site.chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-dark flex-1 !px-4 !py-3 !text-[12px]"
                  >
                    <MessengerIcon /> Open Messenger
                  </a>
                )}
                <button
                  type="button"
                  onClick={copyAgain}
                  className="btn btn-ghost flex-1 !px-4 !py-3 !text-[12px]"
                >
                  <Copy size={14} /> Copy again
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={send}
                disabled={!ready}
                className="btn btn-dark mt-4 w-full !py-4 disabled:cursor-not-allowed disabled:bg-ink/25 disabled:text-cream/90"
              >
                {ready ? (
                  <>
                    <MessengerIcon /> Order on Messenger
                  </>
                ) : (
                  hint
                )}
              </button>
              {ready && (
                <p className="mt-2.5 text-center text-xs text-ink/55">
                  We&apos;ll copy your order, then open Messenger so you can paste and send.
                </p>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
