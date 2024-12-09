export class AstroNav extends HTMLElement {
  connectedCallback() {
    this.nextElementSibling
      ?.querySelector('astro-tooltip')
      ?.addEventListener('click', () => {
        this.classList.toggle('top-0')
        this.classList.toggle('top--30')
      })
  }
}
