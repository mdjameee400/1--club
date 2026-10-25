import { site } from "@/lib/site";
import Newsletter from "./Newsletter";
import ScrollLink from "./ScrollLink";

const links = [
  { href: "#flavors", label: "Flavors" },
  { href: "#story", label: "Story" },
  { href: "#craft", label: "Craft" },
  { href: "#ingredients", label: "Ingredients" },
];

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Facebook() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#161210] px-6 pb-10 pt-20 text-cream">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-[0.3em]">
            THE <span className="text-gold">1%</span> CLUB
          </p>
          <p className="mt-5 max-w-xs font-serif text-xl italic text-cream/70">
            It starts with what we put in.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-[11px] font-semibold uppercase tracking-luxe text-cream/50">
            Explore
          </p>
          <ul className="mt-5 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <ScrollLink
                  href={l.href}
                  className="font-serif text-xl text-cream/85 transition-colors hover:text-gold"
                >
                  {l.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-luxe text-cream/50">
            Stay in the 1%
          </p>
          <p className="mt-5 text-sm text-cream/65">
            New batches and flavours, straight to your inbox.
          </p>
          <div className="mt-5">
            <Newsletter />
          </div>
          <div className="mt-8 flex gap-3">
            <a
              href={site.instagram}
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram />
            </a>
            <a
              href={site.facebook}
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"
            >
              <Facebook />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-cream/45 sm:flex-row">
        <p>© {new Date().getFullYear()} The 1% Club. All rights reserved.</p>
        <p>Born at LENS-E UTHSOB 2.0</p>
      </div>
    </footer>
  );
}
