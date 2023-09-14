import {defineConfig} from 'unocss'
import presetUno from '@unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'
export default defineConfig({
  blocklist: [
    'container',
    'filter',
    'flex',
    'grid',
    'hidden',
    'my',
    'px',
    'visible'
  ],
  presets: [
    presetUno({
      arbitraryVariants: false,
      attributifyPseudo: false,
      dark: 'class',
      prefix: '',
      preflight: true,
      variablePrefix: 'u-'
    })
  ],
  theme: {
    breakpoints: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    fontFamily: {
      montserrat: '\'Montserrat\',sans-serif'
    },
    height: {
      'screen-85': '85vh'
    },
    maxHeight: {
      'screen-60': '60vh',
      'screen-80': '80vh'
    },
    preflightRoot: '*',
    width: {
      max: 'max-content'
    }
  },
  transformers: [
    transformerDirectives({
      applyVariable: ['--u-apply']
    })
  ]
})