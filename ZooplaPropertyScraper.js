var cheerio = require('cheerio');
var db = require('mongojs')('test',['zooplaProps', 'getAgentAreas']);
var request = require('request');
var Zoopla = require('zoopla-scraper')


db.getAgentAreas.find({type:'postcode'}, function(err, docs){
  docs.map(function(value, index){
    console.log(value.val)
    Zoopla.byLocation(value.val).map(function(value){
      console.log(index);
      value.inserted = Date.now()
      db.zooplaProps.insert(value);
    });
  });
});
