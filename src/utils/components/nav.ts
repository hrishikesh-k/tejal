export class AstroNav extends HTMLDivElement {
  connectedCallback() {
    this.nextElementSibling
      ?.querySelector('astro-tooltip')
      ?.addEventListener('click', () => {
        this.classList.toggle('top-0')
        this.classList.toggle('top--30')
      })
  }
}
