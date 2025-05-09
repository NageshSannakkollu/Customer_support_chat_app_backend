const { default: mongoose, trusted } = require("mongoose");


const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
})

const UserModel = mongoose.models.User || mongoose.model('User',UserSchema)

module.exports = UserModel;