import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    {
      name: 'after',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('after:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(6),
              selector(s) {
                return `${s}::after`
              }
            }
          }
        }
      ]
    },
    {
      name: 'align-items',
      rules: [
        [
          'items-center',
          {
            'align-items': 'center'
          }
        ]
      ]
    },
    {
      name: 'background-color',
      rules: [
        [
          'bg-current',
          {
            'background-color': 'currentColor'
          }
        ],
        [
          'bg-dark-100',
          {
            'background-color': '#3c3c3c'
          }
        ],
        [
          'bg-dark-500',
          {
            'background-color': '#1f1f1f'
          }
        ],
        [
          'bg-dark-900',
          {
            'background-color': '#0f0f0f'
          }
        ],
        [
          'bg-light-500',
          {
            'background-color': '#f2f2f2'
          }
        ],
        [
          'bg-light-900',
          {
            'background-color': '#dde1e3'
          }
        ]
      ]
    },
    {
      name: 'border-color',
      rules: [
        [
          'border-gray-300',
          {
            'border-color': '#d1d5db'
          }
        ],
        [
          'border-gray-500',
          {
            'border-color': '#6b7280'
          }
        ]
      ]
    },
    {
      name: 'border-radius',
      rules: [
        [
          'border-rounded-0.25',
          {
            'border-radius': '0.0625rem'
          }
        ],
        [
          'border-rounded-1',
          {
            'border-radius': '0.25rem'
          }
        ],
        [
          'border-rounded-1.5',
          {
            'border-radius': '0.375rem'
          }
        ],
        [
          'border-b-rounded-1.5',
          {
            'border-bottom-left-radius': '0.375rem',
            'border-bottom-right-radius': '0.375rem'
          }
        ],
        [
          'border-t-rounded-1.5',
          {
            'border-top-left-radius': '0.375rem',
            'border-top-right-radius': '0.375rem'
          }
        ]
      ]
    },
    {
      name: 'border-style',
      rules: [
        [
          'border-solid',
          {
            'border-style': 'solid'
          }
        ]
      ]
    },
    {
      name: 'border-width',
      rules: [
        [
          'border-0',
          {
            'border-width': '0'
          }
        ],
        [
          'border-0.25',
          {
            'border-width': '0.0625rem'
          }
        ],
        [
          'border-b-0.25',
          {
            'border-bottom-width': '0.0625rem'
          }
        ]
      ]
    },
    {
      name: 'bottom',
      rules: [
        [
          'bottom--26',
          {
            bottom: '-6.5rem'
          }
        ],
        [
          'bottom-0.5',
          {
            bottom: '0.125rem'
          }
        ]
      ]
    },
    {
      name: 'box-sizing',
      rules: [
        [
          'box-border',
          {
            'box-sizing': 'border-box'
          }
        ]
      ]
    },
    {
      name: 'color',
      rules: [
        [
          'text-current',
          {
            color: 'currentColor'
          }
        ],
        [
          'text-dark-500',
          {
            color: '#1f1f1f'
          }
        ],
        [
          'text-light-500',
          {
            color: '#f2f2f2'
          }
        ]
      ]
    },
    {
      name: 'column-gap',
      rules: [
        [
          'gap-x-1',
          {
            'column-gap': '0.25rem'
          }
        ],
        [
          'gap-x-3',
          {
            'column-gap': '0.75rem'
          }
        ]
      ]
    },
    {
      name: 'cursor',
      rules: [
        [
          'cursor-pointer',
          {
            cursor: 'pointer'
          }
        ]
      ]
    },
    {
      name: 'dark',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('dark:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(5),
              selector(s) {
                return `.dark ${s}`
              }
            }
          }
        }
      ]
    },
    {
      name: 'display',
      rules: [
        [
          'block',
          {
            display: 'block'
          }
        ],
        [
          'flex',
          {
            display: 'flex'
          }
        ],
        [
          'hidden',
          {
            display: 'none'
          }
        ]
      ]
    },
    {
      name: 'fill',
      rules: [
        [
          'fill-current',
          {
            fill: 'currentColor'
          }
        ]
      ]
    },
    {
      name: 'flex-direction',
      rules: [
        [
          'flex-col',
          {
            'flex-direction': 'column'
          }
        ],
        [
          'flex-row',
          {
            'flex-direction': 'row'
          }
        ]
      ]
    },
    {
      name: 'font-family',
      rules: [
        [
          'font-montserrat',
          {
            'font-family': "'Montserrat', sans-serif"
          }
        ]
      ]
    },
    {
      name: 'font-size',
      rules: [
        [
          'text-3',
          {
            'font-size': '0.75rem'
          }
        ]
      ]
    },
    {
      name: 'group-hover',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('group-hover:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(12),
              selector(s) {
                return `.group:hover ${s}`
              }
            }
          }
        }
      ]
    },
    {
      name: 'height',
      rules: [
        [
          'h-0',
          {
            height: '0'
          }
        ],
        [
          'h-0.5',
          {
            height: '0.125rem'
          }
        ],
        [
          'h-24',
          {
            height: '6rem'
          }
        ],
        [
          'h-full',
          {
            height: '100%'
          }
        ]
      ]
    },
    {
      name: 'hover',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('hover:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(6),
              selector(s) {
                return `${s}:hover`
              }
            }
          }
        }
      ]
    },
    {
      name: 'justify-content',
      rules: [
        [
          'justify-between',
          {
            'justify-content': 'space-between'
          }
        ],
        [
          'justify-center',
          {
            'justify-content': 'center'
          }
        ]
      ]
    },
    {
      name: 'left',
      rules: [
        [
          'left-0',
          {
            left: '0'
          }
        ]
      ]
    },
    {
      name: 'lg',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('lg:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(3),
              parent: '@media (min-width: 1024px)'
            }
          }
        }
      ]
    },
    {
      name: 'max-width',
      rules: [
        [
          'max-w-300',
          {
            'max-width': '75rem'
          }
        ]
      ]
    },
    {
      name: 'margin',
      rules: [
        [
          'm-0',
          {
            margin: '0'
          }
        ],
        [
          'm-x-auto',
          {
            'margin-left': 'auto',
            'margin-right': 'auto'
          }
        ]
      ]
    },
    {
      name: 'md',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('md:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(3),
              parent: '@media (min-width: 768px)'
            }
          }
        }
      ]
    },
    {
      name: 'min-height',
      rules: [
        [
          'min-h-full',
          {
            'min-height': '100%'
          }
        ]
      ]
    },
    {
      name: 'outline-width',
      rules: [
        [
          'outline-0',
          {
            'outline-width': '0'
          }
        ]
      ]
    },
    {
      name: 'padding',
      rules: [
        [
          'p-2',
          {
            padding: '0.5rem'
          }
        ],
        [
          'p-x-6',
          {
            'padding-left': '1.5rem',
            'padding-right': '1.5rem'
          }
        ],
        [
          'p-x-16',
          {
            'padding-left': '4rem',
            'padding-right': '4rem'
          }
        ],
        [
          'p-x-32',
          {
            'padding-left': '8rem',
            'padding-right': '8rem'
          }
        ]
      ]
    },
    {
      name: 'pointer-events',
      rules: [
        [
          'pointer-none',
          {
            'pointer-events': 'none'
          }
        ]
      ]
    },
    {
      name: 'position',
      rules: [
        [
          'pos-absolute',
          {
            position: 'absolute'
          }
        ],
        [
          'pos-fixed',
          {
            position: 'fixed'
          }
        ],
        [
          'pos-relative',
          {
            position: 'relative'
          }
        ],
        [
          'pos-static',
          {
            position: 'static'
          }
        ]
      ]
    },
    {
      name: 'right',
      rules: [
        [
          'right-0',
          {
            right: '0'
          }
        ],
        [
          'right-3/8',
          {
            right: '37.5%'
          }
        ]
      ]
    },
    {
      name: 'row-gap',
      rules: [
        [
          'gap-y-1.5',
          {
            'row-gap': '0.375rem'
          }
        ]
      ]
    },
    {
      name: 'text-align',
      rules: [
        [
          'text-center',
          {
            'text-align': 'center'
          }
        ],
        [
          'text-right',
          {
            'text-align': 'right'
          }
        ]
      ]
    },
    {
      name: 'text-decoration',
      rules: [
        [
          'decoration-none',
          {
            'text-decoration': 'none'
          }
        ]
      ]
    },
    {
      name: 'text-transform',
      rules: [
        [
          'uppercase',
          {
            'text-transform': 'uppercase'
          }
        ]
      ]
    },
    {
      name: 'top',
      rules: [
        [
          'top--30',
          {
            top: '-7.5rem'
          }
        ],
        [
          'top-0',
          {
            top: '0'
          }
        ],
        [
          'top-4',
          {
            top: '1rem'
          }
        ]
      ]
    },
    {
      name: 'transition-duration',
      rules: [
        [
          'transition-duration-250',
          {
            'transition-duration': '250ms'
          }
        ]
      ]
    },
    {
      name: 'transition-property',
      rules: [
        [
          'transition-top',
          {
            'transition-property': 'top'
          }
        ],
        [
          'transition-width',
          {
            'transition-property': 'width'
          }
        ]
      ]
    },
    {
      name: 'width',
      rules: [
        [
          'w-0',
          {
            width: '0'
          }
        ],
        [
          'w-full',
          {
            width: '100%'
          }
        ],
        [
          'w-unset',
          {
            width: 'unset'
          }
        ]
      ]
    },
    {
      name: 'z-index',
      rules: [
        [
          'z-1',
          {
            'z-index': '1'
          }
        ]
      ]
    }
  ]
})
