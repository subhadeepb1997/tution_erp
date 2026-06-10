const { Sequelize } = require('sequelize');
const path = require('path');

// Use a local database file in the project folder
const dbPath = path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Set to true to see SQL queries in console
});

module.exports = sequelize;
