//'use strict';

var mainApp = angular.module("mainApp", [
	"ngRoute",
	"appControllers",
	"xeditable",
	"chart.js"
]);

mainApp.run(function($rootScope) {
	// load global setting
	$rootScope.Global=Global;
});

mainApp.config(['$routeProvider', 
			function ($routeProvider) {
	
	$routeProvider.
		when('/configuration', {
			templateUrl: 'views/conf.html',
			controller : 'ConfigurationCtrl'
		}).
		when('/services', {
			templateUrl: 'views/services.html',
			controller : 'ServicesCtrl'
		}).
		when('/run', {
			templateUrl: 'views/run.html',
			controller : 'RunCtrl'
		}).
		when('/statistics', {
			templateUrl: 'views/statistics.html',
			controller : 'StatisticsCtrl'
		}).
		when('/statistics/:key', {
			templateUrl: 'views/statistics-detail.html',
			controller : 'StatisticsDetailCtrl'
		}).
		otherwise({
			templateUrl: 'views/intro.html',
			controller : 'IntroCtrl'
		});
}]);
