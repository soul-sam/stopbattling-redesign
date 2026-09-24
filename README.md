# stopbattling.com — visual refresh

Same words, same links, same prices, same palette and fonts. Only the presentation changed.

**Start here → [review.html](https://soul-sam.github.io/stopbattling-redesign/review.html)** — three home versions, the six copy changes with reasons, and 18 banners.

## What's inside

- `index.html` — the home page
- `long.html` — "The long version"
- `styles.css`, `script.js` — no frameworks, no dependencies (Google Fonts only)
- `home-v2.html` — six copy suggestions applied · `home-v3.html` — the funnel (01 stop battling → 02 start remembering)
- `review.html` — the hub for Oriya · `banners.html` — live banner renderer · `banners/` — 18 PNG exports
- `assets/` — the two photos and the OG image, copied from the live site

## What changed (visually)

- Forest hero with slow "breathing" light, a breathing ring around the portrait, headline that rises word by word
- Tagline: "battling" gets struck through, "remembering" gets underlined, in sequence
- Cards reveal on scroll; icons draw themselves in
- "Support my work" has a soft ember glow (brighter when hovering a way to pay)
- "Four acts. You're in one." — tap an act, it shows your own words from the long page
- Long page: reading progress bar, clickable outsourcing wheel, "I'm here" on the four acts
- On phones the hero keeps the original layout: portrait floated left, words wrapping around it, compact above the fold
- Everything respects `prefers-reduced-motion`; everything works on phones

## Two things to wire before going live

1. The email form (`#seven-days-form`) has `action="#"`. Point it at the same handler the current site uses — field names (`email`, honeypot `website`) are unchanged.
2. Internal links use `index.html` / `long.html`. Swap for `/` and `/long`.

## Remembership — product prototypes

**→ [soul-sam.github.io/stopbattling-redesign/remembership/](https://soul-sam.github.io/stopbattling-redesign/remembership/)**

Three concepts for a calmer, Telegram-simple space around Oriya's work. Switch with the small dot, bottom-left. Press `` ` `` for the prototype notes (hypothesis, strength, risk).

- `#/room` — The Room: one thing the community is sitting with today, reflections as notes on a table, Thursday's open room
- `#/radio` — The Radio: one button, the archive picks something for you, "what came up?"
- `#/remembership` — Remembership: seven days, one audio / question / practice / conversation each; the framework shows up only at the end

Shared: private journal (with the mocked "you wrote about something similar three months ago"), other rooms, live-gathering mock, tiny support modal, "Close the app. Go live your life."

Source in `prototype/` (React + TypeScript + Tailwind, local state + localStorage, silent mock audio). `cd prototype && npm i && npm run dev`. The Pages workflow builds it into `/remembership/`.
