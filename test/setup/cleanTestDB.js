const pool = require('../../db/dbConnection');

module.exports = async function cleanTestDB() {
  const sql = `TRUNCATE ratings, reviews, watchlist, favourites, users`;
  
  await pool.query(sql, (err, res) => {
    if (err) { console.log(err); }
  });
}