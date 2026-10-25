import { flavors } from "@/data/flavors";
import Bottle from "./Bottle";
import PackButton from "./PackButton";

const rots = [-8, -4, 0, 4, 8];

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 pb-28 pt-28 text-cream sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(217,146,46,.22),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p data-reveal className="text-[11px] font-semibold uppercase tracking-luxe text-cream/60">
          Second preorder batch
        </p>
        <h2
          data-reveal
          className="mt-5 font-serif text-[clamp(3rem,9vw,7rem)] font-medium uppercase leading-none tracking-[0.05em]"
        >
          Pick your <span className="text-gold">1%.</span>
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-cream/70">
          Build a pack of four, six or twelve and send us your preorder.
        </p>
        <div data-reveal className="mt-9">
          <PackButton className="btn bg-cream text-ink hover:bg-gold">
            Build your pack
          </PackButton>
        </div>
      </div>

      <div
        aria-hidden
        className="relative mx-auto mt-16 flex max-w-3xl items-end justify-center"
      >
        {flavors.map((f, i) => (
          <div
            key={f.id}
            data-reveal
            className="origin-bottom"
            style={{
              width: "clamp(52px, 11vw, 110px)",
              marginInline: "clamp(-10px,-0.8vw,-2px)",
              transform: `rotate(${rots[i]}deg)`,
            }}
          >
            <Bottle flavor={f} className="block h-auto w-full" animate={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
