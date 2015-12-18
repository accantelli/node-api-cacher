var appControllers = angular.module('appControllers', []);

appControllers.controller('IntroCtrl', function($scope, $http) {
	//TODO
	toast("Welcome!", "info");

});

/** 
 * Configuration controller
 **/
appControllers.controller('ConfigurationCtrl', function($scope, $http) {

	console.log('controller called...');

	$scope.confs	   = {}

	console.log('gathering infos...');

	$http.get('/conf/list').success( function(response) {
	  $scope.confs = response; 
	});


	$scope.save = function (data, id) {
		
		console.log("saving: " + id);
		console.log("saving: " + JSON.stringify(data));

		if (id) {
			// update existing
			$http.put('/conf/update/'+id, data)
				.success( function(response) {
					if (response.numUpdated > 0) {
						toast("Item successfully updated ;)", "success");
					}
					else {
						toast("Ops, Item not found", "warning");
					}
					
					$http.get('/conf/list').success( function(response) {
						$scope.confs = response; 
					});
			});
		}
		else {
			// add new element
			$http.post('/conf/add', data).success( function(response) {
				toast('Item successfully added', "success");

				$http.get('/conf/list').success( function(response) {
				  $scope.confs = response; 
				});

			});
		}
		
	};

	$scope.remove = function (data) {

		console.log("remove: " + JSON.stringify(data));

		$http.delete('/conf/del/'+data._id)
			.success( function(response) {

			var index = $scope.confs.indexOf(data);
			$scope.confs.splice(index, 1);
			
			if (response.numDeleted > 0) {
				toast("Done! deleted!", "success");
			}
			else {
				toast("Ops, Item not found", "warning");
			}

		});

	};

	$scope.addRowElement = function() {
		$scope.inserted = {
			id: '',
			key: '',
			value: '' 
		};
		$scope.confs.push($scope.inserted);
	};

	$scope.checkKey = function (data, value) {
		console.log("value="+value)
		console.log("data="+JSON.stringify(data))
		if (data == undefined || data == "")
			return "cannot be empty!";
	}

	$scope.checkValue = function (data, value) {
		if (data == undefined || data == "")
			return "cannot be empty!";
	}		

});


/** 
 * Services controller
 **/
appControllers.controller('ServicesCtrl', function($scope, $http) {

	console.log('controller called...');

	$scope.services	   = {}

	console.log('gathering infos...');

	$http.get('/services/list').success( function(response) {
	  $scope.services = response; 
	});

	$scope.save = function (data, id) {
		
		console.log("saving: " + id);
		console.log("saving: " + JSON.stringify(data));

		if (id) {
			// update existing
			$http.put('/services/update/'+id, data)
				.success( function(response) {
					if (response.numUpdated > 0) {
						toast("Item successfully updated ;)", "success");
					}
					else {
						toast("Ops, Item not found", "warning");
					}
					
					$http.get('/services/list').success( function(response) {
						$scope.services = response; 
					});
			});
		}
		else {
			// add new element
			$http.post('/services/add', data).success( function(response) {
				toast('Item successfully added', "success");

				$http.get('/services/list').success( function(response) {
				  $scope.services = response; 
				});

			});
		}
		
	};

	$scope.remove = function (data) {

		console.log("remove: " + JSON.stringify(data));

		$http.delete('/services/del/'+data._id)
			.success( function(response) {

			var index = $scope.services.indexOf(data);
			$scope.services.splice(index, 1);
			
			if (response.numDeleted > 0) {
				toast("Done! deleted!", "success");
			}
			else {
				toast("Ops, Item not found", "warning");
			}

		});

	};
    
    $scope.addRowElement = function() {
		$scope.inserted = {
			id: '',
			key: '',
			type: 'http',
			value: '',
			resultType: 'auto',
			ttl: '' 
		};
		$scope.services.push($scope.inserted);
	};

	$scope.checkKey = function (data, value) {
		console.log("value="+value)
		console.log("data="+JSON.stringify(data))
		if (data == undefined || data == "")
			return "cannot be empty!";
	}

	$scope.checkValue = function (data, value) {
		if (data == undefined || data == "")
			return "cannot be empty!";
	}		

});


/** 
 * Statistics controller
 **/
appControllers.controller('StatisticsCtrl', function($scope, $http) {
	
	$scope.statistics	   = {}
	
	$scope.data 	= [];
	$scope.labels 	= [];
	$scope.series 	= ['w cache', 'w/o cache'];

	console.log('gathering infos...');

	$http.get('/statistics/list').success( function(response) {
		$scope.statistics = response; 

		for(var i=0; i<4; i++) {
			$scope.data[i] = [];
		}

		for(var i=0; i<$scope.statistics.length; i++) {
			$scope.labels.push($scope.statistics[i].key)
			
			$scope.data[0].push($scope.statistics[i].cacheAvgTime)
			$scope.data[1].push($scope.statistics[i].noCacheAvgTime)
		}
	});

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};

	$scope.reset = function (stat) {
		$http.put('/statistics/reset/'+stat.key)
			.success( function(response) {
				
				console.log("response: " + JSON.stringify(response));
				if (response) {
					toast("Done! Statistics have been successfully reset!", "success");
				}
				else {
					toast("Ops, Something went wrong...", "warning");
				}

				// reload data: TODO: export as a service
				$http.get('/statistics/list').success( function(response) {
					$scope.statistics = response; 

					for(var i=0; i<4; i++) {
						$scope.data[i] = [];
					}

					for(var i=0; i<$scope.statistics.length; i++) {
						$scope.labels.push($scope.statistics[i].key)
						
						$scope.data[0].push($scope.statistics[i].cacheBestTime)
						$scope.data[1].push($scope.statistics[i].cacheAvgTime)
						$scope.data[2].push($scope.statistics[i].noCacheBestTime)
						$scope.data[3].push($scope.statistics[i].noCacheAvgTime)
					}
				});

		});
	};

});

/** 
 * Statistic details controller
 **/
appControllers.controller('StatisticsDetailCtrl', function($scope, $http, $routeParams) {
		
	$scope.service	       = {}
	$scope.statistic	   = {}
	$scope.firstDate       = "";
	$scope.lastDate        = "";

	console.log('gathering infos for key:'+$routeParams.key);

	$http.get('/services/get/'+$routeParams.key).success( function(response) {
	  $scope.service = response; 
	});

	$http.get('/statistics/get/'+$routeParams.key).success( function(response) {
	  $scope.statistic = response;
	  $scope.firstDate = timestamp2Date(response[0].firstCallDate);
	  $scope.lastDate  = timestamp2Date(response[0].lastCallDate);
	});


	// TODO: load data!!!
	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
		[28, 48, 40, 19, 86, 27, 90],
		[28, 48, 40, 19, 86, 27, 90]
	];

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};

});

/** 
 * Run/Tester controller
 **/
appControllers.controller('RunCtrl', function($scope, $http, $window) {

	console.log('controller called...');

	$scope.services	= {}
	$scope.runUrl = "";
	$scope.serviceUrl = "";

	console.log('gathering infos...');

	$http.get('/services/list').success( function(response) {
	  $scope.services = response; 
	});

	$scope.onServiceSelection = function (service) {
		$scope.serviceUrl = service.value;
		$scope.runUrl = "/proxy?k="+service.key;
		
		var pars = getParameters($scope.serviceUrl);
		for (var i=0; i<pars.length; i++) {
			$scope.runUrl += "&" + pars[i] + "=XXX";
		}

	};

	$scope.run = function () {
		$window.open($scope.runUrl, 'target=_blank');
	};	

});
