const pool = require('../../db/dbConnection');
const cleanTestDB = require('../setup/cleanTestDB');
const closeTestDB = require('../setup/closeTestDB');
const Review = require('../../models/review');

describe('Review', () => {
  let userID;

  beforeEach(async () => {
    await cleanTestDB();

    userID = await pool.query(
      `INSERT INTO users 
      (username, email, password) VALUES ($1, $2, $3)
      RETURNING user_id`, ['malachi', 'm.spencer@makers.com', '2020']
    ).then(res => { return res.rows[0].user_id });
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('.create', () => {
    test('adds a review to the database', async () => {
      await Review.create(
        null, 
        1, 
        'Loved it', 
        'One of the best movies of all time', 
        '10:40'
      );

      const sql = `SELECT * FROM reviews WHERE user_id IS NULL AND movie_id = $1`;
      const values = [1];

      const reviewFromDB = await pool
        .query(sql, values)
        .then(res => { return res.rows[0] })
        
      expect(reviewFromDB.user_id).toBeNull();
      expect(reviewFromDB.movie_id).toBe('1');
      expect(reviewFromDB.title).toBe('Loved it');
      expect(reviewFromDB.body).toBe('One of the best movies of all time');
    });

    test('returns a Review instance', async () => {
      const review = await Review.create(
        null, 
        1, 
        'Loved it', 
        'One of the best movies of all time', 
        '10:40'
      );

      expect(review.reviewID).toBeDefined();
      expect(review.userID).toBeNull();
      expect(review.movieID).toBe('1');
      expect(review.title).toBe('Loved it');
      expect(review.body).toBe('One of the best movies of all time');
      expect(review.time).toBe('10:40');
      expect(review.date).toBe('24/12/2020');
    });
  });
});