var app = require('express')();
var async = require('async');
var load = require( 'ractive-load' );
var RightMoveRecentDiff = require('../RightMoveRecentDiff.js');
var ignoreChange = require('../ignoreChange.json');
var moment = require('moment');

app.use(require('express').static(process.cwd() + '/public'));


app.get('/ticker', function(req, res){
  RightMoveRecentDiff(function(recent){
    load('views/ticker.html').then( function ( Component ) {
      var ractive = new Component({
        el: 'body',
        data: {
          recent:recent,
          fromNow:function(date){return moment(date).fromNow()},
          genChangeMessage:function(that){
            var change = that[that.length-1];
            return Object.keys(change).filter(function(val){
              return !(ignoreChange.indexOf(val)>-1)
            }).map(function(value){
              return ({
                price:function(){
                  return 'Price changed by '+change.price[0]-change.price[1];
                },
                status:function(){
                  return 'Status changed to '+change.status[1];
                },
                orderFromServer:function(){
                  var change = change.orderFromServer[0]-change.orderFromServer[1];
                  console.log(change)
                  return change?'Page Rank decreased by '+change:'Page Rank increased by '+Math.abs(change);
                },
                photoCount:function(){
                  return change.photoCount[1]-change.photoCount[0]+' photos were added.'
                },
                inserted:function(){
                  return 'Property Added To Market'
                },
                floorplanCount:function(){
                  return change.floorplanCount[1]-change.floorplanCount[0]+' floorplans were added.'
                },
              }[value]||function(){return ''})();
            }).filter(function(val){return val});
          }
        }
      });

      var helpers = ractive.data;

      // generate some HTML so that we can save it, or serve to a client
      res.send(ractive.toHTML());
    }).catch(function(a,b){
      console.log(a,b)
    });
  });
});

app.listen(8080);
