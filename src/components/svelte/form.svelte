<script lang="ts">
import wretch from 'wretch'
import wretchFormDataAddon from 'wretch/addons/formData'

const inputClass = [
  'bg-light-500',
  'dark:bg-dark-500',
  'border-0.25',
  'border-gray-300',
  'dark:border-gray-500',
  'border-solid',
  'border-rounded-1',
  'box-border',
  'font-montserrat',
  'm-0',
  'outline-0',
  'p-2',
  'peer',
  'text-dark-500',
  'dark:text-light-500',
  'w-full'
].join(' ')

const spanClass = [
  'left-2',
  'pointer-none',
  'pos-absolute',
  'peer-focus:scale-75',
  'peer-not-placeholder-shown:scale-75',
  'text-gray-500',
  'top-1.8125',
  'transform',
  'transform-origin-left',
  'peer-focus:translate-x--2',
  'peer-focus:translate-y--8',
  'peer-not-placeholder-shown:translate-x--2',
  'peer-not-placeholder-shown:translate-y--8',
  'transition-duration-250',
  'transition-transform'
].join(' ')

let formStatus: null | string = $state(null)
let formStatusClass: string = $state('')
let formStatusText: string = $state('')

$effect(() => {
  if (formStatus === 'error') {
    formStatusClass = 'bg-red-500 text-light-500'
    formStatusText = 'Failed to submit form!'
  } else if (formStatus === 'progress') {
    formStatusClass = 'bg-yellow-500 text-dark-500'
    formStatusText = 'Submitting...'
  } else if (formStatus === 'success') {
    formStatusClass = 'bg-green-500 text-light-500'
    formStatusText = 'Successfully submitted!'
  } else {
    formStatusClass = ''
    formStatusText = ''
  }
})

function oninput(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight + 2}px`
}

async function onsubmit(event: Event) {
  const form = event.target as HTMLFormElement
  event.preventDefault()
  formStatus = 'progress'
  try {
    await wretch()
      .addon(wretchFormDataAddon)
      .post(new FormData(form), '/')
      .res()
    form.reset()
    formStatus = 'success'
  } catch {
    formStatus = 'error'
  } finally {
    setTimeout(() => {
      formStatus = null
    }, 5000)
  }
}
</script>

<!-- TODO: placeholder colour -->
<form action="/contact/" class="md:flex-basis-0 md:flex-grow-1 md:flex-shrink-1" data-netlify="true" data-netlify-recaptcha="true" method="post" name="contact" {onsubmit}>
  <input type="hidden" name="form-name" value="contact">
  <div class="flex gap-x-2 items-center">
    <label class="block flex-basis-0 flex-grow-1 flex-shrink-1 pos-relative">
      <input class={inputClass} name="First name" placeholder="&nbsp;" required>
      <span class={spanClass}>First name</span>
    </label>
    <label class="block flex-basis-0 flex-grow-1 flex-shrink-1 pos-relative">
      <input class={inputClass} name="Last name" placeholder="&nbsp;" required>
      <span class={spanClass}>Last name</span>
    </label>
  </div>
  <label class="block m-t-6 pos-relative">
    <input class={inputClass} name="E-mail" placeholder="&nbsp;" required type="email">
    <span class={spanClass}>E-mail address</span>
  </label>
  <label class="block m-t-6 pos-relative">
    <input class={inputClass} name="Subject" placeholder="&nbsp;" required>
    <span class={spanClass}>Subject</span>
  </label>
  <label class="block m-t-6 pos-relative">
    <textarea class="{inputClass} min-h-36 resize-none" name="Message" {oninput} placeholder="&nbsp;" required></textarea>
    <span class={spanClass}>Message</span>
  </label>
  <div class="h-19.5 m-t-6 transform transform-origin-left transition-duration-250 transition-transform" data-netlify-recaptcha="true"></div>
  <button class="bg-dark-500 dark:bg-light-500 hover:bg-dark-900 hover:dark:bg-light-900 border-0 border-rounded-1 cursor-pointer font-montserrat m-t-6 p-2 text-4 text-light-500 dark:text-dark-500" type="submit">Submit</button>
  {#if formStatus}
    <p class="{formStatusClass} box-border m-t-6 p-2 text-center">{formStatusText}</p>
  {/if}
</form>
