import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * `vite preview` uses `appType: 'spa'`, so a clean URL such as `/projects`
 * falls back to the root `index.html` instead of the prerendered
 * `dist/projects/index.html`. Production runs on Vercel with `cleanUrls` and a
 * static `404.html`, so this emulates that for preview only: clean URLs resolve
 * to their directory index, and unknown paths return the static 404. Neither
 * the dev server nor the production build is affected.
 */
function previewCleanUrls(): Plugin {
  return {
    name: 'knowledgeassemble:preview-clean-urls',
    apply: 'serve',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '/').split('?')[0] ?? '/'
        if (path === '/') return next()

        const dist = join(server.config.root, server.config.build.outDir)

        // Only the last segment decides whether this is an asset request. A
        // dotted directory such as `/v1.0/notes` is a route, not a file, and
        // must 404 rather than fall through to the SPA shell.
        const lastSegment = path.slice(path.lastIndexOf('/') + 1)
        if (lastSegment.includes('.')) return next()

        if (existsSync(join(dist, path.replace(/\/$/, ''), 'index.html'))) {
          req.url = `${path.replace(/\/$/, '')}/index.html`
          return next()
        }

        const notFound = join(dist, '404.html')
        if (!existsSync(notFound)) return next()

        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(notFound, 'utf8'))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), previewCleanUrls()],
})
