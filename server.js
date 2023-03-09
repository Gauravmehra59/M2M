const express = require("express")
const app = express()
const http = require("http")
const port = process.env.PORT || 3000

const server = http.createServer(app)
app.use(express.static(__dirname))
app.get("/",(req,res)=>{
    res.sendFile(__dirname +'/index.html')
})

server.listen(port,()=>{
    console.log(`Listen port ${port}`)
})

const io = require("socket.io")(server,{
    cors:{
        origin: '*',
        methods: ['GET','POST'],
    },
    maxHttpBufferSize: Infinity
})
var user = {}
io.on('connection',(socket)=>{
    console.log("connected")
    var roomid
    socket.on('room_id',(room)=>{
        socket.join(room)
        roomid = room
    })

    socket.on('message',(data)=>{
        socket.broadcast.to(data.room).emit('message',data.msg)
        console.log(data.msg)
    })
    
    socket.on("user_name",(nam)=>{
        user[socket.id] = nam.username
        socket.broadcast.to(nam.room).emit('user_name',nam.username)
    })

    socket.on('typing',(data)=>{
        socket.broadcast.to(data).emit("typing","typing...")
    })

    socket.on('typing_stop',(data)=>{
        socket.broadcast.to(data).emit("typing_stop"," ")
    })



    socket.on('disconnect',()=>{
        console.log(roomid)
        socket.broadcast.to(roomid).emit("user_disconnect",users = user[socket.id])
        delete user[socket.id]

    })
})