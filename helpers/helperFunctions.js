/**
 * Helper function to return the response's result text if successful, otherwise
 * returns the rejected Promise result with an error status and corresponding text
 * @param {object} response - response to check for success/error
 * @return {object} - valid response if response was successful, otherwise rejected
 * Promise result
 */
const checkStatus = (response) => {
    if (response.ok) {
        return response;
    }
    throw Error('Error in request: ' + response.statusText);
}

module.exports = {checkStatus};
