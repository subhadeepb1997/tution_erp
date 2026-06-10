const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  parent_phone: {
    type: DataTypes.STRING
  },
  batch_time: {
    type: DataTypes.STRING
  },
  fee_type: {
    type: DataTypes.STRING,
    defaultValue: 'Monthly'
  },
  fee_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  joined_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = Student;
