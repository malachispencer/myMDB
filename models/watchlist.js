const pool = require('../db/dbConnection');

class Watchlist {
  static async add(userID, movieID) {
    const sql = `
      INSERT INTO watchlist 
      (user_id, movie_id) 
      VALUES ($1, $2)
      RETURNING user_id, movie_id
      `
    const values = [userID, movieID];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    return dbResponse;
  }
}

module.exports = Watchlist;