import { app, BrowserWindow, dialog, ipcMain } from "electron"

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { i18n } from "./src/scripts/i18n.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        minWidth: 650,
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
        buttons: [i18n.t('yes'), i18n.t('no')],
        defaultId: 1,
        cancelId: 1,
        noLink: true
    })

    event.returnValue = (result == 0)
})

ipcMain.on('saveDiscard', (event, text) => {
    const result = dialog.showMessageBoxSync({
        message: text,
        buttons: [i18n.t('save'), i18n.t('discard'), i18n.t('cancel')],
        defaultId: 2,
        cancelId: 2,
        noLink: true
    })

    event.returnValue = result
})