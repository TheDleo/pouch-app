// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pouchApp = angular.module('starter', ['ionic']);

var localDB = new PouchDB("todos");
var remoteDB = new PouchDB("http://web:user@danatfh.iriscouch.com/todos");

pouchApp.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
	    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	    // for form inputs)
	    if(window.cordova && window.cordova.plugins.Keyboard) {
	      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	    }
	    if(window.StatusBar) {
	      StatusBar.styleDefault();
	    }
	    localDB.sync(remoteDB, { live : true });
	});
});

pouchApp.controller("PouchController", function($scope, PouchDBListener, $ionicPopup) {

	$scope.todos = [];

	$scope.create = function() {
		$ionicPopup.prompt({
			title: "Enter a new TODO item",
			inputType: "text"
		}).then(function(result) {
			if(result !== "") {
				if ($scope.hasOwnProperty("todos") !== true) {
					$scope.todos = [];
				};
				localDB.post({title: result});
			}
		});
	}

    $scope.$on("add", function(event, todo) {
    	$scope.todos.push(todo);
    });

    $scope.$on("delete", function(event, id) {
    	for (var i = 0; i < $scope.todos; i++) {
    		if($scope.todos[i]._id === id) {
    			$scope.todos.splice(i, 1);
    		}
    	}
    });
});

pouchApp.factory("PouchDBListener", ["$rootScope", function($rootScope) {

	localDB.changes({
		continuous: true,
		onChange: function(change) {
			if(!change.deleted) {
				$rootScope.$apply(function() {
					localDB.get(change.id, function(err, doc) {
						$rootScope.$apply(function() {
							if (err) {
								console.error(err);
							}
							$rootScope.$broadcast("add", doc);
						});
					});
				});
			} else {
				$rootScope.$apply(function() {
					$rootScope.$broadcast("delete", change.id);
				});
			}
		}
	});

	return true;

}]);
