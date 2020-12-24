const pool = require('../db/dbConnection');

class Review {
  constructor(reviewID, userID, movieID, title, body, time, date) {
    this.reviewID = reviewID;
    this.userID = userID;
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
      
    return new Review(
      dbResponse.review_id,
      dbResponse.user_id,
      dbResponse.movie_id,
      dbResponse.title,
      dbResponse.body,
      dbResponse.time,
      dbResponse.date
    );
  }
}

module.exports = Review;