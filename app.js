const express = require('express');
const multer = require('multer');
const app = express();
const fileRoutes = require("./router/fileRoutes");
const bodyParser = require('body-parser');
const port = 3000;

const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/file",fileRoutes)
app.get('/', (req, res) => {
  res.send({
    statusCode: 200,
    body: "Hello Server is ready"
  })
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});




module.exports = app;
