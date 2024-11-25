import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'
import uno from 'unocss/astro'

export default defineConfig({
  build: {
    inlineStylesheets: 'never'
  },
  integrations: [sitemap(), svelte(), uno()],
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
