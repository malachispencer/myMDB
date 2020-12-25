require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`
});

const JWT = require('jsonwebtoken');

module.exports = {
  signToken: (userID) => {
    return JWT.sign({
      issuer: 'myMDb',
      subject: userID,
      expiresIn: '7d'
    }, process.env.MYMDB_TOKEN_SECRET);
  }
}