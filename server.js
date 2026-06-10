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

// Authentication Logic
const crypto = require('crypto');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const FALLBACK_PASSWORD_HASH = 'f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7'; // SHA256 of the default password
const AUTH_TOKEN = 'tuition-erp-auth-token-12345'; // Hardcoded for simplicity

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Use env password if provided, otherwise verify against fallback hash
  let passwordMatches = false;
  if (process.env.ADMIN_PASSWORD) {
    passwordMatches = (password === process.env.ADMIN_PASSWORD);
  } else {
    const inputHash = crypto.createHash('sha256').update(password || '').digest('hex');
    passwordMatches = (inputHash === FALLBACK_PASSWORD_HASH);
  }

  if (username === ADMIN_USERNAME && passwordMatches) {
    res.json({ token: AUTH_TOKEN });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Auth Middleware for protected routes
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(' ')[1] === AUTH_TOKEN) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Import Routes
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const feeRoutes = require('./routes/fees');
const aiRoutes = require('./routes/ai');

// Use Routes (Protected)
app.use('/api/students', requireAuth, studentRoutes);
app.use('/api/attendance', requireAuth, attendanceRoutes);
app.use('/api/fees', requireAuth, feeRoutes);
app.use('/api/ai', requireAuth, aiRoutes);

// Fallback to index.html for single-page application feel
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
