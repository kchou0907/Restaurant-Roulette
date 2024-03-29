/**
 * Functionality for main page
 */

"use strict";

(function () {

  window.addEventListener("load", init);

  /**
   * Adds options to the dropdowns, clears the input when someone clicks on those dropdowns,
   * initializes address autocomplete, initializes html5 geolocation
   */
  function init() {
    getCategories();
    ratings();
    qs('input[name="rating"]').addEventListener('click', clearInput);
    qs('input[name="type"]').addEventListener('click', clearInput);
    qs('input[name="address"]').addEventListener('focus', focus);
    qs('input[name="address"]').addEventListener('blur', unfocus);
    id('location').addEventListener('click', getLocation);
    getCountry();
  }

  /**
   * Makes element unfocused when user clicks elsewhere
   */
  function unfocus() {
    this.parentElement.style.boxShadow = '';
  }

  /**
   * Makes element focused when user clicks on it
   */
  function focus() {
    this.parentElement.style.boxShadow = '0 1px 6px 0 rgba(32,33,36,0.28';
  }

  /**
   * Clears the dropdowns once user clicks on them
   */
  function clearInput() {
    this.value = "";
  }

  /**
   * Appends the possible minimum rating values to dropdown
   */
  function ratings() {
    let rating = id('rating');

    for (let i = 1.0; i <= 5; i += 0.5) {
      let option = gen('option');
      let grammar = "stars";
      if (i === 1) {
        grammar = "star";
      }
      option.innerHTML = `${i} ${grammar}`;
      option.setAttribute('value', i);
      rating.appendChild(option);
    }
  }

  /**
   * Obtains country that user is in + passes that into address autocomplete
   */
  function getCountry() {
    fetch('/trace')
    .then(checkStatus)
    .then(res => res.json())
    .then(function (res) {
      initialize(res.countryCode);
    })
    .catch(error => alert('Error: cannot locate country! \n' + error))
  }

  /**
   * Obtains all the cuisines from yelp
   */
  function getCategories() {
    fetch('/categories')
      .then(checkStatus)
      .then(res => res.json())
      .then(function (res) {
        let restaurantOnly = res.categories.filter(function (entry) {
          return entry.parent_aliases[0] === 'restaurants';
        });
        let titles = processRestaurants(restaurantOnly);
        appendOption(titles);
      })
      .catch(error => alert('error', error));
  }

  /**
   * Goes through the JSON object and extracts all of the cuisine types
   * @param {JSON} restaurants - JSON object returned from Yelp API call
   * @returns {Array} - array of cuisine names
   */
  function processRestaurants(restaurants) {
    let result = [];
    for (let i in restaurants) {
      result.push(restaurants[i].title);
    }
    return result;
  }

  /**
   * Appends all the diffierent cuisines as options in the dropdown
   * @param {Array} types - array of all the cuisine names
   */
  function appendOption(types) {
    let cuisine = id('cuisine');

    //put different categories into dropdown
    types.forEach(function (item, index) {
      var option = gen('option');
      option.innerHTML = item;
      option.setAttribute('value', item);
      cuisine.appendChild(option);
    });
  }

  /**
   * Starts the animation and gets the users location
   */
  function getLocation() {
    addressLoad()
      .then(clickedAnime)
      .then(geolocate)
  }


  /**
   * Geolocation
   */
  async function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(translateCoords, showError);
    } else {
      addressLoad();
      clickedAnime();
      alert("Geolocation is not supported by this browser.");
    }
  }

  /**
   * Finds user's current lat and long and turns it into an address
   * @param {Object} position - object containing the user's lat long
   */
  function translateCoords(position) {
    let latlon = position.coords.latitude + "," + position.coords.longitude;
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latlon +'&key=AIzaSyBWMLH79IgUEk8DDfJmWX-cqrGiXWZHc7o';
    fetch(url)
      .then(checkStatus)
      .then(res => res.json())
      .then(function(res) {
        unClickedAnime();
        appendAddress(res);
        addressLoad();
      })
      .catch(error => console.log('Error: ' + error));
  }

  /**
   * Fills the address bar with the user's current address
   * @param {Object} addyData JSON containing information on the user's current location
   */
  function appendAddress(addyData) {
    let addy = addyData['results'][0]['formatted_address'];
    name("address")[0].value = addy;
  }

  /**
   * Changes the address bar to alert the user that something is happening
   */
  async function addressLoad() {
    name('address')[0].classList.toggle('hidden');
    qs('.address>p').classList.toggle('hidden');
  }

  /**
   * Disables the location button to prevent user spam
   */
  function clickedAnime() {
    let btn = id('location');
    btn.style.color = 'lightgrey';
    btn.removeEventListener('click', getLocation);
  }

  /**
   * Reverts the button back to full functionality
   */
  function unClickedAnime() {
    let btn = id('location');
    btn.style.color = null;
    btn.addEventListener('click', getLocation);
  }

  /**
   * Alerts user to what went wrong with geolocation
   * @param {Object} error - what went wrong with geolocation
   */
  function showError(error) {
    addressLoad();
    clickedAnime();
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert(x.innerHTML = "Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert(x.innerHTML = "The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert(x.innerHTML = "An unknown error occurred.");
        break;
    }
  }

 /**
  * Address autocomplete
  * @param {String} country - String containing the user's current country
  */
  function initialize(country) {
    var input = qs('.address input');
    var options = {
      types: ['(cities)'],
      componentRestrictions: {country: country}
    };
    new google.maps.places.Autocomplete(input);
  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Note: You may use these in your code, but remember that your code should not have
   * unused functions. Remove this comment in your own code.
   */

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

  /**
   * Returns all the elements that has the name attribute with the specificied value
   * @param {String} name the name
   * @returns {NodeList} returns a list of all of the elements that share the specified name
   */
  function name(name) {
    return document.getElementsByName(name);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();