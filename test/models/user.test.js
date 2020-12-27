const pool = require('../../db/dbConnection');
const cleanTestDB = require('../setup/cleanTestDB');
const closeTestDB = require('../setup/closeTestDB');
const User = require('../../models/user');

describe('User', () => {
  let user;
  let fbUser;

  beforeEach(async () => {
    await cleanTestDB();
    user = await User.create('malachi', 'm.spencer@makers.com', '2020');
    fbUser = await User.fbCreate('Facebook User', 'facebook@makers.com', 123456);
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
      expect(user.facebookID).toBeNull();
    });
  });

  describe('.findByEmail', () => {
    test('returns user if found in the database', async () => {
      const foundUser = await User.findByEmail('m.spencer@makers.com');

      expect(foundUser).toBeInstanceOf(Object);
      expect(foundUser.userID).toEqual(user.userID);
      expect(foundUser.username).toBe('malachi');
    });

    test('returns null if user not found', async () => {
      const foundUser = await User.findByEmail('nulluser@makers.com');

      expect(foundUser).toBeNull();
    })
  });

  describe('.findByID', () => {
    test('returns user if found in the database', async () => {
      const foundUser = await User.findByID(user.userID);

      expect(foundUser).toBeInstanceOf(Object);
      expect(foundUser.userID).toEqual(user.userID);
      expect(foundUser.email).toBe('m.spencer@makers.com');
    });

    test('returns null if user not found', async () => {
      const foundUser = await User.findByID(0);

      expect(foundUser).toBeNull();
    });
  });

  describe('#isValidPassword', () => {
    test(`returns true if user's password credential is correct`, async () => {
      const result = await user.isValidPassword('2020');

      expect(result).toBe(true);
    });

    test(`returns false if user's password credential is incorrect`, async () => {
      const result = await user.isValidPassword('wrongPassword');

      expect(result).toBe(false);
    });
  });

  describe('.fbCreate', () => {
    test('adds a user to db who signs up with their facebook account', async () => {
      const dbResponse = await pool
        .query(`SELECT * FROM users WHERE facebook_id = $1`, [fbUser.facebookID])
        .then(res => { return res.rows[0]; })
      
      expect(dbResponse.facebook_id).toEqual('123456');
      expect(dbResponse.username).toBe('Facebook User');
      expect(dbResponse.email).toBe('facebook@makers.com');
    });

    test('returns a user instance', async () => {
      expect(fbUser).toBeInstanceOf(Object);
      expect(fbUser.userID).toBeDefined();
      expect(fbUser.email).toBe('facebook@makers.com');
    });
  });

  describe('.findByFacebookID', () => {
    test('returns user who signed up with facebook if found', async () => {
      const foundUser = await User.findByFacebookID(fbUser.facebookID);

      expect(fbUser.userID).toEqual(foundUser.userID);
      expect(fbUser.facebookID).toEqual(foundUser.facebookID);
      expect(fbUser.email).toEqual(foundUser.email);
    });

    test('returns null if no facebook user with that facebookID found', async () => {
      const foundUser = await User.findByFacebookID(0);

      expect(foundUser).toBeNull();
    });
  });
});