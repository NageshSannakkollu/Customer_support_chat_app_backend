const { default: mongoose } = require("mongoose");

const documentSchema = new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    uploadDate:{
        type:Date,
        default:Date.now()
    }
})

const DocumentModel = mongoose.models.Document || mongoose.model("Document",documentSchema);
module.exports = DocumentModel;