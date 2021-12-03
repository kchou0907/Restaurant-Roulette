const express = require("express");
const fs = require("fs");
const app = express();
const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
const bodyparser = require('body-parser');
const {getCategoriesHandler} = require('./handlers/categoryHandler');
const {getTraceHandler} = require('./handlers/traceHandler');
const { postNavHandler } = require("./handlers/navHandler");

app.use(express.static("public"));

const API_KEY = process.env.YELP_API_KEY;
let port = process.env.PORT || 8080;

// some middleware options for bodyparser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: false
}))

app.listen(port);

console.log(`server started on port: ${port}`);

/**
 * All the categories on Yelp
 */
app.get('/categories', (req, res) => getCategoriesHandler(req, res));

/**
 * User's location data (based on ip)
 */
app.get('/trace', (req, res) => getTraceHandler(req, res));

/**
 * Takes form data and chooses restaurant location at random
 */
app.post("/", (req, res) => postNavHandler(req, res));

