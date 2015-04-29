var cheerio = require('cheerio');
var db = require('mongojs')('test', ['rightmoveProps', 'getAgentAreas']);
var RightMove = require('rightmove-scraper');

setTimeout(function() {
  db.getAgentAreas.find({
    type: 'postcode'
  }, function(err, docs) {
    docs.slice(0, docs.length).map(function(value, index) {
      console.log(index, value.val)
      var Props = RightMove.byOutcode(value.val);
      if (Props)
        Props.map(function(value, i) {
          console.log(index, i, docs.length, value.identifier, value.updateDate)
          value.inserted = Date.now();
          db.rightmoveProps.insert(value);
        });
    });
  });
}, 3000);
