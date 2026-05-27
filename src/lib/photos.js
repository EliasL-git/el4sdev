// Auto-bundled photographs from /media — every supported image file in
// that folder is picked up automatically. No list.json maintenance.
//
// Ordering: filenames sorted alphabetically/numerically. Because the
// originals are named like IMG_0171.JPEG → IMG_0608.JPEG, that gives a
// chronological ordering for free.
//
// `import.meta.glob` makes Vite emit URLs for each matched file:
//   - dev:        served from the original location
//   - production: hashed copy in /assets/, served from the deploy root

const modules = import.meta.glob('/media/*.{JPEG,jpeg,JPG,jpg,PNG,png,WEBP,webp,AVIF,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Every photograph in /media, sorted by filename. */
export const photos = Object.entries(modules)
  .map(([fullPath, url]) => ({ name: fullPath.split('/').pop(), url }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

const urlByName = Object.fromEntries(photos.map((p) => [p.name, p.url]))

/** Direct URL lookup by filename. Returns '' if the file isn't bundled. */
export function photoUrl(name) {
  return urlByName[name] || ''
}

/**
 * One stable, randomly-picked photograph per page load. Hero uses it as
 * the featured image; WorkStrip excludes it so the same photo doesn't
 * appear twice on the home page. Resets to a new random pick on full
 * reload — client-side route changes keep the same one.
 */
export const featured =
  photos.length > 0 ? photos[Math.floor(Math.random() * photos.length)] : null
