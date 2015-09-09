'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	passport = require('passport'),
	models  = require('../../models/mssql'),
	session = require('express-session'),
	MSSQLStore = require('connect-mssql')(session),
	sequelize  = models.sequelize,
	User = models.User;


/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {

	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.HashPassword = undefined;
			user.salt = undefined;
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					req.session.user = user;
					var userId = user.UserId;
					var sid = req.session.id;

					sequelize.query("DELETE FROM [sessions] WHERE [sessions].[UserId] = "+ userId + ";")
						.then(function(resp) {
							sequelize.query("UPDATE [sessions] SET [sessions].[UserId] = "+ userId + " WHERE [sessions].[sid] = '" + sid +"' ;")
								.then(function(data) {
									console.log('Session updated');
									return res.json(user);
								}).catch(function(err) {
									console.log(err);
								});
						}).catch(function(err) {
							console.log(err);
						});



				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.session.user = null;
	req.session.destroy();
	req.logout();
	res.redirect('/');
};
