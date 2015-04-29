var db = require('mongojs').connect('test', ['userSaved']);
var async = require('async');
var Property = require('./Property.js');

module.exports = function(userId, cb){
  db.userSaved.find({user:userId}, function(err, docs){
    async.map(docs, function(val, cb){
      Property(val.id, '', cb, true);
    }, function(err, val){
      cb(err, val);
    }, cb);
  });
}
