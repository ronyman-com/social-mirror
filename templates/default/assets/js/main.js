// Post creation functionality
document.querySelectorAll('.creator-option').forEach(option => {
    option.addEventListener('click', function() {
      const type = this.dataset.type;
      openPostModal(type);
    });
  });
  
  function openPostModal(type) {
    const modal = document.getElementById('post-modal');
    modal.style.display = 'block';
    
    // Set modal content based on type
    if (type === 'photo') {
      // Initialize photo uploader
      initPhotoUpload();
    }
  }
  
  function initPhotoUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*';
    fileInput.click();
    
    fileInput.addEventListener('change', function(e) {
      // Handle file upload
    });
  }


  // Post Creator Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Post creator modal
  const postCreatorInput = document.getElementById('postCreatorInput');
  const postModal = document.getElementById('postModal');
  const modalClose = postModal.querySelector('.modal-close');
  const postContent = document.getElementById('postContent');
  const submitPost = document.getElementById('submitPost');
  
  // Open modal when clicking post creator
  postCreatorInput.addEventListener('click', function() {
      postModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
  });
  
  // Close modal
  modalClose.addEventListener('click', function() {
      postModal.style.display = 'none';
      document.body.style.overflow = '';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
      if (e.target === postModal) {
          postModal.style.display = 'none';
          document.body.style.overflow = '';
      }
  });
  
  // Enable/disable post button based on content
  postContent.addEventListener('input', function() {
      submitPost.disabled = postContent.value.trim() === '';
  });
  
  // Like button functionality
  document.querySelectorAll('.like-btn').forEach(button => {
      button.addEventListener('click', function() {
          const postId = this.dataset.postId;
          const icon = this.querySelector('i');
          const span = this.querySelector('span');
          
          this.classList.toggle('active');
          
          if (this.classList.contains('active')) {
              icon.classList.remove('far');
              icon.classList.add('fas');
              span.textContent = 'Liked';
              // Send like to server
              likePost(postId, true);
          } else {
              icon.classList.remove('fas');
              icon.classList.add('far');
              span.textContent = 'Like';
              // Send unlike to server
              likePost(postId, false);
          }
      });
  });
  
  // Page like button
  const pageLikeButton = document.querySelector('.page-button.like-button');
  if (pageLikeButton) {
      pageLikeButton.addEventListener('click', function() {
          const pageId = window.location.pathname.split('/').pop();
          const icon = this.querySelector('i');
          const isActive = this.classList.contains('active');
          
          this.classList.toggle('active');
          
          if (this.classList.contains('active')) {
              this.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
              // Send like to server
              likePage(pageId, true);
          } else {
              this.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
              // Send unlike to server
              likePage(pageId, false);
          }
      });
  }
});

// Helper functions
function likePost(postId, like) {
  fetch('/api/posts/' + postId + '/like', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          like: like
      }),
      credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
      if (!data.success) {
          console.error('Error liking post:', data.error);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function likePage(pageId, like) {
  fetch('/api/pages/' + pageId + '/like', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          like: like
      }),
      credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
      if (!data.success) {
          console.error('Error liking page:', data.error);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

// Time ago helper (add this to your utilities)
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
  
  return Math.floor(seconds) + " second" + (seconds === 1 ? "" : "s") + " ago";
}