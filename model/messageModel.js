const { default: mongoose } = require("mongoose");


const MessageSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    message:{
        type:String,
        required:true,
    },
    response:{
        type:String,
        default:''
    }
},{timestamps:true})

const MessageModel = mongoose.models.Message || mongoose.model("Message",MessageSchema)

module.exports = MessageModel;