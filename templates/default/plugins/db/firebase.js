// templates/default/plugins/db/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  FacebookAuthProvider,
  signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import admin from 'firebase-admin';

// Initialize Firebase Client
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase Admin (Server-side)
let firebaseAdmin;
try {
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL
    })
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
  firebaseAdmin = admin.app();
}

// Client-side Firebase App
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const facebookProvider = new FacebookAuthProvider();

// Add scopes for Facebook Auth
facebookProvider.addScope('public_profile');
facebookProvider.addScope('email');

// Authentication Methods
const firebaseAuth = {
  async loginWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      return {
        user: result.user,
        token
      };
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async verifyToken(idToken) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }
};

// Database Methods
const firebaseDB = {
  async createDocument(collection, data) {
    try {
      const docRef = await firebaseAdmin.firestore()
        .collection(collection)
        .add(data);
      return docRef.id;
    } catch (error) {
      console.error('Create document error:', error);
      throw error;
    }
  },

  // Add other DB methods as needed
};

export default {
  auth: firebaseAuth,
  db: firebaseDB,
  storage,
  admin: firebaseAdmin
};