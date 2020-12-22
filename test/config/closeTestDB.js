const pool = require('../../db/dbConnection');

module.exports = async function closeTestDB() {
  await pool.end();
}