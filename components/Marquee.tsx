const items = [
  "Sugarcane",
  "Mango",
  "Banana",
  "Coconut",
  "Coffee",
  "Milk",
  "Almonds",
  "Dates",
];

/** Pure-CSS ingredient ticker — no JS, no layout cost. */
export default function Marquee() {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div
      className="marquee-wrap overflow-hidden border-y border-ink/10 bg-sand/50 py-5"
      aria-label="Ingredients: sugarcane, mango, banana, coconut, coffee, milk, almonds, dates"
    >
      <div className="marquee flex w-max items-center" aria-hidden>
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 font-serif text-2xl italic text-ink/80 sm:text-3xl">
              {t}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
