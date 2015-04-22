var app = require('express')();
var rmRecent = require('../RightMoveRecentUpdates.js');

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));

app.get('/rm/recent', function(req, res){
  rmRecent(function(recent){
    res.send(recent);
  });
});

app.listen(8081);
