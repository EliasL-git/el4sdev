# el4s — Portfolio

Vite + React portfolio for `el4s` — photographer, actor, developer.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # → dist/
npm run preview  # serve the production build locally
```

## Adding photographs

Drop any `.JPEG`, `.JPG`, `.PNG`, `.WEBP`, or `.AVIF` file into `/media/`.
That's it — Vite auto-discovers every image at build time via
`import.meta.glob`, so the gallery, home strip, and random hero image
pick it up without any list to maintain.

Files are sorted alphanumerically by filename. The originals here are
named `IMG_0171.JPEG`, `IMG_0194.JPEG`, …, which gives a chronological
ordering for free.

Quotes for the rotating hero blurb still live in `media/quotes.json`.

## Source layout

- `index.html` — Vite entry
- `src/main.jsx` — app bootstrap + tiny hash-style router
- `src/pages/` — Home, Photography, NonCommercial, Freexyz
- `src/components/` — SiteHeader, SiteFooter, Hero, Quotes, WorkStrip, Gallery, Lightbox
- `src/lib/photos.js` — auto-bundled photo registry
- `src/lib/quotes.js` — bundled quote module
- `src/styles/global.css` — design tokens + base styles

## License

All rights reserved. See the Non-commercial page for usage terms.
