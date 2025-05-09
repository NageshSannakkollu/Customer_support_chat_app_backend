const DbConnection = require("../config/db");
const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { getAllResponsesById } = require("./messageController");

const activeDatabase = async() => {
    await DbConnection()
}
activeDatabase()

const userRegistration = async(req,res) => {
    const userDetails = req.body;
    // console.log("UserDetails:",userDetails)
    const checkEmailExists = await UserModel.findOne({email:userDetails.email})
    //console.log("checkEmailExists:",checkEmailExists)
    const hashedPassword = await bcrypt.hash(userDetails.password,10);
    //console.log("password:",hashedPassword);
    if(checkEmailExists=== null){
         await UserModel.create({...userDetails,password:hashedPassword})
         res.status(201).send({message:'Registration Successful',success:true});
    }
    res.status(200).send({message:'Email already exists!',success:false})
}

const userLogin = async(req,res) => {
    const {email,password} = req.body;
    // console.log("Email,password:",email,password)
    const checkEmail = await UserModel.findOne({email:email})
    if(checkEmail === null){
        return res.status(400).send("Invalid Email address");
    }
    const isPasswordMatch = await bcrypt.compare(password,checkEmail.password);
    if(isPasswordMatch){
        const payload = {email:email}
        const jwtToken = jwt.sign(payload,process.env.MY_SECRET_KEY)
        res.status(200).send({jwtToken:jwtToken,success:true})
    }else{
        res.status(200).send({message:"Password not matched.",success:false})
    }
}

const userProfile = async(req,res) => {
    const {email} = req;
    const userResponse = await UserModel.findOne({email:email})
    if(!userResponse){
        return res.status(200).send({message:"Invalid User",success:false});
    }
    res.status(200).send({userResponse,success:false});
}


module.exports = {userRegistration,userLogin,userProfile}