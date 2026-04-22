const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    confirm: (text) => ipcRenderer.sendSync('confirm', text),
    message: (text) => ipcRenderer.sendSync('message', text),
    saveDiscard: (text) => ipcRenderer.sendSync('save-discard', text)
})
