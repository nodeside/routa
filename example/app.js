var express = require('express');  
var routa = require('routa');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

var db = {};
routa.createRoute(app,{
  route: '/:ver/:cat/:func',
  func: 'func',  
  db:db/*Pass along your db connection*/,
  vars:{ 
  	anything: "any argument you want to add to the routa object"       
  }
 }
);

//404
app.use(function(req, res, next) {  
  //return res.status(404).send({success:false, errDesc:404});
});

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
