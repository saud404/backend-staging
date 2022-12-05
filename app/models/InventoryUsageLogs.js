const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Project = require('../models/Projects');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const InventoryUsageLogs = sequelize.define('inventoryusagelogs', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	status: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isVisible: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
});
InventoryUsageLogs.belongsTo(Project, {
	foreignKey: 'projectId',
	targetKey: 'id',
	sourcekey: 'projectId',
	onDelete: 'CASCADE',
});
InventoryUsageLogs.belongsTo(User, {
	foreignKey: 'userId',
	targetKey: 'id',
	sourcekey: 'userId',
	onDelete: 'CASCADE',
});
InventoryUsageLogs.belongsTo(Inventory, {
	foreignKey: 'inventoryId',
	targetKey: 'id',
	sourcekey: 'inventoryId',
	onDelete: 'CASCADE',
});
InventoryUsageLogs.belongsTo(Inventory, {
	foreignKey: 'subinventoryId',
	targetKey: 'id',
	sourcekey: 'subinventoryId',
	onDelete: 'CASCADE',
});
module.exports = InventoryUsageLogs;
