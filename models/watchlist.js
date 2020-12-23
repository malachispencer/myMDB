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

  static async delete(userID, movieID) {
    const sql = `DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2`;
    const values = [userID, movieID];

    await pool
      .query(sql, values)
      .then(res => { return res })
      .catch(err => console.log(err))
  }
}

module.exports = Watchlist;