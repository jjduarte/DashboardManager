'use strict';

angular.module('users').controller('UsersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Users', 'Master', '$sce',   
	function($scope, $http, $stateParams, $location, Authentication, Users, Master, $sce) {
		$scope.authentication = Authentication;

		// If user is not signed in then redirect back home
		//if (!$scope.user) $location.path('/');

		$scope.create = function() {
			if ($scope.userForm.$valid) {
				// TODO: improve using $resource
				$http.post('/users/create', $scope.credentials).success(function (response) {

					// And redirect to the index page
					$location.path('users');
				}).error(function (response) {
					$scope.error = response.message;
				});
			} else {
				$scope.error = 'Cadastro inválido. Favor, revisar os campos.';
			}
		};


		$scope.remove = function(user, userSelected) {
			$scope.user = Authentication.user;
			if (Authentication.user.RoleUser === 1 ) {
				userSelected.$remove();
				for (var i in $scope.users) {
					if ($scope.users[i] === userSelected) {
						$scope.users.splice(i, 1);
					}
				}
			} else if (Authentication.user.RoleUser === 2) {
				if(Authentication.user.ClientId === userSelected.ClientId) {
					userSelected.$remove();
					for (var j in $scope.users) {
						if ($scope.users[j] === userSelected) {
							$scope.users.splice(j, 1);
						}
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('users');
				});
			}
		};

		$scope.update = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.userSelected);

				user.$update(function(response) {
					$scope.success = true;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		$scope.find = function() {
			$scope.users = Master.query();
		};

		$scope.findOne = function() {
			 $scope.userSelected = Master.get({
				userId: $stateParams.userId
			});
			$scope.user = Authentication.user;
		};

		$scope.getWidgets = function() {
			//get urls and widget´s name 
			$http.get('/dash-home').success(function(response) {

				$scope.widget1 = {};
				$scope.widget2 = {};
				$scope.widget3 = {};
				$scope.widget4 = {};

				$scope.widget1.url = $sce.trustAsResourceUrl('http://wbpreview.com/previews/WB01PF84M/widgets/widget1.html');
				$scope.widget2.url = $sce.trustAsResourceUrl('http://wbpreview.com/previews/WB01PF84M/widgets/widget2.html');
				$scope.widget3.url = $sce.trustAsResourceUrl('http://wbpreview.com/previews/WB01PF84M/widgets/widget3.html');
				$scope.widget4.url = $sce.trustAsResourceUrl('http://wbpreview.com/previews/WB01PF84M/widgets/widget3.html');

				$scope.widget1.name = response[0][0];
				$scope.widget2.name = response[1][0];
				$scope.widget3.name = response[2][0];
				$scope.widget4.name = response[3][0];				

			}).error(function(response) {
				$location.path('/auth/signout');
			});



		};
	}
]);
