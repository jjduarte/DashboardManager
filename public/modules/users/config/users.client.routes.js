'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/');

		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('listUsers', {
			url: '/users',
			templateUrl: 'modules/users/views/master/list-user.client.view.html'
		}).
		state('createUsers', {
			url: '/users/create',
			templateUrl: 'modules/users/views/master/create-user.client.view.html'
		}).
		state('viewUsers', {
			url: '/users/:userId',
			templateUrl: 'modules/users/views/master/view-user.client.view.html'
		}).
		state('editUsers', {
			url: '/users/:userId/edit',
			templateUrl: 'modules/users/views/master/edit-user.client.view.html'
		}).
		state('dash-home', {
			url: '/dash-home',
			templateUrl: 'modules/users/views/dashboard/dashboard-home.view.html'
		});

	}
]);
