const express = require('express')
const app = express()
const cors = require("cors")
require("dotenv").config()

const port = 3031 || process.env.PORT 
app.use(cors())
app.use(express.json());

app.use("/auth/",require("./routes/userRoutes"));
app.use("/api/message",require("./routes/messageRoutes"));
app.use("/api/file/",require("./routes/uploadFileRoutes"));

app.listen(port,(() => {
    console.log(`Server Running at: http://localhost:${port}`)
}))