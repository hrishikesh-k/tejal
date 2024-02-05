import {cwd} from 'node:process'
import {join} from 'node:path'
/**
 * @returns {import('@netlify/build').NetlifyPlugin}
 */
export default function() {
  const resourcesPath = join(cwd(), './resources/')
  return {
    onPostBuild: meta => {
      return meta.utils.cache.save(resourcesPath).then(saveStatus => {
        if (saveStatus) {
          console.log('save successful')
        } else {
          console.warn('save successful, but nothing saved')
        }
        return meta.utils.cache.list({
          depth: 10
        }).then(listOfFiles => {
          console.log(listOfFiles)
        }).catch(() => {
          console.error('failed to list')
        })
      }).catch(() => {
        console.error('failed to save')
      })
    },
    onPreBuild: meta => {
      return meta.utils.cache.list({
        depth: 10
      }).then(listOfFiles => {
        console.log(listOfFiles)
        return meta.utils.cache.restore(resourcesPath).then(restoreStatus => {
          if (restoreStatus) {
            console.log('successfully restored')
          } else {
            console.warn('successfully restored, but nothing to restore')
          }
        }).catch(() => {
          console.error('failed to restore')
        })
      }).catch(() => {
        console.error('failed to list')
      })
    }
  }
}