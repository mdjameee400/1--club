import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F9F6F0",
        sand: "#EFE8DA",
        ink: "#1F1A17",
        forest: "#1E4D3A",
        gold: "#D9922E",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      letterSpacing: {
        luxe: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
