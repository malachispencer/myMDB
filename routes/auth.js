const express = require('express');
const router = require('express-promise-router')();
const AuthController = require('../controllers/auth');

router.route('/')
  .post(AuthController.signIn);

module.exports = router;