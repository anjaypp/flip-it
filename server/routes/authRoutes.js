const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


//Route to register a user
router.post('/register', authController.register);

//Route to login 
router.post('/login', authController.login);

//Route for forget password
router.post('/forget-password', authController.forgetPassword);

//Route to reset password
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;