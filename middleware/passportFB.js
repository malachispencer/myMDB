require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`
});

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

passport.use(new FacebookStrategy({
  clientID: process.env.MYMDB_FACEBOOK_CLIENT_ID,
  clientSecret: process.env.MYMDB_FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, name, email } = profile._json;
    const existingUser = await User.findByFacebookID(id);

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.fbCreate(name, email, id);
    done(null, newUser);

  } catch (err) {
    done(err, false);
  }
}));