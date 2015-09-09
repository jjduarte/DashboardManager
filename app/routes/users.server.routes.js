'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);

	// Setting up the users authentication api

	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	//Define routes that is only for Editors users (Master and Administrators)
	app.route('/users')
		.get(users.requiresLogin, users.hasAuthorization, users.list)
		.post(users.requiresLogin, users.hasAuthorization,  users.create);

	app.route('/dash-home')
		.get(users.requiresLogin, users.widget);

	app.route('/users/create')
		.post(users.requiresLogin, users.hasAuthorization,  users.create);

	app.route('/users/:userId')
		.get(users.requiresLogin, users.read)
		.put(users.requiresLogin, users.hasAuthorization, users.update)
		.delete(users.requiresLogin, users.canEdit, users.delete);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);

};
