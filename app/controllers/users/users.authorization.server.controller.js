'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	models  = require('../../models/mssql'),
	User = models.User;

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {

	models.User.findOne({where:{UserId: id}}).then(function (user) {
		if (!user) return next(new Error('Falha ao carregar o usuario ' + id));
		req.user = user;
		next();
	}).catch(function(err) {
		if (err) return next(err);
	});

};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'Sessão encerrada. Favor logar novamente.'
		});
	}
	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'Usuario nao autorizado'
				});
			}
		});
	};
};
