const {app, BrowserWindow} = require('electron')
const bytenode = require('bytenode')
const sqlite3 = require('@journeyapps/sqlcipher').verbose()
const path  = require('path')

let mainwindow;

const createWindow = () => {
    mainwindow = new BrowserWindow({
        width:500,
        height:500,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            nodeIntegrationInSubFrames:true
        }
    })
  
   mainwindow.loadURL("https://super-stats.herokuapp.com"); 
}

app.on('ready',createWindow)


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

module.exports = {
    app,
    mainwindow
}
