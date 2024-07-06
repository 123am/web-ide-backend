const express = require("express");
const multer = require("multer");
const fileController = require("../contoller/fileController");
const router = express.Router();
const upload = multer();
router.get("/register", fileController.creation);
router.get("/getDirectory", fileController.getFileList);
router.post("/viewFile", fileController.viewFile);
router.post("/createDirectory", fileController.createDirectory);
router.post("/createFile", fileController.createFile);
router.post("/saveFile", fileController.saveFile);
router.post("/readmeFilePreview",upload.single('file'),fileController.readmeFilePreview);

module.exports = router;