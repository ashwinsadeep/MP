var GSearch = require('../index');
var gSearch = new GSearch();

gSearch.search('NYSE:TWTR', function(err, links){
    console.log(err);
    console.log(links);
});