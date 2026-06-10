const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Student = require('./Student');

const Attendance = sequelize.define('Attendance', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Present'
  },
  notes: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'date']
    }
  ]
});

// Setup relationship
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = Attendance;
