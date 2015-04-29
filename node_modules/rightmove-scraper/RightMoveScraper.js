var request = require('sync-request');
var db = require('mongojs').connect('test', ['rightmoveCodes']);
var outcodes = {};
db.rightmoveCodes.find({}, function(err, docs){
  docs.map(function(val, index){
    outcodes[val.outcode]=val.locationIdent;
  });
});

module.exports = {
  byOutcode:function(outcode){
    return JSON.parse(request('GET', "http://api.rightmove.co.uk/api/sale/find?index=0&sortType=2&numberOfPropertiesRequested=9999&locationIdentifier=OUTCODE%5E"+(outcodes[outcode]||outcode)+"&apiApplication=IPAD").getBody()).properties;
  },
  detail:function(id){
    return JSON.parse(request('GET', "http://api.rightmove.co.uk:80/api/propertyDetails?propertyId="+id+"&apiApplication=IPAD").getBody());
  },
  areaDetail:function(outcode){
    return JSON.parse(request('GET', "http://api.rightmove.co.uk/api/sale/find?index=0&sortType=2&numberOfPropertiesRequested=0&locationIdentifier=OUTCODE%5E"+(outcodes[outcode]||outcode)+"&apiApplication=IPAD").getBody());
  },
  rmLocIdentFromOutcode:function(outcode){
    return outcodes[outcode];
  }
};
