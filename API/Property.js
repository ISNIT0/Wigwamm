var db = require('mongojs').connect('test', ['allProps']);
var Found = require('./Found.js');

module.exports = function(id, userId, cb, ignoreUser){
  db.allProps.findOne({listing_id:id}, function(err, val){
    if(!ignoreUser)
      Found(userId, function(err, found){
        cb(found.filter(function(val){
          return found.listing_id==val.listing_id;
        }));
      });
    else
      cb(err, val);
  });
}
