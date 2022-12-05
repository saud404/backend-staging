const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Task = require('../models/Task');
const TutorialMedia = require('../models/TutorialMediaGallery');

const BridgeTaskMedia = sequelize.define('BridgeTaskMedia', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	isVisible: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
});
// ProjectTasks.belongsTo(User, {
// 	foreignKey: 'userId',
// 	targetKey: 'id',
// 	sourcekey: 'userId',
// });
BridgeTaskMedia.belongsTo(TutorialMedia, {
	foreignKey: 'mediaId',
	targetKey: 'id',
	sourcekey: 'mediaId',
	onDelete: 'CASCADE',
});
BridgeTaskMedia.belongsTo(Task, {
	foreignKey: 'taskId',
	targetKey: 'id',
	sourcekey: 'taskId',
	onDelete: 'CASCADE',
});

module.exports = BridgeTaskMedia;
