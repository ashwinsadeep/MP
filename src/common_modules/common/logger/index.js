(function (module) {

    var bunyan  = require('bunyan');
    var Loggers = {};

    var Logger = function () {
    };

    Logger.factory = function (logFile) {
        if (!logFile) {
            logFile = 'default';
        }

        if (!Loggers[logFile]) {
            Loggers[logFile] = bunyan.createLogger({
                name   : logFile,
                streams: [{
                    path: '/tmp/' + logFile + '.log',
                    leve: bunyan.DEBUG
                }]
            });
        }

        return Loggers[logFile];
    };

    module.exports = Logger;

}(module));