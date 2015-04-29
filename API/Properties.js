var request = require('sync-request');
var _ = require('lodash');
var db = require('mongojs').connect('test', ['allProps', 'userRemoved', 'userSaved']);
var async = require('async');

module.exports = function(outcode, priceRange, feature, userId, cb) {
  db.allProps.find(_.extend({
    outcode: outcode
  }, {
    price: {
      $gte: parseInt(priceRange.min),
      $lte: parseInt(priceRange.max)
    }
  }, feature), function(err, docs) {
    docs = docs||[];
    db.userRemoved.find({
        user: userId
      }, function(err, removed) {
        removed = removed||[];
        async.map(docs.filter(function(doc) {
          return !removed.filter(function(removed) {
            return removed.id == doc.listing_id;
          }).length;
        }), function(val, cb) {
          db.userSaved.find({
            id: val.listing_id
          }, function(err, docs) {
            if (docs.length)
              val.found = true;
            cb(err, val)
          });
        }, function(err, val) {
          cb(err, val);
        })
      });
    }
  )
};
