// C:\Users\USER\OneDrive\Desktop\OpenSource\AweSome-ReadME\social-mirror\templates\default\auth\google.js

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Add scopes
provider.addScope('profile');
provider.addScope('email');

// DOM elements
const googleSignInBtn = document.getElementById('googleSignIn');
const authContainer = document.querySelector('.auth-container');

// Handle Google Sign-In
export const handleGoogleSignIn = async (method = 'popup') => {
  try {
    let result;
    
    if (method === 'popup') {
      result = await signInWithPopup(auth, provider);
    } else {
      await signInWithRedirect(auth, provider);
      result = await getRedirectResult(auth);
    }

    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // Send token to backend for verification
    const response = await fetch('/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    // Redirect to home page or return URL
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/';
    window.location.href = returnUrl;

  } catch (error) {
    console.error('Google Sign-In Error:', error);
    showError(error.message);
  }
};

// Error display
const showError = (message) => {
  const errorElement = document.createElement('div');
  errorElement.className = 'auth-error';
  errorElement.textContent = message;
  
  // Remove existing errors if any
  const existingError = document.querySelector('.auth-error');
  if (existingError) {
    existingError.remove();
  }
  
  authContainer.prepend(errorElement);
  setTimeout(() => errorElement.remove(), 5000);
};

// Event Listeners
if (googleSignInBtn) {
  googleSignInBtn.addEventListener('click', () => handleGoogleSignIn('popup'));
}

// Check for redirect result on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      await handleGoogleSignIn('redirect');
    }
  } catch (error) {
    console.error('Redirect result error:', error);
  }
});

// CSS (injected dynamically)
const style = document.createElement('style');
style.textContent = `
  .auth-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .auth-error {
    color: #f02849;
    background: #ffe6e6;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .google-signin-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.75rem;
    background: white;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    color: #3c4043;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .google-signin-btn:hover {
    background: #f8f9fa;
  }
  
  .google-signin-btn img {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
`;
document.head.appendChild(style);

// Export for testing
export { auth, provider, handleGoogleSignIn };