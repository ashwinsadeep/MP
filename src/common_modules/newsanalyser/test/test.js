var NewsAnalyzer = require('../index');
var analyzer     = new NewsAnalyzer('NYSE:TWTR');
var _            = require('underscore');
analyzer.analyze(function (err, data) {
    if (err)
    {
        console.log(err);
        return;
    }

    console.log(data);
    var sum = _.chain(data).pluck('netScore').reduce(function (memo, score) {
        return memo + score
    }, 0).value();

    console.log('Final Score', sum / data.length);
    console.log('Details', _.map(data, function (obj) {
        return _.pick(obj, ['title', 'description', 'publisher', 'netScore']);
    }))
});