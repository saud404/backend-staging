const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Expenses = require('./Expenses');
const Project = require('./Projects');
const User = require('./User');

const ProjectExpense = sequelize.define('ProjectExpense', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	budget: {
		type: DataTypes.INTEGER,
		defaultValue: false,
		allowNull: false,
	},
	expense: {
		type: DataTypes.INTEGER,
		defaultValue: false, 
		allowNull: false,
	},
	isVisible: {
		type: DataTypes.INTEGER,
		defaultValue: false, 
		allowNull: false,
	}

});
ProjectExpense.belongsTo(User, {
	foreignKey: 'createdBy',
	targetKey: 'id',
	sourcekey: 'createdBy',
});
ProjectExpense.belongsTo(User, {
	foreignKey: 'updatedBy',
	targetKey: 'id',
	sourcekey: 'updatedBy',
});

ProjectExpense.belongsTo(Project, {
	foreignKey: 'projectId',
	targetKey: 'id',
	sourcekey: 'projectId',
	onDelete: 'CASCADE',
});
ProjectExpense.belongsTo(Expenses, {
	foreignKey: 'expenseId',
	targetKey: 'id',
	sourcekey: 'expenseId',
	onDelete: 'CASCADE',
});
Expenses.hasMany(ProjectExpense, { foreignKey: "expenseId" });


module.exports = ProjectExpense;
