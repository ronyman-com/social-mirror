```html
<!-- templates/default/auth/signout.md -->
<div class="logout-confirmation">
  <div class="logout-modal">
    <div class="logout-header">
      <i class="fas fa-door-open"></i>
      <h3>Log Out of Facebook Mirror?</h3>
    </div>
    
    <div class="logout-body">
      <p>You can always log back in at any time.</p>
      
      <div class="logout-buttons">
        <form action="/auth/signout" method="POST">
          <input type="hidden" name="_method" value="DELETE">
          <button type="submit" class="logout-confirm">
            <i class="fas fa-check-circle"></i> Confirm Log Out
          </button>
        </form>
        <button class="logout-cancel" onclick="window.location.href='/'">
          <i class="fas fa-times-circle"></i> Cancel
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .logout-confirmation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .logout-modal {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    animation: modalFadeIn 0.3s ease-out;
  }

  .logout-header {
    background: #f0f2f5;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #dddfe2;
  }

  .logout-header i {
    font-size: 36px;
    color: #1877f2;
    margin-bottom: 10px;
  }

  .logout-header h3 {
    margin: 0;
    color: #1d2129;
  }

  .logout-body {
    padding: 20px;
    text-align: center;
  }

  .logout-body p {
    color: #65676b;
    margin-bottom: 20px;
  }

  .logout-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .logout-confirm,
  .logout-cancel {
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .logout-confirm {
    background: #1877f2;
    color: white;
  }

  .logout-confirm:hover {
    background: #166fe5;
  }

  .logout-cancel {
    background: #e4e6eb;
    color: #1d2129;
  }

  .logout-cancel:hover {
    background: #d8dadf;
  }

  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>

<script>
  // Handle auto-logout (e.g., session timeout)
  if (new URLSearchParams(window.location.search).has('timeout')) {
    document.querySelector('.logout-body p').textContent = 
      'Your session has timed out. Please log in again.';
    document.querySelector('.logout-cancel').onclick = function() {
      window.location.href = '/login';
    };
  }
</script>
```