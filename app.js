const express = require("express");
const fs = require("fs");
const app = express();
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const bodyparser = require('body-parser');

dotenv.config();

const API_KEY = process.env.YELP_API_KEY;

app.use(express.static("public"));

// some middleware options for bodyparser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.listen(3000, function(req, res){
  console.log("Server is running on port 3000");
  console.log(API_KEY);
});

/**
 * All the categories on Yelp
 */
app.get('/categories', function(req, res){
  getCategories()
  .then(result => res.send(result))
  .catch(error => console.log('Error: ', error));
});

/**
 * User's location data (based on ip)
 */
app.get('/trace', function (req, res) {
  traceIp()
  .then(result => res.send(result))
  .catch(error => console.log('Error: country not found \n' + error));
})

/**
 * Takes form data and chooses restaurant location at random
 */
app.post("/", function(req,res){
  console.log(req.body);
  let ua = req.headers['user-agent'];
  console.log(ua);

  let data = req.body;
  let from = req.body.address;
  let cuisine = req.body.cuisine || "";
  let price = req.body.price;
  let rating = req.body.rating;
  let maxMiles = parseFloat(data.transport);
  let distance = Math.ceil(maxMiles * 1609.34);
  let transportList = { 0.5: 'walking', 3: 'bicycling', 5: 'transit', 10: 'driving' };
  let transport = transportList[maxMiles];

  getLocation(from, cuisine, distance, price)
  .then(function(result){
    let end = chooseLocation(result, rating);
    startNav(res, from, end, transport, ua);
  })
  .catch(error => res.sendFile(__dirname + '/public/error.html'));
  console.log(transport);
  console.log(from);
});

/**
 * Calls ip-api in order to gain data about the user's api
 * @returns{Promise} returns the fetch call
 */
function traceIp() {
  return fetch('http://ip-api.com/json/')
  .then(checkStatus)
  .then(result => result.json());
}

/**
 * Obtains all the categories of on Yelp
 * @returns{Promise} returns the fetch call
 */
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

/**
 * Gets a list of up to 50 different restaurants fulfilling user's params
 * @param {String} address - User's address or coordinates
 * @param {String} cuisine - User's cuisine of interest
 * @param {Integer} radius - How far user is willing to travel (based on transport type)
 * @param {String} price - User's price range in the form of dollar signs
 * @returns{Promise} returns the fetch call
 */
function getLocation(address, cuisine, radius, price) {
  let requestOptions = {
    method: 'GET',
    headers:{
      'Authorization' : 'Bearer ' + API_KEY
    },
    redirect: 'follow'
  };

  let url = 'https://api.yelp.com/v3/businesses/search?&limit=50&category=restaurant&open_now=true';
  return fetch(url + '&location=' + address + '&radius=' + radius + '&term=' + cuisine + '&price=' + price, requestOptions)
    .then(checkStatus)
    .then(result => result.json());
}

/**
 * Chooses the restaurant
 * @param {JSON} locationData - List of all the possible places
 * @param {Double} rating - Lowest rating user would like
 * @returns {String} returns the restaurant's address
 */
function chooseLocation(locationData, rating) {
  let goodPlaces = locationData.businesses.filter(function (entry) {
    return entry.rating >= rating && entry.location.address1 != null;
  });
  let size = Object.keys(goodPlaces).length;
  let randIndex = Math.floor(Math.random() * size);
  if (size === 0) {
    throw Error('No Businesses Found At This Time');
  }
  return goodPlaces[randIndex].location.display_address;
}

/**
 * Begins device's navigation to the restaurant
 * @param {Object} res - Response object
 * @param {String} start - Starting location
 * @param {String} end - Ending location
 * @param {String} transport - Transport type (walk, bike, public transport, car)
 */
function startNav(res, start, end, transport, ua) {
  start = encodeURIComponent(start);
  end = encodeURIComponent(end.join(', '));

  console.log('start: ' + start);
  console.log('end: ' + end);
  console.log('transport: ' + transport);

  if (/Macintosh/.test(ua)) {
    let letter = transport.charAt(0);
    if (letter === 'd') {
      letter = 't';
    } else if (letter ==='t') {
      letter = 'r';
    } else if (letter === 'b') {
      letter = 'w';
    }
    console.log('apple');
    res.redirect('maps://maps.google.com/maps/dir/?saddr='+ start +'&daddr='+ end +'&dirflg=' + letter);
  } else {
    console.log('not apple');
    console.log('https://google.com/maps/dir/?api=1&origin=' +
    start + '&destination=' + end + '&travelmode=' + transport + '&dir_action=navigate');
    res.redirect('https://www.google.com/maps/dir/?api=1&origin=' +
      start + '&destination=' + end + '&travelmode=' + transport + '&dir_action=navigate');
  }
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

