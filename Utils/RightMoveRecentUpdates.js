var db = require('mongojs')('test',['rightmoveProps']);

module.exports = function(cb){
  db.rightmoveProps.find({}).limit(20).sort({updateDate:-1},function(err, docs){
    cb(docs);
  });
};
