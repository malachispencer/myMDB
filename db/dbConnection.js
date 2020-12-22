const { Pool } = require('pg');

let dbName;

if (process.env.NODE_ENV === 'test') {
  dbName = 'mymdb_test';
} else {
  dbName = 'mymdb_development';
}

const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  port: 5432,
  database: dbName
});

module.exports = pool;