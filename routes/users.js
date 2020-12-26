const express = require('express');
const router = require('express-promise-router')();
const UsersController = require('../controllers/users');
const { validateUser, signUpSchema } = require('../middleware/userValidation');

router.route('/')
  .post(validateUser(signUpSchema), UsersController.signUp);

module.exports = router;