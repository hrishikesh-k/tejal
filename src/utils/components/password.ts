import {
  formTextDefault,
  formTextError,
  formTextSuccess,
  formTextWarn,
  formWretch
} from '~/utils/constants/client.ts'
import { addTurnstileScript } from '~/utils/functions.ts'

export class AstroPassword extends HTMLElement {
  connectedCallback() {
    const form = this.querySelector('form') as HTMLFormElement
    addTurnstileScript()

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const p = document.createElement('p')
      formTextDefault.map((c) => p.classList.add(c))
      formTextWarn.map((c) => p.classList.add(c))
      p.innerText = 'Submitting...'
      form.appendChild(p)

      try {
        await formWretch.post(new FormData(form), location.href).res()
        p.innerText = 'Valid password'
        formTextSuccess.map((c) => p.classList.add(c))
        form.reset()
        location.reload()
      } catch {
        p.innerText = 'Invalid password'
        formTextError.map((c) => p.classList.add(c))
      } finally {
        formTextWarn.map((c) => p.classList.remove(c))
        setTimeout(() => {
          p.remove()
        }, 5000)
      }
    })
  }
}
