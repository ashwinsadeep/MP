(function (module) {

    var _ = require('underscore');

    var SearchSuggestions = function (yahooData) {
        this._parseYahooResponse(yahooData);
    };

    SearchSuggestions.prototype._parseYahooResponse = function (response) {
        this._suggestions = _.map(response.ResultSet.Result, function (result) {
            return {
                symbol  : result.symbol,
                name    : result.name,
                exchange: result.exchDisp,
                type    : result.typeDisp
            };
        });
    };

    SearchSuggestions.prototype.getDisplayData = function () {
        return this._suggestions;
    };

    module.exports = SearchSuggestions;

}(module));