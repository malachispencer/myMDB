const pool = require('../db/dbConnection');

class Review {
  constructor(reviewID, userID, username, movieID, title, body, time, date) {
    this.reviewID = reviewID;
    this.userID = userID;
    this.username = username;
    this.movieID = movieID;
    this.title = title;
    this.body = body;
    this.time = time;
    this.date = date;
  }

  static async create(userID, movieID, title, body, time) {    
    const sql = `
      INSERT INTO reviews
      (user_id, movie_id, title, body, time) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING review_id, 
      user_id, movie_id, title, body,
      to_char(time, 'HH24:MI') as time, 
      to_char(date, 'DD/MM/YYYY') as date
    `;

    const values = [userID, movieID, title, body, time];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    const reviewerName = await this.#getReviewerName(userID);
      
    return new Review(
      dbResponse.review_id,
      dbResponse.user_id,
      reviewerName,
      dbResponse.movie_id,
      dbResponse.title,
      dbResponse.body,
      dbResponse.time,
      dbResponse.date
    );
  }

  static async allByUser(userID) {
    const sql = `
      SELECT review_id, 
      user_id, movie_id, title, body,
      to_char(time, 'HH24:MI') as time, 
      to_char(date, 'DD/MM/YYYY') as date
      FROM reviews 
      WHERE user_id = $1 
      ORDER BY review_id DESC
    `;

    const values = [userID];

    const userReviews = await pool
      .query(sql, values)
      .then(res => { return res.rows; })
      .catch(err => console.log(err))

    const reviewerName = await this.#getReviewerName(userID);

    return userReviews.map(review => {
      return new Review(
        review.review_id,
        review.user_id,
        reviewerName,
        review.movie_id,
        review.title,
        review.body,
        review.time,
        review.date
      );
    });
  }

  // static async allForMovie(movieID) {
  //   const sql = `
  //     SELECT review_id, 
  //     user_id, movie_id, title, body,
  //     to_char(time, 'HH24:MI') as time, 
  //     to_char(date, 'DD/MM/YYYY') as date
  //     FROM reviews 
  //     WHERE movie_id = $1 
  //     ORDER BY review_id DESC
  //   `;

  //   const values = [movieID];

  //   const movieReviews = await pool
  //     .query(sql, values)
  //     .then(res => { return res.rows; })
  //     .catch(err => console.log(err))


  //   console.log(movieReviews)
  // }

  static async #getReviewerName(userID) {
    const sql = `SELECT username FROM users WHERE user_id = $1`;
    const values = [userID];

    return await pool
      .query(sql, values)
      .then(res => { return res.rows[0].username; })
      .catch(err => console.log(err))
  } 
}

module.exports = Review;