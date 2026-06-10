const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Get attendance for a specific date
router.get('/:date', async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: {
        date: req.params.date // formatted as YYYY-MM-DD
      },
      include: [Student]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark attendance
router.post('/', async (req, res) => {
  try {
    const { student_id, date, status, notes } = req.body;
    
    // Sequelize upsert: returns [record, created]
    const [record, created] = await Attendance.upsert({
      student_id,
      date,
      status,
      notes
    }, {
      returning: true
    });
    
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
