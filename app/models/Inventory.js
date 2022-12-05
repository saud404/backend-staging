const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Inventory = sequelize.define('inventory', {
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
	noOfAvailable: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	noOfOccupied: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	parentId: {
		type: DataTypes.INTEGER,
		defaultValue: null,
		allowNull: true,
	},
	isVisible: DataTypes.BOOLEAN,
});

module.exports = Inventory;
