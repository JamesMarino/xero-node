"use strict";

/**
 * Step 3: The Request
 * Example - Performs Request
 */

const Xero = require("../index");
const Constants = require("./constants");

const ACCESS_TOKEN = "X3TKXM8MKYXV1RHZ02BJXHY1SVD3AF";
const ACCESS_TOKEN_SECRET = "8DHT0AHPLJPTQHO0VZAOQLZKBXNQ1Y";

// Create new connection
let xero = new Xero({
    consumerKey: Constants.CONSUMER_KEY,
    consumerSecret: Constants.CONSUMER_SECRET,
    accessToken: ACCESS_TOKEN,
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    callbackUrl: Constants.CALLBACK_URL,
    apiVersion: Constants.API_VERSION
});

let parameters = {
    fromDate: new Date(),
    toDate: new Date(),
    trackingCategoryID: "1234"
};

xero.get("/Reports/ProfitAndLoss", parameters, true).then(function (response) {

    console.log(response);

}).catch(function (error) {
    console.log(error);
});
