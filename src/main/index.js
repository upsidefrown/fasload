'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import windowStateKeeper from 'electron-window-state'
import { formatToAxios, aggregateResponses, latencyDistribution } from '../utils/format'
import { deployWorkers } from '../utils/workers'

const env = {
  isMac: process.platform === 'darwin',
  isWin: process.platform === 'win32',
  isDev: process.env.NODE_ENV !== 'production',
  mainURL: process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
}

let mainWindow

function createWindow () {
  let state = windowStateKeeper({ defaultWidth: 960, defaultHeight: 680 })

  mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    minWidth: 840,
    minHeight: 515,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false // disable resource throttling on blur
    }
  })

  state.manage(mainWindow)

  mainWindow.loadURL(env.mainURL)
  mainWindow.once('ready-to-show', mainWindow.show) // preload ('once' frees for garbage collection)

  mainWindow.on('closed', () => {
    mainWindow = null // free for garbage collection
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (!env.isMac) app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

// IPC Channel

ipcMain.on('run-test', async (e, request, load, workers) => {
  request = formatToAxios(request)

  const results = await deployWorkers(request, load, workers)

  const formattedResults = latencyDistribution(aggregateResponses(results))

  mainWindow.webContents.send('test-results', formattedResults)
})
