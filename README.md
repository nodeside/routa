routa
=====

First Experimental version. Stay tuned for examples and many many fixes and improvements

Usage:
------

APP.JS

var express = require('express');  
var routa = require('routa');
var app = express();

var db = {}; // this can be any db connection

routa.createRoute(app,{
  route: '/:ver/:cat/:func',
  func: 'func',  
  db:db/*Pass along your db connection*/,
  vars:{ 
  	anything: "any argument you want to add to the routa object"       
  }
 }
);


routes/0.1/test.js

exports.test = function(req,res,next,routa) {
	//here is your db
	var db  = routa.db;
	routa.send({success:true, query:req.query});
}

By default output is json. to output xml do ?format=xml

