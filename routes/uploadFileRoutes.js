const express = require("express")
const authenticateToken = require("../middleware/authentication")
const { handleUploadFile, upload, deleteUploadFile, editUploadFile, getAllDocuments } = require("../controller/uploadFileController")
const router = express.Router();

router.post("/uploads",authenticateToken,upload.single('file'),handleUploadFile);
router.get("/all_docs",authenticateToken,getAllDocuments)
router.patch("/uploads/:id",authenticateToken,upload.single('file'), editUploadFile);
router.delete("/uploads/:id",authenticateToken,deleteUploadFile);

module.exports = router;