const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
const {checkStatus} = require('../helpers/helperFunctions')

const API_KEY = process.env.YELP_API_KEY;

const getCategoriesHandler = async(req, res) => {
    getCategories()
    .then(result => res.send(result))
    .catch(error => console.log('Error: ', error));
}

/**
 * Obtains all the categories of on Yelp
 * @returns{Promise} returns the fetch call
 */
 function getCategories() {
    let requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + API_KEY
      },
      redirect: 'follow'
    };
  
    return fetch("https://api.yelp.com/v3/categories", requestOptions)
      .then(checkStatus)
      .then(result => result.json());
}

module.exports = {getCategoriesHandler};