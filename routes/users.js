const express = require('express');
const router = require('express-promise-router')();
const UsersController = require('../controllers/users');
const { validateUser, userSchema } = require('../middleware/userValidation');

router.route('/')
  .post(validateUser(userSchema), UsersController.signUp);

module.exports = router;