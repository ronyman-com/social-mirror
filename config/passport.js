const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Initialize Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
    enableProof: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user logic
      let user = await User.findOne({ facebookId: profile.id });
      
      if (!user) {
        user = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialization/Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;