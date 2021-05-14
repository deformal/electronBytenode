const {app, BrowserWindow, ipcMain} = require('electron')
const bytenode = require('bytenode')
const sqlite3 = require('@journeyapps/sqlcipher').verbose()
const path  = require('path')

let db = new sqlite3.Database('test.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});
db.serialize(function(){
  db.run("PRAGMA cipher_compatibility = 4");
  db.run("PRAGMA key = 'mysecret'");
  db.run("CREATE TABLE contact (name TEXT, number NUMERICAL)",(err)=>{
    
    if (err) console.log("table already created")

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
        }
    })
   mainwindow.loadFile(__dirname+"/index.html");
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

ipcMain.on('addContacts',async (event, data) => {
 const intoquery = `INSERT INTO contact (name, number) VALUES ('${data.x}','${data.y}')`
 db.run(intoquery)
 event.sender.send("addContact","added")
console.log(`added ${data.name} to the contacts list`)
})

ipcMain.on('showContacts',async (event) => {
  const query ='SELECT * FROM contact'  
 db.each(query, (err, row) => {
  if (err) {
    console.log(err);
  }
  event.sender.send('showContact',row)
})

ipcMain.on('fromhtml',async (event)=>{
  event.sender.send("fromserver","hello")
})
})