var app = require('express')();
var db = require('mongojs').connect('test', ['userRemoved', 'userSaved', 'prevSearches', 'plentificAreas']);
var Cookies = require('cookies');
var Properties = require('./Properties.js');
var Property = require('./Property.js');
var PriceBands = require('./PriceBands.js');
var Features = require('./Features.json');
var Found = require('./Found.js');
var Load = require('ractive-load');
var moment = require('moment');
var numeral = require('numeral');

app.use(require('express').static(process.cwd() + '/public'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({
  extended: true
}));
app.use(require('cookie-parser')());
app.use(require('./userIdMiddleware.js'));

var getFeatureById = function(id) {
  return Features.filter(function(val) {
    return val.id == id;
  })[0] || {};
};
/******API******/
app.get('/previousSearches', function(req, res) {
  db.prevSearches.find({
    user: req.cookies.userId,
    hidden: {
      $not: true
    }
  }, function(err, docs) {
    res.send(docs);
  });
});

app.get('/userFound', function(req, res) {
  Found(req.cookies.userId, function(err, docs) {
    res.send(docs);
  });
});

app.get('/userForgot', function(req, res) {
  db.userRemoved.find({
    user: req.cookies.userId
  }, function(err, docs) {
    res.send(docs);
  });
});

app.post('/markFound/:id', function(req, res) {
  db.userSaved.insert({
    id: req.params.id,
    user: req.cookies.userId
  }, function(err) {
    res.send(err);
  });
});

app.post('/markForget/:id', function(req, res) {
  db.userRemoved.insert({
    id: req.params.id,
    user: req.cookies.userId
  }, function(err) {
    res.send(err);
  });
});

app.get('/autoComplete/:typed', function(req, res) {
  db.plentificAreas.find({
    description: {
      $regex: '.*' + req.params.typed + '.*',
      $options: 'i'
    }
  }).limit(15, function(err, docs) {
    res.send(docs);
  });
});

app.get('/priceRange/:outcode', function(req, res) {
  PriceBands(req.params.outcode, function(err, docs) {
    res.send({
      outcode: req.params.outcode,
      ranges: docs
    }); //Need to add bed numbers
  });
});

app.get('/features/:outcode/:priceMin/:priceMax', function(req, res) {
  res.send({
    outcode: req.params.outcode,
    range: {
      min: req.params.priceMin,
      max: req.params.priceMax
    },
    features: Features
  }); //New
});

app.get('/properties/:outcode/:priceMin/:priceMax/:feature', function(req, res) {
  Properties(
    req.params.outcode, //OUTCODE
    {
      min: req.params.priceMin,
      max: req.params.priceMax
    }, //PRICERANGE {min:, max:}
    getFeatureById(req.params.feature).query, //FEATURE QUERY
    req.cookies.userId,
    function(err, docs) {
      res.send({
        outcode: req.params.outcode,
        range: {
          min: req.params.priceMin,
          max: req.params.priceMax
        },
        features: req.params.feature,
        props: docs
      });
    }
  );
});

app.get('/property/:id', function(req, res) {
  Property(
    req.params.id,
    function(err, doc) {
      res.send(doc);
    }
  );
});
/******End API******/

/******Site******/
app.get('/app', function(req, res) {
  Load('views/index.html').then(function(Component) {
    db.prevSearches.find({
      user: req.cookies.userId,
      hidden: {
        $not: true
      }
    }, function(err, prevSearches) {
      db.userSaved.find({
        user: req.cookies.userId
      }, function(err, favourites) {
        Found(req.cookies.userId, function(err, found) {
          var ractive = new Component({
            data: {
              numeral: numeral,
              prevSearches: prevSearches,
              found: found
            }
          });
          res.send(ractive.toHTML());
        });
      });
    });
  }).catch(function(a, b) {
    console.log(a, b)
  });
});

app.get('/app/priceRange/:outcode', function(req, res) {
  Load('views/priceRange.html').then(function(Component) {
    PriceBands(req.params.outcode, function(err, docs) {
      var ractive = new Component({
        data: {
          numeral:numeral,
          outcode: req.params.outcode,
          ranges: docs
        }
      });
      res.send(ractive.toHTML());
    });
  }).catch(function(a, b) {
    console.log(a, b)
  });
});

app.get('/app/features/:outcode/:priceMin/:priceMax', function(req, res) {
  Load('views/features.html').then(function(Component) {
    PriceBands(req.params.outcode, function(err, docs) {
      var ractive = new Component({
        data: {
          numeral:numeral,
          outcode: req.params.outcode,
          price: {
            min: req.params.priceMin,
            max: req.params.priceMax
          },
          features: Features
        }
      });
      res.send(ractive.toHTML());
    });
  }).catch(function(a, b) {
    console.log(a, b)
  });
});

app.get('/app/properties/:outcode/:priceMin/:priceMax/:feature', function(req, res) {
  Load('views/properties.html').then(function(Component) {
    Properties(
      req.params.outcode, //OUTCODE
      {
        min: req.params.priceMin,
        max: req.params.priceMax
      }, //PRICERANGE {min:, max:}
      getFeatureById(req.params.feature).query, //FEATURE QUERY
      req.cookies.userId,
      function(err, docs) {
        var ractive = new Component({
          data: {
            numeral: numeral,
            outcode: req.params.outcode,
            price: {
              min: req.params.priceMin,
              max: req.params.priceMax
            },
            feature: req.params.feature,
            properties: docs
          }
        });
        res.send(ractive.toHTML());
      }
    );
  }).catch(function(a, b) {
    console.log(a, b)
  });
});

app.get('/app/property/:id', function(req, res) {
  Load('views/property.html').then(function(Component) {
    Property(
      req.params.id, //OUTCODE
      req.cookies.userId,
      function(err, doc) {
        var ractive = new Component({
          data: {
            numeral:numeral,
            property: doc,
            fromNow: function(date) {
              return moment(date).fromNow();
            }
          }
        });
        res.send(ractive.toHTML());
      }
    );
  }).catch(function(a, b) {
    console.log(a, b)
  });
});
/******End Site******/




app.listen(8081);
