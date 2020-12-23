const pool = require('../db/dbConnection');

class Rating {
  constructor(rating_id, user_id, movie_id, score) {
    this.rating_id = rating_id;
    this.user_id = user_id;
    this.movie_id = movie_id;
    this.score = score;
  }

  static async create(user_id, movie_id, score) {    
    const sql = `INSERT INTO ratings
      (user_id, movie_id, score) VALUES ($1, $2, $3)
      RETURNING rating_id, user_id, movie_id, score;`;

    const values = [user_id, movie_id, score];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0] })
      .catch(err => console.log(err))

    return new Rating(
      dbResponse.rating_id,
      dbResponse.user_id,
      dbResponse.movie_id,
      dbResponse.score
    );
  }

  static async allByUser(user_id) {
    const sql = `SELECT * FROM ratings WHERE user_id = $1 ORDER BY rating_id DESC`;
    const values = [user_id];

    const userRatings = await pool
      .query(sql, values)
      .then(res => { return res.rows })
      .catch(err => console.log(err))

    return userRatings.map(rating => {
      return new Rating(
        rating.rating_id,
        rating.user_id,
        rating.movie_id,
        rating.score
      );
    });
  }
}

module.exports = Rating;