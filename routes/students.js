const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [['name', 'ASC']]
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new student
router.post('/', async (req, res) => {
  try {
    const newStudent = await Student.create({
      name: req.body.name,
      phone: req.body.phone,
      parent_phone: req.body.parent_phone,
      batch_time: req.body.batch_time,
      fee_type: req.body.fee_type,
      fee_amount: req.body.fee_amount
    });
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Student.destroy({
      where: { id: req.params.id }
    });
    if(deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Deleted Student' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
