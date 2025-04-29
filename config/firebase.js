const admin = require('firebase-admin');

// Check if app already exists to prevent duplicate initialization
if (!admin.apps.length) {
  const serviceAccount = require('../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

module.exports = admin;