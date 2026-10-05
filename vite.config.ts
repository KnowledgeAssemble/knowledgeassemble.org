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
        if (path === '/' || path.includes('.')) return next()

        const dist = join(server.config.root, server.config.build.outDir)
        const normalized = path.replace(/\/$/, '')

        if (existsSync(join(dist, normalized, 'index.html'))) {
          req.url = `${normalized}/index.html`
          return next()
        }

        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(join(dist, '404.html'), 'utf8'))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), previewCleanUrls()],
})
