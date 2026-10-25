const text =
  "Every bottle starts with a short list: mango, banana, coconut, coffee, sugarcane, milk. Nothing hiding. Nothing extra. Five drinks, five simple recipes, made in our kitchen and handed straight to you.";

/** Word-by-word scroll reveal; the scrub itself lives in RevealController. */
export default function Story() {
  const words = text.split(" ");
  return (
    <section id="story" className="relative px-6 py-32 sm:py-44">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-10 text-center" data-reveal>
          Our story
        </p>
        <p
          data-story
          className="text-center font-serif text-[clamp(1.9rem,4.6vw,3.9rem)] font-medium leading-[1.18] text-ink"
        >
          {words.map((w, i) => (
            <span key={i} data-word className="inline-block">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <p
          data-reveal
          className="mt-12 text-center font-serif text-xl italic text-forest sm:text-2xl"
        >
          naturally refreshing. naturally nourishing.
        </p>
      </div>
    </section>
  );
}
