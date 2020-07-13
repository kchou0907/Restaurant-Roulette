/**
 * Name: _your name here_
 * Date: _add date here_
 * Section: CSE 154 _your section here_
 *
 * -- your description of what this file does here --
 * Do not keep comments from this template in any work you submit (functions included under "Helper
 * functions" are an exception, you may keep the function names/comments of id/qs/qsa/gen)
 */

"use strict";

(function () {

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * CHANGE: Describe what your init function does here.
   */
  function init() {
    getCategories();
    id('location').addEventListener('click', getLocation);
    //uncomment for Google Autocomplete (auto charges after certain # of searches)
    //initialize();
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
      .catch(error => console.log('error', error));
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
    let cuisine = document.getElementById('cuisine');

    //put different categories into dropdown
    types.forEach(function (item, index) {
      var option = gen('option');
      option.innerHTML = item;
      option.setAttribute('value', item);
      cuisine.appendChild(option);
    });
  }


  //location data
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    let latlon = position.coords.latitude + ", " + position.coords.longitude;
    name("address")[0].value = latlon;
  }

  function showError(error) {
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

//Location Autocomplete
  function initialize() {
    var input = document.querySelector('.address input');
    var options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'usa'}
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