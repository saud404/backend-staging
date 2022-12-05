const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Roles = sequelize.define('roles', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: DataTypes.STRING,
});

module.exports = Roles;
