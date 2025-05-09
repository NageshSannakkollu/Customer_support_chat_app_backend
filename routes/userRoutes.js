const express = require("express")
const { userRegistration, userLogin, userProfile } = require("../controller/userController");
const authenticateToken = require("../middleware/authentication");
const router = express.Router()

router.post("/register",userRegistration)
router.post("/signin",userLogin);
router.get("/profile",authenticateToken,userProfile)

module.exports = router;