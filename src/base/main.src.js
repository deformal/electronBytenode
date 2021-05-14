const { app, BrowserWindow, ipcMain } = require("electron");
const bytenode = require("bytenode");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const path = require("path");

let db = new sqlite3.Database("test.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});
db.serialize(function () {
  db.run("PRAGMA cipher_compatibility = 4");
  db.run("PRAGMA key = 'mysecret'");
  db.run(
    "CREATE TABLE person (pid INTEGER NOT NULL UNIQUE ,name TEXT NOT NULL, PRIMARY KEY('pid' AUTOINCREMENT))",
    (err) => {
      if (err) console.log(err);
      console.log("table person create");
    }
  );
  db.run(
    "CREATE TABLE phone (pid INTEGER NOT NULL UNIQUE ,phonenumber NUMERICAL NOT NULL UNIQUE, PRIMARY KEY('pid' AUTOINCREMENT) )",
    (err) => {
      if (err) console.log(err);
      console.log("table phone created");
    }
  );
});

let mainwindow;

const createWindow = () => {
  mainwindow = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainwindow.loadFile(__dirname + "/index.html");
};

app.on("ready", createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("addContacts", async (event, data) => {
  const personinsert = `INSERT INTO person (name) VALUES ('${data.x}')`;
  const contactinsert = `INSERT INTO phone (phonenumber) VALUES ('${data.y}')`;
  db.run(personinsert);
  db.run(contactinsert);
  event.sender.send("addContact", "added");
  console.log(`added ${data.x} with ${data.y} to the contacts list`);
});

ipcMain.on("showContacts", async (event) => {
  const query =
    "CREATE VIEW persons AS SELECT name, phonenumber FROM person INNER JOIN phone ON phone.pid = person.pid";
  const statement = db.exec(query, (err) => {
    err ? console.log(err) : console.log("ok to go");
  });
  const viewquery = `SELECT * FROM persons`;
  db.each(viewquery, (err, row) => {
    err ? console.log(err) : event.sender.send("showContact", row);
  });

  ipcMain.on("fromhtml", async (event) => {
    event.sender.send("fromserver", "hello");
  });
});
