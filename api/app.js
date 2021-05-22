// required packages for the API
const express = require('express');
const bodyParser = require('body-parser')

//Set .env variable file
const dotenv = require("dotenv");
dotenv.config();

//import routing file
var routes = require('./routes/routes');


const app = express();


//API data definition
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Requests origin control and header settings
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, DELETE"
  );
  next();
  });

routes(app); //register the route



module.exports = app;