require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./models/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Import Cron Jobs
const initCronJobs = require('./services/cronJobs');
initCronJobs();

// Import and Train Local AI (node-nlp)
const { trainNLP } = require('./services/nlpService');
trainNLP();

// Database Connection
sequelize.sync().then(() => {
  console.log('Connected to SQLite Database');
}).catch((err) => {
  console.error('Failed to connect to SQLite Database', err);
});

// Import Routes
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const feeRoutes = require('./routes/fees');
const aiRoutes = require('./routes/ai');

// Use Routes (Unprotected)
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/ai', aiRoutes);

// Fallback to index.html for single-page application feel
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
