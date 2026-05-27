// Build-time bundling of every photograph in /media.
//
// `import.meta.glob` makes Vite emit URLs for each matched file:
//   - dev:        served by Vite's dev server (original location)
//   - production: hashed copy in /assets/, served from the deploy root
//
// `list.json` is imported as a JSON module — no runtime fetch, no broken
// `/media/list.json` path possibilities. It drives both ordering and
// inclusion: only filenames present in list.json show up on the site.

import list from '../../media/list.json'

const modules = import.meta.glob('/media/*.{JPEG,jpeg,JPG,jpg,PNG,png,WEBP,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const urlByName = {}
for (const fullPath of Object.keys(modules)) {
  const name = fullPath.split('/').pop()
  urlByName[name] = modules[fullPath]
}

/** Ordered photos as listed in media/list.json — only entries that exist on disk. */
export const photos = list
  .filter((name) => urlByName[name])
  .map((name) => ({ name, url: urlByName[name] }))

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
