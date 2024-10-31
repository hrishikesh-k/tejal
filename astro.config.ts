import { fileURLToPath } from 'node:url'
import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'

export default defineConfig({
  build: {
    inlineStylesheets: 'never'
  },
  integrations: [svelte()],
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
