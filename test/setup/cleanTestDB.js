const pool = require('../../db/dbConnection');

async function cleanTestDB() {
  const sql = `TRUNCATE users, ratings, reviews, watchlist, favourites;`

  await pool.query(sql, (err, res) => {
    if (err) { console.log(err); }
  });
}

cleanTestDB();