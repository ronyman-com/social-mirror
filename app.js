require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const flash = require('connect-flash');
const FirebaseStore = require('connect-session-firebase')(session);
const fs = require('fs').promises;


// Initialize Express app
const app = express();
app.use(require('./middleware/browserCompatibility'));
// Firebase Configuration
const admin = require('./config/firebase');
const db = admin.database();

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'templates/default/public')));

// Add this middleware before your routes
app.use((req, res, next) => {
  res.locals.resolvePath = (relativePath) => {
    return path.join(__dirname, 'templates/default', relativePath);
  };
  next();
});



// Session configuration with Firebase
app.use(session({
  store: new FirebaseStore({
    database: db,
    expiration: 24 * 60 * 60 * 1000 // 1 day
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Passport and Flash middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'templates/default'),
  path.join(__dirname, 'templates/default/auth'),
  path.join(__dirname, 'templates/default/partials')
]);

// Add this middleware before your routes
app.use((req, res, next) => {
  // Set security headers for all browsers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // Ensure consistent MIME types
  res.type('html'); // For all .ejs templates
  
  // Browser feature detection
  res.locals.isModernBrowser = req.headers['user-agent'].includes('Chrome') || 
                              req.headers['user-agent'].includes('Firefox');
  next();
});

// Replace your current EJS configuration with this:
app.engine('ejs', (filePath, data, cb) => {
  // Create a custom include function that handles paths properly
  const customInclude = (includePath, includeData = {}) => {
    const baseDir = path.dirname(filePath);
    const resolvedPath = path.join(baseDir, includePath.replace(/\.ejs$/, '') + '.ejs');
    
    return ejs.renderFile(resolvedPath, {
      ...data,
      ...includeData,
      include: customInclude
    }, {}, (err, str) => {
      if (err) {
        console.error('Include error:', err);
        return `<!-- Error including ${includePath} -->`;
      }
      return str;
    });
  };

  ejs.renderFile(filePath, {
    ...data,
    include: customInclude
  }, {}, cb);
});

// Template helpers middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.messages = req.flash();
  next();
});

// Route imports
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const pagesRoutes = require('./routes/pages');
const postsRoutes = require('./routes/posts');

// Route registration - Fixed duplicate route registration
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/pages', pagesRoutes);
app.use('/posts', postsRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Facebook Mirror',
    user: req.user 
  });
});

// Test route
app.get('/test-route', (req, res) => {
  res.send('Route test successful');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message.includes('Failed to lookup view')) {
    return res.status(500).send(`
      <h1>Server Error</h1>
      <p>Missing template file: ${err.message.split('"')[1]}</p>
    `);
  }
  
  if (err.message.includes('Unknown authentication strategy')) {
    return res.status(500).send(`
      <h1>Authentication Error</h1>
      <p>${err.message}</p>
      <p>Please check your passport configuration</p>
    `);
  }

  res.status(500).render('error', { 
    title: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Access at: http://localhost:${PORT}`);
});

module.exports = app;