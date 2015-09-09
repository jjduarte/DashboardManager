'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page1
								document.documentElement.classList.remove('back-logged');
								document.documentElement.classList.add('back');
								$location.path('signin');
								break;
							case 403:
								$location.path('/');
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);


