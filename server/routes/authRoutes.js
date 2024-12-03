const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/authController');
const validateRegistration = require('../middlewares/validateRegistration');

// Use validateRegistration before hitting the controller logic
router.post('/register', validateRegistration, userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgetPassword);
router.post('/reset-password', userController.resetPassword);
//Initiate Google Login
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

//Callback route for Google to redirect to
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

//Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.redirect('/');
    });
  });

module.exports = router;
