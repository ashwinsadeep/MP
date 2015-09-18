module.exports = function (router) {

    var YahooQuotes = require('../../../../../common_modules/yahooapi/index');

    router.get('/intraday/:symbol', function (req, res, next) {
        var yahooQuotes = new YahooQuotes();
        yahooQuotes.getIntraDayData(req.params.symbol, function (err, intradayQuote) {
            if (err) {
                next(err);
                return;
            }

            res.send(intradayQuote.getDisplayData());
        });
    });

    router.get('/historic/:symbol', function (req, res, next) {
        var yahooQuotes = new YahooQuotes();
        yahooQuotes.getHistoricData(req.params.symbol, function (err, intradayQuote) {
            if (err) {
                next(err);
                return;
            }

            res.send(intradayQuote.getDisplayData());
        });
    });
};