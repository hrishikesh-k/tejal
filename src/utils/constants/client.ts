// @unocss-include

import wretch from 'wretch'
import wretchAddonFormData from 'wretch/addons/formData'

export const formTextDefault = [
  'bg-yellow-500',
  'border-rounded-1',
  'box-border',
  'm-t-6',
  'p-2',
  'text-center',
  'text-dark-500',
  'transition-background-color-color'
]

export const formTextError = ['bg-red-500', 'text-light-500']

export const formTextSuccess = ['bg-green-500', 'text-light-500']

export const formTextWarn = ['bg-yellow-500', 'text-dark-500']

export const formWretch = wretch().addon(wretchAddonFormData)
