var db = require('mongojs').connect('test', ['priceBands', 'landReg']);
var async = require('async');

/*module.exports = function(outcode, callBack){
  db.priceBands.find({outcode:outcode}, function(err, value){
    callBack(err, value);
  });
};*/

module.exports = function(outcode, callBack) {
  db.landReg.find({
    outcode: {
      $regex: ".*" + outcode + ".*",
      $options: "i"
    }
  }).sort({
    price: 1
  }, function(err, docs) {
    if (docs.length) {
      var index = 0;
      async.map(Array(4).join(',').split(','), function(value, cb) {
        db.landReg.find({
          outcode: outcode
        }).sort({
          price: 1
        }).limit(docs.length / 4).skip(index * (docs.length / 4), function(err, limitedDocs) {
          if(limitedDocs.length)
            var ret = {
              price: {
                min: limitedDocs[0].price,
                max: limitedDocs[limitedDocs.length - 1].price
              },
              beds: {
                min: 0,
                max: 0
              },
              soldInArea: docs.length
            };
          else
            var ret = {}
          cb(err, ret);
        });
        index++;
      }, callBack);
    } else {
      callBack(null, []);
    }
  });
}




/*
db.landReg.find().sort({price:1}).limit(db.landReg.find().length()/4).skip(1*(db.landReg.find().length()/4))
*/
