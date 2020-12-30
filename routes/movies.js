const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportJWT = require('../middleware/passportJWT');
const MoviesController = require('../controllers/movies');

router.route('/search/:query')
  .get(passport.authenticate('jwt', { session: false }), MoviesController.getSearchResults);

router.route('/:movie_id')
  .get(passport.authenticate('jwt', { session: false }), MoviesController.findMovie);

  module.exports = router;