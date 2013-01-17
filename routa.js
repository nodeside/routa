var config = require('./config');
var root = config.root;

exports.createRoute = function (app, options) {
  var route = options.route;
  
  app.get(options.route, function(req, res, next) {    
    processRequest(req,res,next,options);
  });

  app.post(options.route, function(req, res, next) {    
    processRequest(req,res,next, options);
  });
}

function processRequest(req,res,next, options) {
  var RouteFunc = options.func;
  var RouteStructure = _buildRouteStructure(options);

  var query = req.query;                         
  var args = new Array(req, res, next, {    
    db:(options.db)?(options.db):null,
    kue:(options.kue)?(options.kue):null,
    query:query,
    vars:(options.vars)?(options.vars):null,
    send: function(data) {
      if (query.format == 'xml') {
        res.header('Content-Type', 'text/xml');
        res.header('Charset', 'utf-8');
        res.send(JSON2XMLParser(data,'data'));        
      } else  {
        res.json(data);
      }
    }
  });
  _routa({
    route:root+_buildRoutePath(req.params, RouteStructure),
    func:req.params[RouteFunc],
    args:args,
    next:next
  }); 
}

function JSON2XMLParser(json, wrapper) {
  var out = "";
  if (wrapper) {
    out += '<'+wrapper+'>';
  }
  for (var key in json) {
    if (json[key].constructor == Array) {
      for (var i in json[key]) {
        out += '<'+key+'>';
        out += JSON2XMLParser(json[key][i]);
        out += '</'+key+'>';
      }
    } else if (json[key].constructor == Object) {
      out += JSON2XMLParser(json[key]);
    } else {
      out += '<'+key+'>';
      out+=json[key];
      out += '</'+key+'>';
    } 
  }
  if (wrapper) {
    out += '</'+wrapper+'>';
  }

  console.log(out);
  return out;
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

