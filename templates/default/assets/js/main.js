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