var rmRecent = require('./RightMoveRecentUpdates.js');
var RightMoveDiff = require('./RightMoveDiff.js');
var async = require('async');

module.exports = function(cb){
  rmRecent(function(recent){
    async.map(recent.map(function(val){return val.identifier}), RightMoveDiff, function(err, response){
      cb(response);
    });
  });
};
