import { addTurnstileScript, submitForm } from '~/utils/functions.ts'

export class AstroPassword extends HTMLElement {
  connectedCallback() {
    const form = this.querySelector('form') as HTMLFormElement
    form.addEventListener('submit', submitForm)
    addTurnstileScript()
  }
}
