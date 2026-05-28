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

- `index.html` — Vite entry, Google Fonts (Archivo Black + Space Mono)
- `src/main.jsx` — app bootstrap, tiny router, mounts the global motion layer
- `src/pages/` — Home, Photography, NonCommercial, Freexyz
- `src/components/` — UI + motion components (see below)
- `src/lib/` — photos, quotes, motion helpers (`glitch`, `audio`, hooks)
- `src/styles/global.css` — design tokens + base styles

### Motion components

- `CrosshairCursor` — Custom `+` cursor; hides on touch / reduced-motion.
- `IntroSlam` — Counter 0→100, red slam reveal. Runs once per session.
- `PageTransitionSlam` — Hard color-block hard-cut on every navigation.
- `ShaderCanvas` — Vanilla WebGL2 fragment shader (RGB split + cursor
  displacement) used on the hero photo. Falls back to a plain `<img>`
  when WebGL2 is unavailable or `prefers-reduced-motion: reduce`.
- `GlitchText` — Character-shuffle reveal helper. Wrap any string.
- `MarqueeStrip` — Two opposing-direction rows for ticker text.
- `AudioToggle` — Corner toggle for hover ticks (Web Audio API). Off by
  default, persisted in `localStorage` under `el4s.audio`.

### Motion / accessibility toggles

- **Reduced motion** (`prefers-reduced-motion: reduce`): the shader
  pauses to a static fallback image, glitch reveals snap to final text,
  the intro is skipped, marquees stop, the cursor reverts to native.
- **Touch / coarse pointer**: the crosshair cursor and magnetic button
  effects are disabled automatically.
- **Audio**: off by default. Click the corner toggle to enable hover
  ticks. State persists across visits.

## License

All rights reserved. See the Non-commercial page for usage terms.
