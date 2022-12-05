'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const Attendance = sequelize.define(
  'attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  hoursWorked: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: DataTypes.STRING,
  present: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  late: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

});
Attendance.belongsTo(User, {
  foreignKey: 'user_id',
  sourceKey: User.id,
});

User.hasMany(Attendance, {
  foreignKey: "id",
  sourceKey: User.id,
});


module.exports = Attendance;
