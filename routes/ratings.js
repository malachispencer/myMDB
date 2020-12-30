const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportJWT = require('../middleware/passportJWT');
const { validateBody, ratingSchema } = require('../middleware/joi');
const RatingsController = require('../controllers/ratings');

router.route('/')
  .post(passport.authenticate('jwt', { session: false }), validateBody(ratingSchema), RatingsController.create);

module.exports = router;