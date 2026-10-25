# The 1% Club

Luxury single-page site for The 1% Club: five bottled drinks, built with
Next.js (App Router), Tailwind CSS, GSAP ScrollTrigger and Lenis.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: WhatsApp number, socials, site URL
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Structure

| Path | What it does |
| --- | --- |
| `data/flavors.ts` | The five drinks: copy, colours, ingredients, **placeholder prices** |
| `components/Bottle.tsx` | Pure-SVG bottle + arched label, themed per flavor (no image files) |
| `components/SmoothScroll.tsx` | Lenis, driven by GSAP's ticker so it stays in sync with ScrollTrigger |
| `components/RevealController.tsx` | Fade-up reveals and the scrubbed story text |
| `components/Hero.tsx` | CSS entrance (instant paint) + cursor and scroll parallax |
| `components/Showcase.tsx` | Pinned horizontal scroll on desktop, snap carousel on touch, tint follows the active bottle |
| `components/OrderDrawer.tsx`, `PackProvider.tsx` | Build-your-pack drawer (4 / 6 / 12 bottles) |

## Before launch

- Replace the placeholder prices in `data/flavors.ts`.
- Set `NEXT_PUBLIC_ORDER_WHATSAPP` so "Send preorder" opens WhatsApp with the order pre-filled. Without it, the button copies the order summary.
- Wire up `components/Newsletter.tsx` to an email provider (it is UI-only).
- Review the tasting notes and craft copy; they are draft wording.
- Add social URLs in `.env.local`.

## Performance notes

- Bottles are inline SVG: zero image requests, no layout shift.
- Hero entrance is pure CSS, so the headline paints without waiting for JS.
- Fonts are self-hosted via Fontsource (no third-party font request).
- Motion respects `prefers-reduced-motion`; touch devices keep native scrolling.
