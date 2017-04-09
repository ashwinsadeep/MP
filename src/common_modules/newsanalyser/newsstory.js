(function (module) {

    var request     = require('request'),
        parse       = require('url-parse'),
        CustomError = require('../custom_errors'),
        unfluff     = require('unfluff'),
        async       = require('async'),
        sentiment   = require('sentiment'),
        _           = require('underscore');

    var NewsStory = function (storyUrl) {
        this._url    = storyUrl;
        this._domain = parse(storyUrl, true).host;
    };

    NewsStory.prototype.summarize = function (callback) {
        var self = this;
        async.waterfall([
            function (callback) {
                self._getStory(callback);
            }, function (html, callback) {
                self._summariseAndAnalyse(html, callback);
            }, function (callback) {
                self._getResponseData(callback);
            }
        ], function (err, response) {
            if (err && err.isIgnorable) {
                err      = null;
                response = null;
            }

            callback(err, response);
        });
    };

    /**
     * Makes a GET request to this._url & fetches the content
     * @param callback - function(err, htmlBody)
     * @private
     */
    NewsStory.prototype._getStory = function (callback) {
        var self = this;
        if (!self._url) {
            var err = new CustomError.InternalError('url was not set');
            return callback(err);
        }

        request(self._url, function (err, response, body) {
            if (err) {
                return callback(err);
            }

            if (response.statusCode !== 200) {
                var msg         = 'non 200 error code from ' + self._domain;
                var debug       = {url: self._url, status: response.statusCode};
                err             = new CustomError.ThirdPartyError(msg, debug);
                err.isIgnorable = true;
                return callback(err);
            }

            return callback(err, body);
        });
    };

    /**
     * Parses the HTML content and sets the title, content etc
     * @param html - the html body of the current page
     * @private
     */
    NewsStory.prototype._extractBody = function (html) {
        var parsedData    = unfluff(html);
        this._title       = parsedData.title;
        this._content     = parsedData.text;
        this._image       = parsedData.image;
        this._tags        = parsedData.tags;
        this._description = parsedData.description;

    };

    /**
     * Summarise and analyse the sentiment of the article
     * @param html
     * @param callback
     * @private
     */
    NewsStory.prototype._summariseAndAnalyse = function (html, callback) {
        var self                   = this;
        self._extractBody(html);
        self._titleSentiment       = sentiment(self._title);
        self._contentSentiment     = sentiment(self._content);
        self._descriptionSentiment = sentiment(self._description);
        self._tagScore             = _.reduce(self._tags, function (score, tag) {
            if (tag.length < 10) {
                return score;
            }

            return score + sentiment(tag).score;
        }, 0);
        callback(null);
    };

    /**
     * Get response data for this article
     * @param callback
     * @private
     */
    NewsStory.prototype._getResponseData = function (callback) {
        var self             = this;
        var titleScore       = parseInt(self._titleSentiment.score);
        var contentScore     = parseInt(self._contentSentiment.score);
        var tagScore         = parseInt(self._tagScore);
        var descriptionScore = parseInt(self._descriptionSentiment.score);
        var netScore         = titleScore + contentScore + tagScore + descriptionScore;
        var response         = {
            title               : self._title,
            titleSentiment      : titleScore,
            content             : self._content,
            contentSentiment    : contentScore,
            description         : self._description,
            descriptionSentiment: self._descriptionSentiment.score,
            tags                : self._tags,
            tagScore            : tagScore,
            netScore            : netScore,
            publisher           : self._domain
        };
        callback(null, response);
    };

    module.exports = NewsStory;

}(module));