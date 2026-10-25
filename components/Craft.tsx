import { Leaf, ListChecks, Recycle, Snowflake } from "lucide-react";

const pillars = [
  {
    icon: Leaf,
    title: "Fresh ingredients",
    body: "Real mango, banana, coconut and cane. What's on the label is what's in the bottle.",
  },
  {
    icon: Snowflake,
    title: "Pressed & chilled",
    body: "Made fresh in our kitchen and kept cold until it reaches your hand.",
  },
  {
    icon: ListChecks,
    title: "Short recipes",
    body: "One to five ingredients per bottle. No long lists, no mystery.",
  },
  {
    icon: Recycle,
    title: "Considered packaging",
    body: "Clear bottles and a single arched label. Nothing extra wrapped around it.",
  },
];

export default function Craft() {
  return (
    <section id="craft" className="bg-sand/60 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="eyebrow" data-reveal>
            Craft &amp; quality
          </p>
          <h2
            data-reveal
            className="mt-5 font-serif text-5xl font-medium uppercase leading-[1.05] tracking-[0.03em] sm:text-6xl"
          >
            Made slowly.
            <br />
            <em className="normal-case text-forest">Poured simply.</em>
          </h2>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              data-reveal
              className="group bg-cream p-8 transition-colors duration-500 hover:bg-white sm:p-10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 text-forest transition-transform duration-500 group-hover:-translate-y-1">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <h3 className="mt-8 font-serif text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
