import { defineConfig } from 'astro/config'
import unoCss from 'unocss/astro'

export default defineConfig({
  build: {
    inlineStylesheets: 'never'
  },
  integrations: [unoCss()],
  trailingSlash: 'always'
})
