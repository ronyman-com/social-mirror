class FBClient {
  static async getLoginStatus() {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => {
        resolve(user ? { 
          status: 'connected',
          authResponse: {
            accessToken: user.accessToken,
            userID: user.uid
          }
        } : { status: 'unknown' });
      });
    });
  }

  static async login() {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    
    const result = await firebase.auth().signInWithPopup(provider);
    return {
      user: result.user,
      credential: result.credential
    };
  }

  static async logout() {
    await firebase.auth().signOut();
  }

  static async getPosts() {
    const user = firebase.auth().currentUser;
    if (!user) throw new Error('Not authenticated');
    
    const token = await user.getIdToken();
    const response = await fetch('/api/fb/posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }

  static async postMessage(message) {
    const user = firebase.auth().currentUser;
    if (!user) throw new Error('Not authenticated');
    
    const token = await user.getIdToken();
    const response = await fetch('/api/fb/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    return response.json();
  }
}

// Initialize only once
if (!window.FBClient) {
  window.FBClient = FBClient;
}