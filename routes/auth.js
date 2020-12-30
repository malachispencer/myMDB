const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportLocal = require('../middleware/passportLocal');
const passportFB = require('../middleware/passportFB');
const AuthController = require('../controllers/auth');
const { validateBody, signInSchema } = require('../middleware/joi');

router.route('/')
  .post(validateBody(signInSchema), passport.authenticate('local', { session: false }), AuthController.localAuth);

router.route('/facebook')
  .get(passport.authenticate('facebook', { session: false, scope: ['email'] }))

router.route('/facebook/callback')
  .get(passport.authenticate('facebook', { session: false }), AuthController.facebookOAuth);

module.exports = router;