"use strict";

const OAuth = require("oauth");
const QueryString = require("querystring");
const Parser = require("xml2js");

const XERO_URLS = {
    REQUEST_TOKEN: "https://api.xero.com/oauth/RequestToken",
    ACCESS_TOKEN: "https://api.xero.com/oauth/AccessToken",
    API_ENDPOINT: "https://api.xero.com/api.xro/",
    AUTHORISE_URL: "https://api.xero.com/oauth/Authorize"
};

const XERO_OAUTH = {
    VERSION: "1.0A",
    SIGNATURE_METHOD: "HMAC-SHA1"
};

/**
 * @class Xero
 */

class Xero {

    constructor(properties) {

        if (!properties) {
            throw new Error("Xero properties not defined");
        }

        if (!(properties.hasOwnProperty("consumerKey") &&
            properties.hasOwnProperty("consumerSecret") &&
            properties.hasOwnProperty("callbackUrl") &&
            properties.hasOwnProperty("apiVersion"))
        ) {
            throw new Error("Consumer Key, Secret, Callback and API Version URL Must be set");
        }

        // Set the Consumer Properties
        this._ConsumerKey = properties.consumerKey;
        this._ConsumerSecret = properties.consumerSecret;
        this._CallbackUrl = properties.callbackUrl;
        this._ApiVersion = properties.apiVersion;

        if (properties.hasOwnProperty("accessToken") &&
            properties.hasOwnProperty("accessTokenSecret")
        ) {
            this._AccessToken = properties.accessToken;
            this._AccessTokenSecret = properties.accessTokenSecret;
        } else {
            this._AccessToken = null;
            this._AccessTokenSecret = null;
        }

        this._OAuth = new OAuth.OAuth(
            XERO_URLS.REQUEST_TOKEN,
            XERO_URLS.ACCESS_TOKEN,
            this._ConsumerKey,
            this._ConsumerSecret,
            XERO_OAUTH.VERSION,
            this._CallbackUrl,
            XERO_OAUTH.SIGNATURE_METHOD
        );

    }

    /**
     * Formats OAuth Error
     * @param error
     * @returns {*}
     * @private
     */
    static _handleOAuthError(error) {

        if (error.hasOwnProperty("statusCode") &&
            error.hasOwnProperty("data")
        ) {
            return {
                statusCode: error.statusCode,
                data: QueryString.parse(error.data)
            }
        } else {
            return error;
        }

    }

    /**
     * Gets OAuth request tokens
     * @returns {Promise}
     */
    getRequestToken() {

        return new Promise((resolve, reject) => {

            this._OAuth.getOAuthRequestToken(
                {
                    oauth_callback: this._CallbackUrl
                },
                (error, requestToken, requestTokenSecret) => {
                    if (error) {
                        return reject(Xero._handleOAuthError(error));
                    } else {

                        let requestTokenVerification = XERO_URLS.AUTHORISE_URL + "?"
                            + QueryString.stringify({
                                oauth_token: requestToken,
                                oauth_callback: this._CallbackUrl
                            });

                        return resolve({
                            RequestToken: requestToken,
                            RequestTokenSecret: requestTokenSecret,
                            RequestTokenVerification: requestTokenVerification
                        });
                    }
                }
            )

        });

    }

    /**
     * Gets OAuth Access Tokens
     * @param verifier Taken from the XERO site
     * @param requestToken
     * @param requestTokenSecret
     * @returns {Promise}
     */
    getAccessToken(verifier, requestToken, requestTokenSecret) {

        return new Promise((resolve, reject) => {
            this._OAuth.getOAuthAccessToken(
                requestToken,
                requestTokenSecret,
                verifier,
                (error, accessToken, accessSecret) => {
                    if (error) {
                        return reject(Xero._handleOAuthError());
                    } else {
                        this._AccessToken = accessToken;
                        this._AccessTokenSecret = accessSecret;

                        return resolve({
                            AccessToken: accessToken,
                            AccessTokenSecret: accessSecret
                        });
                    }
                }
            )
        })

    }

    /**
     * Checks if Access Tokens Exist
     * @private
     */
    _validateProperties() {
        if (!this._AccessToken || !this._AccessTokenSecret) {
            throw new Error("Access Tokens Missing");
        }
    }

    /**
     * GET Request to Xero API
     * @param endpoint
     * @param parameters API GET Parameters
     * @param json If true, JSON will be returned
     * @returns {Promise}
     */
    get(endpoint, parameters, json) {

        // Validate
        this._validateProperties();

        // Make the request
        let url = XERO_URLS.API_ENDPOINT + this._ApiVersion + endpoint;

        if (parameters) {
            url += "?" + QueryString.stringify(parameters);
        }

        return new Promise((resolve, reject) => {
            this._OAuth.get(url, this._AccessToken, this._AccessTokenSecret, (error, data) => {

                if (error) {



                    return reject(error);
                } else {

                    if (json) {
                        Parser.parseString(data, (error, result) => {
                            if (error) {
                                return reject(error);
                            } else {
                                return resolve(result);
                            }
                        })
                    } else {
                        return resolve(data);
                    }
                }

            })
        });

    }

}

module.exports = Xero;
