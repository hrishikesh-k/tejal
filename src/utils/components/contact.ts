import {
  formTextDefault,
  formTextError,
  formTextSuccess,
  formTextWarn,
  formWretch
} from '~/utils/constants/client.ts'
import { addTurnstileScript } from '~/utils/functions.ts'

export class AstroContact extends HTMLElement {
  connectedCallback() {
    const form = this.querySelector('form') as HTMLFormElement
    const textarea = form.querySelector('textarea') as HTMLTextAreaElement
    addTurnstileScript()

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const p = document.createElement('p')
      formTextDefault.map((c) => p.classList.add(c))
      formTextWarn.map((c) => p.classList.add(c))
      p.innerText = 'Submitting...'
      form.appendChild(p)

      try {
        await formWretch.post(new FormData(form), '/contact/').res()
        p.innerText = 'Submission successful'
        formTextSuccess.map((c) => p.classList.add(c))
        form.reset()
      } catch {
        p.innerText = 'Submission failed'
        formTextError.map((c) => p.classList.add(c))
      } finally {
        formTextWarn.map((c) => p.classList.remove(c))
        setTimeout(() => {
          p.remove()
        }, 5000)
      }
    })

    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight + 2}px`
    })
  }
}
