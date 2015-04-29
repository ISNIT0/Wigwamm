var cheerio = require('cheerio');
var db = require('mongojs')('test', ['zooplaProps', 'getAgentAreas']);
var request = require('sync-request');
var Zoopla = require('zoopla-scraper')


db.getAgentAreas.find({
  type: 'postcode'
}, function(err, docs) {
  docs.map(function(value, index) {
      setTimeout(function() {
        console.log(value.val)
        JSON.parse(request('GET', 'http://api.zoopla.co.uk/api/v1/property_listings.json?area=' + value.val + '&api_key=qwx4xhztjv8qnxfe62xrccxa').getBody()).listing.map(function(value) {
          console.log(index);
          value.inserted = Date.now();
          db.zooplaProps.insert(value);
        });
      }, index*36000);
  })
});
