'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	chalk = require('chalk'),
	sql = require('mssql');
var env = process.env.NODE_ENV || 'development';



/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */


// Init the express application
var app = require('./config/express')();

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Portal-BI application started on port ' + config.port);
