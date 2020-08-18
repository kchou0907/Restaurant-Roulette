/**
 * Functionality for the error page
 */
"use strict";

(function() {

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * Makes the back button functional
   */
  function init() {
    qs('button').addEventListener('click', back);
  }

  /**
   * Goes back to the og page
   */
  function back() {
    window.history.back();
  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Note: You may use these in your code, but remember that your code should not have
   * unused functions. Remove this comment in your own code.
   */



  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();