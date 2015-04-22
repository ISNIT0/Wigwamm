var db = require('mongojs')('test',['rightmoveProps']);
var diff = require('jsondiffpatch').diff;

module.exports = function(identifier, cb){
  db.rightmoveProps.find({identifier:identifier}).sort({updateDate:-1}, function(err, docs){
    cb(err, docs.map(function(value, index, array){
      return diff(value, array[index-1]);
    }));
  });
};
