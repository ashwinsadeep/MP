var InternalError = require('../../common_modules/custom_errors').InternalError;
var err = new InternalError('as');
console.log(require('../../common_modules/custom_errors').isCustomError(err));