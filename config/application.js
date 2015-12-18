var env 		= process.env.NODE_ENV || 'development'
var packageJson = require('../package.json')
var path		= require('path')
var express		= require('express')
var bodyParser  = require('body-parser')

var ncache		= require('node-cache')

console.log('loading App in ' + env + ' mode.')

var nedb        = require('nedb')
var confDbUrl   = process.env.CONF_DB_URL || 'storage/configuration.json'
var svcsDbUrl   = process.env.SVCS_DB_URL || 'storage/services.json'
var statDbUrl   = process.env.STAT_DB_URL || 'storage/statistics.json'
console.log('loading database ' + confDbUrl + ', ' + svcsDbUrl + ', ' + statDbUrl)

// init 
var cache  = new ncache();
var confdb 	   = new nedb({ filename: confDbUrl, autoload: true })
var servicesdb = new nedb({ filename: svcsDbUrl, autoload: true })
var statdb     = new nedb({ filename: statDbUrl, autoload: true })

global.App = {

	env: 		env, 
	app: 		express(),
	port: 		process.env.PORT || 3000,
	version:  	packageJson.version,
	root: 		path.join(__dirname, '..'),
	cache: 		cache,

	start: function() {
		if (!this.started) {
			this.started = true;
			this.app.listen(this.port);
			console.log("Running App Version " + App.version + 
				" on port " + App.port + " in " + App.env + " mode")
		}
	},

	appPath: function(path) {
    	return this.root + '/' + path
	},
	
	require: function(path) {
		return require(this.appPath(path))
	},

  	route: function(path) {
    	return this.require("app/routes/" + path)
	},

	utils: function(path) {
    	return this.require("app/utils/" + path)
  	},

  	helpers: function(path) {
    	return this.require("app/helpers/" + path)
  	},

  	confdb: 	confdb,
  	servicesdb: servicesdb,
  	statdb: 	statdb
}

// Express setup
App.app.use(express.static(App.appPath('public')));
App.app.use('/node_modules', 	 express.static(App.appPath('node_modules')));
App.app.use('/bower_components', express.static(App.appPath('bower_components')));

App.app.use(bodyParser.json());
App.app.use(bodyParser.urlencoded({extended:true})); 

App.require('config/routes')(App.app)


