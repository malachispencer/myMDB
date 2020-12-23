const pool = require('../db/dbConnection');

class Rating {
  constructor(ratingID, userID, movieID, score) {
    this.ratingID = ratingID;
    this.userID = userID;
    this.movieID = movieID;
    this.score = score;
  }

  static async create(userID, movieID, score) {    
    const sql = `INSERT INTO ratings
      (user_id, movie_id, score) VALUES ($1, $2, $3)
      RETURNING rating_id, user_id, movie_id, score;`;

    const values = [userID, movieID, score];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))
      
    return new Rating(
      dbResponse.rating_id,
      dbResponse.user_id,
      dbResponse.movie_id,
      dbResponse.score
    );
  }

  static async allByUser(userID) {
    const sql = `SELECT * FROM ratings WHERE user_id = $1 ORDER BY rating_id DESC`;
    const values = [userID];

    const userRatings = await pool
      .query(sql, values)
      .then(res => { return res.rows; })
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

  static async allForMovie(movieID) {
    const sql = `SELECT * FROM ratings WHERE movie_id = $1 ORDER BY rating_id DESC`;
    const values = [movieID];

    const movieRatings = await pool
      .query(sql, values)
      .then(res => { return res.rows; })
      .catch(err => console.log(error))

    return movieRatings.map(rating => {
      return new Rating(
        rating.rating_id,
        rating.user_id,
        rating.movie_id,
        rating.score
      );
    });
  }

  static async update(userID, movieID, newScore) {
    const sql = `
      UPDATE ratings 
      SET score = $1 
      WHERE user_id = $2 AND movie_id = $3 
      RETURNING rating_id, user_id, movie_id, score
    `;
    
    const values = [newScore, userID, movieID];

    const newRating = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    return new Rating(
      newRating.rating_id,
      newRating.user_id,
      newRating.movie_id,
      newRating.score
    );
  }
}

module.exports = Rating;