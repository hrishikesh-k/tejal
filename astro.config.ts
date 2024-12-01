import { statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import svelte from '@astrojs/svelte'
import type { AstroConfig } from 'astro'
import { defineConfig } from 'astro/config'
import uno from 'unocss/astro'

export default defineConfig({
  build: {
    inlineStylesheets: 'never'
  },
  integrations: [
    svelte(),
    uno(),
    (() => {
      let config: AstroConfig
      return {
        hooks: {
          'astro:build:done': (options) => {
            let sitemap =
              '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">'
            for (const page of options.pages.sort((a, b) =>
              a.pathname.localeCompare(b.pathname, 'en', {
                numeric: true
              })
            )) {
              sitemap += `<url><loc>${new URL(page.pathname, config.site).href}</loc><lastmod>${statSync(
                join(
                  cwd(),
                  'src',
                  'pages',
                  `${page.pathname === '' ? 'index' : page.pathname.slice(0, -1)}.astro`
                )
              ).mtime.toISOString()}</lastmod></url>`
            }
            sitemap += '</urlset>'
            writeFileSync(
              join(fileURLToPath(options.dir), 'sitemap.xml'),
              sitemap,
              'utf-8'
            )
          },
          'astro:config:done': (options) => {
            config = options.config
          }
        },
        name: 'sitemap'
      }
    })()
  ],
  site: 'https://www.tejalshinde.com/',
  trailingSlash: 'always',
  vite: {
    resolve: {
      alias: {
        // workaround: https://github.com/withastro/astro/issues/9633#issuecomment-2323740421
        '~/': fileURLToPath(new URL('./src/', import.meta.url))
      }
    }
  }
})
