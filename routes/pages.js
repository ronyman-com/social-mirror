const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const User = require('../models/User');

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// Signup Page Route
router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }
    res.render('auth/signup', {
        title: 'Sign Up',
        messages: req.flash('error')
    });
});

// Signup Form Submission
router.post('/signup', async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    
    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already in use');
            return res.redirect('/signup');
        }

        // Create new user
        const newUser = await User.create({
            email,
            password, // Note: Should be hashed in model
            name: `${firstName} ${lastName}`,
            avatar: '/public/images/default-avatar.jpg'
        });

        // Login user after signup
        req.login(newUser, (err) => {
            if (err) return next(err);
            return res.redirect('/profile');
        });

    } catch (error) {
        req.flash('error', 'Registration failed');
        res.redirect('/signup');
    }
});

// Facebook Signup Route
router.get('/auth/facebook/signup',
    passport.authenticate('facebook', {
        scope: ['email', 'public_profile'],
        authType: 'rerequest' // Forces re-request of permissions
    })
);

// Facebook Signup Callback
router.get('/auth/facebook/signup/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    })
);

// List all pages
router.get('/pages', ensureAuthenticated, async (req, res) => {
    try {
        // Get pages with manage_posts permission
        const pages = req.user.pages.filter(page => page.perms.includes('MANAGE_POSTS'));
        
        res.render('pages/manage', { 
            user: req.user,
            pages: pages,
            title: 'Your Pages'
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Create new page form
router.get('/pages/create', ensureAuthenticated, (req, res) => {
    res.render('pages/create', { user: req.user });
});

// Create new page
router.post('/pages/create', ensureAuthenticated, async (req, res) => {
    try {
        // Facebook API call to create a new page
        const response = await axios.post(`https://graph.facebook.com/v12.0/me/accounts`, {
            name: req.body.pageName,
            category: req.body.category,
            about: req.body.description,
            access_token: req.user.accessToken
        });
        
        // Update user's pages in Firebase
        const updatedPages = [...req.user.pages, response.data];
        await User.update(req.user.id, { pages: updatedPages });
        
        res.redirect('/pages');
    } catch (err) {
        console.error(err);
        res.redirect('/pages/create');
    }
});

// Page details
router.get('/pages/:pageId', ensureAuthenticated, async (req, res) => {
    try {
        const page = req.user.pages.find(p => p.id === req.params.pageId);
        if (!page) {
            return res.status(404).send('Page not found');
        }
        
        // Get page posts
        const posts = await axios.get(`https://graph.facebook.com/v12.0/${page.id}/posts`, {
            params: {
                access_token: page.access_token,
                fields: 'id,message,created_time,full_picture',
                limit: 10
            }
        });
        
        res.render('pages/page', {
            user: req.user,
            page: page,
            posts: posts.data.data
        });
    } catch (err) {
        console.error(err);
        res.redirect('/pages');
    }
});

module.exports = router;