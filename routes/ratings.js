const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportJWT = require('../middleware/passportJWT');
const { validateBody, ratingSchema, updateRatingSchema } = require('../middleware/joi');
const RatingsController = require('../controllers/ratings');

router.route('/')
  .post(
    passport.authenticate('jwt', { session: false }), 
    validateBody(ratingSchema), 
    RatingsController.create
  );

router.route('/')
  .put(
    passport.authenticate('jwt', { session: false }),
    validateBody(updateRatingSchema),
    RatingsController.update
  );

router.route('/:ratingID')
  .delete(
    passport.authenticate('jwt', { session: false }), 
    RatingsController.delete
  );

module.exports = router;