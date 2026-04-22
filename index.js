const { app, BrowserWindow, dialog, ipcMain } = require('electron') ;
const path = require('path');

const createWindow = () => {
    const window = new BrowserWindow({
        minWidth: 600,
        minHeight: 400,
        webPreferences: {
            preload: path.join(__dirname, 'bridge.js')
        }
    })

    //window.removeMenu()
    window.loadFile('index.html')
}

ipcMain.on('confirm', (event, text) => {
    const result = dialog.showMessageBoxSync({
        message: text,
        buttons: ['Confirmar', 'Cancelar'],
        defaultId: 1,
        cancelId: 1,
        noLink: true
    })

    event.returnValue = (result == 0)
})

ipcMain.on('save-discard', (event, text) => {
    const result = dialog.showMessageBoxSync({
        message: text,
        buttons: ['Salvar', 'Descartar', 'Cancelar'],
        defaultId: 2,
        cancelId: 2,
        noLink: true
    })

    event.returnValue = result
})

ipcMain.on('message', (event, text) => {
    dialog.showMessageBoxSync({
        message: text,
        buttons: ['OK'],
        noLink: true
    })

    event.returnValue = undefined
})

app.whenReady().then(() => {
    createWindow()
})