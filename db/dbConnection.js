require('dotenv').config(
  { path: `${__dirname}/../.env.${process.env.NODE_ENV}` }
);

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  port: 5432,
  database: process.env.MYMDB_DB_NAME,
  max: 1
});

module.exports = pool;