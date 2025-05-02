```html
<div class="account-management">
  <h2>Manage Your Account</h2>
  
  <!-- Facebook SDK Injection -->
  <%- plugins.facebook.sdkScript %>
  
  <div class="account-sections">
    <section class="connected-accounts">
      <h3>Connected Accounts</h3>
      <div class="connection-status">
        <i class="fab fa-facebook"></i>
        <span id="fb-status">Checking status...</span>
        <button id="fb-toggle" class="btn-link">Connect</button>
      </div>
    </section>
    
    <section class="privacy-settings">
      <h3>Privacy Settings</h3>
      <div class="setting">
        <label>
          <input type="checkbox" id="public-profile"> Show profile in search results
        </label>
      </div>
    </section>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Facebook SDK
    await new Promise(resolve => {
      if (typeof FB !== 'undefined') resolve();
      else window.fbAsyncInit = resolve;
    });
    
    const statusElement = document.getElementById('fb-status');
    const toggleButton = document.getElementById('fb-toggle');
    
    // Check connection status
    async function checkFacebookConnection() {
      try {
        const { status } = await new Promise(resolve => 
          FB.getLoginStatus(resolve)
        );
        
        if (status === 'connected') {
          statusElement.textContent = 'Connected';
          toggleButton.textContent = 'Disconnect';
          toggleButton.onclick = disconnectFacebook;
        } else {
          statusElement.textContent = 'Not connected';
          toggleButton.textContent = 'Connect';
          toggleButton.onclick = connectFacebook;
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }
    
    // Connect handler
    async function connectFacebook() {
      try {
        toggleButton.disabled = true;
        const { authResponse } = await new Promise(resolve => 
          FB.login(resolve, { scope: 'public_profile,email' })
        );
        
        if (authResponse) {
          await fetch('/account/connect/facebook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: authResponse.accessToken })
          });
          checkFacebookConnection();
        }
      } catch (error) {
        console.error('Connection failed:', error);
      } finally {
        toggleButton.disabled = false;
      }
    }
    
    // Disconnect handler
    async function disconnectFacebook() {
      try {
        toggleButton.disabled = true;
        await fetch('/account/disconnect/facebook', { method: 'POST' });
        FB.logout();
        checkFacebookConnection();
      } catch (error) {
        console.error('Disconnection failed:', error);
      } finally {
        toggleButton.disabled = false;
      }
    }
    
    // Initial check
    checkFacebookConnection();
  });
</script>

<style>
  .account-management {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .account-sections {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f0f2f5;
    border-radius: 4px;
  }
  
  .btn-link {
    margin-left: auto;
    background: none;
    border: none;
    color: #1877f2;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .setting {
    margin: 1rem 0;
    padding: 12px;
    background: #f0f2f5;
    border-radius: 4px;
  }
</style>
```