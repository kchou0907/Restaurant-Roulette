const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
const {checkStatus} = require('../helpers/helperFunctions')

const API_KEY = process.env.YELP_API_KEY;

const postNavHandler = (req, res) => {
    let ua = req.headers['user-agent'];

    let data = req.body;
    let from = req.body.address;
    let cuisine = req.body.cuisine || "";
    let price = req.body.price;
    let rating = req.body.rating;
    let maxMiles = parseFloat(data.transport);
    let distance = Math.ceil(maxMiles * 1609.34);
    let transportList = {
        0.5: 'walking',
        3: 'bicycling',
        5: 'transit',
        10: 'driving'
    };
    let transport = transportList[maxMiles];

    getLocation(from, cuisine, distance, price)
        .then(function (result) {
            let end = chooseLocation(result, rating);
            startNav(res, from, end, transport, ua);
        })
        .catch(error => res.sendFile(__dirname + '/public/error.html'));
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
        headers: {
            'Authorization': 'Bearer ' + API_KEY
        },
        redirect: 'follow'
    };
    let category = 'restaurant'
    if (cuisine != '') {
        category = cuisine;
    }

    let url = 'https://api.yelp.com/v3/businesses/search?&limit=50&open_now=true';
    return fetch(url + '&location=' + address + '&radius=' + radius + '&category=' + category + '&price=' + price, requestOptions)
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
    console.log('end: ' + end);

    if (/iPhone/.test(ua) ||
        /iPod/.test(ua)) {
        let letter = transport.charAt(0);
        if (letter === 't') {
            letter = 'r';
        }
        res.redirect('maps://maps.google.com/maps/dir/?saddr=' + start + '&daddr=' + end + '&dirflg=' + letter);
    } else {
        res.redirect('https://www.google.com/maps/dir/?api=1&origin=' +
            start + '&destination=' + end + '&travelmode=' + transport + '&dir_action=navigate');
    }
}

module.exports = {postNavHandler}