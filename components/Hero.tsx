"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { flavorById } from "@/data/flavors";
import Bottle from "./Bottle";
import PackButton from "./PackButton";
import ScrollLink from "./ScrollLink";

const v = (i: number) => ({ "--i": i }) as CSSProperties;

/** Poster order: 01 · 04 · 05 · 03 · 02, mango tallest in the centre. */
const lineup = [
  { id: "sugarcane-splash", rot: -9, scale: 0.84, depth: 0.5, dur: 7.5, dl: 0.2 },
  { id: "banana-breeze", rot: -4, scale: 0.98, depth: 0.85, dur: 6.5, dl: 0.9 },
  { id: "mango-milkshake", rot: 0, scale: 1.22, depth: 1.3, dur: 8, dl: 0 },
  { id: "coco-blast", rot: 4, scale: 0.98, depth: 0.85, dur: 7, dl: 1.4 },
  { id: "coconut-milkshake", rot: 9, scale: 0.9, depth: 0.55, dur: 6.8, dl: 0.5 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // Scroll parallax: bottles drift up at different speeds
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-s]").forEach((n) => {
        const d = Number(n.dataset.depth ?? 1);
        gsap.to(n, {
          y: -46 * d,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    // Cursor parallax (fine pointers only; touch devices keep scroll parallax)
    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-m]")).map(
        (n) => ({
          d: Number(n.dataset.depth ?? 1),
          x: gsap.quickTo(n, "x", { duration: 1, ease: "power3.out" }),
          y: gsap.quickTo(n, "y", { duration: 1, ease: "power3.out" }),
        }),
      );
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        items.forEach((i) => {
          i.x(-nx * 22 * i.d);
          i.y(-ny * 12 * i.d);
        });
      };
      const leave = () =>
        items.forEach((i) => {
          i.x(0);
          i.y(0);
        });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-28 sm:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_68%,rgba(217,146,46,.18),transparent_72%),radial-gradient(40%_30%_at_15%_20%,rgba(30,77,58,.07),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="rise eyebrow" style={v(0)}>
          The second preorder batch is open
        </p>
        <h1
          className="rise mt-5 font-serif text-[clamp(2.7rem,7.4vw,6.4rem)] font-medium uppercase leading-[1.02] tracking-[0.04em] text-ink"
          style={v(1)}
        >
          It starts with
          <br />
          what{" "}
          <em className="font-medium normal-case italic tracking-[0.02em] text-forest">
            we put in.
          </em>
        </h1>
        <p
          className="rise mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70 sm:text-base"
          style={v(2)}
        >
          Five small-batch drinks, made in our kitchen from short, honest
          recipes and handed straight to you. Naturally refreshing. Naturally
          nourishing.
        </p>
        <div
          className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={v(3)}
        >
          <PackButton className="btn btn-dark w-full sm:w-auto">
            Taste the 1%
          </PackButton>
          <ScrollLink href="#flavors" className="btn btn-ghost w-full sm:w-auto">
            Explore Menu <ArrowDown size={15} />
          </ScrollLink>
        </div>
      </div>

      <div
        className="rise relative z-10 mt-auto flex w-full max-w-5xl items-end justify-center pb-10 pt-14 sm:pb-14"
        style={v(4)}
      >
        {lineup.map((b) => {
          const f = flavorById(b.id);
          return (
            <div
              key={b.id}
              data-s
              data-depth={b.depth}
              className="relative origin-bottom"
              style={{
                width: `calc(clamp(58px, 12.5vw, 160px) * ${b.scale})`,
                marginInline: "clamp(-14px, -1.1vw, -3px)",
                transform: `rotate(${b.rot}deg)`,
              }}
            >
              <div data-m data-depth={b.depth} className="relative">
                <span
                  aria-hidden
                  className="bottle-shadow absolute -bottom-2 left-1/2 h-3 w-[85%] rounded-[50%] bg-ink blur-md"
                  style={{ "--d": `${b.dur}s`, "--dl": `${b.dl}s` } as CSSProperties}
                />
                <div
                  className="float relative"
                  style={{ "--d": `${b.dur}s`, "--dl": `${b.dl}s` } as CSSProperties}
                >
                  <Bottle flavor={f} className="block h-auto w-full" animate={false} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
