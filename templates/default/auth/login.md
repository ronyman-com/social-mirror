# Facebook Login Integration

```html
<!-- Facebook Login Container -->
<div class="fb-login-container">
  <h2>Welcome to Our App</h2>
  
  <!-- Inject Facebook SDK -->
  <%- plugins.facebook.sdkScript %>
  
  <!-- Login Button -->
  <div class="login-options">
    <button 
      class="fb-login-button" 
      onclick="handleFacebookLogin()"
      data-scope="public_profile,email"
    >
      <i class="fab fa-facebook"></i> Continue with Facebook
    </button>
    
    <div class="divider">OR</div>
    
    <!-- Alternative login options -->
    <button class="email-login-button">
      <i class="fas fa-envelope"></i> Continue with Email
    </button>
  </div>
</div>

<!-- Client-side Implementation -->
<script>
  // Global Facebook Auth Handler
  async function handleFacebookLogin() {
    try {
      // Show loading state
      const btn = document.querySelector('.fb-login-button');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
      btn.disabled = true;
      
      // Initialize if not already available
      if (typeof app === 'undefined') {
        window.app = {};
      }
      if (!app.facebook) {
        app.facebook = {
          ready: new Promise(resolve => {
            if (typeof FB !== 'undefined') {
              resolve();
            } else {
              window.fbAsyncInit = resolve;
            }
          })
        };
      }
      
      // Wait for SDK to be ready
      await app.facebook.ready;
      
      // Perform login
      const response = await new Promise(resolve => {
        FB.login(resolve, { scope: 'public_profile,email' });
      });
      
      if (response.authResponse) {
        // Send to server for verification
        const authResult = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID
          })
        });
        
        const result = await authResult.json();
        
        if (result.success) {
          window.location.href = '/dashboard';
        } else {
          showError(result.message || 'Login failed');
        }
      } else {
        showError('You cancelled the login or did not fully authorize.');
      }
    } catch (error) {
      showError('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      // Reset button state
      const btn = document.querySelector('.fb-login-button');
      btn.innerHTML = '<i class="fab fa-facebook"></i> Continue with Facebook';
      btn.disabled = false;
    }
  }
  
  function showError(message) {
    // Implement your error display logic
    alert(message); // Replace with toast or modal
  }
</script>

<!-- Styles -->
<style>
  .fb-login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .fb-login-button, .email-login-button {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .fb-login-button {
    background: #1877f2;
    color: white;
  }
  
  .email-login-button {
    background: #f0f2f5;
    color: #333;
  }
  
  .divider {
    margin: 1rem 0;
    position: relative;
  }
  
  .divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #ddd;
    z-index: -1;
  }
  
  .divider span {
    background: white;
    padding: 0 10px;
  }
</style>
```