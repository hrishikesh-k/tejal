export class AstroContact extends HTMLFormElement {
  connectedCallback() {
    const form = this as HTMLFormElement
    const textarea = form.querySelector('textarea') as HTMLTextAreaElement

    form.addEventListener('submit', async (event) => {
      event.preventDefault()

      const p = document.createElement('p')
      p.classList.add(
        'bg-yellow-500',
        'box-border',
        'm-t-6',
        'p-2',
        'text-center',
        'text-dark-500'
      )
      p.innerText = 'Submitting...'
      form.appendChild(p)

      try {
        await fetch('/', {
          body: new FormData(form),
          method: 'POST'
        })
        p.classList.add('bg-green-500', 'text-light-500')
        form.reset()
      } catch {
        p.classList.add('bg-red-500', 'text-light-500')
      } finally {
        p.classList.remove('bg-yellow-500', 'text-dark-500')
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
