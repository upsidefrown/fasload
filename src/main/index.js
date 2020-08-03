'use strict'

import { app, dialog, BrowserWindow, ipcMain } from 'electron'
import windowStateKeeper from 'electron-window-state'
import { formatToAxios, aggregateResponses, sortTimes, latencyDistribution } from '../utils/format'
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
  let windowState = windowStateKeeper({ defaultWidth: 960, defaultHeight: 680 })

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 840,
    minHeight: 515,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false // disable resource throttling on blur
    }
  })

  windowState.manage(mainWindow)

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

  const responses = await deployWorkers(request, load, workers)
  const aggResponses = aggregateResponses(responses)
  const times = sortTimes(aggResponses.times)
  const distribution = latencyDistribution(times)
  const statusCodes = aggResponses.statusCodes

  mainWindow.webContents.send('test-results', { times, distribution, statusCodes })
})

ipcMain.on('upload-files', async () => {
  const fileSelect = await dialog.showOpenDialog({
    buttonLabel: 'Select files',
    defaultPath: app.getPath('home'),
    properties: [
      'openFile',
      'openDirectory' ]
  })

  mainWindow.webContents.send('file', fileSelect.filePaths[0])
})
