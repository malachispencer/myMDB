const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportLocal = require('../middleware/passportLocal');
const passportFB = require('../middleware/passportFB');
const AuthController = require('../controllers/auth');
const { validateUser, signInSchema } = require('../middleware/userValidation');

router.route('/')
  .post(validateUser(signInSchema), passport.authenticate('local', { session: false }), AuthController.signIn);

router.route('/facebook')
  .get(passport.authenticate('facebook', { session: false, scope: ['email'] }))

router.route('/facebook/callback')
  .get(passport.authenticate('facebook'))

module.exports = router;