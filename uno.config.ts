import { defineConfig } from 'unocss'

function valueToRem(n = '0') {
  return `${Number.parseFloat(n) * 4}rem`
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
            autocomplete: ['bg-dark-500']
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
          /^border-(?:(?<direction>bottom|top)-)?(?<value>[01])$/,
          (match) => {
            if (match.groups) {
              const value = `${match.groups['value']}px`
              if (match.groups['direction']) {
                return {
                  [`border-${[match.groups['direction'] as 'bottom' | 'top']}-width`]:
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
              'border-bottom-0',
              'border-bottom-1',
              'border-top-0',
              'border-top-1'
            ]
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
      }
    }
  }
})
