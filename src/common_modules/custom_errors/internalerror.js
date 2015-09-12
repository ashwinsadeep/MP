(function (module) {
    var util = require('util');
    var BaseError = require('./base');

    var InternalError = function () {
        InternalError.super_.apply(this, arguments);
    };
    util.inherits(InternalError, BaseError);

    module.exports = InternalError;

}(module));