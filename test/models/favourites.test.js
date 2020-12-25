const pool = require('../../db/dbConnection');
const cleanTestDB = require('../setup/cleanTestDB');
const closeTestDB = require('../setup/closeTestDB');
const Favourites = require('../../models/favourites');

describe('Favourites', () => {
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

  describe('.add', () => {
    test('adds a favourites entry to the database', async () => {
      await Favourites.add(userID, 1);

      const sql = `SELECT * FROM favourites WHERE user_id = $1 AND movie_id = $2`;
      const values = [userID, 1];

      const favouritesItemFromDB = await pool
        .query(sql, values)
        .then(res => { return res.rows[0]; })
            
      expect(favouritesItemFromDB.user_id).toEqual(userID);
      expect(favouritesItemFromDB.movie_id).toBe('1');
    });
  });

  describe('.retrieve', () => {
    test(`gets and returns all a user's favourites`, async () => {
      await Favourites.add(userID, 1);
      await Favourites.add(userID, 2);
      await Favourites.add(null, 1);

      const favourites = await Favourites.retrieve(userID);

      expect(favourites.userID).toEqual(userID);
      expect(favourites.movieIDs).toBeInstanceOf(Array);
      expect(favourites.movieIDs).toContain('1');
      expect(favourites.movieIDs).toContain('2');
    });
  });

  describe('.delete', () => {
    test('deletes a watchlist entry from the database', async () => {
      await Favourites.add(userID, 1);
      await Favourites.delete(userID, 1);

      const sql = `SELECT * FROM favourites WHERE user_id = $1 AND movie_id = $2`;
      const values = [userID, 1];

      const dbResponse = await pool
        .query(sql, values)
        .then(res => { return res.rows[0]; })

       expect(dbResponse).toBeUndefined();
    });
  });
});