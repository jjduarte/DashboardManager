'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var config    = require('../../../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, {timezone: '+08:00', dialect: config.dialect, host: config.host});
var dbmssql        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    dbmssql[model.name] = model;
  });

Object.keys(dbmssql).forEach(function(modelName) {
  if ('associate' in dbmssql[modelName]) {
    dbmssql[modelName].associate(dbmssql);
  }
});

dbmssql.sequelize = sequelize;
dbmssql.Sequelize = Sequelize;

module.exports = dbmssql;
