'use strict';

//Master service used for communicating with the users REST endpoints
angular.module('users').factory('Master', ['$resource',
	function($resource) {
		return $resource('users/:userId', {
			userId: '@UserId'
		}, {
			update: { method: 'PUT'}
		});
	}
]);
