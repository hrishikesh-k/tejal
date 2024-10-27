import { defineConfig } from 'unocss'

const directions = {
  b: 'bottom',
  l: 'left',
  r: 'right',
  t: 'top'
} as const

function valueToRem(n = '0') {
  return `${Number.parseFloat(n) / 4}rem`
}

export default defineConfig({
  presets: [
    {
      name: 'background-color',
      rules: [
        [
          /^bg-(?<color>.+)-(?<intensity>500)$/,
          (match, context) => {
            if (
              match.groups &&
              Object.keys(context.theme.colors).includes(
                match.groups['color'] as string
              )
            ) {
              return {
                'background-color':
                  context.theme.colors[
                    match.groups['color'] as keyof typeof context.theme.colors
                  ][match.groups['intensity'] as '500']
              }
            }
            return {}
          },
          {
            autocomplete: ['bg-dark-500', 'bg-light-500']
          }
        ]
      ]
    },
    {
      name: 'border',
      rules: [
        [
          'border-solid',
          {
            'border-style': 'solid'
          }
        ],
        [
          /^border-(?:(?<direction>[blrt])-)?(?<value>[01])$/,
          (match) => {
            if (match.groups) {
              const value = `${match.groups['value']}px`
              if (match.groups['direction']) {
                return {
                  [`border-${directions[match.groups['direction'] as 'b' | 'l' | 'r' | 't']}-width`]:
                    value
                }
              }
              return {
                'border-width': value
              }
            }
            return {}
          },
          {
            autocomplete: [
              'border-0',
              'border-1',
              'border-b-0',
              'border-b-1',
              'border-l-0',
              'border-l-1',
              'border-r-0',
              'border-r-1',
              'border-t-0',
              'border-t-1'
            ]
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
      name: 'dark-mode',
      variants: [
        {
          match(matcher) {
            if (!matcher.startsWith('dark:')) {
              return matcher
            }
            return {
              matcher: matcher.slice(5),
              parent: '.dark'
            }
          },
          name: 'dark'
        }
      ]
    },
    {
      name: 'height',
      rules: [
        [
          /^h-(?<value>[01])/,
          (match) => ({
            height: valueToRem(match.groups?.['value'])
          }),
          {
            autocomplete: ['h-0']
          }
        ]
      ]
    },
    {
      name: 'margin',
      rules: [
        [
          /^m-(?:(?<direction>[blrtxy])-)?(?<value>[01])$/,
          (match) => {
            if (match.groups) {
              const value = valueToRem(match.groups['value'])
              if (match.groups['direction']) {
                if (match.groups['direction'] === 'x') {
                  return {
                    'margin-left': value,
                    'margin-right': value
                  }
                }

                if (match.groups['direction'] === 'y') {
                  return {
                    'margin-bottom': value,
                    'margin-top': value
                  }
                }

                return {
                  [`margin-${directions[match.groups['direction'] as 'b' | 'l' | 'r' | 't']}`]:
                    value
                }
              }
              return {
                margin: value
              }
            }
            return {}
          },
          {
            autocomplete: [
              'm-0',
              'm-b-0',
              'm-b-1',
              'm-l-0',
              'm-l-1',
              'm-r-0',
              'm-r-1',
              'm-t-0',
              'm-t-1',
              'm-x-0',
              'm-x-1',
              'm-y-0',
              'm-y-1'
            ]
          }
        ]
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
      name: 'position',
      rules: [
        [
          'pos-fixed',
          {
            position: 'fixed'
          }
        ],
        [
          /^(?<direction>left|top)-(?<value>0)$/,
          (match) => {
            if (match.groups) {
              return {
                [match.groups['direction'] as 'left' | 'top']: valueToRem(
                  match.groups['value']
                )
              }
            }
            return {}
          },
          {
            autocomplete: ['left-0', 'top-0']
          }
        ]
      ]
    },
    {
      name: 'text-color',
      rules: [
        [
          /^text-(?<color>.+)-(?<intensity>500)$/,
          (match, context) => {
            if (
              match.groups &&
              Object.keys(context.theme.colors).includes(
                match.groups['color'] as string
              )
            ) {
              return {
                color:
                  context.theme.colors[
                    match.groups['color'] as keyof typeof context.theme.colors
                  ][match.groups['intensity'] as '500']
              }
            }
            return {}
          },
          {
            autocomplete: ['text-dark-500', 'text-light-500']
          }
        ]
      ]
    },
    {
      name: 'width',
      rules: [
        [
          'w-4',
          {
            width: '1rem'
          }
        ],
        [
          'w-full',
          {
            width: '100%'
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
            'z-index': 1
          }
        ]
      ]
    }
  ],
  theme: {
    colors: {
      dark: {
        500: '#1f1f1f'
      },
      light: {
        500: '#f2f2f2'
      }
    }
  }
})
