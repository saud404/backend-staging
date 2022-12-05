const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const TutorialMedia = sequelize.define('TutorialMediaGallery', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	image: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	isVisible: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
});

// User.belongsTo(ProjectContractor);
// ProjectContractor.hasMany(User);
module.exports = TutorialMedia;
