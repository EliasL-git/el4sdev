import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const MIME = {
  '.jpeg': 'image/jpeg',
  '.jpg':  'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
}

/**
 * Serves /media/* from <project-root>/media/ during dev,
 * and copies that folder into dist/media/ on production build.
 *
 * The repo keeps photographs in /media (not /public) so we wire it up
 * explicitly here instead of relocating thousands of bytes of binaries.
 */
function mediaPlugin() {
  const root = process.cwd()
  const mediaDir = path.resolve(root, 'media')

  return {
    name: 'el4s-media',

    configureServer(server) {
      server.middlewares.use('/media', (req, res, next) => {
        try {
          const reqPath = decodeURIComponent((req.url || '/').split('?')[0])
          if (reqPath === '/' || reqPath === '') return next()
          const filePath = path.join(mediaDir, reqPath)
          // Path traversal guard
          if (!filePath.startsWith(mediaDir + path.sep)) return next()
          if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            return next()
          }
          const ext = path.extname(filePath).toLowerCase()
          res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
          res.setHeader('Cache-Control', 'public, max-age=3600')
          fs.createReadStream(filePath).pipe(res)
        } catch (err) {
          next(err)
        }
      })
    },

    closeBundle() {
      if (!fs.existsSync(mediaDir)) return
      const outDir = path.resolve(root, 'dist', 'media')
      fs.mkdirSync(outDir, { recursive: true })
      for (const entry of fs.readdirSync(mediaDir)) {
        const src = path.join(mediaDir, entry)
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, path.join(outDir, entry))
        }
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [mediaPlugin()],
})
