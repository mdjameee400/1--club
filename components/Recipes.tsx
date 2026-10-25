import { flavors } from "@/data/flavors";

export default function Recipes() {
  return (
    <section id="ingredients" className="px-6 py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow" data-reveal>
            Ingredients
          </p>
          <h2
            data-reveal
            className="mt-5 font-serif text-5xl font-medium uppercase leading-[1.05] tracking-[0.03em] sm:text-6xl"
          >
            Five drinks.
            <br />
            <em className="normal-case text-forest">Five simple recipes.</em>
          </h2>
          <p data-reveal className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
            From our kitchen to your hand. If it isn&apos;t listed, it isn&apos;t in
            the bottle.
          </p>
        </div>

        <ol className="divide-y divide-ink/10 border-y border-ink/10">
          {flavors.map((f) => (
            <li
              key={f.id}
              data-reveal
              className="group flex items-start gap-5 py-7 transition-colors duration-500 sm:gap-8 sm:py-9"
            >
              <span
                className="w-10 pt-1 font-serif text-2xl tabular-nums sm:w-14 sm:text-3xl"
                style={{ color: f.accent }}
              >
                {f.no}
              </span>
              <div className="flex-1">
                <h3 className="font-serif text-3xl font-semibold transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">
                  {f.name}
                </h3>
                <p className="mt-2 font-serif text-lg italic text-ink/65 sm:text-xl">
                  {f.ingredients.join(" · ")}
                </p>
              </div>
              <span
                aria-hidden
                className="mt-3 h-3 w-3 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-150"
                style={{ background: f.liquid2 }}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
