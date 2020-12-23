const pool = require('../../db/dbConnection');
const cleanTestDB = require('../setup/cleanTestDB');
const closeTestDB = require('../setup/closeTestDB');
const Rating = require('../../models/rating');

describe('Rating', () => {
  let userID;

  beforeEach(async () => {
    await cleanTestDB();

    userID = await pool.query(
      `INSERT INTO users 
      (username, email, password) VALUES ($1, $2, $3)
      RETURNING user_id`, ['ai', 'ai@makers.com', '2020']
    ).then(res => { return res.rows[0].user_id });
  });

  afterAll(async () => {
    await closeTestDB();
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

      expect(rating.ratingID).toBeDefined();
      expect(rating.userID).toBeNull();
      expect(rating.movieID).toBe('1');
      expect(rating.score).toBe(10);
    });
  });

  describe('.allByUser', () => {
    test('retrieves all the ratings made by a given user', async () => {
      await Rating.create(userID, 1, 9);
      await Rating.create(userID, 2, 6);
      await Rating.create(userID, 3, 3);

      const userRatings = await Rating.allByUser(userID);

      expect(userRatings.length).toBe(3);
      expect(userRatings[0].score).toBe(3);
      expect(userRatings[1].score).toBe(6);
      expect(userRatings[2].score).toBe(9);
    });
  });

  describe('.allForMovie', () => {
    test('retrieves all the ratings of a given movie', async () => {
      await Rating.create(userID, 1, 7);
      await Rating.create(null, 1, 3);

      const movieRatings = await Rating.allForMovie(1);

      expect(movieRatings.length).toBe(2);
      expect(movieRatings[0].score).toBe(3);
      expect(movieRatings[1].score).toBe(7);
    });
  });

  describe('.update', () => {
    test(`changes the user's rating of a particular movie`, async () => {
      const rating = await Rating.create(userID, 1, 7);
      const ratingID = rating.ratingID;

      const updatedRating = await Rating.update(userID, 1, 7);

      expect(rating.ratingID).toEqual(updatedRating.ratingID);
      expect(rating.userID).toEqual(updatedRating.userID);
      expect(updatedRating.score).toBe(7);
    });
  });

  describe('.delete', () => {
    test(`deletes the user's rating from the database`, async () => {
      const rating = await Rating.create(userID, 1, 7);

      await Rating.delete(userID, 1);

      const dbResponse = await pool
        .query('SELECT * FROM ratings WHERE rating_id = $1', [rating.ratingID])
        .then(res => { return res.rows[0]; })

      expect(dbResponse).toBeUndefined();
    });
  });
});