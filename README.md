# stopbattling.com — visual refresh

Same words, same links, same prices, same palette and fonts. Only the presentation changed.

## What's inside

- `index.html` — the home page
- `long.html` — "The long version"
- `styles.css`, `script.js` — no frameworks, no dependencies (Google Fonts only)
- `assets/` — the two photos and the OG image, copied from the live site

## What changed (visually)

- Forest hero with slow "breathing" light, a breathing ring around the portrait, headline that rises word by word
- Tagline: "battling" gets struck through, "remembering" gets underlined, in sequence
- Cards reveal on scroll; icons draw themselves in
- "Support my work" has a soft ember glow (brighter when hovering a way to pay)
- "Four acts. You're in one." — tap an act, it shows your own words from the long page
- Long page: reading progress bar, clickable outsourcing wheel, "I'm here" on the four acts
- Everything respects `prefers-reduced-motion`; everything works on phones

## Two things to wire before going live

1. The email form (`#seven-days-form`) has `action="#"`. Point it at the same handler the current site uses — field names (`email`, honeypot `website`) are unchanged.
2. Internal links use `index.html` / `long.html`. Swap for `/` and `/long`.
