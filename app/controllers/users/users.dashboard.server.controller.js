'use strict';
/**
 * Created by joao.lucio on 09/06/2015.
 */

var errorHandler = require('../errors.server.controller'),
	_ = require('lodash'),
	models  = require('../../models/mssql'),
	customUtils  = require('../../../utils/custom-utils'),
 	User = models.User,
 	Report = models.Report,
	sequelize  = models.sequelize,
 	md5 = require('md5');
/**
 * Create user
 */
exports.create = function(req, res) {
	var clientId = null;
	var displayName = req.body.firstName + ' ' + req.body.lastName;
	// Add missing user fields



	if( req.user.RoleUser === 1 ){
		clientId = req.body.clientId;
	} else if ( req.user.RoleUser ===2 ){
		clientId = req.user.ClientId;
	}

	var dataExp = 'null';
	if(req.body.dataExpiracao){
		dataExp =" '" + customUtils.setCreationDate(new Date(req.body.dataExpiracao)) + "' ";
	}

	sequelize.query("EXEC [SSRS_C].[P_CreateUser] @ClientId = "+ clientId+", @UserName = '"+ displayName + "', @LoginName = '" + req.body.loginName+"', @MaxPasswrdAttempt = 3, @HashPassword = '"+md5(req.body.password)+"', @EmailUser = '"+req.body.emailUser+"', @RoleUser = "+req.body.RoleUser+", @ExpirationDate = "+dataExp+", @LanguageId = 1, @Comment = 'First user created with [SSRS_C].[P_CreateUser] stored procedure'")
		.spread(function (data) {
			if (!data["0"].Flag) {
				throw new Error(data["0"].Message);
			} else {
				res.json(req.user);
			}
		}).catch(function(err) {
			if (err) {
				return res.status(400).send({
					message: err.message
				});
			}
		});
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
	res.json(req.user);
};

/**
 * Update a user
 */
exports.update = function(req, res) {
	var userToUpdate = req.body;
	var password = '';

	User.findOne({where:{UserId: userToUpdate.UserId}}).then(function (user) {
		if (!user) return new Error('Falha ao carregar usuário ' + userToUpdate.UserId);
		password = user.HashPassword;


		if(userToUpdate.HashPassword !== password){
			userToUpdate.HashPassword = md5(userToUpdate.HashPassword);
		}

		var dataExp = null;
		if(req.body.ExpirationDate){
			dataExp = customUtils.setCreationDate(new Date(req.body.ExpirationDate));
		}

		User.update(
			{
				UserName: userToUpdate.UserName,
				LoginName: userToUpdate.LoginName,
				EmailUser: userToUpdate.EmailUser,
				RoleUser: userToUpdate.RoleUser,
				HashPassword: userToUpdate.HashPassword,
				ExpirationDate:dataExp
			},
			{
				where: { UserId : userToUpdate.UserId }
			})
			.then(function (isInserted) {
				if(isInserted[0]) {
					var user = userToUpdate;
					res.json(user);
				}
			})
			.catch(function (err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
			});

	}).catch(function(err) {
		if (err) return new Error('Falha ao carregar usuário ' + userToUpdate.UserId);
	});


};

/**
 * Delete an user
 */
exports.delete = function(req, res) {
	var user = req.user;

	models.User.findOne({where:{UserId: user.UserId}}).then(function(userToRemove) {
		userToRemove.destroy().then(function() {
			var userRemoved = user;
			res.json(userRemoved);
		});
	})
	.catch(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
};

/**
 * List of Users
 */
exports.list = function(req, res) {
	if(req.user.RoleUser !== 1){
		models.User.findAll({where:{ClientId: req.user.ClientId}}).then(function(users) {
			users.forEach(function(user) {
				var index = users.indexOf(user);
				user.HashPassword = '';
				if(user.UserId === req.user.UserId){
					users.splice(index, 1);
				}
			});
			res.json(users);
		}).catch(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
		});
	} else {
		models.User.findAll().then(function(users) {
			users.forEach(function(user) {
				var index = users.indexOf(user);
				user.HashPassword = '';
				if(user.UserId === req.user.UserId){
					users.splice(index, 1);
				}
			});
			res.json(users);
		}).catch(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
		});
	}
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	models.User.findOne({where:{UserId: id}}).then(function (user) {
		if (!user) return next(new Error('Falha ao carregar usuário ' + id));
		if(user.ExpirationDate !== null) {
			user.ExpirationDate = customUtils.formatDate(user.ExpirationDate);
		}
		req.user = user;
		next();
	}).catch(function(err) {
			if (err) return next(err);
	});
};

/**
 * User authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	if ( req.user.RoleUser ===  3) {
		return res.status(403).send({
			message: 'Usuário não autorizado'
		});
	}
	next();
};

/**
 * User authorization middleware
 */
exports.canEdit = function(req, res, next) {
	var id = req.session.passport.user;

	User.findOne({where:{UserId: id}}).then(function (userAdmin) {
		if (!userAdmin) return next(new Error('Falha ao carregar usuário de id: ' + id));

		if ( userAdmin.ClientId !== req.user.ClientId) {
			if(userAdmin.RoleUser !==  1){
				return res.status(403).send({
					message: 'Usuário não autorizado'
				});
			} else {
				next();
			}
		} else {
			next();
		}
	}).catch(function(err) {
		if (err) return next(err);
	});
};


/**
 * Send User
 */
exports.widget = function(req, res) {

	var widgets = {};

	User.findOne({where:{UserId: req.user.UserId}})
	.then(function (user) {
		var dash = [];
		dash.push(user.Dash_RepId_Cell_1);
		dash.push(user.Dash_RepId_Cell_2);
		dash.push(user.Dash_RepId_Cell_3);
		dash.push(user.Dash_RepId_Cell_4);

		models.Report.findAll({where:{ ReportId: {in: dash}}})
		.then(function(reports) {
			reports.forEach(function(report) {
				if(report.ReportId === dash[0]){
					widgets[0] = [report.ReportName, report.URL];
				} else if(report.ReportId === dash[1]){
					widgets[1] = [report.ReportName, report.URL];
				} else if(report.ReportId === dash[2]){
					widgets[2] = [report.ReportName, report.URL];
				} else if(report.ReportId === dash[3]){
					widgets[3] = [report.ReportName, report.URL];
				}
			});
			return res.json(widgets);
		}).catch(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
		});
	}).catch(function(err) {
		if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
	});


};
