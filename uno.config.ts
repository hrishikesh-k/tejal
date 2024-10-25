import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
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
            if (match.groups?.['direction'] && match.groups['value']) {
              return {
                [match.groups['direction']]: match.groups['value']
              }
            }
            return {}
          },
          {
            autocomplete: [
              'left-0',
              'top-0'
            ]
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
  ]
})
