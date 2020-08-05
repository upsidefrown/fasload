"use strict";

import { app, dialog, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import windowStateKeeper from 'electron-window-state'

import { formatToAxios, aggregateResponses, sortTimes, latencyDistribution } from './utilities/format'
import { deployWorkers } from './utilities/deploy'

const env = {
  isMac: process.platform === 'darwin',
  isWin: process.platform === 'win32',
  isDev: process.env.NODE_ENV !== 'production',
  isTest: process.env.IS_TEST,
  nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
}

let mainWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  let windowState = windowStateKeeper({ defaultWidth: 1040, defaultHeight: 770 })

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 840,
    minHeight: 515,
    backgroundColor: 'white',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: env.nodeIntegration
    },
    backgroundThrottling: false // disable resource throttling on blur
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html");
  }

  windowState.manage(mainWindow)
  mainWindow.once('ready-to-show', mainWindow.show) // preload ('once' frees for garbage collection)

  mainWindow.on("closed", () => {
    mainWindow = null; // free for garbage collection
  });
}

app.on("window-all-closed", () => {
  if (!env.isMac) app.quit()
});

app.on("activate", () => {
  if (mainWindow === null) createWindow()
});

app.on("ready", async () => {
  if (env.isDev && !env.isTest) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (env.isDev) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// IPC channel to renderer process

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