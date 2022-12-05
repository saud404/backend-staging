const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../models/User');
const Notification = sequelize.define('notification', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	content: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
Notification.belongsTo(User, {
	foreignKey: 'userId',
	targetKey: 'id',
	sourcekey: 'userId',
});
module.exports = Notification;
