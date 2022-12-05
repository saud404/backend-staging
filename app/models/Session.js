const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../models/User');

const Session = sequelize.define('sessions', {
	sid: {
		// type: DataTypes.STRING,
		// primaryKey: true,
		type: DataTypes.STRING,
		//autoIncrement: true,
		//allowNull: false,
		primaryKey: true,
	},
	// userId: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
	// },
	expires: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	accessToken: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	refreshToken: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
});

Session.belongsTo(User, {
	foreignKey: 'userId',
	targetKey: 'id',
	sourcekey: 'userId',
});
module.exports = Session;
