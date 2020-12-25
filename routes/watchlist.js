const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportStrategy = require('../middleware/passport');
const WatchlistController = require('../controllers/watchlist');

router.route('/')
  .get(passport.authenticate('jwt', { session: false }), WatchlistController.showWatchlist);

  module.exports = router;