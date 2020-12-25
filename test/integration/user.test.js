const pool = require('../../db/dbConnection');
const cleanTestDB = require('../setup/cleanTestDB');
const closeTestDB = require('../setup/closeTestDB');
const User = require('../../models/user');

describe('User', () => {
  describe('.create', () => {
    test('it adds a User to the database', async () => {
      await User.create('malachi', 'm.spencer@makers.com', '2020');

      const userFromDB = pool
        .query(`SELECT * FROM users WHERE email = $1`, ['m.spencer@makers.com'])
        .then(res => { return res.rows[0]; })

      expect(userFromDB.user_id).toBeDefined();
      expect(userFromDB.username).toBe('malachi');
      expect(userFromDB.email).toBe('m.spencer@makers.com');
    });
  });
});