(function (module) {

    var NewsStory = require('./newsstory'),
        GSearch   = require('../googlesearch'),
        async     = require('async');

    var NewsAnalyser = function (stockDisplayName, exchangeDisplayName) {
        this._stockDisplayName    = stockDisplayName;
        this._exchangeDisplayName = exchangeDisplayName;
        this._searchLib           = new GSearch();
    };

    NewsAnalyser.prototype.analyze = function (callback) {
        var self = this;
        async.waterfall([
            GSearch.prototype.search.bind(self._searchLib, self._stockDisplayName),
            NewsAnalyser.prototype._analyzeSearchResult.bind(self)
        ], function (err, data) {
            callback(err, data);
        });
    };

    NewsAnalyser.prototype._analyzeSearchResult = function (links, callback) {
        links = links.splice(0, 10);
        async.map(links, function (link, callback) {
            var newsStory = new NewsStory(link);
            newsStory.summarize(callback);
        }, function (err, result) {
            callback(err, result);
        });
    };

    module.exports = NewsAnalyser;
}(module));