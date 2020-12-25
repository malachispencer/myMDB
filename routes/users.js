const express = require('express');
const router = require('express-promise-router')();
const UsersController = require('../controllers/users');

router.route('/')
  .post(UsersController.signUp);

module.exports = router;