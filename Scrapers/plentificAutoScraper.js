var db = require('mongojs').connect('test', ['plentificAreas', 'getAgentAreas', 'landReg']);
var request = require('sync-request');

db.landReg.distinct('outcode',function(err,docs){
  docs.map(function(val){
    var res = JSON.parse(request('GET', 'https://plentific.com/api/zoopla/?method=geo_autocomplete&search_term='+val.toLowerCase()+'&search_type=listings').body).suggestions;
    console.log(res)
    res&&res.filter(function(val){return val.value}).map(function(res){
      db.plentificAreas.insert({
        outcode:val,
        description:res.value
      })

    });

  });
});

/*https://plentific.com/api/zoopla/?method=geo_autocomplete&search_term=h&search_type=listings*/
