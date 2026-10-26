"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { getLenis } from "@/lib/lenis";
import ScrollLink from "./ScrollLink";
import PackButton from "./PackButton";
import { SocialLinks } from "./Social";

const links = [
  { href: "#flavors", label: "Flavors" },
  { href: "#arcade", label: "Arcade" },
  { href: "#story", label: "Story" },
  { href: "#craft", label: "Craft" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Full-screen menu: lock page scroll, close on Escape
  useEffect(() => {
    if (!menu) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  // Close the menu if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenu(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="fixed inset-x-3 top-3 z-[65] mx-auto max-w-6xl sm:inset-x-5 sm:top-5">
        <nav
          aria-label="Primary"
          className={`flex items-center justify-between rounded-full border px-4 py-2 backdrop-blur-xl transition-all duration-500 sm:px-6 sm:py-2.5 ${
            menu
              ? "border-transparent bg-transparent"
              : scrolled
                ? "border-ink/10 bg-cream/75 shadow-[0_8px_30px_-12px_rgba(31,26,23,.25)]"
                : "border-transparent bg-cream/20"
          }`}
        >
          <ScrollLink
            href="#top"
            onNavigate={() => setMenu(false)}
            className="font-serif text-[17px] font-semibold tracking-[0.28em] text-ink sm:text-xl sm:tracking-[0.3em]"
          >
            THE <span className="text-gold">1%</span> CLUB
          </ScrollLink>

          <ul className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <ScrollLink
                  href={l.href}
                  className="group relative text-[12px] font-semibold uppercase tracking-[0.22em] text-ink/75 transition-colors hover:text-ink"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
                </ScrollLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <PackButton
              badge
              className="hidden items-center gap-1 rounded-full bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-500 hover:bg-forest md:inline-flex"
            >
              Order Now
            </PackButton>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full text-ink md:hidden"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu((m) => !m)}
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        aria-hidden={!menu}
        inert={!menu}
        className={`fixed inset-0 z-[60] flex flex-col bg-cream px-7 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.2,1)] md:hidden ${
          menu
            ? "[clip-path:circle(150%_at_calc(100%-2.25rem)_2.25rem)]"
            : "[clip-path:circle(0%_at_calc(100%-2.25rem)_2.25rem)]"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_40%_at_80%_100%,rgba(217,146,46,.16),transparent_70%)]"
        />
        <ul className="relative flex flex-1 flex-col justify-center gap-1">
          {links.map((l, i) => (
            <li
              key={l.href}
              className={`transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${
                menu ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: menu ? `${200 + i * 70}ms` : "0ms" }}
            >
              <ScrollLink
                href={l.href}
                onNavigate={() => setMenu(false)}
                className="flex items-baseline gap-4 border-b border-ink/10 py-4 font-serif text-[2.6rem] font-medium leading-none text-ink active:text-forest"
              >
                <span className="w-7 font-sans text-[11px] font-semibold tracking-[0.2em] text-gold">
                  0{i + 1}
                </span>
                {l.label}
              </ScrollLink>
            </li>
          ))}
        </ul>

        <div
          className={`relative transition-all duration-700 ${
            menu ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: menu ? "560ms" : "0ms" }}
        >
          <PackButton
            onClick={() => setMenu(false)}
            className="btn btn-dark w-full !py-4"
          >
            Build your pack
          </PackButton>
          <SocialLinks className="mt-5 justify-center [&_a]:border-ink/20 [&_a]:text-ink [&_a:active]:bg-ink [&_a:active]:text-cream" />
        </div>
      </div>
    </>
  );
}
