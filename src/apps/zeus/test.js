var Yahoo = require('../../common_modules/yahooapi');
var yahoo = new Yahoo();
yahoo.getHistoricData('ITC.BO', function (err, data) {
    console.log(data.getDisplayData());
});