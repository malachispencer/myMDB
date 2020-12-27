const pool = require('../db/dbConnection');

module.exports = {
  clean: async () => {
    const sql = `TRUNCATE ratings, reviews, watchlist, favourites, users`;
  
    await pool.query(sql, (err, res) => {
      if (err) { console.log(err); }
    });
  },
  
  close: async () => {
    await pool.end();
  }
};