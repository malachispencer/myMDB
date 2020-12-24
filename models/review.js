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

  static async allForMovie(movieID) {
    const sql = `
      SELECT r.review_id, 
      r.user_id, u.username, 
      r.movie_id, r.title, r.body,
      to_char(r.time, 'HH24:MI') as time, 
      to_char(r.date, 'DD/MM/YYYY') as date
      FROM reviews AS r
      INNER JOIN users AS u
      ON r.user_id = u.user_id
      WHERE movie_id = $1 
      ORDER BY review_id DESC
    `;

    const values = [movieID];

    const movieReviews = await pool
      .query(sql, values)
      .then(res => { return res.rows; })
      .catch(err => console.log(err))

    return movieReviews.map(review => {
      return new Review(
        review.review_id,
        review.user_id,
        review.username,
        review.movie_id,
        review.title,
        review.body,
        review.time,
        review.date
      )
    });
  }

  static async update(reviewID, newTitle, newBody) {
    const sql = `
      UPDATE reviews 
      SET title = $1, body = $2 
      WHERE review_id = $3
      RETURNING review_id,
      user_id, movie_id,
      title, body,
      to_char(time, 'HH24:MI') as time, 
      to_char(date, 'DD/MM/YYYY') as date
    `;

    const values = [newTitle, newBody, reviewID];

    const updatedReview = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    const reviewerName = await this.#getReviewerName(updatedReview.user_id);

    return new Review(
      updatedReview.review_id,
      updatedReview.user_id,
      reviewerName,
      updatedReview.movie_id,
      updatedReview.title,
      updatedReview.body,
      updatedReview.time,
      updatedReview.date
    );
  }

  static async delete(reviewID) {
    const sql = `DELETE FROM reviews WHERE review_id = $1`;
    const values = [reviewID];

    return await pool
      .query(sql, values)
      .then(res => { return { reviewID: reviewID, status: 'deleted' }; })
      .catch(err => console.log(err))
  }

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