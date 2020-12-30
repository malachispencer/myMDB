const express = require('express');
const router = require('express-promise-router')();
const UsersController = require('../controllers/users');
const { validateBody, signUpSchema } = require('../middleware/joi');

router.route('/')
  .post(validateBody(signUpSchema), UsersController.signUp);

module.exports = router;