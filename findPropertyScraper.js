var request = require('sync-request');
var db = require('mongojs').connect('test', ['findProperly', 'getAgentAreas']);
var cheerio = require('cheerio');

db.getAgentAreas.find({
  type: 'postcode'
}, function(err, docs) {
  docs.map(function(val, index) {
    console.log('Area ', val.val)
    var page = request('GET', 'http://www.findproperly.co.uk/property-for-sale-london/postcode/' + val.val + '#page=1').getBody();
    if (page) {
      var $ = cheerio.load(page)
      $('.pagination li>a').filter(function(index, value) {
        return parseInt($(value).text());
      }).map(function(index, value) {
        console.log('Page ', index + 1)
        $ = cheerio.load(request('GET', 'http://www.findproperly.co.uk/property-for-sale-london/postcode/' + val.val + '#page=' + index + 1).getBody())
        $('.col-sm-6.col-md-4.col-lg-3.pl-grid-prop.not-viewed').filter(function(index, value) {
          return $(value).find('.int-area-widget').attr('data-area')
        }).map(function(index, value) {
          db.findProperly.insert({
            postcode:val.val,
            zooplaId: $(value).attr('data-id'),
            area: $(value).find('.int-area-widget').attr('data-area'),
            price: $(value).find('.int-area-widget').attr('data-area-price')
          });
        });
      });
    }
  });
});
