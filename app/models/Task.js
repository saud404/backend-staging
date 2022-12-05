const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Tasks = sequelize.define('task', {
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

module.exports = Tasks;
