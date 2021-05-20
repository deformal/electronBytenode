const { app, BrowserWindow, ipcMain, remote } = require("electron");
const path = require("path");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const jsql = require("json-sql")();
const { Sequelize, DataTypes, HasOne } = require("sequelize");
const userDataPath = path
  .join(app.getPath("userData"), "tables.sqlite")
  .toString();
const sequelize = new Sequelize(
  "USERS",
  "",
  "mysecret",
  {
    dialect: "sqlite",
    dialectModulePath: "@journeyapps/sqlcipher",
    storage: userDataPath,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("Connected to the db");
  }
);
// SQLCipher config

sequelize
  .query("PRAGMA cipher_compatibility = 4")
  .then((result) => {
    console.log("Cipher Created");
  })
  .catch((err) => {
    console.log("Some Error Occured");
  }); // necessary
sequelize
  .query("PRAGMA key = 'mysecret'")
  .then((result) => {
    console.log("Cipher Created");
  })
  .catch((err) => {
    console.log("Some Error Occured");
  }); // necessary //necessary

const userName = sequelize.define("person", {
  pid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
const userPhone = sequelize.define("phone", {
  pid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  phonenumber: {
    type: DataTypes.NUMBER,
    allowNull: false,
    unique: true,
  },
});
userName.hasOne(userPhone, { foreignKey: "pid" });
userPhone.belongsTo(userName, { foreignKey: "pid" });
(async () => {
  await userName
    .sync()
    .then((result) => {
      console.log("Table Created---> userName");
    })
    .catch((err) => {
      console.log("Some Error Occured");
    });
  await userPhone
    .sync()
    .then((result) => {
      console.log("Table Created---> userPhone");
    })
    .catch((err) => {
      console.log("Some Error Occured");
    });
})();

app.on("ready", () => {
  let mainwindow = new BrowserWindow({
    width: 500,
    height: 500,
    alwaysOnTop: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  let splash = new BrowserWindow({
    width: 400,
    height: 400,
    center: true,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.loadFile(__dirname + "/splash.html");
  mainwindow.loadFile(__dirname + "/index.html");

  mainwindow.once("ready-to-show", () => {
    splash.destroy();
    mainwindow.show();
  });
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
  const newUserName = await userName
    .create({
      name: data.name,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  const newUserPhone = await userPhone
    .create({
      phonenumber: data.number,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("showContacts", async (event) => {
  const allusers = await userName
    .findAll({
      include: {
        model: userPhone,
        required: true,
        attributes: ["phonenumber"],
      },
    })
    .then((result) => {
      const body = JSON.stringify(result);
      const final = JSON.parse(body);
      event.sender.send("showContact", final);
    })
    .catch((err) => {
      console.log(`this is the error ${err}`);
    });
});
