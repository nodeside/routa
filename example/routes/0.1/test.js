exports.test = function(req,res,next,routa) {
	//here is your db
	var db  = routa.db;
	routa.send({success:true, query:req.query});
}

