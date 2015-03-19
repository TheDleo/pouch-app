// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pouchApp = angular.module('starter', ['ionic']);

var localDB = new PouchDB("todos");
var remoteDB = new PouchDB("http://130.211.130.95:5984/todos");

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

});


pouchApp.factory("PouchDBListener", ["$rootScope", function($rootScope) {

	localDB.changes([
		continuous: true,
		onChange: function(change) {
			$rootScope.$apply(function() {
				localDB.get(change.id, function(err, doc) {
					$rootScope.$apply(function() {
						if(err) {
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
	]);

}]);