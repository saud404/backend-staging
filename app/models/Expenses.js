const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Expenses = sequelize.define('Expense', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: DataTypes.STRING,
	isVisible: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
});

module.exports = Expenses;
