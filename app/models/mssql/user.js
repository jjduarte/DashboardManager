    'use strict';
    var customDataTypes = require('../../../orm/custom-data-types'),
        models  = require('../../models/mssql'), 
        md5 = require('md5');

    module.exports = function(sequelize, DataTypes) {
      var User = sequelize.define('User', {
          UserId: {
              type: DataTypes.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
          },
          ClientId: {
                type: DataTypes.INTEGER
            },
            UserName: {
                type: DataTypes.STRING,
                trim: true
            },
            RoleId: {
                type: DataTypes.UUID,
                trim: true
            },
            CreationDate: {
                type: customDataTypes.DATE2005,
                trim: true
            },
            LastLoginDate: {
                type: customDataTypes.DATE2005,
                trim: true
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                trim: true
            },
            LoginName: {
                type: DataTypes.STRING,
                trim: true
            },
            MaxPasswrdAttempt: {
                type: DataTypes.INTEGER,
                default: 3,
                trim: true
            },
            CurrentPasswrdAttempt: {
                type: DataTypes.INTEGER,
                default: 0,
                trim: true
            },
            HashPassword: {
                type: DataTypes.STRING,
                default: '',
                trim: true
            },
            LastConnectionAttempt: {
                type: customDataTypes.DATE2005,
                trim: true
            },
            EmailUser: {
                type: DataTypes.STRING,
                trim: true
            },
            ClientRestriction: {
                type: DataTypes.STRING,
                trim: true
            },
            Dash_RepId_Cell_1: {
                type: DataTypes.INTEGER,
                references: {
                    // This is a reference to another model
                    model: 'Report',
                    // This is the column name of the referenced model
                    key: 'ReportId'
                }
            },
            Dash_RepId_Cell_2: {
                type: DataTypes.INTEGER,
                references: {
                    // This is a reference to another model
                    model: 'Report',
                    // This is the column name of the referenced model
                    key: 'ReportId'
                }
            },
            Dash_RepId_Cell_3: {
                type: DataTypes.INTEGER,
                references: {
                    // This is a reference to another model
                    model: 'Report',
                    // This is the column name of the referenced model
                    key: 'ReportId'
                }
            },
            Dash_RepId_Cell_4: {
                type: DataTypes.INTEGER,
                references: {
                    // This is a reference to another model
                    model: 'Report',
                    // This is the column name of the referenced model
                    key: 'ReportId'
                }
            },
            SPID: {
                type: DataTypes.INTEGER,
                trim: true
            },
            RoleUser: {
              type: DataTypes.INTEGER,
              trim: true
            },
            ExpirationDate: {
              type: DataTypes.STRING,
              trim: true
            }

        },{
          schema: 'ssrs_c',
          tableName: 'reportusers',
          freezeTableName: true,
          timestamps: false,
          classMethods: {
              authenticate: function(password) {
                  return this.HashPassword === md5(password);
              }
          },
          instanceMethods: {
              authenticate: function(password) {
                  return this.HashPassword === md5(password);
              }
          }
      }),
          Report = sequelize.define('Report', {
              ReportId: {
                  type: DataTypes.INTEGER,
                  allowNull: false,
                  primaryKey: true,
                  autoIncrement: true
              },
              ReportName: {
                  type: DataTypes.STRING
              },
              BISolution: {
                  type: DataTypes.STRING,
                  trim: true
              },
              IsActive: {
                  type: DataTypes.BOOLEAN,
                  trim: true
              },
              URL: {
                  type: DataTypes.STRING,
                  trim: true
              }

          },{
              schema: 'ssrs_c',
              tableName: 'reports',
              freezeTableName: true,
              timestamps: false
          });

        User.hasMany(Report);
      return User;
    };
