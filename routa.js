var config = require('./config');
var dbConnection = null;
var root = config.root;

var setDBConnection = exports.setDBConnection = function (dbConnection) {
  this.dbConnection = dbConnection;
}

exports.createRoute = function (app, options) {
  var route = options.route;
  var RouteFunc = options.func;
  var RouteData = options.data;
  var RouteStructure = buildRouteStructure(options);  

  app.get(options.route, function(req, res, next) {    
  var params = require('querystring').parse(req.params[RouteData]);                         
  
  var args = new Array(params, this.dbConnection, defineJSONCallback(res));
  routa({
    route:root+buildRoutePath(req.params, RouteStructure),
    func:req.params[RouteFunc],
    args:args,
    error:next
    });     
});
}

function buildRouteStructure(options) {
  var structure = [];
  var params = options.route.split('/:');
  params.shift();
  var length = params.length;
  for (var index = 0; index<length; index++) {
    if (params[index]  != options.func  && params[index] != options.data)
      structure[index] = params[index];
  }  
  return (structure);
}

function buildRoutePath(params, RouteStructure) {
  var path = '';
  for (var index in RouteStructure) {       
    path+= '/'+params[RouteStructure[index]];
  }
  return(path);
}
//set the headers for json and utf-8
function setJSONHeaders(res) {
  res.header('Content-Type', 'application/json');
  res.header('Charset', 'utf-8');  
}

//build the callback functiona and pass along
function defineJSONCallback(res) {
  setJSONHeaders(res);
  return function(ret) {res.send(ret)};
}

//require and run the appropriate function
function routa(options) {
  try {
    require(options.route)[options.func].apply(this, options.args);
  } catch (e) {        
    options.error();   
  } 
}

