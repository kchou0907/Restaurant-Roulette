const fetch = require('node-fetch');
const {checkStatus} = require('../helpers/helperFunctions')

const getTraceHandler = (req, res) => {
    traceIp()
    .then(result => res.send(result))
    .catch(error => console.log('Error: country not found \n' + error));
}

/**
 * Calls ip-api in order to gain data about the user's api
 * @returns{Promise} returns the fetch call
 */
function traceIp() {
    return fetch('http://ip-api.com/json/')
        .then(checkStatus)
        .then(result => result.json());
}

module.exports = {getTraceHandler}

