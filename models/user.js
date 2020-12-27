const bcrypt = require('bcrypt');
const pool = require('../db/dbConnection');

class User {
  constructor(userID, username, email, facebookID) {
    this.userID = userID;
    this.username = username;
    this.email = email;
    this.facebookID = facebookID;
  }

  static async create(username, email, password, facebookID = null) {
    const encryptedPassword = await this.#hashPassword(password);
    email = email.toLowerCase();

    const sql = `
      INSERT INTO users 
      (username, email, password, facebook_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING user_id, username, 
      email, facebook_id;
      `;

    const values = [username, email, encryptedPassword, facebookID];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    return new User(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.facebook_id
    );
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = $1`;
    const values = [email.toLowerCase()];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    if (!dbResponse) { return null; }

    return new User(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.facebook_id
    );
  }

  static async findByID(userID) {
    const sql = `SELECT * FROM users WHERE user_id = $1`;
    const values = [userID];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    if (!dbResponse) { return null; }

    return new User(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.facebook_id
    );
  }

  static async findByFacebookID(facebookID) { 
    const sql = `SELECT * FROM users WHERE facebook_id = $1`;
    const values = [facebookID];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    if (!dbResponse) { return null; }

    return new User(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.facebook_id
    );
  }

  static async #hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }

  async isValidPassword(passwordCredential) {
    const sql = `SELECT password FROM users WHERE email = $1`;
    const values = [this.email];

    const dbPassword = await pool
      .query(sql, values)
      .then(res => { return res.rows[0].password; })
      .catch(err => console.log(err))

    return await bcrypt.compare(passwordCredential, dbPassword);
  }
}

module.exports = User;