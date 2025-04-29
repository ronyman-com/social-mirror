// Like functionality
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postId = this.dataset.postId;
      const likeIcon = this.querySelector('i');
      
      if (this.classList.contains('liked')) {
        // Unlike post
        this.classList.remove('liked');
        likeIcon.className = 'far fa-thumbs-up';
        updateLikeCount(postId, -1);
      } else {
        // Like post
        this.classList.add('liked');
        likeIcon.className = 'fas fa-thumbs-up';
        likeIcon.style.color = '#1877f2';
        updateLikeCount(postId, 1);
      }
    });
  });
  
  function updateLikeCount(postId, change) {
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    const likeCountElement = postElement.querySelector('.post-likes span');
    const currentCount = parseInt(likeCountElement.textContent);
    likeCountElement.textContent = currentCount + change;
    
    // In a real app, you would send an AJAX request here
    fetch(`/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: change > 0 ? 'like' : 'unlike' })
    });
  }