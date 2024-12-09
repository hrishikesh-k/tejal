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

export const theAmazingFashionMagazineIssue19Posts =
  theAmazingFashionMagazineIssue19Collection
    .sort((post1, post2) => post1.data.weight - post2.data.weight)
    .reverse()

export const modellingPosts = modellingCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const presentationPosts = presentationCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()
