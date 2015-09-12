/**
 * Json template for sending response to clients
 * @author: Ashwin
 */
(function (module) {

    var CustomError = require('../../../../common_modules/custom_errors');

    var JsonView = function (data) {
        this._data = data;
        this._errorCode = 0;
    };

    JsonView.factory = function (data) {
        return new JsonView(data);
    };

    JsonView.prototype.setError = function (err) {
        // If the error is not ours, treat it as an internal error with the inner exception as the original one
        if (!CustomError.isCustomError(err)) {
            err = new CustomError.InternalError('Something went wrong', err);
        }

        this._errorCode = err.getErrorCode();
        if (err.getDisplayData()) {
            this._data = err.getDisplayData();
        }

        return this;
    };

    JsonView.prototype.setErrorCode = function (errorCode) {
        this._errorCode = errorCode;
        return this;
    };

    JsonView.prototype.setData = function(data){
        this._data = data;
        return this;
    };

    JsonView.prototype.render = function () {
        var self = this;
        var res = {error_code: self._errorCode};
        if (self._data) {
            res.data = self._data;
        }

        return res;
    };

    module.exports = JsonView;

}(module));