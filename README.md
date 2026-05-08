
# el4s — Vite + React Portfolio

This project is a minimal Vite + React scaffold for the `el4s` portfolio.

Quick start:

```bash
# install dependencies
npm install

# run dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

Open http://localhost:5173/ after `npm run dev`.

Files of interest:

- `index.html` — Vite entry
- `src/main.jsx` — app bootstrap
- `src/App.jsx` — main UI
- `src/styles.css` — styling

This project now serves a single minimal React page.

Default entry: `src/Plain.jsx` — a plain, minimal React page (white text on black) that is currently the default render.

If you previously saw a static `plain.html`, it has been removed; the app is served via Vite and `src/main.jsx` renders `Plain` by default.

If you prefer a Yarn or pnpm setup, or want TypeScript, tell me and I will add it.
