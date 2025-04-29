const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');






// GET /auth/signup
router.get('/signup', (req, res) => {
  res.render('auth/signup', { 
    title: 'Sign Up',
    layout: 'auth' 
  });
});

router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      req.flash('error', 'Email and password are required');
      return res.redirect('/auth/signup');
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      req.flash('error', 'Email already in use');
      return res.redirect('/auth/signup');
    }

    // Create user
    const newUser = await User.create({
      email,
      password,
      name: `${firstName} ${lastName}`
    });

    // Auto-login
    req.login(newUser, (err) => {
      if (err) {
        req.flash('error', 'Login after signup failed');
        return res.redirect('/auth/login');
      }
      return res.redirect('/profile');
    });

  } catch (error) {
    console.error('Signup error:', error);
    req.flash('error', 'Registration failed');
    res.redirect('/auth/signup');
  }
});



/////
// GET Forgot Password Page
router.get('/forgot-password', (req, res) => {
  res.render('auth/forgetpass', {
    title: 'Forgot Password',
    messages: req.flash('error') // For error messages
  });
});

// POST Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      req.flash('error', { 
        type: 'danger',
        text: 'No account found with that email'
      });
      return res.redirect('/auth/forgot-password');
    }
    
    // Send password reset email (implement this)
    await sendPasswordResetEmail(user.email);
    
    req.flash('error', {
      type: 'success',
      text: 'Password reset link sent to your email'
    });
    res.redirect('/auth/forgot-password');
    
  } catch (error) {
    req.flash('error', {
      type: 'danger',
      text: 'Error processing your request'
    });
    res.redirect('/auth/forgot-password');
  }
});
///

router.get('/auth/facebook',
  passport.authenticate('facebook', { 
    scope: ['public_profile', 'email', 'pages_show_list', 'pages_manage_posts'] 
  })
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/login' 
  })
);

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;