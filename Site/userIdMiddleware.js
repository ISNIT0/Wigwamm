var Cookies = require('cookies');
module.exports = function(req, res, next){
  var cookies = new Cookies(req, res);
  if(!req.cookies.userId)
    cookies.set('userId', Date.now());
  next();
};
