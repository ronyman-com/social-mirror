const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// User profile
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Fetch user's feed from Facebook
        const feed = await axios.get(`https://graph.facebook.com/v12.0/me/feed`, {
            params: {
                access_token: req.user.accessToken,
                fields: 'id,message,created_time,full_picture,likes.limit(0).summary(true),comments.limit(0).summary(true)',
                limit: 10
            }
        });
        
        // Fetch user's friends
        const friends = await axios.get(`https://graph.facebook.com/v12.0/me/friends`, {
            params: {
                access_token: req.user.accessToken,
                fields: 'id,name,picture',
                limit: 9
            }
        });
        
        res.render('profile', { 
            user: req.user,
            posts: feed.data.data,
            friends: friends.data.data
        });
    } catch (err) {
        console.error(err);
        res.render('profile', { 
            user: req.user,
            posts: [],
            friends: []
        });
    }
});

// Update profile
router.post('/update', ensureAuthenticated, async (req, res) => {
    try {
        // Update in Firebase
        await User.update(req.user.id, {
            name: req.body.name,
            email: req.body.email
        });
        
        // Update on Facebook
        await axios.post(`https://graph.facebook.com/v12.0/me`, {
            name: req.body.name,
            access_token: req.user.accessToken
        });
        
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.redirect('/profile');
    }
});

module.exports = router;