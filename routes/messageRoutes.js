const express = require("express");
const authenticateToken = require("../middleware/authentication");
const { userInputMessage, getAllResponsesById } = require("../controller/messageController");
const router = express.Router()

router.post("/user_message",authenticateToken,userInputMessage)
router.get("/response",authenticateToken,getAllResponsesById)


module.exports = router;