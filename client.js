const socket = io()
let username
let textarea = document.querySelector('#textarea')
let reply = document.querySelector('#reply_msg')
let usernamehtml = document.querySelector('#user-name') 
let messagearea = document.querySelector('.message__area')
let reply_id_data = document.querySelector('.reply_id')
let number_connection = document.querySelector('#number_connection')
var audio = new Audio("message_tone.mp3")

do{
    room = prompt("Enter your room id ")
}while(!room)


socket.emit('room_id',room)


welcome()
function welcome(){
    let mainclient = document.createElement('div') 
    let classname = 'client_name'
    mainclient.classList.add(classname,'clientname')

    let markup = `
    <center>
        <h5>You are connected now</h5>
         </center>
    `

    mainclient.innerHTML = markup
    messagearea.appendChild(mainclient)    
}

function appendclient(username,type,status){
    let mainclient = document.createElement('div') // it is use to create element
    let classname = type
    mainclient.classList.add(classname,'clientname')
    var ref = ""
    if (username === null){
        username = "Refresh the page`"
    }
    let markup = `
        <center>
        <h5>${username} ${status}</h5>
        </center>
    `

    mainclient.innerHTML = markup
    messagearea.appendChild(mainclient)
}
function sendmessage(message){ // outgoing mssg sender
    var d = new Date()
    var time = d.toLocaleTimeString()
    if (message.indexOf("base64")!== -1){
        let msg = {
            user : username,
            message : `<img src='${message}' width = 300px/><a href="${message}" download ><i class='bi bi-download download'></i></a>`,
            date : time,
            reply_data:reply.textContent,
            reply_id: Math.floor(Math.random() * 10000),
            reply_id_val:reply_id_data.textContent
        }
    
        appendMessage(msg,'outgoing')
        textarea.value = ""
        scrolltobottom()
    
        socket.emit('message',data={msg,room})
    }
    else{
    let msg = {
        user : username,
        message : message.trim(),
        date : time,
        reply_data:reply.textContent,
        reply_id: Math.floor(Math.random() * 10000),
        reply_id_val:reply_id_data.textContent
    }

    appendMessage(msg,'outgoing')
    textarea.value = ""
    scrolltobottom()

    socket.emit('message',data={msg,room})
}
}



function appendMessage(msg,type){
    let maindiv = document.createElement('div') // it is use to create element
    let classname = type
    maindiv.classList.add(classname,'message')

    let markup = `
        <h4>${msg.user}</h4>
        <div style="background:white; color:red"><a href="#${msg.reply_id_val}">${msg.reply_data}</a></div>
        <h1 id='${msg.reply_id}'>${msg.message}<br><i class="bi bi-reply repply"></i></h1>
        <p>${msg.date}</p>
    `
    // reply_id_data.innerHTML = reply_id_data.textContent
    reply.textContent = ""
    maindiv.innerHTML = markup
    messagearea.appendChild(maindiv)
    
    if (type == "incoming" ){
        audio.play()
    }
    
}

function scrolltobottom(){
    messagearea.scrollTop = messagearea.scrollHeight
}



//get the data from text box by enter key
textarea.addEventListener('keyup',(e)=>{
    socket.emit("typing",room)
    if(e.key === "Enter"){
        sendmessage(e.target.value)
        socket.emit("typing_stop",room)
    }
    else if(e.target.value == ""){
        socket.emit("typing_stop",room)
    }
})

function appendTyping(ty){
    var data = document.getElementById("typee")
    data.innerHTML = ty
}

function sendmsg(){
    socket.emit("typing_stop",room)
    var msg = textarea.value
    sendmessage(msg)
}

var loadFile = function(event){
    // var data = event.files
    Object.keys(event.files).forEach(myfunction)
    function myfunction(item){
        console.log(item)
        var file = event.files[item]
        console.log(event.files)
        if(!file.type.match("image.*")){
            alert('Please select image only.....')
        }
        else{
            var reader = new FileReader()
            reader.addEventListener('load',function(){
                sendmessage(reader.result)
            })
            reader.readAsDataURL(file)
        }
    }
    console.log(Object.keys(event.files))
}
socket.on('message',(msg)=>{
    appendMessage(msg,'incoming')
    scrolltobottom()
})


socket.on('user_name',(username)=>{
    appendclient(username,'client_name','connected')
    scrolltobottom()
})

socket.on('user_disconnect',(user)=>{
    appendclient(user,'client_name','disconnected')
    console.log(user)
    scrolltobottom()
})

socket.on("typing",(ty)=>{
    appendTyping(ty)
    scrolltobottom()
})

socket.on("user-name",(ty)=>{
    console.log("client",ty)
    usernamehtml.innerHTML = ty
    username = ty
    socket.emit("user_name",msg={username,room})
})

// socket.on("number_connection",(ty)=>{
//     number_connection.innerHTML = ty
// })

socket.on("typing_stop",(ty)=>{
    appendTyping(ty)
    scrolltobottom()
})