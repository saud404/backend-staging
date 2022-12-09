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
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  hoursWorked: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  name: DataTypes.STRING,
  present: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  late: {
    type: DataTypes.BOOLEAN,
    // allowNull: false,
  },
  // user_id: {
  //   type: DataTypes.INTEGER,
  //   // allowNull: false,
  //   // defaultValue: 3

  // },

});
User.hasMany(Attendance, {
  foreignKey: "userId",
  // sourceKey: User.id,
});
Attendance.belongsTo(User, {
  foreignKey: 'userId',
  // sourceKey: User.id,
});



module.exports = Attendance;
