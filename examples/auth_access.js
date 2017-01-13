"use strict";

/**
 * Step 2:
 * Example - Gets Access Keys
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

const requestToken = "HQEHTP4XYOG7LTDSJJENUJEQIMTVNV";
const requestTokenSecret = "AQLI2YH61QH7DVFPRKSCU9NGRE8JUM";
const requestVerification = "2020232";

xero.getAccessToken(requestVerification, requestToken, requestTokenSecret).then(function (access) {

    console.log("accessToken: " + access.AccessToken);
    console.log("accessTokenSecret: " + access.AccessTokenSecret);

}).catch(function (error) {
    console.log(error);
});
