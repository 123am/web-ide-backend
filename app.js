const express = require('express');
const multer = require('multer');
const app = express();
const fileRoutes = require("./router/fileRoutes");
const authRoutes = require("./router/authRoutes");
const bodyParser = require('body-parser');
const port = 3000;

const cors = require("cors");
const connectDB = require('./utilities/database');
const corsOptions = {
  origin: '*', // allow only this origin
  methods: 'GET,POST,PUT,PATCH,DELETE',          // allow only GET and POST requests
  allowedHeaders: ['Content-Type'], // allow only these headers
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDB();
app.use("/file",fileRoutes)
app.use("/auth",authRoutes)
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
