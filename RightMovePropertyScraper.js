var cheerio = require('cheerio');
var db = require('mongojs')('test',['rightmoveProps', 'getAgentAreas']);
var RightMove = require('rightmove-scraper');

db.getAgentAreas.find({type:'postcode'}, function(err, docs){
  docs.map(function(value, index){
    RightMove.byOutcode(value.val).map(function(value, i){
      console.log(index, i, docs.length)
      db.rightmoveProps.insert(value);
    });
  });
});
