import { autoPlacement, computePosition, offset } from '@floating-ui/dom'

export class AstroTooltip extends HTMLButtonElement {
  connectedCallback() {
    const tooltip = this.querySelector('span') as HTMLSpanElement

    this.addEventListener('mouseenter', async () => {
      tooltip.classList.remove('hidden')
      const pos = await computePosition(this, tooltip, {
        middleware: [
          offset(8),
          autoPlacement({
            allowedPlacements: [
              'bottom',
              'bottom-end',
              'bottom-start',
              'top',
              'top-end',
              'top-start'
            ],
            padding: 24
          })
        ]
      })
      tooltip.style.left = `${pos.x}px`
      tooltip.style.top = `${pos.y}px`
    })

    this.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden')
    })
  }
}
