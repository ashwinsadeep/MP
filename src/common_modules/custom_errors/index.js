(function (module) {


    module.exports.InternalError = require('./internalerror');
    module.exports.isCustomError = function (errObject) {
        return errObject instanceof require('./base');
    }
}(module));