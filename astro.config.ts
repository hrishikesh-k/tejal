import { defineConfig } from 'astro/config'
import unoCss from 'unocss/astro'

export default defineConfig({
  integrations: [unoCss()],
  trailingSlash: 'always'
})
