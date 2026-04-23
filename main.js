import { app, BrowserWindow, dialog, ipcMain } from "electron"

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        minWidth: 526,
        minHeight: 350,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, 'bridge.js')
        }
    })
    mainWindow.loadFile('./src/index.html')
}

app.whenReady().then(() => {
    createWindow()
})

ipcMain.on('message', (event, text) => {
    dialog.showMessageBoxSync({
        message: text,
        buttons: ['OK'],
    })

    event.returnValue = 0
})

ipcMain.on('confirm', (event, text) => {
    const result = dialog.showMessageBoxSync({
        message: text,
        buttons: ['Yes', 'No'],
        defaultId: 1,
    })

    event.returnValue = (result == 0)
})