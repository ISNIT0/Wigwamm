var request = require('request');
var db = require('mongojs').connect('test', ['landReg', 'epcData']);
var cheerio = require('cheerio');


module.exports = {
  savePostcodeIDs: function() {
    db.landReg.distinct('postCode', function(err, docs) {
      docs.map(function(val, index) {
      console.log(val)
      request.post('https://www.epcregister.com/reportSearchAddressByPostcode.html', {
          form: {
            postcode: val.replace(' ','')
          }
        },
        function(error, res, body) {
          console.log('Got some data: ', val, error)
          var $ = cheerio.load(body);
          db.epcData.insert({
            postcode:val,
            locationId:$('a').eq(0).attr('href').split('id=')[1]
          });
        }
      );
      });
    });
  }
}
/*$('#maincontent table a').map(function(index, value) {
  console.log($(value).attr('href'))
  db.epcData.insert({
    id: $(value).attr('href').split('id=')[1]
  });
});*/

module.exports.savePostcodeIDs()
