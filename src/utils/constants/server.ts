// @unocss-include

import { getCollection } from 'astro:content'

const advertisingCollection = await getCollection('advertising')
const modellingCollection = await getCollection('modelling')
const presentationCollection = await getCollection('presentation')
const theAmazingFashionMagazineIssue19Collection = await getCollection(
  'theAmazingFashionMagazineIssue19'
)

export const advertisingPosts = advertisingCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const collectionList = [
  {
    name: 'TAFM #19',
    slug: 'the-amazing-fashion-magazine-issue-19',
    title: 'The Amazing Fashion Magazine (Issue 19)'
  },
  {
    name: 'Advertising',
    slug: 'advertising',
    title: 'Advertising'
  },
  {
    name: 'Presentations',
    slug: 'presentations',
    title: 'Presentations'
  },
  {
    name: 'Modelling',
    slug: 'modelling',
    title: 'Modelling'
  }
] as const

export const formInputClass = [
  'bg-light-500',
  'border-0.25',
  'border-gray-300',
  'border-solid',
  'border-rounded-1',
  'box-border',
  'font-montserrat',
  'm-0',
  'outline-0',
  'p-2',
  'peer',
  'text-dark-500',
  'w-full'
]

export const formSpanClass = [
  'left-2',
  'opacity-50',
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
]

export const icons = {
  bars: 'M0,6.86c0-1.9,1.53-3.43,3.43-3.43H44.57c1.9,0,3.43,1.53,3.43,3.43s-1.53,3.43-3.43,3.43H3.43c-1.9,0-3.43-1.53-3.43-3.43ZM0,24c0-1.9,1.53-3.43,3.43-3.43H44.57c1.9,0,3.43,1.53,3.43,3.43s-1.53,3.43-3.43,3.43H3.43c-1.9,0-3.43-1.53-3.43-3.43Zm48,17.14c0,1.9-1.53,3.43-3.43,3.43H3.43c-1.9,0-3.43-1.53-3.43-3.43s1.53-3.43,3.43-3.43H44.57c1.9,0,3.43,1.53,3.43,3.43Z',
  'caret-down':
    'm20.61 36.99c1.87 1.87 4.92 1.87 6.79.0L46.59 17.8c1.38-1.38 1.78-3.43 1.03-5.23S45.13 9.6 43.18 9.6H4.81c-1.93.01-3.69 1.18-4.44 2.98s-.33 3.85 1.03 5.23L20.59 37h.01z',
  'caret-right':
    'm36.99,27.39c1.87-1.87,1.87-4.92,0-6.79L17.8,1.41C16.42.03,14.37-.38,12.57.37s-2.97,2.49-2.97,4.44v38.38c0,1.93,1.17,3.69,2.97,4.44s3.85.33,5.23-1.03l19.19-19.19h0Z',
  'circle-arrow-left':
    'm48,24c0,13.25-10.75,24-24,24S0,37.25,0,24,10.75,0,24,0s24,10.75,24,24Zm-26.34,12.09c.88.88,2.31.88,3.18,0s.88-2.31,0-3.18l-6.66-6.66h17.07c1.25,0,2.25-1.01,2.25-2.26s-1-2.25-2.25-2.25h-17.07l6.66-6.66c.88-.88.88-2.31,0-3.18s-2.31-.88-3.18,0l-10.5,10.49c-.88.88-.88,2.31,0,3.18l10.5,10.51Z',
  'circle-arrow-right':
    'm0 24c0 13.25 10.75 24 24 24s24-10.75 24-24S37.25.0 24 0 0 10.75.0 24zm26.34 12.09c-.88.88-2.31.88-3.18.0s-.88-2.31.0-3.18l6.66-6.66H12.75c-1.25.0-2.25-1.01-2.25-2.26s1-2.25 2.25-2.25h17.07l-6.66-6.66c-.88-.88-.88-2.31.0-3.18s2.31-.88 3.18.0l10.5 10.49c.88.88.88 2.31.0 3.18l-10.5 10.51z',
  'file-user':
    'M12,0C8.69,0,6,2.69,6,6v36c0,3.31,2.69,6,6,6h24c3.31,0,6-2.69,6-6V15h-12c-1.66,0-3-1.34-3-3V0h-15ZM30,0v12h12L30,0ZM18,24c0-3.31,2.69-6,6-6s6,2.69,6,6-2.69,6-6,6-6-2.69-6-6ZM13.5,40.5c0-4.14,3.36-7.5,7.5-7.5h6c4.14,0,7.5,3.36,7.5,7.5,0,.82-.68,1.5-1.5,1.5H15c-.83,0-1.5-.68-1.5-1.5Z',
  linkedin:
    'M44.57,0H3.42C1.53,0,0,1.55,0,3.46V44.54c0,1.91,1.53,3.46,3.42,3.46H44.57c1.89,0,3.43-1.55,3.43-3.46V3.46C48,1.55,46.46,0,44.57,0ZM14.51,41.14H7.39V18.24h7.12v22.91h-.01Zm-3.56-26.04c-2.28,0-4.12-1.85-4.12-4.12s1.84-4.12,4.12-4.12,4.12,1.85,4.12,4.12-1.84,4.12-4.12,4.12Zm30.22,26.04h-7.11v-11.14c0-2.66-.05-6.07-3.7-6.07s-4.27,2.89-4.27,5.88v11.34h-7.11V18.24h6.82v3.13h.1c.95-1.8,3.28-3.7,6.74-3.7,7.2,0,8.54,4.75,8.54,10.92v12.56Z',
  'square-envelope':
    'M6.86,0C3.08,0,0,3.08,0,6.86V41.14c0,3.78,3.08,6.86,6.86,6.86H41.14c3.78,0,6.86-3.08,6.86-6.86V6.86c0-3.78-3.08-6.86-6.86-6.86H6.86ZM23.36,25.68L6.88,15.04c.19-1.71,1.64-3.04,3.41-3.04h27.43c1.77,0,3.21,1.33,3.41,3.04l-16.48,10.64c-.19,.13-.42,.19-.64,.19s-.45-.06-.64-.19Zm3.15,2.88l14.64-9.45v13.46c0,1.9-1.53,3.43-3.43,3.43H10.29c-1.9,0-3.43-1.53-3.43-3.43v-13.46l14.64,9.45c.75,.48,1.62,.74,2.51,.74s1.76-.26,2.51-.74h0Z',
  'square-facebook':
    'M42.86,0H5.14C2.3,0,0,2.3,0,5.14V42.86c0,2.84,2.3,5.14,5.14,5.14h14.71V31.68h-6.75v-7.68h6.75v-5.85c0-6.66,3.96-10.34,10.04-10.34,2.91,0,5.95,.52,5.95,.52v6.54h-3.35c-3.3,0-4.33,2.05-4.33,4.15v4.99h7.37l-1.18,7.68h-6.19v16.32h14.71c2.84,0,5.14-2.3,5.14-5.14V5.14c0-2.84-2.3-5.14-5.14-5.14Z',
  'square-instagram':
    'M24,18.29c-3.16,0-5.71,2.56-5.71,5.72,0,3.16,2.56,5.71,5.72,5.71,3.16,0,5.71-2.56,5.71-5.71,0-3.16-2.56-5.71-5.72-5.71Zm13.36-4.39c-.59-1.49-1.77-2.67-3.26-3.26-2.25-.89-7.61-.69-10.1-.69s-7.85-.21-10.1,.69c-1.49,.59-2.67,1.77-3.26,3.26-.89,2.25-.69,7.61-.69,10.11s-.2,7.85,.69,10.11c.59,1.49,1.77,2.67,3.26,3.26,2.25,.89,7.61,.69,10.1,.69s7.85,.21,10.1-.69c1.49-.59,2.67-1.77,3.26-3.26,.89-2.25,.69-7.61,.69-10.11s.21-7.85-.69-10.11h0Zm-13.36,18.89c-4.85,0-8.79-3.93-8.79-8.79s3.93-8.79,8.79-8.79,8.79,3.93,8.79,8.79c0,4.85-3.92,8.78-8.76,8.79,0,0-.01,0-.02,0Zm9.15-15.89c-1.13,0-2.05-.92-2.05-2.05s.92-2.05,2.05-2.05c1.13,0,2.05,.92,2.05,2.05h0c0,1.13-.91,2.05-2.04,2.06,0,0,0,0,0,0h0ZM42.86,0H5.14C2.3,0,0,2.3,0,5.14V42.86c0,2.84,2.3,5.14,5.14,5.14H42.86c2.84,0,5.14-2.3,5.14-5.14V5.14c0-2.84-2.3-5.14-5.14-5.14Zm-1.83,31.07c-.14,2.75-.77,5.18-2.77,7.18s-4.44,2.64-7.18,2.77c-2.83,.16-11.31,.16-14.14,0-2.75-.14-5.17-.77-7.18-2.77s-2.64-4.44-2.77-7.18c-.16-2.83-.16-11.32,0-14.14,.14-2.75,.76-5.18,2.77-7.18s4.44-2.63,7.18-2.76c2.83-.16,11.31-.16,14.14,0,2.75,.14,5.18,.77,7.18,2.77,2,2,2.64,4.44,2.77,7.18,.16,2.82,.16,11.3,0,14.13Z',
  tejal:
    'M48 13.6H34.11v27.51H13.89v-6.72h13.49V6.89h20.61v6.72h0zM13.89 27.5h6.72V6.89H0v6.72H13.89V27.5h0z'
} as const

export const modellingPosts = modellingCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const presentationPosts = presentationCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const theAmazingFashionMagazineIssue19Posts =
  theAmazingFashionMagazineIssue19Collection
    .sort((post1, post2) => post1.data.weight - post2.data.weight)
    .reverse()

export const url = 'https://www.tejalshinde.com/'
