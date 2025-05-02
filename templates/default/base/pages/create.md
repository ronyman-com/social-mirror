```html
<div class="create-post-container">
  <h2>Create New Post</h2>
  
  <!-- Facebook SDK Injection -->
  <%- plugins.facebook.sdkScript %>
  
  <form id="post-form">
    <div class="form-group">
      <textarea 
        id="post-content" 
        placeholder="What's on your mind?"
        maxlength="5000"
      ></textarea>
      <div class="char-counter"><span>0</span>/5000</div>
    </div>
    
    <div class="privacy-selector">
      <label>Privacy:</label>
      <select id="post-privacy">
        <option value="EVERYONE">Public</option>
        <option value="FRIENDS">Friends</option>
        <option value="SELF">Only Me</option>
      </select>
    </div>
    
    <div class="post-actions">
      <button type="button" class="btn-media">
        <i class="fas fa-image"></i> Photo/Video
      </button>
      <button type="button" class="btn-tag">
        <i class="fas fa-user-tag"></i> Tag People
      </button>
      <button type="submit" class="btn-post">
        <i class="fas fa-paper-plane"></i> Post
      </button>
    </div>
  </form>
</div>

<script>
  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Facebook SDK
    await new Promise(resolve => {
      if (typeof FB !== 'undefined') resolve();
      else window.fbAsyncInit = resolve;
    });
    
    const form = document.getElementById('post-form');
    const textarea = document.getElementById('post-content');
    const charCounter = document.querySelector('.char-counter span');
    
    // Character counter
    textarea.addEventListener('input', () => {
      charCounter.textContent = textarea.value.length;
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const response = await FB.api('/me/feed', 'POST', {
          message: textarea.value,
          privacy: { value: document.getElementById('post-privacy').value }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        alert('Post created successfully!');
        textarea.value = '';
        charCounter.textContent = '0';
      } catch (error) {
        console.error('Post error:', error);
        alert(`Failed to post: ${error.message}`);
      }
    });
  });
</style>

<style>
  .create-post-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .form-group {
    margin-bottom: 1rem;
    position: relative;
  }
  
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
  }
  
  .char-counter {
    text-align: right;
    font-size: 0.8rem;
    color: #666;
  }
  
  .post-actions {
    display: flex;
    gap: 8px;
    margin-top: 1rem;
  }
  
  button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .btn-post {
    background: #1877f2;
    color: white;
    margin-left: auto;
  }
</style>
```