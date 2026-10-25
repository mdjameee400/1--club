"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * One controller for every below-the-fold entrance:
 *  - [data-reveal]  → soft fade-up, staggered per batch
 *  - [data-story]   → words light up as you scroll (scrubbed)
 */
export default function RevealController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const triggers = ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%",
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          overwrite: true,
        }),
    });

    const scrubs: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>("[data-story]").forEach((p) => {
      const words = p.querySelectorAll("[data-word]");
      const tween = gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: p,
          start: "top 82%",
          end: "bottom 55%",
          scrub: true,
        },
      });
      if (tween.scrollTrigger) scrubs.push(tween.scrollTrigger);
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      scrubs.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
