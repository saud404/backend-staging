const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Project = sequelize.define('project', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	projectOwnerFirstName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	projectOwnerLastName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	projectOwnerPhone: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	street: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	city: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	state: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	image: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	location: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	message: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isVisible: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
});

module.exports = Project;
