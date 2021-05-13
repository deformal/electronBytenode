   const {ipcRenderer} = require('electron')
    function subform() {
        const x = document.getElementById('con').value
        const y = document.getElementById('connum').value
        const usr = {x,y}
        console.log(usr)
        ipcRenderer.send('addContact',usr)
        ipcRenderer.on("addContact",(err, data)=>{
             document.querySelector('h1').innerText = data
            setTimeout(function(){document.querySelector('h1').innerText = "" }, 500);
            
        })
        setTimeout(function(){window.location.reload() }, 1000);
    }
    function showform(){
        ipcRenderer.send('showContacts')
        const list = document.getElementById('list')
        document.getElementById("showbtn").disabled = true
        ipcRenderer.on('showContacts',(err,result) => {
        const data = [result]
        data.forEach(element => {
            let li = document.createElement('li')
            li.innerText = element.name;
            list.appendChild(li)
        });
    });
}   
  