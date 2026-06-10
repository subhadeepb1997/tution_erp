const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Student = require('./Student');

const Fee = sequelize.define('Fee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Student,
      key: 'id'
    }
  },
  month_year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount_due: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  amount_paid: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  payment_date: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'month_year']
    }
  ]
});

// Setup relationship
Student.hasMany(Fee, { foreignKey: 'student_id' });
Fee.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = Fee;
