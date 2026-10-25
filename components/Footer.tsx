import { site } from "@/lib/site";
import Newsletter from "./Newsletter";
import ScrollLink from "./ScrollLink";
import { SocialLinks } from "./Social";

const links = [
  { href: "#flavors", label: "Flavors" },
  { href: "#story", label: "Story" },
  { href: "#craft", label: "Craft" },
  { href: "#ingredients", label: "Ingredients" },
];

export default function Footer() {
  return (
    <footer className="bg-[#161210] px-6 pb-28 pt-20 text-cream md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-[0.3em]">
            THE <span className="text-gold">1%</span> CLUB
          </p>
          <p className="mt-5 max-w-xs font-serif text-xl italic text-cream/70">
            It starts with what we put in.
          </p>
          <SocialLinks className="mt-8 [&_a]:border-cream/20 [&_a:hover]:border-gold [&_a:hover]:text-gold" />
        </div>

        <nav aria-label="Footer">
          <p className="text-[11px] font-semibold uppercase tracking-luxe text-cream/50">
            Explore
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {links.map((l) => (
              <li key={l.href}>
                <ScrollLink
                  href={l.href}
                  className="inline-block py-1 font-serif text-xl text-cream/85 transition-colors hover:text-gold"
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
          <p className="mt-8 text-sm text-cream/55">
            Orders &amp; questions:{" "}
            {site.chatUrl ? (
              <a
                href={site.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream underline underline-offset-4 hover:text-gold"
              >
                message us on Messenger
              </a>
            ) : (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream underline underline-offset-4 hover:text-gold"
              >
                message us on Instagram
              </a>
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-center text-[11px] uppercase tracking-[0.2em] text-cream/45 sm:flex-row sm:text-left">
        <p>© {new Date().getFullYear()} The 1% Club. All rights reserved.</p>
        <p>Born at LENS-E UTHSOB 2.0</p>
      </div>
    </footer>
  );
}
