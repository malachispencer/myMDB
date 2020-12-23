const pool = require('../../db/dbConnection');
const closeTestDB = require('../setup/closeTestDB');
const Rating = require('../../models/rating');

describe('Rating', () => {

  afterAll(() => {
    closeTestDB();
  });

  describe('.create', () => {
    test('adds a rating to the database', async () => {
      await Rating.create(null, 1, 10);

      const sql = `SELECT * FROM ratings WHERE user_id IS NULL AND movie_id = $1`;
      const values = [1];

      const ratingFromDB = await pool
        .query(sql, values)
        .then(res => { return res.rows[0] })
      
      expect(ratingFromDB.user_id).toBeNull();
      expect(ratingFromDB.movie_id).toBe('1');
      expect(ratingFromDB.score).toBe(10);
    });

    test('returns a Rating instance', async () => {
      const rating = await Rating.create(null, 1, 10);

      expect(rating.rating_id).toBeDefined();
      expect(rating.user_id).toBeNull();
      expect(rating.movie_id).toBe('1');
      expect(rating.score).toBe(10);
    });
  });

  describe('.allByUser', () => {
    test('retrieves all the ratings made by a given user', async () => {
      Rating.create(null, 1, 9);
      Rating.create(null, 2, 6);
      Rating.create(null, 3, 3);

      const userRatings = await Rating.allByUser(null);

      expect(userRatings.length).toBe(3);
      expect(userRatings[0].score).toBe(3);
      expect(userRatings[1].score).toBe(6);
      expect(userRatings[2].score).toBe(9);
    });
  });
});