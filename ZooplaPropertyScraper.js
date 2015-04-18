var cheerio = require('cheerio');
var db = require('mongojs')('test',['zooplaProps', 'getAgentAreas']);
var request = require('request');
var Zoopla = require('zoopla-scraper')

console.log(Zoopla.byLocation('HP13'))


/*db.getAgentAreas.find({type:'postcode'}, function(err, docs){
  docs.map(function(value, index){
    request("http://www.zoopla.co.uk/for-sale/property/"+value.val+"/?page_size=999&pn=0", function(err, resp, body){
      $ = cheerio.load(body);
      $('.listing-results > li.clearfix').map(function(i, val){
        console.log(index, i)
        db.zooplaProps.insert({
          zooplaId:$(val).attr('data-listing-id'),
          agent:(($(val).find('.agent_logo img').attr('src')||'').match(/\(([^)]+)\)/)||['',''])[1],
          coordinates:{longitude:$(val).find('meta[itemprop=longitude]').attr('content'), latitude:$(val).find('meta[itemprop=latitude]').attr('content')},
          price:$(val).find('.listing-results-price').eq(0).text().trim(),
          dateListedZoopla:'',
          dateRemovedZoopla:'',
          floorPlan:'',
          address:$(val).find('.streetAddress').text().trim(),
          rank:[i],
          outCode: value.val
        });
      });
    });
  });
});*/
