document.addEventListener('DOMContentLoaded', function() {
    // Handle friend list toggle
    const friendListToggle = document.querySelector('.friend-list-toggle');
    if (friendListToggle) {
      friendListToggle.addEventListener('click', function() {
        document.querySelector('.friend-list').classList.toggle('collapsed');
        this.querySelector('i').classList.toggle('fa-chevron-down');
        this.querySelector('i').classList.toggle('fa-chevron-up');
      });
    }
    
    // Handle sidebar resizing
    const sidebarResizeHandle = document.querySelector('.sidebar-resize-handle');
    if (sidebarResizeHandle) {
      sidebarResizeHandle.addEventListener('mousedown', initResize);
    }
  });
  
  function initResize(e) {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
    
    function resize(e) {
      document.querySelector('.left-sidebar').style.width = 
        (e.clientX + 10) + 'px';
    }
    
    function stopResize() {
      window.removeEventListener('mousemove', resize);
    }
  }