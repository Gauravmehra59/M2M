const express = require("express")
const app = express()
const route = express.Router()
const http = require("http")
const port = process.env.PORT || 3000
const server = http.createServer(app)
const mongoose = require("mongoose")
const mongoDB = "mongodb://localhost:27017/m2m_login"
const SignupModel = require('./models/login.model')
const bcrypt = require('bcrypt')


var user_name 


app.use(express.urlencoded({extended:false}))
// app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, "js")));
// app.use(express.static('js'));





mongoose.connect(mongoDB,(err) => {
    if(err) console.log("Unable to connect")
    else{
        console.log("Mongo connected")
    }
})


app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/login.html")
})
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post('/m2m/chat',async(req,res,next)=>{

    try{
        const check = await SignupModel.collection.find({email:req.body.username}).toArray().then(async(ans) => {

            user_name = ans[0]["name"]
            if(await bcrypt.compare(req.body.password,ans[0]["password"])){
                app.use(express.static(__dirname))
                    res.sendFile(__dirname +'/index.html')
            }
            else{
                res.status(400).send("Invalid Username Password")
            }
        });
    }
    catch{
        res.send("Invalid Login data ")
    }
        
})

app.post('/signup_form',async(req,res,next)=>{
    const email = req.body.email
    await SignupModel.collection.find({email:req.body.email}).toArray().then(async(ans) => {
        const hashpassword = await bcrypt.hash(req.body.password,10)
        if (ans.length == 0){
            if (req.body.password === req.body.confirmpassword){
                SignupModel({
                    name:req.body.name,
                    email:req.body.email,
                    password:hashpassword
                }).save((err,db)=>{
                    if(err){
                        console.error(err.message)
                    }
                    else{
                        res.redirect("/")

                        console.log("Successfully save")
                    }
                })
            }
            else{
                console.log("Password Not Match")
            }

        }
        else{
            res.status(400).send("Email Already Found")
            console.log("Email ALready Found")

        }
    });


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
    console.log(user)
    // console.log(Object.keys(user).length)
    var roomid
    socket.on('room_id',(room)=>{
        socket.join(room)
        roomid = room
        socket.emit('user-name',user_name)
        // socket.broadcast.to(room).emit('number_connection',Object.keys(user).length)
        // socket.emit('number_connection',Object.keys(user).length)
    })

    socket.on('message',(data)=>{
        socket.broadcast.to(data.room).emit('message',data.msg)
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