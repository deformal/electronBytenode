const { app, BrowserWindow, ipcMain } = require("electron");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const jsql = require("json-sql")();

let db = new sqlite3.Database("./src/final/test.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});
db.serialize(function () {
  db.run("PRAGMA cipher_compatibility = 4");
  db.run("PRAGMA key = 'mysecret'");
  db.run(
    "CREATE TABLE IF NOT EXISTS person (pid INTEGER NOT NULL UNIQUE ,name TEXT NOT NULL UNIQUE, PRIMARY KEY('pid' AUTOINCREMENT))",
    (err) => {
      if (err) console.log(err);
      console.log("Switched to table ----> person");
    }
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS phone (pid INTEGER NOT NULL UNIQUE ,phonenumber NUMERICAL NOT NULL UNIQUE, PRIMARY KEY('pid' AUTOINCREMENT) )",
    (err) => {
      if (err) console.log(err);
      console.log("Switched to table ------> phone");
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

app.on("ready", () => {
  createWindow();
});

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
  const personinsert = `INSERT INTO person (name) VALUES ('${data.name}')`;
  const contactinsert = `INSERT INTO phone (phonenumber) VALUES ('${data.number}')`;
  console.log(data);
  db.run(personinsert, (err) => {
    if (err) {
      console.log(err);
      event.sender.send("dberrors", err);
    }
    event.sender.send("addContact", "added");
  });
  db.run(contactinsert, (err) => {
    if (err) {
      console.log(err);
      event.sender.send("dberrors", err);
    }
    event.sender.send("addContact", "added");
  });
});

ipcMain.on("showContacts", (event) => {
  const query =
    "CREATE VIEW IF NOT EXISTS  persons AS SELECT name, phonenumber FROM person INNER JOIN phone ON phone.pid = person.pid";
  db.exec(query);
  const sql = jsql.build({
    type: "select",
    table: "persons",
  });
  db.each(sql.query, (err, row) => {
    if (err) console.log(err);
    event.sender.send("showContact", row);
  });
});
