const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// Get fees for a specific month_year (e.g., "2026-06")
router.get('/:month_year', async (req, res) => {
  try {
    const fees = await Fee.findAll({ 
      where: { month_year: req.params.month_year },
      include: [Student]
    });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update or add a fee record
router.post('/', async (req, res) => {
  try {
    const { student_id, month_year, amount_due, amount_paid, status, payment_date } = req.body;
    
    const [fee, created] = await Fee.upsert({
      student_id,
      month_year,
      amount_due,
      amount_paid,
      status,
      payment_date
    }, {
      returning: true
    });
    
    res.json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
