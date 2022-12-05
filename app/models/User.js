const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
// const Attendance = require('./Attendance');

const User = sequelize.define(
	'users',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		firstName: DataTypes.STRING,
		lastName: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		company: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		code: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		isShown: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		oneSignalId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		wagePerHour: {
			type: DataTypes.INTEGER,
			defaultValue: false,
			allowNull: true,
		}
	},
	{
		indexes: [
			// Create a unique index on email
			{
				unique: true,
				fields: ['email'],
			},
		],
	}
);
// User.associate = (models) => {
// 	User.hasOne(models.Attendance, {
// 		foreignKey: {
// 			name: 'id',
// 			allowNull: true
// 		},
// 		as: 'users'
// 	});
// 	return User;
// };

// User.hasMany(Attendance, {
// 	foreignKey: "id",
// 	sourceKey: Attendance.id,
// });

// User.hasMany(Attendance, {
// 	foreignKey: 'id',
// 	sourceKey: user_id,
// });
module.exports = User;
