const pool = require("../db/dbConnection");

class Rating {
  constructor() {

  }

  static async create(user_id, movie_id, score) {    
    const sql = `INSERT INTO ratings
      (user_id, movie_id, score) VALUES ($1, $2, $3)
      RETURNING rating_id, user_id, movie_id, score;`;

    const values = [user_id, movie_id, score];

    await pool
      .query(sql, values)
      .then(res => { return res.rows[0] })
      .catch(err => console.log(err))
  }
}

module.exports = Rating;