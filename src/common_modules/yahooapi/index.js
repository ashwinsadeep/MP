/**
 * Class that interacts with Yahoo API to get the raw data.
 * Sample URL's are of the format: http://chartapi.finance.yahoo.com/instrument/1.0/ITC.BO/chartdata;type=quote;range=1d/json
 * Webservices URL's are of the format: http://finance.yahoo.com/webservice/v1/symbols/ITC.NS,ITC.BO/quote?format=json
 * Lookup API: http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=google&callback=YAHOO.Finance.SymbolSuggest.ssCallback
 */
(function (module) {

    var request = require('request');
    var util = require('util');
    var async = require('async');
    var CustomErrors = require('../../common_modules/custom_errors');
    var IntraDay = require('../equityquotes/intraday');
    var Historic = require('../equityquotes/historic');

    var YahooFinanceApi = function () {

    };

    /**
     * Fetches intra day data from yahoo for the the last traded day
     * @param symbol
     * @param callback - function(err, IntraDay)
     */
    YahooFinanceApi.prototype.getIntraDayData = function (symbol, callback) {
        var self = this;
        async.waterfall([
            YahooFinanceApi.prototype._getDataFromYahoo.bind(self, symbol, '1d'),
            function (parsedData, callback) {
                var intraDay = new IntraDay(parsedData);
                callback(null, intraDay);
            }
        ], function (err, intraDay) {
            callback(err, intraDay);
        });
    };

    /**
     * Fetches historic data from Yahoo. For now we're fetching data for the last 5 years to keep things simple
     * @param symbol
     * @param callback - function(err, historic)
     */
    YahooFinanceApi.prototype.getHistoricData = function (symbol, callback) {
        var self = this;
        async.waterfall([
            YahooFinanceApi.prototype._getDataFromYahoo.bind(self, symbol, '2y'),
            function (parsedData, callback) {
                var historic = new Historic(parsedData);
                callback(null, historic);
            }
        ], function (err, intraDay) {
            callback(err, intraDay);
        });
    };

    /**
     * Marke curl requrest to yahoo & get the stock data
     * @param symbol - symbol of the stock requesting for - available @ https://in.finance.yahoo.com/lookup
     * @param timeperiod - time period being requested for - "1m","3m","6m","1y","2y","5y","my"
     * @param callback - function(err, jsonObject)
     * @private
     */
    YahooFinanceApi.prototype._getDataFromYahoo = function (symbol, timeperiod, callback) {
        var url = util.format('http://chartapi.finance.yahoo.com/instrument/1.0/%s/chartdata;type=quote;range=%s/json',
            symbol,
            timeperiod);
        async.waterfall([
            // request to yahoo api
            function (callback) {
                request(url, callback);
            },
            // validate that the response was proper
            function (response, body, callback) {
                if (response.statusCode != 200) {
                    var err = CustomErrors.ThirdPartyError('yahoo returned non 200 error code',
                        {'http_status': response.statusCode});
                    return callback(err);
                }

                callback(null, body);
            },
            // cleanup the response body and make it consummable later in the flow
            function (rawResponse, callback) {
                _processYahooResponse(rawResponse, callback);
            }
        ], function (err, processedResponse) {
            return callback(err, processedResponse);
        });
    };

    /**
     * Yahoo returns the data as a json object wrapped in a callback function. Clean that up and make it a proper json
     * @param rawResponse
     * @param callback - function(err, parsedResponse)
     * @private
     */
    var _processYahooResponse = function (rawResponse, callback) {
        var parsedResponse = rawResponse.slice(rawResponse.indexOf('(') + 1, rawResponse.lastIndexOf(')'));
        try {
            parsedResponse = JSON.parse(parsedResponse);
        } catch (e) {
            var err = new CustomErrors.InternalError('unable to parse yahoo response', {response: rawResponse});
            return callback(err);
        }

        callback(null, parsedResponse);
    };

    module.exports = YahooFinanceApi;

}(module));