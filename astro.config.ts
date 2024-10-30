import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'

export default defineConfig({
  build: {
    inlineStylesheets: 'never'
  },
  integrations: [svelte()],
  trailingSlash: 'always'
})
