/**
 * Handles data for intraday quotes. This will be minutely values for the current day
 */
(function (module) {

    var _ = require('underscore');

    /**
     *
     * @param data - raw data from yahoo chart api
     * @param source - data source - for now it is yahoo
     * @constructor
     */
    var IntraDay = function (data, source) {
        this._parseYahooOutput(data);
    };

    IntraDay.prototype._parseYahooOutput = function (data) {
        this._companyName = data.meta['Company-Name'];
        this._exchangeName = data.meta['Exchange-Name'];
        this._previousClose = data.meta['previous_close'];
        this._series = _.map(data.series, function (dataForSecond) {
            return {
                ts    : dataForSecond['Timestamp'],
                close : dataForSecond['close'],
                high  : dataForSecond['high'],
                low   : dataForSecond['low'],
                open  : dataForSecond['open'],
                volume: dataForSecond['volume']
            }
        });
        this._ranges = data.ranges; // an object with close, open, high & low, each with a max & min value
    };

    IntraDay.prototype.getDisplayData = function () {
        return {
            'company_name'  : this._companyName,
            'exchange_name' : this._exchangeName,
            'previous_close': this._previousClose,
            'series'        : this._series
        };
    };

    module.exports = IntraDay;

}(module));