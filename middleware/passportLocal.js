require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`
});

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findByEmail(email);

    if (!user) { return done(null, false); }

    const validPassword = await user.isValidPassword(password);

    if (!validPassword) { return done(null, false); }

    done(null, user);

  } catch (err) {
    
    done(err, false);
  }
}));