const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../models/User');
const ContractorBridgeLogo = sequelize.define('ContractorBridgeLogo', {
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
	// contractorId: DataTypes.INTEGER,
	// contractorAssociatedId: {
	// 	type: DataTypes.INTEGER,
	// 	allowNull: false,
	// },
});
ContractorBridgeLogo.belongsTo(User, {
	foreignKey: 'contractorId',
	// targetKey: 'contractorId',
	sourcekey: 'id',
	onDelete: 'CASCADE',
});
ContractorBridgeLogo.belongsTo(User, {
	foreignKey: 'contractorAssociatedId',
	// targetKey: 'contractorId',
	sourcekey: 'id',
	onDelete: 'CASCADE',
});
module.exports = ContractorBridgeLogo;
