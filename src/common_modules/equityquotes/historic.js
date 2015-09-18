/**
 * Handles data for historic quotes. This will be daily values for the current day
 */
(function (module) {

    var _ = require('underscore');
    var moment = require('moment');

    /**
     *
     * @param data - raw data from yahoo chart api
     * @param source - data source - for now it is yahoo
     * @constructor
     */
    var Historic = function (data, source) {
        this._parseYahooOutput(data);
    };

    Historic.prototype._parseYahooOutput = function (data) {
        this._companyName = data.meta['Company-Name'];
        this._exchangeName = data.meta['Exchange-Name'];
        this._previousClose = data.meta['previous_close'];
        this._series = _.map(data.series, function (dataForSecond) {
            return {
                ts    : moment(dataForSecond['Date'], 'YYYYMMDD').unix(),
                close : dataForSecond['close'],
                high  : dataForSecond['high'],
                low   : dataForSecond['low'],
                open  : dataForSecond['open'],
                volume: dataForSecond['volume']
            }
        });
        this._ranges = data.ranges; // an object with close, open, high & low, each with a max & min value
    };

    Historic.prototype.getDisplayData = function () {
        return {
            'company_name'  : this._companyName,
            'exchange_name' : this._exchangeName,
            'previous_close': this._previousClose,
            'series'        : this._series
        };
    };

    module.exports = Historic;

}(module));