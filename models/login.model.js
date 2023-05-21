const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        uppercase: true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
    }
})

const UserModel = mongoose.model('LoginModel',UserSchema)

module.exports = UserModel