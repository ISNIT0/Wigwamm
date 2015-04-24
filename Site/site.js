var app = require('express')();
var db = require('mongojs').connect('test',['userRemoved','userSaved', 'getAgentAreas']);
var async = require('async');
var load = require( 'ractive-load' );
var RightMoveRecentDiff = require('../RightMoveRecentDiff.js');
var ignoreChange = require('../ignoreChange.json');
var moment = require('moment');
var request = require('sync-request');
var Zoopla = require('zoopla-scraper');
var Cookies = require('cookies');
var _ = require('lodash');

app.use(require('express').static(process.cwd() + '/public'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());
app.use(require('./userIdMiddleware.js'));

var categoryMap = [{
  name:'Outside Space',
  id:'outsideSpace',
  keys:['garden', 'shared-garden', 'patio']
}];

var getCategoryById = function(id){
  return categoryMap.filter(function(val){
    return val.id==id;
  })[0];
}


app.get('/app/autoComplete/:typed', function(req, res){
  db.getAgentAreas.find({val:{$regex:'.*'+req.params.typed+'.*', $options:'i'}}).limit(15, function(err, docs){
    res.send(docs);
  });
});

app.post('/app/removeProp', function(req, res){ //User does not want to see this property
  db.userRemoved.insert({
    userId:req.cookies.userId,
    guid:req.body.guid
  });
});
app.post('/app/saveProp', function(req, res){ //User does want to see this property
  var cookies = new Cookies(req, res);
  db.userSaved.insert({
    userId:req.cookies.userId,
    guid:req.body.guid,
    image:req.body.image,
    name:req.body.name
  });
});
app.post('/app/unSave', function(req, res){ //User does want to see this property
  db.userSaved.remove({
    userId:req.cookies.userId,
    guid:req.body.guid
  });
});

app.get('/app', function(req, res){ //WigwammApp
  load( 'views/wigwammApp.html' ).then( function ( Component ) {
    db.userSaved.find({userId:req.cookies.userId||''}, function(err, docs){
      var ractive = new Component({
        data: {
          recent:JSON.parse((req.cookies.recent||'[]')),
          favourites:docs
        }
      });

      // generate some HTML so that we can save it, or serve to a client
      res.send(ractive.toHTML());
    });
  }).catch( function(a,b){console.log(a,b)} );
});
app.get('/app/location/:location', function(req, res){ //Selecting num of beds
  load( 'views/appLocation.html' ).then( function ( Component ) {
    var ractive = new Component({
      data: {
        location:req.params.location,
        houses:[
          {
            label:'1 Bed/Studio',
            price:'100,000',
            number:100
          }, {
            label:'2 Beds',
            price:'100,000',
            number:100
          }, {
            label:'3 Beds',
            price:'100,000',
            number:100
          }, {
            label:'4+ Beds',
            price:'100,000',
            number:100
          }
        ]
      }
    });

    // generate some HTML so that we can save it, or serve to a client
    res.send(ractive.toHTML());
  }).catch( function(a,b){console.log(a,b)} );
});
app.get('/app/features/:location/:beds', function(req, res){ //Selecting categories
  var cookies = new Cookies(req, res);
  var recent = (JSON.parse(req.cookies.recent||'[]')||[]);
  if(!Array.isArray(recent))
    recent = [];
  recent.unshift({location:req.params.location,beds:req.params.beds});
  cookies.set('recent', JSON.stringify(recent.slice(0,4)));

  load( 'views/appFeatures.html' ).then( function ( Component ) {
    var ractive = new Component({
      data: {
        categoryMap:categoryMap,
        location:req.params.location,
        beds:req.params.beds,
        recent:req.cookies.recent
      }
    });

    // generate some HTML so that we can save it, or serve to a client
    res.send(ractive.toHTML());
  }).catch( function(a,b){console.log(a,b)} );
});
app.get('/app/properties/:location/:beds/:category', function(req, res){ //Property Details
  var cookies = new Cookies(req, res);
  load( 'views/appProperties.html' ).then( function ( Component ) {
    db.userRemoved.find({userId:req.cookies.userId}, function(err, docs){
      var Properties = JSON.parse(request('GET', 'http://api.nestoria.co.uk/api?action=search_listings&encoding=json&place_name='+req.params.location+
                                          '&listing_type=buy&bedroom_min='+req.params.beds+
                                          '&bedroom_max='+req.params.beds+
                                          '&keywords='+(getCategoryById(req.params.category)||{keys:[]}).keys.join(',')).getBody()).response.listings;
      Properties = Properties.filter(function(val){
        return !docs.filter(function(doc){
          return val.guid==doc.guid;
        }).length;
      });

      async.map(Properties, function(item, cb){
        db.userSaved.find({
          userId:req.cookies.userId,
          guid:item.guid
        }, function(err, docs){
          item.saved = !!docs.length
          cb(null, item);
        })
      }, function(err, Properties){
        var ractive = new Component({
          data: {
            properties:Properties,
            location:req.params.location,
            beds:req.params.beds,
            category:req.params.category
          }
        });

        // generate some HTML so that we can save it, or serve to a client
        res.send(ractive.toHTML());
      });
    });
  }).catch( function(a,b){console.log(a,b)} );
});
app.get('/app/property/:id', function(req, res){ //Property Detail
  load( 'views/appProperty.html' ).then( function ( Component ) {
    var ractive = new Component({
      data:JSON.parse(request('GET', 'http://api.nestoria.co.uk/api?action=search_listings&encoding=json&guid='+req.params.id).getBody()).response.listings[0]
    });

    // generate some HTML so that we can save it, or serve to a client
    res.send(ractive.toHTML());
  }).catch( function(a,b){console.log(a,b)} );
});


































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
