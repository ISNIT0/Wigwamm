var cheerio = require('cheerio');
var db = require('mongojs')('test').collection('getAgentBranches');
var request = require('request');





"abcdefghijklmnopqrstuvwxyz".split('').map(function(val){
  request("https://www.getagent.co.uk/branch/search/"+val+".json", function(err, resp, body){
    console.log('Got Page ', val, err);

    JSON.parse(body).map(function(val, index){
      val.type = val.url.split('/')[0];
      db.insert(val);
    });
  });
});
