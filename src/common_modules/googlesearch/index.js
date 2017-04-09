(function (module) {

    var BASE_URL    = 'https://www.google.com/finance/company_news?q=%s';
    var request     = require('request'),
        CustomError = require('../custom_errors'),
        util        = require('util'),
        async       = require('async'),
        cheerio     = require('cheerio'),
        _           = require('underscore'),
        urlparse    = require('url-parse');

    var GSearch = function (domain) {
        this._domain = domain;
    };

    /**
     * Search Google News for the query
     * @param query - Ideally, this should be a stock name. But this can be anything and will be passed on to Google
     *     without any manipulations
     * @param callback - function(err, urls) - urls is an array of urls which you should be looking at to do the
     *     intelligent stuff
     */
    GSearch.prototype.search = function (query, callback) {
        var self = this;
        async.waterfall([
            GSearch.prototype._performSearch.bind(self, query),
            function (response, callback) {
                var $ = cheerio.load(response);
                // this is the class which wraps all result links
                var urls = $('#news-main').find('.news a').map(function () {
                    return $(this).attr('href');
                }).get();

                urls = _.chain(urls).map(function (url) {
                    url = urlparse(url, true);
                    if (url.query) {
                        return url.query.url;
                    }

                    return null;
                }).compact().value();
                callback(null, urls);
            }
        ], function (err, urls) {
            callback(err, urls);
        });
    };

    GSearch.prototype._performSearch = function (query, callback) {
        var url = util.format(BASE_URL, [query]);
        request(url, function (err, response, body) {
            if (err) {
                return callback(err);
            }

            if (response.statusCode !== 200) {
                var msg   = 'non 200 error code from ' + self._domain;
                var debug = {url: self._url, status: response.statusCode};
                err       = new CustomError.ThirdPartyError(msg, debug);
                return callback(err);
            }

            return callback(err, body);
        });
    };

    module.exports = GSearch;

}(module));