const {app, BrowserWindow, ipcMain} = require('electron')
const bytenode = require('bytenode')
const sqlite3 = require('@journeyapps/sqlcipher').verbose()
const path  = require('path')
let db = new sqlite3.Database('./src/contacts.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
db.serialize(function(){
  db.run("PRAGMA cipher_compatibility = 4");
  db.run("PRAGMA key = 'mysecret'");
  db.run("CREATE TABLE contact (name TEXT, number NUMERICAL)",(err)=>{
    console.log("table already created")
  });
})

let mainwindow;

const createWindow = () => {
    mainwindow = new BrowserWindow({
        width:500,
        height:500,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            nodeIntegrationInSubFrames:true,
            nodeIntegrationInSubFrames:true
        }
    })
   mainwindow.loadURL(__dirname+"./index.html"); 
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

ipcMain.on('addContact',(event, data) => {
 const intoquery = `INSERT INTO contact (name, number) VALUES ('${data.x}','${data.y}')`
 db.run(intoquery)
console.log(`added ${data.name} to the contacts list`)
})

ipcMain.on('showContacts',(event) => {
  let contactArray = [];
  const query ='SELECT * FROM contact'  
 db.each(query, (err, row) => {
  if (err) {
    throw err;
  }
  console.log(row);
  event.sender.send('contacts',row)
})
})


module.exports = {
    app,
    mainwindow
}
