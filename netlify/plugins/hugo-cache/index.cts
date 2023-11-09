import {logError, logSuccess, logWarn} from '../../../scripts.ts'
import type {NetlifyPlugin} from '@netlify/build'
export default function () : NetlifyPlugin {
  return {
    onBuild: async meta => {
      logWarn('removing old resources from cache')
      try {
        await meta.utils.cache.remove('./resources/')
        logSuccess('old resources successfully removed from cache')
        logWarn('saving new resources to cache')
        try {
          await meta.utils.cache.save('./resources/')
          logSuccess('new resources successfully saved to cache')
        } catch {
          logError('failed to save new resources to cache')
        }
      } catch {
        logError('failed to remove old resources from cache, new resources won\'t be saved')
      }
    },
    onPreBuild: async meta => {
      logWarn('restoring old resources from cache')
      try {
        await meta.utils.cache.restore('./resources/')
        logSuccess('old resources successfully restored')
      } catch {
        logError('failed to restore old resources from cache')
      }
    }
  }
}