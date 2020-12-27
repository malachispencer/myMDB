require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`
});

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.MYMDB_FACEBOOK_CLIENT_ID,
  clientSecret: process.env.MYMDB_FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('PROFILE', profile._json)
    console.log('ACCESS TOKEN', accessToken)
  } catch (err) {
    done(err, false);
  }
}));