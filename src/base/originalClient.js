const { ipcRenderer } = require("electron");
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
require('ajv-keywords')(ajv,"transform")
// schema
const schmea = {
  type: "object",
  properties: {
    name: { type: "string" },
    number: { type: "number",},
  },
  required: ["name", "number"],
  additionalProperties: false,
};
const validate = ajv.compile(schmea);

//schema test functions
function test(data) {
  const valid = validate(data);
  return valid ? true : false;
}

// client functions
function subform() {
  const name = document.getElementById("con").value
  const number = parseFloat(document.getElementById("connum").value)
  const message = document.getElementById("msg");
  const usr = {name,number};
  if (test(usr)) {
    message.innerText = "The user is added"
    ipcRenderer.send("addContacts", usr);
    setTimeout(function () {
      window.location.reload();
    }, 800);
  } else {
    message.innerText = `Invalid entry ${ajv.errorsText(validate.errors)}`
  }
}

function showform() {
  ipcRenderer.send("showContacts");
  const list = document.getElementById("list");
  document.getElementById("showbtn").disabled = true;
}

// ipc functions
ipcRenderer.on("showContact", (err, result) => {
  const data = [result];
  data.forEach((element) => {
    let li = document.createElement("li");
    li.innerText = `Name:${element.name} ----- Phone:${element.phonenumber} `;
    list.appendChild(li);
  });
});

ipcRenderer.on("addContact", (err, data) => {
  document.querySelector("h1").innerText = data;
  setTimeout(function () {
    document.querySelector("h1").innerText = "";
  }, 500);
});
ipcRenderer.on("fromserver", async (err, data) => {
  const x = document.querySelector("h1");
  x.innerText = data;
});

ipcRenderer.on("dberrors",(err,data)=>{
  const message = document.getElementById("msg")
   if(err) message.innerText = err
   message.innerText = data
})
