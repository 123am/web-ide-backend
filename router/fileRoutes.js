const express = require("express");
const multer = require("multer");
const fileController = require("../contoller/fileController");
const { requireAuth } = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = multer();
router.get("/register", requireAuth, fileController.creation);
router.get("/testing", fileController.testing);
router.get("/getDirectory", requireAuth, fileController.getFileList);
router.post("/viewFile", requireAuth, fileController.viewFile);
router.post("/createDirectory", requireAuth, fileController.createDirectory);
router.post("/createFile", requireAuth, fileController.createFile);
router.post("/saveFile", requireAuth, fileController.saveFile);
router.post("/readmeFilePreview", requireAuth,upload.single('file'),fileController.readmeFilePreview);

module.exports = router;