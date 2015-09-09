/**
 * Created by jduarte on 7/25/15.
 */
'use strict';
var customDataTypes = require('../../../orm/custom-data-types'),
    models  = require('../../models/mssql');

module.exports = function(sequelize, DataTypes) {
        var Report = sequelize.define('Report', {
            ReportId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
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

    return Report;
};
