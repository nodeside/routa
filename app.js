
var express = require('express');
var app = express();

var routa = require('./routa.js');
routa.createRoute(app,{
	route: '/:ver/:func/:data/:cat',
	func: 'func',
	data: 'data'
});

routa.createRoute(app,{
	route: '/:cat/:func/:data',
	func: 'func',
	data: 'data'
});

//404
app.use(function(req, res, next) {
  
  return res.status(404).send({success:false, errDesc:404});
});

app.listen(3000);

