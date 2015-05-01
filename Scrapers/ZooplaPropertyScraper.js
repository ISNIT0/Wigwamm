var cheerio = require('cheerio');
var db = require('mongojs')('test', ['zooplaProps', 'landReg']);
var request = require('sync-request');
var Zoopla = require('zoopla-scraper')

var Locations = ['HP13', 'SW11', 'SW13', 'SW16', 'E1'];

db.landReg.distinct('outcode', function(err, docs) {
  Locations.forEach(function(value, index) {
    setTimeout(function() {
      console.log(value)
      Array(Math.ceil(JSON.parse(request('GET', 'http://api.zoopla.co.uk/api/v1/property_listings.json?area=' + value + '&api_key=qwx4xhztjv8qnxfe62xrccxa&page_size=1').getBody()).result_count / 100)).join(',').split(',').forEach(function(val, index) {
        console.log('Page: ', index)
        JSON.parse(request('GET', 'http://api.zoopla.co.uk/api/v1/property_listings.json?area=' + value + '&api_key=qwx4xhztjv8qnxfe62xrccxa&page_size=100&page_number=' + (index + 1)).getBody()).listing.map(function(value) {
          db.zooplaProps.update({
            listing_id: value.listing_id
          }, {
            $set: value,
            $setOnInsert: {
              inserted:Date.now()
            }
          }, {
            upsert: true
          });
        });
      }, index * 36000);
    });
  });
});


/*db.landReg.distinct('outcode', function(err, value) {
  value.forEach(function(value, index){
    console.log(value)
    Zoopla.byLocation(value).forEach(function(property, index){
      property.inserted = Date.now();
      db.zooplaProps.insert(property);
    });
  });
});*/
