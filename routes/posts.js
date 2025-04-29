const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// Create new post
router.post('/create', ensureAuthenticated, async (req, res) => {
    try {
        let response;
        
        if (req.body.pageId) {
            // Post to a page
            const page = req.user.pages.find(p => p.id === req.body.pageId);
            if (!page) {
                return res.status(404).json({ error: 'Page not found' });
            }
            
            response = await axios.post(`https://graph.facebook.com/v12.0/${page.id}/feed`, {
                message: req.body.content,
                access_token: page.access_token
            });
        } else {
            // Post to user's profile
            response = await axios.post(`https://graph.facebook.com/v12.0/me/feed`, {
                message: req.body.content,
                access_token: req.user.accessToken
            });
        }
        
        res.json({ success: true, postId: response.data.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating post' });
    }
});

// Load more posts
router.get('/load-more', ensureAuthenticated, async (req, res) => {
    try {
        const response = await axios.get(`https://graph.facebook.com/v12.0/me/feed`, {
            params: {
                access_token: req.user.accessToken,
                fields: 'id,message,created_time,full_picture,likes.limit(0).summary(true),comments.limit(0).summary(true)',
                limit: 5,
                until: req.query.lastPostId
            }
        });
        
        res.json(response.data.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error loading posts' });
    }
});

// Delete post
router.delete('/:postId', ensureAuthenticated, async (req, res) => {
    try {
        await axios.delete(`https://graph.facebook.com/v12.0/${req.params.postId}`, {
            params: {
                access_token: req.user.accessToken
            }
        });
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting post' });
    }
});

module.exports = router;