const express = require("express");
const multer = require("multer");
const authController = require("../contoller/authController");
const router = express.Router();
const upload = multer();
router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser)
module.exports = router;