"use strict";

/**
 * Step 1:
 * Example - Gets Request Tokens
 */

const Xero = require("../index");
const Constants = require("./constants");

// Create new connection
let xero = new Xero({
    consumerKey: Constants.CONSUMER_KEY,
    consumerSecret: Constants.CONSUMER_SECRET,
    accessToken: null,
    accessTokenSecret: null,
    callbackUrl: Constants.CALLBACK_URL,
    apiVersion: Constants.API_VERSION
});

xero.getRequestToken().then(function (request) {

    console.log("requestToken: " + request.RequestToken);
    console.log("requestTokenSecret: " + request.RequestTokenSecret);
    console.log("accessTokenVerification: " + request.RequestTokenVerification)

}).catch(function (error) {
    console.log(error);
});
