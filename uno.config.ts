import { defineConfig } from 'unocss'

export default defineConfig({
  layers: {
    default: 1,
    lg: 5,
    md: 4,
    sm: 3,
    xl: 6,
    xs: 2
  },
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
          'bg-dark-900/75',
          {
            'background-color': 'rgb(15 15 15/0.75)'
          }
        ],
        [
          'bg-green-500',
          {
            'background-color': '#22c55e'
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
        ],
        [
          'bg-rajasab',
          {
            'background-color': '#001429'
          }
        ],
        [
          'bg-red-500',
          {
            'background-color': '#ef4444'
          }
        ],
        [
          'bg-transparent',
          {
            'background-color': 'transparent'
          }
        ],
        [
          'bg-yellow-500',
          {
            'background-color': '#eab308'
          }
        ]
      ]
    },
    {
      name: 'blur',
      rules: [
        [
          'blur-2',
          {
            '--u-blur': '0.5rem'
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
          'bottom--2',
          {
            bottom: '-0.25rem'
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
      name: 'children',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('children:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(9),
              selector(s) {
                return `${s} > *`
              }
            }
          }
        }
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
          'text-dark-700',
          {
            color: '#1b1b1b'
          }
        ],
        [
          'text-light-500',
          {
            color: '#f2f2f2'
          }
        ],
        [
          'text-light-700',
          {
            color: '#e9ecef'
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
          'gap-x-2',
          {
            'column-gap': '0.5rem'
          }
        ],
        [
          'gap-x-3',
          {
            'column-gap': '0.75rem'
          }
        ],
        [
          'gap-x-4',
          {
            'column-gap': '1rem'
          }
        ],
        [
          'gap-x-6',
          {
            'column-gap': '1.5rem'
          }
        ],
        [
          'gap-x-12',
          {
            'column-gap': '3rem'
          }
        ]
      ]
    },
    {
      name: 'content',
      rules: [
        [
          'content',
          {
            content: '""'
          }
        ]
      ]
    },
    {
      name: 'cursor',
      rules: [
        [
          'cursor-not-allowed',
          {
            cursor: 'not-allowed'
          }
        ],
        [
          'cursor-pointer',
          {
            cursor: 'pointer'
          }
        ]
      ]
    },
    {
      name: 'disabled',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('disabled:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(9),
              selector(s) {
                return `${s}[disabled]`
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
          'grid',
          {
            display: 'grid'
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
        ],
        [
          'fill-white',
          {
            fill: '#ffffff'
          }
        ]
      ]
    },
    {
      name: 'filter',
      rules: [
        [
          'filter',
          {
            filter:
              'blur(var(--u-blur)) brightness(var(--u-brightness)) contrast(var(--u-contrast)) drop-shadow(var(--u-drop-shadow)) grayscale(var(--u-grayscale)) hue-rotate(var(--u-hue-rotate)) invert(var(--u-invert)) saturate(var(--u-saturate)) sepia(var(--u-sepia))'
          }
        ]
      ]
    },
    {
      name: 'flex-basis',
      rules: [
        [
          'flex-basis-0',
          {
            'flex-basis': '0'
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
      name: 'flex-grow',
      rules: [
        [
          'flex-grow-1',
          {
            'flex-grow': '1'
          }
        ]
      ]
    },
    {
      name: 'flex-shrink',
      rules: [
        [
          'flex-shrink-1',
          {
            'flex-shrink': '1'
          }
        ]
      ]
    },
    {
      name: 'flex-wrap',
      rules: [
        [
          'flex-nowrap',
          {
            'flex-wrap': 'nowrap'
          }
        ],
        [
          'flex-wrap',
          {
            'flex-wrap': 'wrap'
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
        ],
        [
          'text-4',
          {
            'font-size': '1rem'
          }
        ],
        [
          'text-6',
          {
            'font-size': '1.5rem'
          }
        ],
        [
          'text-8',
          {
            'font-size': '2rem'
          }
        ],
        [
          'text-9',
          {
            'font-size': '2.25rem'
          }
        ]
      ]
    },
    {
      name: 'font-weight',
      rules: [
        [
          'font-400',
          {
            'font-weight': '400'
          }
        ]
      ]
    },
    {
      name: 'gap',
      rules: [
        [
          'gap-3',
          {
            gap: '0.75rem'
          }
        ],
        [
          'gap-6',
          {
            gap: '1.5rem'
          }
        ],
        [
          'gap-9',
          {
            gap: '2.25rem'
          }
        ],
        [
          'gap-12',
          {
            gap: '3rem'
          }
        ],
        [
          'gap-18',
          {
            gap: '4.5rem'
          }
        ]
      ]
    },
    {
      name: 'grid-template-columns',
      rules: [
        [
          'grid-cols-1',
          {
            'grid-template-columns': 'repeat(1, minmax(0, 1fr))'
          }
        ],
        [
          'grid-cols-2',
          {
            'grid-template-columns': 'repeat(2, minmax(0, 1fr))'
          }
        ],
        [
          'grid-cols-3',
          {
            'grid-template-columns': 'repeat(3, minmax(0, 1fr))'
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
          'h-0.5',
          {
            height: '0.125rem'
          }
        ],
        [
          'h-16',
          {
            height: '4rem'
          }
        ],
        [
          'h-19.5',
          {
            height: '4.875rem'
          }
        ],
        [
          'h-20',
          {
            height: '5rem'
          }
        ],
        [
          'h-24',
          {
            height: '6rem'
          }
        ],
        [
          'h-30',
          {
            height: '7.5rem'
          }
        ],
        [
          'h-128',
          {
            height: '32rem'
          }
        ],
        [
          'h-fit',
          {
            height: 'fit-content'
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
        ],
        [
          'justify-end',
          {
            'justify-content': 'flex-end'
          }
        ]
      ]
    },
    {
      name: 'justify-items',
      rules: [
        [
          'justify-items-center',
          {
            'justify-items': 'center'
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
        ],
        [
          'left-1/2',
          {
            left: '50%'
          }
        ],
        [
          'left-2',
          {
            left: '0.5rem'
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
              layer: 'lg',
              matcher: matcher.slice(3),
              parent: '@media (min-width: 1024px)'
            }
          }
        }
      ]
    },
    {
      name: 'line-height',
      rules: [
        [
          'leading-5',
          {
            'line-height': '1.25rem'
          }
        ],
        [
          'leading-8',
          {
            'line-height': '2rem'
          }
        ]
      ]
    },
    {
      name: 'max-width',
      rules: [
        [
          'max-w-1/2',
          {
            'max-width': '50%'
          }
        ],
        [
          'max-w-3/5',
          {
            'max-width': '60%'
          }
        ],
        [
          'max-w-5/6',
          {
            'max-width': '83.33%'
          }
        ],
        [
          'max-w-11/12',
          {
            'max-width': '91.67%'
          }
        ],
        [
          'max-w-75',
          {
            'max-width': '18.75rem'
          }
        ],
        [
          'max-w-300',
          {
            'max-width': '75rem'
          }
        ],
        [
          'max-w-full',
          {
            'max-width': '100%'
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
          'm-b-4',
          {
            'margin-bottom': '1rem'
          }
        ],
        [
          'm-b-6',
          {
            'margin-bottom': '1.5rem'
          }
        ],
        [
          'm-b-9',
          {
            'margin-bottom': '2.25rem'
          }
        ],
        [
          'm-b-12',
          {
            'margin-bottom': '3rem'
          }
        ],
        [
          'm-l-auto',
          {
            'margin-left': 'auto'
          }
        ],
        [
          'm-t-6',
          {
            'margin-top': '1.5rem'
          }
        ],
        [
          'm-t-12',
          {
            'margin-top': '3rem'
          }
        ],
        [
          'm-x-auto',
          {
            'margin-left': 'auto',
            'margin-right': 'auto'
          }
        ],
        [
          'm-y-6',
          {
            'margin-bottom': '1.5rem',
            'margin-top': '1.5rem'
          }
        ],
        [
          'm-y-12',
          {
            'margin-bottom': '3rem',
            'margin-top': '3rem'
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
              layer: 'md',
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
          'min-h-36',
          {
            'min-height': '9rem'
          }
        ],
        [
          'min-h-full',
          {
            'min-height': '100%'
          }
        ]
      ]
    },
    {
      name: 'object-fit',
      rules: [
        [
          'object-contain',
          {
            'object-fit': 'contain'
          }
        ]
      ]
    },
    {
      name: 'opacity',
      rules: [
        [
          'opacity-0',
          {
            opacity: '0'
          }
        ],
        [
          'opacity-50',
          {
            opacity: '0.5'
          }
        ],
        [
          'opacity-100',
          {
            opacity: '1'
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
      name: 'overflow',
      rules: [
        [
          'overflow-hidden',
          {
            overflow: 'hidden'
          }
        ],
        [
          'overflow-y-auto',
          {
            'overflow-y': 'auto'
          }
        ]
      ]
    },
    {
      name: 'padding',
      rules: [
        [
          'p-0',
          {
            padding: '0'
          }
        ],
        [
          'p-2',
          {
            padding: '0.5rem'
          }
        ],
        [
          'p-3',
          {
            padding: '0.75rem'
          }
        ],
        [
          'p-6',
          {
            padding: '1.5rem'
          }
        ],
        [
          'p-9',
          {
            padding: '2.25rem'
          }
        ],
        [
          'p-12',
          {
            padding: '3rem'
          }
        ],
        [
          'p-l-6',
          {
            'padding-left': '1.5rem'
          }
        ],
        [
          'p-t-36',
          {
            'padding-top': '9rem'
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
      name: 'peer-focus',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('peer-focus:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(11),
              selector(s) {
                return `.peer:focus ~ ${s}`
              }
            }
          }
        }
      ]
    },
    {
      name: 'peer-not-placeholder-shown',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('peer-not-placeholder-shown:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(27),
              selector(s) {
                return `.peer:not(:placeholder-shown) ~ ${s}`
              }
            }
          }
        }
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
      name: 'resize',
      rules: [
        [
          'resize-none',
          {
            resize: 'none'
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
          'gap-y-3',
          {
            'row-gap': '0.75rem'
          }
        ],
        [
          'gap-y-4',
          {
            'row-gap': '1rem'
          }
        ],
        [
          'gap-y-6',
          {
            'row-gap': '1.5rem'
          }
        ]
      ]
    },
    {
      name: 'sm',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('sm:')) {
              return matcher
            }
            return {
              layer: 'sm',
              matcher: matcher.slice(3),
              parent: '@media (min-width: 640px)'
            }
          }
        }
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
          'top-1/2',
          {
            top: '50%'
          }
        ],
        [
          'top-1.8125',
          {
            top: '0.453125rem'
          }
        ],
        [
          'top-8',
          {
            top: '2rem'
          }
        ]
      ]
    },
    {
      name: 'transform',
      rules: [
        [
          'scale-75',
          {
            '--u-scale-x': '75%',
            '--u-scale-y': '75%',
            '--u-scale-z': '75%'
          }
        ],
        [
          'transform',
          {
            transform:
              'scaleX(var(--u-scale-x)) scaleY(var(--u-scale-y)) scaleZ(var(--u-scale-z)) skewX(var(--u-skew-x)) skewY(var(--u-skew-y)) translateX(var(--u-translate-x)) translateY(var(--u-translate-y)) translateZ(var(--u-translate-z)) rotate(var(--u-rotate)) rotateX(var(--u-rotate-x)) rotateY(var(--u-rotate-y)) rotateZ(var(--u-rotate-z))'
          }
        ],
        [
          'translate-x--2',
          {
            '--u-translate-x': '-0.5rem'
          }
        ],
        [
          'translate-x--1/2',
          {
            '--u-translate-x': '-50%'
          }
        ],
        [
          'translate-x-0',
          {
            '--u-translate-x': '0'
          }
        ],
        [
          'translate-y--8',
          {
            '--u-translate-y': '-2rem'
          }
        ],
        [
          'translate-y--1/2',
          {
            '--u-translate-y': '-50%'
          }
        ]
      ]
    },
    {
      name: 'transform-origin',
      rules: [
        [
          'transform-origin-left',
          {
            'transform-origin': 'left'
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
        ],
        [
          'transition-duration-500',
          {
            'transition-duration': '500ms'
          }
        ]
      ]
    },
    {
      name: 'transition-property',
      rules: [
        [
          'transition-background-color-color',
          {
            'transition-property': 'background-color, color'
          }
        ],
        [
          'transition-filter',
          {
            'transition-property': 'filter'
          }
        ],
        [
          'transition-margin-transform',
          {
            'transition-property': 'margin, transform'
          }
        ],
        [
          'transition-opacity',
          {
            'transition-property': 'opacity'
          }
        ],
        [
          'transition-opacity-transform',
          {
            'transition-property': 'opacity, transform'
          }
        ],
        [
          'transition-top',
          {
            'transition-property': 'top'
          }
        ],
        [
          'transition-transform',
          {
            'transition-property': 'transform'
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
      name: 'xl',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('xl:')) {
              return matcher
            }
            return {
              layer: 'xl',
              matcher: matcher.slice(3),
              parent: '@media (min-width: 1280px)'
            }
          }
        }
      ]
    },
    {
      name: 'xs',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('xs:')) {
              return matcher
            }
            return {
              layer: 'xs',
              matcher: matcher.slice(3),
              parent: '@media (min-width: 320px)'
            }
          }
        }
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
          'w-1/5',
          {
            width: '20%'
          }
        ],
        [
          'w-1/2',
          {
            width: '50%'
          }
        ],
        [
          'w-3/4',
          {
            width: '75%'
          }
        ],
        [
          'w-20',
          {
            width: '5rem'
          }
        ],
        [
          'w-fit',
          {
            width: 'fit-content'
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
        ],
        [
          'z-10',
          {
            'z-index': '10'
          }
        ],
        [
          'z-100',
          {
            'z-index': '100'
          }
        ]
      ]
    }
  ],
  safelist: [
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'cursor-not-allowed',
    'children:opacity-50',
    'children:pointer-none'
  ]
})
