//This file must be CommonJS in order for electron to properly recognize it
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('eAPI', {
    message: (text) => ipcRenderer.sendSync('message', text),
    confirm: (text) => ipcRenderer.sendSync('confirm', text)
})