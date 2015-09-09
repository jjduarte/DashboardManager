'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	path = require('path'),
	config = require('./config'),
	models  = require('../app/models/mssql'),
	User = models.User,
	Sequelize = models.sequelize,
	Report = models.Report;
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.UserId);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		Sequelize.query('SELECT [User].[UserId], [User].[ClientId], [User].[UserName], [User].[RoleId], [User].[CreationDate], [User].[LastLoginDate], [User].[isActive], [User].[LoginName], [User].[MaxPasswrdAttempt], [User].[CurrentPasswrdAttempt], [User].[HashPassword], [User].[LastConnectionAttempt], [User].[EmailUser], [User].[ClientRestriction], [User].[SPID], [User].[RoleUser], [R1].[ReportId] AS [R1.ReportId], [R1].[ReportName] AS [R1.ReportName], [R1].[BISolution] AS [R1.BISolution], [R1].[IsActive] AS [R1.IsActive], [R1].[URL] AS [Dash_RepId_Cell_1], [R2].[ReportId] AS [R2.ReportId], [R2].[ReportName] AS [R2.ReportName], [R2].[BISolution] AS [R2.BISolution], [R2].[IsActive] AS [R2.IsActive], [R2].[URL] AS [Dash_RepId_Cell_2], [R3].[ReportId] AS [R3.ReportId], [R3].[ReportName] AS [R3.ReportName], [R3].[BISolution] AS [R3.BISolution], [R3].[IsActive] AS [R3.IsActive], [R3].[URL] AS [Dash_RepId_Cell_3], [R4].[ReportId] AS [R4.ReportId], [R4].[ReportName] AS [R4.ReportName], [R4].[BISolution] AS [R4.BISolution], [R4].[IsActive] AS [R4.IsActive], [R4].[URL] AS [Dash_RepId_Cell_4] FROM [ssrs_c].[reportusers] AS [User] LEFT OUTER JOIN [ssrs_c].[reports] R1 ON [User].[Dash_RepId_Cell_1] = R1.[ReportId] AND [R1].[IsActive] = 1 LEFT OUTER JOIN [ssrs_c].[reports] R2 ON [User].[Dash_RepId_Cell_2] = R2.[ReportId] AND [R2].[IsActive] = 1 LEFT OUTER JOIN [ssrs_c].[reports] R3 ON [User].[Dash_RepId_Cell_3] = R3.[ReportId] AND [R3].[IsActive] = 1 LEFT OUTER JOIN [ssrs_c].[reports] R4 ON [User].[Dash_RepId_Cell_4] = R4.[ReportId] AND [R4].[IsActive] = 1 WHERE [User].[UserId] = ' + id + ';')
			.then(function(data) {
				var user = {};
				user = data['0']['0'];
				user.HashPassword = '';
				done(null, user);
			}).catch(function(err) {
				done(err, null);
			});
	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};
