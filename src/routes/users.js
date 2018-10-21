const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validation = require('./validation');

router.get('/users/signup', userController.signup);

router.post('/users/signup', validation.validateUsers, userController.create);

router.get('/users/signin', userController.signInForm);

router.post('/users/signin', validation.validateUserSignIn, userController.signIn);

router.get('/users/signout', userController.signOut);

module.exports = router;