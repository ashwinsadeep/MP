(function (module) {

    var BaseError = function (msg, data) {
        this._msg = msg;
        this._errorCode = 1001;
        this._isLoggable = false;
        this._data = data;
    };

    BaseError.prototype.getMessage = function () {
        return this._msg;
    };

    BaseError.prototype.getErrorCode = function () {
        return this._errorCode;
    };

    BaseError.prototype.getDisplayData = function () {
        if (this._displayData) {
            return this._displayData;
        }

        return {
            msg: this._msg
        }
    };

    BaseError.prototype.setDisplayData = function (data) {
        this._displayData = data;
    };

    BaseError.prototype.setDisplayMessage = function (displayMsg) {
        this._displayData.msg = displayMsg;
    };

    module.exports = BaseError;

}(module));