var RightMove = require('rightmove-scraper');
var db = require('mongojs').connect('test',['test']);


var run = function(i){
  var data=RightMove.areaDetail(i);
  if(!((data.errorInfo||'').split('\n').length>1)){
    if(!data.errorInfo){
      console.log(i);
      db.test.insert({outcode:data.searchableLocation.name, locationIdent:i})
    }
    run(i+1);
  } else {
    console.log('Done!')
  }
}
setTimeout(function(){
  run(1);
});
