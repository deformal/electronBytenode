   const {ipcRenderer} = require('electron')
function subform() {
        const x = document.getElementById('con').value
        const y = document.getElementById('connum').value
        const h1 = document.querySelector('h1')
        let usr; 
        if(x == "" || y == "") h1.innerText = "empty fields" 
        else { 
            h1.innerText = "added" 
            usr = {x,y}
        console.log(usr)
        ipcRenderer.send('addContacts',usr)
       setTimeout(function(){window.location.reload() }, 1000);  
    }
}  

function showform(){
        ipcRenderer.send('showContacts')
        const list = document.getElementById('list')
        document.getElementById("showbtn").disabled = true
      
    }   

ipcRenderer.on('showContact',(err,result) => {
        const data = [result]
        data.forEach(element => {
            let li = document.createElement('li')
            li.innerText = element.name;
            list.appendChild(li)
        });
    });

function hey(){
ipcRenderer.send('fromhtml')  

}
ipcRenderer.on("addContact",(err, data)=>{
        document.querySelector('h1').innerText = data
        setTimeout(function(){document.querySelector('h1').innerText = "" }, 500);
            
    })
 ipcRenderer.on("fromserver",async(err,data)=>{
       const x = document.querySelector('h1')
       x.innerText = data
    })   
