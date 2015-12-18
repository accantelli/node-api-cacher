var async  = require('async');
var http   = require('http');
var https  = require('https');

var confdbHelper     = App.helpers('confdbHelper')
var servicesdbHelper = App.helpers('servicesdbHelper')
var statsdbHelper    = App.helpers('statsdbHelper')
var utils            = App.utils('utils')

var logPrefix = ''

exports.process = function process(req, res) {

	var k = req.query.k;
	console.log( JSON.stringify(req.query) ); 
	for (var el in req.query) {
		console.log( el + '-->' + req.query[el]);
	}

	logPrefix = k+'::';
	
	var done = function(err, result) {
		
		// result from last function calle d
		console.log(logPrefix+'--> final result=' + result);
		console.log(logPrefix+' err? ' + (err) );
		console.log(logPrefix+'');
		
		if (err) 
			return res.status(500).send(err);
		res.status(200).send(result);
	};
	
	// flow

	async.waterfall([
		async.apply(initMap, req),
		retrieveServiceUrl,
		readCache,
		callEndpoint,
		saveCache,
		updateStatistics
	], done);

}

function initMap(req, callback) {
	
	// this map will store parameters 
	// for every further calls
	var map = {
		'cacheObjectFound' : false,
		'cacheObjectKey'   : req.query.k,
		'cacheObjectHash'  : null,
		'cacheObjectSvcUrl': null,
		'cacheObjectValue' : null,
		'requestStartAt'   : new Date().getTime()
	};
	
	console.log(logPrefix+'map'+JSON.stringify(map));
	callback(null, map, req); //...and forward to next callback
};

function retrieveServiceUrl(map, req, callback) {
	console.log(logPrefix+'retrieveServiceUrl:'+JSON.stringify(map)); 
		
	servicesdbHelper.selectByKey(map.cacheObjectKey, function(err, result) {
		
		if (err) {
			console.log("--> Configuration not found for key: " + req.query.k);
			callback(new Error("Configuration not found for key: " + req.query.k));	
		}
		else if (!result || result.length == 0) {
			// TODO
		}
		else
		{
			var url = result[0].value;
			
			var urlPars = [];
			for (var el in req.query) {
				if (url.indexOf('{'+el+'}') > -1) {
					url = utils.replaceAll(url, 
						'{'+el+'}', req.query[el]);
					urlPars.push(req.query[el]);
				}
			}
			
			map.cacheObjectSvcUrl = url;
			map.cacheObjectHash   = utils.generateHash(req.query.k, urlPars);
			callback(null, map); // forward value to next function
		}
		
	});
}

function readCache(map, callback) {
	console.log(logPrefix+'readCache:'+JSON.stringify(map)); 
	
	App.cache.get( map.cacheObjectHash, function( err, value ){
		
		if (err) return callback(err);
		if (value) {
			map.cacheObjectFound = true;
			map.cacheObjectValue = value;
		}
		callback(null, map); // forward value to next function
	});
}
	
function callEndpoint(map, callback) {
	console.log(logPrefix+'callEndpoint:'+JSON.stringify(map)); 
	
	if (map.cacheObjectFound) {
		return callback(null, map); // forward value to next function
	}

	var endpoint = map.cacheObjectSvcUrl;

	if (endpoint.slice(0, "https".length) == "https") {

		https.get(endpoint, function(res) {
			
			var body = '';
			res.setEncoding('utf-8');
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {
				map.cacheObjectValue = body;
				callback(null, map);
			});

		}).on('error', function(e) {
			callback(e, map);
		});

	}
	else if (endpoint.slice(0, "http".length) == "http") {

		http.get(endpoint, function(res) {
			
			var body = '';
			res.setEncoding('utf-8');
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {
				map.cacheObjectValue = body;
				callback(null, map);
			});

		}).on('error', function(e) {
			callback(e, map);
		});

	}
	

}
	
function saveCache(map, callback) {
	console.log(logPrefix+'saveCache:'+JSON.stringify(map)); 
	
	if (map.cacheObjectFound || !map.cacheObjectValue) {
		return callback(null, map);
	}
	
	// save into cache for further reads....
	App.cache.set( map.cacheObjectHash, 
				map.cacheObjectValue, 
				function( err, hasBeenSaved) {
		
		if (err) return callback(err);
		callback(null, map);
	});	

}

function updateStatistics(map, callback) {
	console.log(logPrefix+'updateStatistics:'+JSON.stringify(map)); 

	var timeTaken = 
		new Date().getTime() - (map.requestStartAt == undefined ? 0 : map.requestStartAt);

	statsdbHelper.insertOrUpdate(
		map.cacheObjectKey,
		map.cacheObjectFound,
		timeTaken,
		function(err, result) {
			if (!err) {
				console.log("statistics updated successfully!")
			}
			callback(null, map);
		});
}