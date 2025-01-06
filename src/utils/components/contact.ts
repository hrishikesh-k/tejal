import { addTurnstileScript, submitForm } from '~/utils/functions.ts'

export class AstroContact extends HTMLElement {
  connectedCallback() {
    const form = this.querySelector('form') as HTMLFormElement
    const textarea = form.querySelector('textarea') as HTMLTextAreaElement
    form.addEventListener('submit', submitForm)
    addTurnstileScript()

    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight + 2}px`
    })
  }
}
