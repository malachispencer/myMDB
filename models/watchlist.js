const pool = require('../db/dbConnection');

class Watchlist {
  constructor(userID, movieIDsArray) {
    this.userID = userID;
    this.movieIDs = movieIDsArray;
  }

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

  static async retrieve(userID) {
    const sql = `SELECT * FROM watchlist WHERE user_id = $1`;
    const values = [userID];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows; })
      .catch(err => console.log(err))
      
    const movieIDsArray = this.#movieIDsToArray(dbResponse);

    return new Watchlist(
      userID,
      movieIDsArray
    );
  }

  static async delete(userID, movieID) {
    const sql = `DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2`;
    const values = [userID, movieID];

    await pool
      .query(sql, values)
      .then(res => { return res })
      .catch(err => console.log(err))
  }

  static #movieIDsToArray(watchlistFromDB) {
    let movieIDsArray = [];

    watchlistFromDB.forEach(item => {
      movieIDsArray.push(item.movie_id);
    });

    return movieIDsArray;
  }
}

module.exports = Watchlist;