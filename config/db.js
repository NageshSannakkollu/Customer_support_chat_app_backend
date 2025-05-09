const { default: mongoose } = require("mongoose");
require("dotenv").config()
const uri = process.env.MONGO_URI;

// console.log(`URI:`,uri)

const DbConnection = async() => {
    try {
        await mongoose.connect(`${uri}`)
        console.log(`DB Connected Successfully`)
    } catch (error) {
        console.log(`DB Error at:`,error.message)
    }
}

module.exports = DbConnection;