```html
<div class="signup-container">
  <h2>Create New Account</h2>
  
  <!-- Facebook SDK Injection -->
  <%- plugins.facebook.sdkScript %>
  
  <div class="signup-options">
    <button class="fb-signup-btn" onclick="handleFacebookSignup()">
      <i class="fab fa-facebook"></i> Sign Up with Facebook
    </button>
    
    <div class="divider">OR</div>
    
    <form id="email-signup-form">
      <div class="form-group">
        <input type="text" placeholder="Full Name" required>
      </div>
      <div class="form-group">
        <input type="email" placeholder="Email" required>
      </div>
      <div class="form-group">
        <input type="password" placeholder="Password" required>
      </div>
      <button type="submit" class="email-signup-btn">
        Sign Up
      </button>
    </form>
  </div>
  
  <p class="login-link">Already have an account? <a href="/login">Log In</a></p>
</div>

<script>
  async function handleFacebookSignup() {
    try {
      const btn = document.querySelector('.fb-signup-btn');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
      
      await new Promise(resolve => {
        if (typeof FB !== 'undefined') resolve();
        else window.fbAsyncInit = resolve;
      });
      
      const { authResponse } = await new Promise(resolve => 
        FB.login(resolve, { scope: 'public_profile,email' })
      );
      
      if (authResponse) {
        const userData = await new Promise(resolve => 
          FB.api('/me?fields=name,email', resolve)
        );
        
        // Submit to your backend
        const response = await fetch('/auth/facebook/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: authResponse.accessToken,
            userData
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          window.location.href = '/welcome';
        } else {
          throw new Error(result.message || 'Signup failed');
        }
      } else {
        throw new Error('Facebook authorization cancelled');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      const btn = document.querySelector('.fb-signup-btn');
      btn.innerHTML = '<i class="fab fa-facebook"></i> Sign Up with Facebook';
    }
  }
</script>

<style>
  .signup-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .fb-signup-btn {
    width: 100%;
    padding: 12px;
    background: #1877f2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .email-signup-btn {
    width: 100%;
    padding: 12px;
    background: #42b72a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .login-link {
    text-align: center;
    margin-top: 1rem;
  }
</style>
```