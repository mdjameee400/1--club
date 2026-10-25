"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ScrollLink from "./ScrollLink";
import PackButton from "./PackButton";

const links = [
  { href: "#flavors", label: "Flavors" },
  { href: "#story", label: "Story" },
  { href: "#craft", label: "Craft" },
  { href: "#ingredients", label: "Ingredients" },
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

  return (
    <header className="fixed inset-x-3 top-3 z-50 mx-auto max-w-6xl sm:inset-x-5 sm:top-5">
      <nav
        aria-label="Primary"
        className={`flex items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-500 sm:px-6 ${
          scrolled || menu
            ? "border-ink/10 bg-cream/75 shadow-[0_8px_30px_-12px_rgba(31,26,23,.25)]"
            : "border-transparent bg-cream/20"
        }`}
      >
        <ScrollLink
          href="#top"
          className="font-serif text-lg font-semibold tracking-[0.3em] text-ink sm:text-xl"
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
            className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-500 hover:bg-forest sm:px-5 sm:py-2.5 sm:text-[12px]"
          >
            Order Now
          </PackButton>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        className={`mt-2 overflow-hidden rounded-3xl border border-ink/10 bg-cream/90 backdrop-blur-xl transition-all duration-500 md:hidden ${
          menu ? "max-h-80 opacity-100" : "max-h-0 border-transparent opacity-0"
        }`}
        inert={!menu}
      >
        <ul className="flex flex-col p-3">
          {links.map((l) => (
            <li key={l.href}>
              <ScrollLink
                href={l.href}
                onNavigate={() => setMenu(false)}
                className="block rounded-2xl px-4 py-3.5 font-serif text-2xl text-ink hover:bg-ink/5"
              >
                {l.label}
              </ScrollLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
