require('dotenv').config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`
});

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.MYMDB_JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findByID(payload.subject);

    if (!user) { return done(null, false); }

    done(null, user);

  } catch (err) {

    done(err, false);
  }
}));