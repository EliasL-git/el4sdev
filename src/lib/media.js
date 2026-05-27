// Resolves a media filename to a URL that works under any Vite base.
//
// We always return an *absolute* path so that client-side navigation to
// SPA routes (e.g. /photography) doesn't cause "./media/X" to resolve as
// "/photography/media/X" in the browser.
//
//   dev          (BASE_URL = "/")          → "/media/IMG_0541.JPEG"
//   prod (root)  (BASE_URL = "./" )        → "/media/IMG_0541.JPEG"
//   prod (sub)   (BASE_URL = "/el4sdev/")  → "/el4sdev/media/IMG_0541.JPEG"

const raw = import.meta.env.BASE_URL || '/'
const base = raw === './' || raw === '' ? '/' : raw

export function mediaUrl(filename) {
  if (!filename) return ''
  return `${base}media/${filename}`.replace(/\/{2,}/g, '/')
}
