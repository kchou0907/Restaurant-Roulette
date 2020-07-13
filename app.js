//jshint esversion: 6

//google maps query example https://www.google.com/maps/dir/?api=1&origin=5557+San+Antonio+Street%2C+Pleasanton%2C+CA&destination=416+Barber+Ln%2C+Milpitas%2C+CA+95035&travelmode=walking&dir_action=navigate
const express = require("express");
const fs = require("fs");
const app = express();
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const bodyparser = require('body-parser');

dotenv.config();

const API_KEY = process.env.YELP_API_KEY;
const GEOCODING_KEY = process.env.LOCATION_API_KEY;

app.use(express.static("public"));

// some middleware options for bodyparser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.listen(3000, function(req, res){
  console.log("Server is running on port 3000");
  console.log(API_KEY);

});

app.get('/categories', function(req, res){
  getCategories()
  .then(result => res.send(result))
  .catch(error => console.log('error', error));
});

app.post("/", function(req,res){
  console.log(req.body);
  let data = req.body;

  let from = req.body.address;
  let cuisine = req.body.cuisine || "";
  let price = req.body.price;

  let maxMiles = parseInt(data.transport);
  let distance = Math.ceil(maxMiles * 1609.34);
  let transportList = { 1: 'walking', 3: 'bicycling', 5: 'transit', 10: 'driving' };
  let transport = transportList[maxMiles];

  getLocation(from, cuisine, distance, price)
  .then(function(result){
    let end = chooseLocation(result);
    startNav(res, from, end, transport);
  })
  .catch(error => console.log('error ' + error));
  console.log(transport);
  console.log(from);
});

function getCategories() {
  let requestOptions = {
    method: 'GET',
    headers:{
      'Authorization' : 'Bearer ' + API_KEY
    },
    redirect: 'follow'
  };

  return fetch("https://api.yelp.com/v3/categories", requestOptions)
    .then(checkStatus)
    .then(result => result.json());
}

function getLocation(address, cuisine, radius, price) {
  let requestOptions = {
    method: 'GET',
    headers:{
      'Authorization' : 'Bearer ' + API_KEY
    },
    redirect: 'follow'
  };

  // add open_now=true once completed
  let url = 'https://api.yelp.com/v3/businesses/search?&limit=50&category=restaurant';
  return fetch(url + '&location=' + address + '&radius=' + radius + '&term=' + cuisine + '&price=' + price, requestOptions)
    .then(checkStatus)
    .then(result => result.json());
}

function chooseLocation(locationData) {
  let goodPlaces = locationData.businesses.filter(function (entry) {
    return entry.rating >= 3.5 && entry.location.address1 != null;
  });
  let size = Object.keys(goodPlaces).length;
  let randIndex = Math.floor(Math.random() * size);
  return goodPlaces[randIndex].location.display_address;
}

function startNav(res, start, end, transport) {
  console.log(end.join(', '));
  console.log(transport);
  res.redirect('https://www.google.com/maps/dir/?api=1&origin=' +
  start + '&destination=' + end.join(', ') + '&travelmode=' + transport + '&dir_action=navigate');
}

/**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   * Promise result
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    }
    throw Error('Error in request: ' + response.statusText);

  }

