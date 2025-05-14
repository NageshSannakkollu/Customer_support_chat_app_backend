const DbConnection = require("../config/db");
const axios = require("axios");
require("dotenv").config();
const UserModel = require("../model/userModel");
const MessageModel = require("../model/messageModel");

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent/?key=${process.env.GEMINI_API_KEY}`
// const fileMessageUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision/?key=${process.env.GEMINI_API_KEY}`
const getAIResponse = async(message) => {
    // console.log('Message:',message)
  try {
    const response = await axios.post(url,{
      contents:[{ parts: [{ text: message }] }]
    });
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(`API Error:`,error.message)
  }
}

const activeDatabase = async() => {
    await DbConnection()
}
activeDatabase()

const userInputMessage = async(req,res) => {
    const {message} = req.body;
    const {email} = req;
    // const {file} = req.file;
    // console.log("inputMessage:",message,file)
    const checkUser = await UserModel.findOne({email:email})
    if(!checkUser){
        return res.status(400).send("Invalid User");
    }
    try {
        const response = await getAIResponse(message);
        //console.log("AI response:",response)
        const messageQuery = await MessageModel.create({userId:checkUser._id,message,response})
        res.status(200).send({messageQuery,success:true})
    } catch (error) {
        console.log(error.message);
        res.status(400).send({Error:error.message})
    }
}

const getAllResponsesById = async(req,res) => {
  const {email} = req;
  const checkUser = await UserModel.findOne({email:email})
  // console.log(checkUser)
  if(!checkUser){
        return res.status(400).send("Invalid User");
  }
  const getAllResponses = await MessageModel.find({userId:checkUser._id})
  res.status(200).send({getAllResponses});
}



module.exports = {userInputMessage,getAllResponsesById};