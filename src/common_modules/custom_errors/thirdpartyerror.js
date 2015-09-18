(function (module) {
    var util = require('util');
    var BaseError = require('./base');

    var ThirdPartyError = function () {
        ThirdPartyError.super_.apply(this, arguments);
        this._errorCode = 1004;
    };
    util.inherits(ThirdPartyError, BaseError);

    module.exports = ThirdPartyError;

}(module));