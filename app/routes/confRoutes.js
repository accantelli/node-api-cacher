var confdbHelper   = App.helpers('confdbHelper')

var httpOK	= 200;
var httpKO	= 400;

/* return JSON: array of objects
   on error returns HTTP 400 */
exports.list = function list(req, res) {

	confdbHelper.selectAll(function(err, results) {

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

	confdbHelper.selectByKey(key, function(err, result) {
		
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

/* return JSON: object created
   on error returns HTTP 400 */
exports.add = function add(req, res) {

	var data = req.body;

	confdbHelper.insert(data, function(err, newObj) {
		
		if (err) {
			res.status( 400 );
			res.end( JSON.stringify(newObj), 
				'utf-8' );
		}

		res.status( httpOK );
		res.end( JSON.stringify(newObj), 
			'utf-8' );
	});

}

/* return JSON: {"numUpdated" : num}
   on error returns HTTP 400 */
exports.update = function update(req, res) {

	var id   = req.params.id;
	var data = req.body;

	confdbHelper.update(id, data, function(err, num) {
		
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
exports.del = function del(req, res) {

	var id   = req.params.id;

	confdbHelper.del(id, function(err, num) {
		
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

