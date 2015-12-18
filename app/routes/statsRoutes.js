var statsdbHelper   = App.helpers('statsdbHelper')

var httpOK	= 200;
var httpKO	= 400;

/* return JSON: array of objects
   on error returns HTTP 400 */
exports.list = function list(req, res) {

	statsdbHelper.selectAll(function(err, results) {

		if (err) {
			res.status( 400 );
			res.end( JSON.stringify(results), 
				'utf-8' );
		}

		res.status( httpOK );
		res.end( JSON.stringify(results), 
			'utf-8' );
	});

}

/* return JSON: array of objects
   on error returns HTTP 400 */
exports.getByKey = function getByKey(req, res) {

	var key   = req.params.key;

	statsdbHelper.selectByKey(key, function(err, result) {
		
		if (err) {
			res.status( 400 );
			res.end( JSON.stringify(result), 
				'utf-8' );
		}

		res.status( httpOK );
		res.end( JSON.stringify(result), 
			'utf-8' );

	});

}

/* return JSON: array of objects
   on error returns HTTP 400 */
exports.resetByKey = function resetByKey(req, res) {

	var key   = req.params.key;

	statsdbHelper.reset(key, function(err, num) {
		
		var out = {"numUpdated" : num}

		if (err) {
			res.status( 400 );
			res.end( JSON.stringify(out), 
				'utf-8' );
		}

		res.status( httpOK );
		res.end( JSON.stringify(out), 
			'utf-8' );

	});

}


/* return JSON: {"numDeleted" : num}
   on error returns HTTP 400 */
exports.deleteById = function deleteById(req, res) {

	var id   = req.params.id;

	statsdbHelper.del(id, function(err, num) {
		
		var out = {"numDeleted" : num}

		if (err) {
			res.status( 400 );
			res.end( JSON.stringify(out), 
				'utf-8' );
		}

		res.status( httpOK );
		res.end( JSON.stringify(out), 
			'utf-8' );
	});

}

