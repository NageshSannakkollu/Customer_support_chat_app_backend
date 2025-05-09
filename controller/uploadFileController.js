const multer = require("multer");
const path = require('path');
const fs = require("fs");
const DocumentModel = require("../model/uploadFileModel");
const UserModel = require("../model/userModel");

const uploadPath = path.join(__dirname,"../uploads");

if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath,{recursive:true})
}

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,uploadPath)
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`);
    }
});

//File type filter
const fileFilter = function(req,file,cb){
        const allowedTypes = ['application/pdf','image/jpeg','image/png'];
        if(!allowedTypes.includes(file.mimetype)){
            return cb(new Error('Invalid file type'),false);
        }
        cb(null,true)
    }

const upload = multer({storage,fileFilter})

const handleUploadFile = async(req,res) => {
    const {email} = req;
    const checkUser = await UserModel.findOne({email:email})
    if(!checkUser){
        return res.status(400).send("Invalid User");
    }
    if(checkUser.role !== "admin"){
        return res.status(400).send("Only admin can upload file.");
    }
    if(!req.file){
        return res.status(400).send('No file uploaded')
    }
    await DocumentModel.create({
        filename:req.file.filename,
        path:req.file.path,
        uploadedBy:checkUser._id,
        uploadDate:Date.now()
    })
    res.status(200).send("Document added successfully!");
}



//Delete File
const deleteUploadFile = async(req,res) => {
    const fileId = req.params.id;
    try {
        const checkFileId =await DocumentModel.findById({_id:fileId})
        const filePath = checkFileId.path;
        if(!checkFileId) return res.status(404).send({message:"File not found."})
        
        fs.unlink(filePath,async(err) =>{
            if(err) return  res.status(200).send({message:"Failed to delete file"})
            await DocumentModel.findByIdAndDelete({_id:fileId})
            res.status(200).send({message:"File deleted Successfully"})
        });
    } catch (error) {
        res.status(500).send({message:'Error Deleting file'})
    }
}

//Edit File

const editUploadFile = async(req,res) => {
    const fileId = req.params.id;
    const newFile = req.file;
    try {
        const checkFileId =await DocumentModel.findById({_id:fileId})
        const oldFilePath = checkFileId.path;
        if(!checkFileId) return res.status(404).send({message:"File not found."})
        
        fs.unlink(oldFilePath,async(err) =>{
            if(err) return  res.status(200).send({message:"Failed to delete file"})
            checkFileId.filename = newFile.filename;
            checkFileId.originalname = newFile.originalname;
            await DocumentModel.findByIdAndUpdate({_id:fileId},{filename:checkFileId.originalname,uploadedBy:checkFileId._id})
            res.status(200).send({message:'FIle Updated Successfully'})
        });
    } catch (error) {
        res.status(400).send({Error:error.message})
    }
}

const getAllDocuments = async(req,res) => {
    const {email} = req;
    const checkUser = await UserModel.findOne({email:email})
    if(!checkUser){
        return res.status(400).send("Invalid User");
    }
    const allDocuments = await DocumentModel.find()
    res.status(200).send({allDocuments,success:true})
}

module.exports = {handleUploadFile,upload,deleteUploadFile,editUploadFile,getAllDocuments}