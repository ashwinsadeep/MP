/**
 * @author: Ashwin
 */
(function (module) {

    var domain = '/api/v1/';
    var $      = require('jquery');

    var MarketPulse = function () {
    };

    MarketPulse.prototype.getSearchSuggestions = function (query, callback) {
        var self = this;
        var url  = domain + 'quote/search?q=' + query;
        var data = null;
        $.get(url, data, function (res, status, jqXHR) {
            try {
                res = self._responseParser(res, status, jqXHR);
            } catch (e) {
                return callback(e);
            }

            callback(null, res);
        });
    };

    MarketPulse.prototype._responseParser = function (data, status, jqXHR) {
        if (status != 'success') {
            console.log(status);
            throw new Error('something went wrong');
        }

        return data;
    };

    MarketPulse.prototype.getHistoricData = function (symbol, callback) {
        var self = this;
        var url  = domain + 'quote/historic/' + symbol;
        $.get(url, null, function (res, status, jqXHR) {
            try {
                res = self._responseParser(res, status, jqXHR);
            } catch (e) {
                return callback(e);
            }

            callback(null, res);
        });
    };

    module.exports = MarketPulse;
}(module));
