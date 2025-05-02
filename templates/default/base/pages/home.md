```html
<!-- templates/default/base/pages/home.md -->
<div class="home-layout">
  <!-- Sidebar Navigation -->
  <aside class="sidebar">
    <div class="sidebar-menu">
      <% sidebar.menu.forEach(item => { %>
        <a href="<%= item.link %>" class="menu-item <%= currentPage === item.link ? 'active' : '' %>">
          <div class="menu-icon">
            <% if (item.icon) { %>
              <i class="fas fa-<%= item.icon === 'home' ? 'home' : 
                                item.icon === 'friends' ? 'user-friends' :
                                item.icon === 'groups' ? 'users' :
                                item.icon === 'marketplace' ? 'store' :
                                item.icon === 'watch' ? 'tv' :
                                item.icon === 'memories' ? 'history' : 'circle' %>"></i>
            <% } %>
          </div>
          <span class="menu-title"><%= item.title %></span>
        </a>
      <% }); %>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-shortcuts">
      <h3>Your Shortcuts</h3>
      <% sidebar.shortcuts.forEach(shortcut => { %>
        <a href="<%= shortcut.link %>" class="shortcut-item">
          <div class="shortcut-icon">
            <% if (shortcut.image) { %>
              <img src="<%= shortcut.image %>" alt="<%= shortcut.title %>">
            <% } else if (shortcut.icon) { %>
              <i class="fas fa-<%= shortcut.icon === 'code' ? 'code' :
                                 shortcut.icon === 'events' ? 'calendar-alt' : 'link' %>"></i>
            <% } %>
          </div>
          <span><%= shortcut.title %></span>
        </a>
      <% }); %>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="home-content">
    <div class="stories-container">
      <div class="create-story-card">
        <div class="user-avatar">
          <img src="<%= user.avatar || '/images/default-avatar.jpg' %>" alt="Your Story">
        </div>
        <div class="story-content">
          <div class="add-story">
            <i class="fas fa-plus-circle"></i>
          </div>
          <p>Create Story</p>
        </div>
      </div>
      <!-- Story items would be looped here -->
    </div>

    <div class="post-creator">
      <div class="post-creator-header">
        <img src="<%= user.avatar || '/images/default-avatar.jpg' %>" alt="<%= user.name %>">
        <input type="text" placeholder="What's on your mind, <%= user.name.split(' ')[0] %>?">
      </div>
      <div class="post-creator-actions">
        <button class="action-btn">
          <i class="fas fa-video" style="color: #f3425f;"></i> Live Video
        </button>
        <button class="action-btn">
          <i class="fas fa-images" style="color: #45bd62;"></i> Photo/Video
        </button>
        <button class="action-btn">
          <i class="fas fa-smile" style="color: #f7b928;"></i> Feeling/Activity
        </button>
      </div>
    </div>

    <!-- Posts Feed -->
    <div class="posts-feed" id="posts-feed">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Loading posts...
      </div>
    </div>
  </main>

  <!-- Right Sidebar -->
  <aside class="right-sidebar">
    <div class="sponsored-section">
      <h3>Sponsored</h3>
      <!-- Sponsored content would go here -->
    </div>

    <div class="birthdays-section">
      <h3>Birthdays</h3>
      <div class="birthday-item">
        <i class="fas fa-birthday-cake"></i>
        <span><strong>John Doe</strong> and <strong>2 others</strong> have birthdays today.</span>
      </div>
    </div>

    <div class="contacts-section">
      <div class="contacts-header">
        <h3>Contacts</h3>
        <div class="contacts-actions">
          <i class="fas fa-video"></i>
          <i class="fas fa-search"></i>
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      <!-- Contacts list would be looped here -->
    </div>
  </aside>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Load posts data
    setTimeout(() => {
      const posts = [
        {
          id: 1,
          user: {
            name: "Jane Smith",
            avatar: "/images/avatars/user1.jpg"
          },
          content: "Just finished my new project! Check it out and let me know what you think.",
          image: "/images/posts/project.jpg",
          time: "3 hrs ago",
          likes: 24,
          comments: 5,
          shares: 2
        },
        // More mock posts...
      ];
      
      renderPosts(posts);
    }, 1500);

    function renderPosts(posts) {
      const feed = document.getElementById('posts-feed');
      
      if (posts.length === 0) {
        feed.innerHTML = '<div class="empty-state">No posts to show</div>';
        return;
      }
      
      feed.innerHTML = posts.map(post => `
        <div class="post-card">
          <div class="post-header">
            <img src="${post.user.avatar}" alt="${post.user.name}">
            <div class="post-user">
              <strong>${post.user.name}</strong>
              <span>${post.time}</span>
            </div>
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="post-content">
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post image">` : ''}
          </div>
          <div class="post-stats">
            <span>${post.likes} likes</span>
            <span>${post.comments} comments</span>
            <span>${post.shares} shares</span>
          </div>
          <div class="post-actions">
            <button><i class="far fa-thumbs-up"></i> Like</button>
            <button><i class="far fa-comment"></i> Comment</button>
            <button><i class="fas fa-share"></i> Share</button>
          </div>
        </div>
      `).join('');
    }
  });
</script>

<style>
  /* Layout Structure */
  .home-layout {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Sidebar Styles */
  .sidebar {
    position: sticky;
    top: 80px;
    height: fit-content;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 4px;
    color: #050505;
    text-decoration: none;
  }

  .menu-item:hover {
    background: #f0f2f5;
  }

  .menu-item.active {
    background: #e7f3ff;
    color: #1877f2;
    font-weight: 600;
  }

  .menu-icon {
    width: 36px;
    height: 36px;
    background: #e4e6eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }

  .menu-item.active .menu-icon {
    background: #1877f2;
    color: white;
  }

  .sidebar-divider {
    height: 1px;
    background: #ddd;
    margin: 16px 0;
  }

  .sidebar-shortcuts h3 {
    color: #65676b;
    font-size: 17px;
    padding: 8px 0;
  }

  .shortcut-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    color: #050505;
    text-decoration: none;
  }

  .shortcut-item:hover {
    background: #f0f2f5;
  }

  .shortcut-icon {
    width: 36px;
    height: 36px;
    margin-right: 10px;
    border-radius: 6px;
    overflow: hidden;
  }

  .shortcut-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Main Content Styles */
  .home-content {
    max-width: 680px;
    margin: 0 auto;
  }

  .stories-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .create-story-card {
    min-width: 120px;
    height: 200px;
    border-radius: 10px;
    background: #f0f2f5;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
  }

  .user-avatar {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid #1877f2;
    overflow: hidden;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .story-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    color: white;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    border-radius: 0 0 10px 10px;
  }

  .add-story {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #1877f2;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
  }

  /* Post Creator Styles */
  .post-creator {
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }

  .post-creator-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .post-creator-header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .post-creator-header input {
    flex: 1;
    background: #f0f2f5;
    border: none;
    border-radius: 20px;
    padding: 10px 15px;
  }

  .post-creator-actions {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }

  .action-btn {
    background: none;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }

  .action-btn:hover {
    background: #f0f2f5;
  }

  /* Right Sidebar Styles */
  .right-sidebar {
    position: sticky;
    top: 80px;
    height: fit-content;
  }

  .sponsored-section,
  .birthdays-section,
  .contacts-section {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .birthday-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .birthday-item i {
    color: #f5533d;
    font-size: 20px;
  }

  .contacts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .contacts-actions {
    display: flex;
    gap: 15px;
    color: #65676b;
  }

  /* Responsive Design */
  @media (max-width: 900px) {
    .home-layout {
      grid-template-columns: 80px 1fr;
    }
    
    .right-sidebar {
      display: none;
    }
    
    .menu-title {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .home-layout {
      grid-template-columns: 1fr;
    }
    
    .sidebar {
      display: none;
    }
  }
</style>