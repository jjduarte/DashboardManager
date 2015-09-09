'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$rootScope', 
	function($scope, $http, $location, Authentication, $rootScope) {
		$scope.authentication = Authentication;


		var init = function () {
			if ($scope.authentication.user){
				document.documentElement.classList.remove('back');
				document.documentElement.classList.add('back-logged');
				$location.path('/dash-home');
			} else {
				$location.path('/');
			}
		};

		// If user is signed in then redirect back home
		if ($scope.authentication.user && $scope.authentication.user === '[user]'){
			$location.path('/');
		}



		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			if ($scope.formulario.$valid){
				$http.post('/auth/signin', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;
					// Initialize template layout
					init();
					// And redirect to the index page
				}).error(function(response) {
					$scope.error = response.message;
					console.log(response.message);
				});
			}
		};

		init();
	}
]);
