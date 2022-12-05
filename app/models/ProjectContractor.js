const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Projects = require('../models/Projects');
const ProjectTask = require('../models/ProjectTask');
const User = require('../models/User');
const ProjectContractor = sequelize.define('ProjectContractor', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	jobCompletion: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	jobStatus: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
});
ProjectContractor.belongsTo(Projects, {
	foreignKey: 'projectId',
	targetKey: 'id',
	sourcekey: 'projectId',
});
ProjectContractor.belongsTo(ProjectTask, {
	foreignKey: 'projecttaskId',
	targetKey: 'id',
	sourcekey: 'projecttaskId',
});
ProjectContractor.belongsTo(User, {
	foreignKey: 'projectContractorId',
	targetKey: 'id',
	sourcekey: 'projectContractorId',
});
// User.belongsTo(ProjectContractor);
// ProjectContractor.hasMany(User);
module.exports = ProjectContractor;
