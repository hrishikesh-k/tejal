import {argv, cwd, env, exit} from 'node:process'
import {basename, join} from 'node:path'
import {bindOpts} from '@netlify/cache-utils'
import chalk from 'chalk'
import {type ChildProcess, spawn} from 'node:child_process'
import {copyFileSync, existsSync, rmSync, unwatchFile, watch, writeFileSync} from 'node:fs'
const unoCommonArguments = [
  'unocss',
  './layouts/**/*.html',
  './assets/css/styles.css',
  './assets/js/bundle.ts',
  '--out-file',
  './assets/css/uno.css',
  '--write-transformed'
]
const unoFile = join(cwd(), './assets/css/styles.css')
const unoFileBak = join(cwd(), './assets/css/styles.css.bak.css')
const unoOutput = join(cwd(), './assets/css/uno.css')
let hugoProcess : ChildProcess | null = null
let unoProcess : ChildProcess | null = null
function logError(message : string) {
  console.error(chalk.red(message))
}
function logSuccess(message : string) {
  console.log(chalk.green(message))
}
function logWarn(message : string) {
  console.warn(chalk.yellow(message))
}
function closeAll(error : boolean | string = false) {
  if (unoProcess) {
    try {
      logWarn('Killing UnoCSS server...')
      unoProcess.kill('SIGINT')
      logSuccess('UnoCSS server successfully killed')
    } catch {
      logError('Failed to kill UnoCSS server')
    }
  }
  if (hugoProcess) {
    try {
      logWarn('Killing Hugo server...')
      hugoProcess.kill('SIGINT')
      logSuccess('Hugo server successfully killed')
    } catch {
      logError('Failed to kill Hugo server')
    }
  }
  try {
    logWarn('Restoring custom styles from backup and stopping the watcher...')
    unwatchFile(unoFileBak)
    copyFileSync(unoFileBak, unoFile)
    logSuccess('Custom styles watcher successfully stopped and styles successfully restored from backup')
    try {
      logWarn('Deleting custom styles backup...')
      rmSync(unoFileBak)
      logSuccess('Custom styles backup successfully deleted')
    } catch {
      logError('Failed to delete custom styles backup')
    }
    try {
      logWarn('Deleting UnoCSS output...')
      rmSync(unoOutput)
      logSuccess('UnoCSS output successfully deleted')
    } catch {
      logError('Failed to delete UnoCSS output')
    }
  } catch {
    logError('Failed to stop watcher and restore custom styles from backup')
  }
  try {
    logWarn('Deleting scripts...')
    rmSync(join(cwd(), './scripts.js'))
    logSuccess('Scripts successfully deleted')
  } catch {
    logError('Failed to scripts')
  }
  if (error && typeof error === 'boolean') {
    logError('Process completed with an error')
    exit(1)
  } else {
    logSuccess('Process successfully completed')
    exit()
  }
}
function common() {
  try {
    logWarn('Backing up custom styles before UnoCSS processing...')
    copyFileSync(unoFile, unoFileBak)
    logSuccess('Custom styles successfully backed up')
  } catch {
    logError('Failed to create a backup of custom styles')
    closeAll(true)
  }
  try {
    logWarn('Creating UnoCSS output file before starting Hugo...')
    writeFileSync(unoOutput, '')
    logSuccess('UnoCSS output file successfully created')
  } catch {
    logError('Failed to create UnoCSS output file')
    closeAll(true)
  }
}
if (argv[2] === '--build') {
  const resourcesDir = join(cwd(), './resources/')
  async function restoreOrSave(action : 'restore' | 'save') {
    if (env['NETLIFY'] === 'true') {
      if (argv[3] === '--clean') {
        logWarn(`Skipping ${action} as --clean was used`)
      } else {
        try {
          logWarn(`Performing ${action}...`)
          const actionStatus = await bindOpts({
            cacheDir: '/opt/build/cache'
          })[action]([
            resourcesDir
          ], {})
          if (actionStatus) {
            logSuccess(`Successfully ${action}d`)
          } else {
            logWarn(`Successfully ${action}d, but nothing to ${action}`)
          }
        } catch {
          logError(`Failed to ${action}`)
        }
      }
    } else {
      logWarn(`Skipping ${action} as env['NETLIFY'] is not 'true'`)
    }
  }
  [
    join(cwd(), './public/'),
    resourcesDir
  ].forEach(dir => {
    const dirName = basename(dir)
    if (existsSync(dir)) {
      function deleteDir() {
        logWarn(`Deleting ${dirName} directory...`)
        rmSync(dir, {
          recursive: true
        })
        logSuccess(`${dirName} directory successfully deleted`)
      }
      try {
        if (dirName === 'resources') {
          if (argv[3] === '--clean') {
            deleteDir()
          }
        } else {
          deleteDir()
        }
      } catch {
        logError(`Failed to delete ${dirName} directory`)
        closeAll(true)
      }
    } else {
      logSuccess(`${dirName} does not exist, skipping deletion...`)
    }
  })
  await restoreOrSave('restore')
  logWarn('Starting type-checking...')
  const tscProcess = spawn('npx', ['tsc'], {
    stdio: 'inherit'
  })
  tscProcess.on('close', tscProcessMessage => {
    if (tscProcessMessage === 0) {
      logSuccess('Type-checking successfully completed')
      common()
      logWarn('Starting UnoCSS build process...')
      unoProcess = spawn('npx', unoCommonArguments, {
        stdio: 'inherit'
      })
      unoProcess.on('close', unoProcessMessage => {
        unoProcess = null
        if (unoProcessMessage === 0) {
          logSuccess('UnoCSS build process successfully completed')
          logWarn('Starting Hugo build process...')
          hugoProcess = spawn('hugo', {
            stdio: 'inherit'
          })
          hugoProcess.on('close', async hugoProcessMessage => {
            hugoProcess = null
            if (hugoProcessMessage === 0) {
              logSuccess('Hugo build process successfully completed')
              await restoreOrSave('save')
              closeAll()
            } else {
              logError('Hugo build process failed')
              closeAll(true)
            }
          })
        } else {
          logError('UnoCSS build process failed')
          closeAll(true)
        }
      })
    } else {
      logError('Type-checking failed')
      closeAll(true)
    }
  })
} else if (argv[2] === '--dev') {
  common()
  logWarn('Setting up watcher for custom styles backup...')
  watch(unoFileBak, unoFileBakWatchEventType => {
    if (unoFileBakWatchEventType === 'change') {
      try {
        logWarn('Custom styles backup changed, updating the original file...')
        copyFileSync(unoFileBak, unoFile)
        logSuccess('Custom styles successfully updated')
      } catch {
        logError('Failed to update custom styles from backup')
      }
    }
  })
  logSuccess('Custom styles watcher successfully set up')
  logWarn('Starting UnoCSS server...')
  unoProcess = spawn('npx', unoCommonArguments.concat([
    '--watch'
  ]), {
    stdio: 'inherit'
  })
  unoProcess.on('close', unoProcessMessage => {
    unoProcess = null
    if (unoProcessMessage !== 0) {
      logError('UnoCSS server failed to start')
      closeAll(true)
    }
  })
  logWarn('Starting Hugo server...')
  hugoProcess = spawn('hugo', ['server'], {
    stdio: 'inherit'
  })
  hugoProcess.on('close', hugoProcessMessage => {
    hugoProcess = null
    if (hugoProcessMessage !== 0) {
      logError('Hugo server failed to start')
      closeAll(true)
    }
  })
} else {
  logError('Invalid argument, please use --build or --dev')
  exit(1)
}
process.on('SIGINT', closeAll)
process.on('SIGTERM', closeAll)