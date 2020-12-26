const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportLocal = require('../middleware/passportLocal');
const AuthController = require('../controllers/auth');
const { validateUser, signInSchema } = require('../middleware/userValidation');

router.route('/')
  .post(validateUser(signInSchema), passport.authenticate('local', { session: false }), AuthController.signIn);

module.exports = router;