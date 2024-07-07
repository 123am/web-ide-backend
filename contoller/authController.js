const fs = require('fs').promises;
const fss = require('fs');
var path = require('path');
const markdown = require('markdown-it')();
const nestedFiler = require('../utilities/fileutil');
const authServices = require('../services/authServices');






class AuthController {
  async registerUser(req, res, next) {
    try {
      var userData = req.body;
      console.log(userData);
      const user = await authServices.registerUserAsync(userData);
      const resultObject = {
        message: "User registered successfully",
        statusCode: 201,
        success: true,
      };
      res.status(201).json(resultObject);

    } catch (err) {
      // next(err);
      res.status(400).json({
        msg: err.message,
        statusCode: 400,
        success: true,
      });
    }
  }

  async loginUser(req, res, next) {
    try {
      const response = await authServices.loginUserAsync(req.body);
      const resultObject = {
        message: "Logged IN successfully",
        statusCode: 201,
        success: true,
        data: response,
      };
      res.status(201).json(resultObject);
    } catch (err) {
      // next(err);
      res.status(400).json({
        msg: "Invalid Credentialss",
        statusCode: 400,
        success: true,
      });
    }
  }
}


module.exports = new AuthController();