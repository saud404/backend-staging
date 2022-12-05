const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Task = require('../models/Task');
// const User = require('../models/User');
const User = require('../models/User');

const CustomerTasks = sequelize.define('customertasks', {
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
CustomerTasks.belongsTo(User, {
	foreignKey: 'userId',
	targetKey: 'id',
	sourcekey: 'userId',
});
// ProjectTasks.belongsTo(Project, {
// 	foreignKey: 'projectId',
// 	targetKey: 'id',
// 	sourcekey: 'projectId',
// 	onDelete: 'CASCADE',
// });
CustomerTasks.belongsTo(Task, {
	foreignKey: 'taskId',
	targetKey: 'id',
	sourcekey: 'taskId',
	onDelete: 'CASCADE',
});

module.exports = CustomerTasks;
