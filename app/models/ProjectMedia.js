const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Project = require('../models/Projects');
const ProjectMedia = sequelize.define('ProjectMedia', {
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
	isVisible: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
});
ProjectMedia.belongsTo(Project, {
	foreignKey: 'projectId',
	targetKey: 'id',
	sourcekey: 'projectId',
	onDelete: 'CASCADE',
});

// User.belongsTo(ProjectContractor);
// ProjectContractor.hasMany(User);
module.exports = ProjectMedia;
