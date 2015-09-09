'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	_ = require('lodash'),
	models  = require('../../app/models/mssql'),
	User = models.User,
	sequelize  = models.sequelize,
	md5 = require('md5');


module.exports = function() {
	// Use local strategyBI @Login, @Pwd
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			sequelize.query('EXEC SSRS_C.P_LoginBI @Login = "' + username + '", @Pwd = "' + md5(password) + ' ";').spread(function (res) {
				if (res[0]['']) {
					return done(null, false, {
						message: res[0]['']
					});
				}
				var userLogged = res[0];
				userLogged.HashPassword = md5(password);
				var user = User.build(userLogged);
				user.Dash_RepId_Cell_1 = userLogged.Dash_RepId_Cell_1;
				user.Dash_RepId_Cell_2 = userLogged.Dash_RepId_Cell_2;
				user.Dash_RepId_Cell_3 = userLogged.Dash_RepId_Cell_3;
				user.Dash_RepId_Cell_4 = userLogged.Dash_RepId_Cell_4;

				if (!user) {
					return done(null, false, {
						message: 'Usuario desconhecido ou senha invalida'
					});
				}
				if (!user.authenticate(password)) {
						return done(null, false, {
						message: 'Usuario desconhecido ou senha invalida'
					});
				}
				return done(null, user);
			}).catch(function(err) {
				console.log(err);
				done(err);
			});
		}
	));
};
