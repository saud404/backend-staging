const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Task = require('../models/Task');
const Project = require('../models/Projects');
const User = require('../models/User');

const ProjectTasks = sequelize.define('projectTasks', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	isCompleted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
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
ProjectTasks.belongsTo(Project, {
	foreignKey: 'projectId',
	targetKey: 'id',
	sourcekey: 'projectId',
	onDelete: 'CASCADE',
});
ProjectTasks.belongsTo(Task, {
	foreignKey: 'taskId',
	targetKey: 'id',
	sourcekey: 'taskId',
	onDelete: 'CASCADE',
});

module.exports = ProjectTasks;
