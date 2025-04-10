const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tutorconnect',
  waitForConnections: true,
  queueLimit: 0,
});

module.exports = pool;