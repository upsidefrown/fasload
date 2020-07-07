// async function appWindowScreenshotPNG () {
//   const [ width, height ] = remote.getCurrentWindow().getSize();

//   const appWindow = (await desktopCapturer.getSources(
//     { types: ['window'], thumbnailSize: { width, height } }))[0];

//   return appWindow.thumbnail.toPNG();
// }

// async function saveToDesktop () {
//   const file = await appWindowScreenshotPNG();

//   ipcRenderer.invoke('save-to-desktop', file);
// }

// async function selectFile () {
//   const file = await remote.dialog.showOpenDialog({
//     buttonLabel: 'Select file',
//     defaultPath: remote.app.getPath('home'),
//     properties: [
//       'multiSelections',
//       'createDirectory',
//       'openFile',
//       'openDirectory' ]
//     });

//   console.log(file);
// }
