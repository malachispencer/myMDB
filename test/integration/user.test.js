const pool = require('../../db/dbConnection');
const cleanTestDB = require('../setup/cleanTestDB');
const closeTestDB = require('../setup/closeTestDB');
const User = require('../../models/user');

describe('User', () => {
  let user;

  beforeEach(async () => {
    await cleanTestDB();
    user = await User.create('malachi', 'm.spencer@makers.com', '2020');
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('.create', () => {
    test('adds a User to the database', async () => {
      const userFromDB = await pool
        .query(`SELECT * FROM users WHERE email = $1`, ['m.spencer@makers.com'])
        .then(res => { return res.rows[0]; })

      expect(userFromDB.user_id).toBeDefined();
      expect(userFromDB.username).toBe('malachi');
      expect(userFromDB.email).toBe('m.spencer@makers.com');
    });

    test('hashes password before saving the user', async () => {
      const passwordFromDB = await pool
        .query(`SELECT password FROM users WHERE email = $1`, ['m.spencer@makers.com'])
        .then(res => { return res.rows[0]; })

      expect(passwordFromDB).not.toBe('2020');
    });

    test('returns a User instance', () => {      
      expect(user.userID).toBeDefined();
      expect(user.username).toBe('malachi');
      expect(user.email).toBe('m.spencer@makers.com');
      expect(user.googleID).toBeNull();
    });
  });
});