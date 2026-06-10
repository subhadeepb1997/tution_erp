const cron = require('node-cron');
const Student = require('../models/Student');
const Fee = require('../models/Fee');

function initCronJobs() {
  console.log('Initializing Cron Jobs...');

  // Run on the 1st of every month at 1:00 AM: '0 1 1 * *'
  // Generates monthly fee records for all 'Monthly' students
  cron.schedule('0 1 1 * *', async () => {
    console.log('Running Monthly Fee Auto-Generation...');
    
    try {
      const currentMonthYear = new Date().toISOString().slice(0, 7); // e.g., "2026-06"
      const students = await Student.findAll({ where: { fee_type: 'Monthly' } });

      for (const student of students) {
        // Upsert fee record (only creates if it doesn't already exist for this month)
        await Fee.upsert({
          student_id: student.id,
          month_year: currentMonthYear,
          amount_due: student.fee_amount,
          amount_paid: 0,
          status: 'Pending'
        });
      }
      console.log(`Auto-generated fees for ${students.length} students for ${currentMonthYear}`);
    } catch (err) {
      console.error('Error generating monthly fees:', err);
    }
  });
}

module.exports = initCronJobs;
