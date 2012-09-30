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
  var RouteStructure = _buildRouteStructure(options);  

  app.get(options.route, function(req, res, next) {    
    var params = require('querystring').parse(req.params[RouteData]);                         

    var args = new Array(req, res, next, {    
      db:dbConnection
    });

    _routa({
      route:root+_buildRoutePath(req.params, RouteStructure),
      func:req.params[RouteFunc],
      args:args,
      next:next
      });     
    });
}

function _buildRouteStructure(options) {
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

function _buildRoutePath(params, RouteStructure) {
  var path = '';
  for (var index in RouteStructure) {       
    path+= '/'+params[RouteStructure[index]];
  }
  return(path);
}

//require and run the appropriate function
function _routa(options) {
  try {
    require(options.route)[options.func].apply(this, options.args);
  } catch (e) {        
    options.next();   
  } 
}

