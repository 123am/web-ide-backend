const fs = require('fs').promises;
const fss = require('fs');
var path = require('path');
const markdown = require('markdown-it')();
const nestedFiler = require('../utilities/fileutil');






class FileController {
  async creation(req, res, next) {
    try {
      console.log("dfghjkl")
      // if (!fs.existsSync("netlifyApp")) {
      fs.mkdirSync("/tmp/netlifyApp/" + req.userId)
      // }
      res.json({
        "msg": "file",
        "status": false
      })
    }
    catch (err) {

      console.log(err)
      // next(err)\
      // if (err.code === 'EEXIST') { // curDir already exists!
      //   return curDir;
      // }
      res.json({
        "msg": err.code,
        "status": false
      })

    }
  }
  async testing(req, res, next) {
    try {
      console.log("dfghjkl")

      if (!fs.existsSync("/tmp/netlifyApp")) {
        fs.mkdirSync("/tmp/netlifyApp")
      }
      // if (!fs.existsSync("netlifyApp")) {
      //   fs.mkdirSync("/tmp/netlifyApp/" + req.userId)
      // }
      res.json({
        "msg": "file",
        "status": false
      })
    }
    catch (err) {

      console.log(err)
      // next(err)\
      // if (err.code === 'EEXIST') { // curDir already exists!
      //   return curDir;
      // }
      res.json({
        "msg": err.code,
        "status": false
      })

    }
  }





  async viewFile(req, res, next) {
    let myPath = "/tmp/netlifyApp/" + req.userId;
    try {



      console.log(myPath, req.body.path, "myPathmyPathmyPath")


      let fileContent = await fss.readFileSync(req.body.path, 'utf8')

      res.json({
        "msg": "file",
        "status": false,
        "data": {
          "name": path.basename(req.body.path),
          "ext": req.body.path.split(".").pop(),
          "path": req.body.path,
          "content": fileContent,
          "type": ""
        }
      })
    }
    catch (err) {
      console.log(err)
      res.json({
        "msg": err.code,
        "status": false,
        "data": []
      })
    }
  }
  async createDirectory(req, res, next) {
    try {
      console.log("dfghjkl", req.body)
      let fpath = ""
      if (req.body.path) {
        fpath = req.body.path
      } else {
        fpath = "/tmp/netlifyApp/" + req.userId
      }

      if (req.body.fName == "") {
        res.json(400, {
          "msg": "Folder named empty.",
          "status": false
        })
      }
      let fullFolderPath = path.join(fpath, req.body.fName)

      console.log(fullFolderPath, "fullFolderPath")
      // if (!fs.existsSync("netlifyApp")) {
      fss.mkdirSync(fullFolderPath)
      // }
      res.json({
        "msg": "Folder Created Successfully.",
        "status": true
      })
    }
    catch (err) {

      console.log(err)
      let errMsg = ""
      if (err.code === 'EEXIST') {
        errMsg = "Folder Already Exist."
      }
      res.json(400, {
        "msg": errMsg,
        "status": false
      })
    }
  }
  async createFile(req, res, next) {
    try {
      let fpath = ""
      if (req.body.path) {
        fpath = req.body.path
      } else {
        fpath = "/tmp/netlifyApp/" + req.userId
      }

      if (req.body.fname == "") {
        res.json(400, {
          "msg": "File named empty.",
          "status": false
        })
      }
      if (req.body.ext == "") {
        res.json(400, {
          "msg": "Please select extension.",
          "status": false
        })
      }
      let fullFolderPath = path.join(fpath, req.body.fname + req.body.ext)

      console.log(fullFolderPath, "fullFolderPath")
      // if (!fs.existsSync("netlifyApp")) {
      fss.createWriteStream(fullFolderPath)
      // }
      res.json({
        "msg": "File Created Successfully.",
        "status": true
      })
    }
    catch (err) {

      console.log(err)
      let errMsg = ""
      if (err.code === 'EEXIST') {
        errMsg = "File Already Exist."
      }
      res.json(400, {
        "msg": errMsg,
        "status": false
      })
    }
  }

  async getFileList(req, res, next) {

    console.log(req.userId, "userIduserIduserId")
    let myPath = "/tmp/netlifyApp/" + req.userId;
    try {

      let a = []
      if (!fss.existsSync(myPath)) {
        fss.mkdirSync(myPath)
      }
      let dte = await nestedFiler(myPath)
      res.json({
        "msg": "file",
        "status": false,
        "data": dte
      })
    }
    catch (err) {
      console.log(err)
      res.json({
        "msg": err.code,
        "status": false,
        "data": []
      })

    }
  }


  async saveFile(req, res, next) {
    try {

      console.log(req.body, "req.body.path,req.body.content")

      fs.writeFile(req.body.path, req.body.content)

      res.status(200).json({
        "msg": "File Updated Successfully",
        "status": false,
        "data": ""
      })
    }
    catch (err) {
      console.log(err)
      res.status(400).json({
        "msg": err.code,
        "status": false,
        "data": []
      })

    }
  }



  async readmeFilePreview(req, res, next) {
    try {

      console.log(req.body, "req.body.path,req.body.content")
      if (!req.file) {
        res.status(400).json({
          "msg": "Please Select File",
          "status": false,
          "data": ""
        })
      }
      const content = req.file.buffer.toString('utf-8');
      const htmlContent = markdown.render(content);
      res.status(200).json({
        "msg": "file",
        "status": false,
        "data": htmlContent
      })
    }
    catch (err) {
      console.log(err)
      res.status(400).json({
        "msg": err.code,
        "status": false,
        "data": []
      })

    }
  }
}


module.exports = new FileController();