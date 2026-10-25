"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * UI-only signup. Wire `onSubmit` to your provider (Mailchimp, Buttondown,
 * a Next.js route handler, …) before launch.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setDone(true);
  };

  if (done) {
    return (
      <p className="flex items-center gap-2 font-serif text-xl italic text-cream">
        <Check size={18} className="text-gold" /> You&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm items-center border-b border-cream/30 pb-2">
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        autoComplete="email"
        className="w-full bg-transparent py-2 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Join the newsletter"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-ink transition-colors hover:bg-gold"
      >
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
