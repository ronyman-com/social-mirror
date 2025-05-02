// Facebook Auth Plugin with Firebase integration
export default (context) => {
  const config = context.config.facebook || {};
  
  // Validate configuration
  if (!config.appId || !process.env.FIREBASE_API_KEY) {
    console.warn('Facebook or Firebase configuration missing');
    return {};
  }

  // SDK loader function
  const loadSDK = () => {
    return `
      <script>
        // Firebase initialization
        const firebaseConfig = ${JSON.stringify({
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID
        })};
        
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        
        // Facebook SDK initialization
        window.fbAsyncInit = function() {
          FB.init({
            appId: '${config.appId}',
            cookie: true,
            xfbml: true,
            version: '${config.version || 'v19.0'}'
          });
          
          // Initialize context after SDK loads
          if (typeof ${context.globalVar} !== 'undefined') {
            ${context.globalVar}.plugins.facebook = {
              login: function() {
                const provider = new firebase.auth.FacebookAuthProvider();
                return firebase.auth().signInWithPopup(provider);
              },
              logout: function() {
                return firebase.auth().signOut();
              },
              getStatus: function() {
                return new Promise(resolve => {
                  firebase.auth().onAuthStateChanged(user => {
                    resolve(user ? { status: 'connected' } : { status: 'unknown' });
                  });
                });
              }
            };
          }
        };
        
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          js.async = true;
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      </script>
    `;
  };

  return {
    sdkScript: loadSDK(),
    
    clientAPI: `
      <script>
        class FBClient {
          static async getLoginStatus() {
            return new Promise(resolve => {
              firebase.auth().onAuthStateChanged(user => {
                resolve(user ? { status: 'connected' } : { status: 'unknown' });
              });
            });
          }
          
          static async login() {
            const provider = new firebase.auth.FacebookAuthProvider();
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
            return fetch('/api/fb/posts', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            }).then(res => res.json());
          }
          
          static async postMessage(message) {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('Not authenticated');
            
            const token = await user.getIdToken();
            return fetch('/api/fb/posts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify({ message })
            }).then(res => res.json());
          }
        }
        
        window.FBClient = FBClient;
      </script>
    `,
    
    middleware: {
      authenticate: async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          if (!authHeader) return res.status(401).send('Unauthorized');
          
          const token = authHeader.split(' ')[1];
          const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
          req.user = decodedToken;
          next();
        } catch (error) {
          console.error('Authentication error:', error);
          res.status(401).send('Unauthorized');
        }
      }
    }
  };
};