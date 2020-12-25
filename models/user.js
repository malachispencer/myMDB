const pool = require('../db/dbConnection');
const { hashPassword } = require('../utils/password');

class User {
  constructor(userID, username, email, googleID) {
    this.userID = userID;
    this.username = username;
    this.email = email;
    this.googleID = googleID;
  }

  static async create(username, email, password, googleID = null) {
    const encryptedPassword = await hashPassword(password);

    const sql = `
      INSERT INTO users 
      (username, email, password, google_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING user_id, username, 
      email, google_id;
      `;

    const values = [username, email, encryptedPassword, googleID];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    return new User(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.google_id
    );
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    const dbResponse = await pool
      .query(sql, values)
      .then(res => { return res.rows[0]; })
      .catch(err => console.log(err))

    if (!dbResponse) { return null; }

    return new User(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.google_id
    );
  }
}

module.exports = User;