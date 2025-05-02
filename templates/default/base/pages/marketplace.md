```html
<!-- Marketplace Template -->
<div class="marketplace-container">
  <!-- Facebook SDK Injection -->
  <%- plugins.facebook.sdkScript %>
  
  <!-- Marketplace Header -->
  <header class="marketplace-header">
    <h1><i class="fas fa-store"></i> Marketplace</h1>
    <div class="header-actions">
      <button class="btn-sell" onclick="showSellModal()">
        <i class="fas fa-plus"></i> Sell Item
      </button>
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search Marketplace...">
      </div>
    </div>
  </header>

  <!-- Categories Navigation -->
  <nav class="categories-nav">
    <div class="category active" data-category="all">All Items</div>
    <div class="category" data-category="vehicles">Vehicles</div>
    <div class="category" data-category="electronics">Electronics</div>
    <div class="category" data-category="furniture">Furniture</div>
    <div class="category" data-category="clothing">Clothing</div>
  </nav>

  <!-- Marketplace Grid -->
  <div class="items-grid" id="marketplace-items">
    <!-- Items will be loaded here dynamically -->
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i> Loading marketplace items...
    </div>
  </div>

  <!-- Sell Item Modal -->
  <div class="modal" id="sell-modal">
    <div class="modal-content">
      <span class="close" onclick="hideSellModal()">&times;</span>
      <h2>Sell an Item</h2>
      <form id="sell-form">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="item-title" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="item-description" required></textarea>
        </div>
        <div class="form-group">
          <label>Price ($)</label>
          <input type="number" id="item-price" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="item-category" required>
            <option value="other">Other</option>
            <option value="vehicles">Vehicles</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>
        <div class="form-group">
          <label>Upload Photos (Max 10)</label>
          <div class="image-upload">
            <label for="item-images" class="upload-btn">
              <i class="fas fa-camera"></i> Select Images
            </label>
            <input type="file" id="item-images" multiple accept="image/*" style="display: none;">
            <div class="preview-container" id="image-preview"></div>
          </div>
        </div>
        <button type="submit" class="btn-submit">List Item</button>
      </form>
    </div>
  </div>
</div>

<script>
  // Initialize Marketplace
  document.addEventListener('DOMContentLoaded', async () => {
    // Load Facebook SDK
    await new Promise(resolve => {
      if (typeof FB !== 'undefined') resolve();
      else window.fbAsyncInit = resolve;
    });

    // Load marketplace items
    loadMarketplaceItems();
    
    // Setup event listeners
    setupCategoryNavigation();
    setupSellForm();
  });

  // Load items from API
  async function loadMarketplaceItems(category = 'all') {
    const grid = document.getElementById('marketplace-items');
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading items...</div>';

    try {
      // In a real app, you would fetch from your API
      // const response = await fetch(`/api/marketplace?category=${category}`);
      // const items = await response.json();
      
      // Mock data for demonstration
      const items = [
        {
          id: 1,
          title: "iPhone 13 Pro",
          price: 799,
          image: "https://via.placeholder.com/300x200?text=iPhone+13+Pro",
          seller: { name: "TechGuy", avatar: "https://via.placeholder.com/50" },
          category: "electronics"
        },
        // Add more mock items...
      ];

      displayItems(items);
    } catch (error) {
      console.error('Failed to load items:', error);
      grid.innerHTML = '<div class="error-message">Failed to load items. Please try again.</div>';
    }
  }

  // Display items in grid
  function displayItems(items) {
    const grid = document.getElementById('marketplace-items');
    
    if (items.length === 0) {
      grid.innerHTML = '<div class="empty-state">No items found in this category.</div>';
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="marketplace-item" data-id="${item.id}" data-category="${item.category}">
        <div class="item-image" style="background-image: url('${item.image}')"></div>
        <div class="item-details">
          <h3 class="item-title">${item.title}</h3>
          <p class="item-price">$${item.price.toFixed(2)}</p>
          <div class="seller-info">
            <img src="${item.seller.avatar}" alt="${item.seller.name}" class="seller-avatar">
            <span class="seller-name">${item.seller.name}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Add click handlers to items
    document.querySelectorAll('.marketplace-item').forEach(item => {
      item.addEventListener('click', () => {
        const itemId = item.getAttribute('data-id');
        window.location.href = `/marketplace/item/${itemId}`;
      });
    });
  }

  // Category navigation
  function setupCategoryNavigation() {
    document.querySelectorAll('.category').forEach(category => {
      category.addEventListener('click', () => {
        document.querySelector('.category.active').classList.remove('active');
        category.classList.add('active');
        loadMarketplaceItems(category.getAttribute('data-category'));
      });
    });
  }

  // Sell modal functions
  function showSellModal() {
    document.getElementById('sell-modal').style.display = 'block';
  }

  function hideSellModal() {
    document.getElementById('sell-modal').style.display = 'none';
  }

  // Handle image upload preview
  document.getElementById('item-images').addEventListener('change', function(e) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    if (this.files.length > 10) {
      alert('Maximum 10 images allowed');
      this.value = '';
      return;
    }

    Array.from(this.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        preview.appendChild(img);
      }
      reader.readAsDataURL(file);
    });
  });

  // Handle sell form submission
  function setupSellForm() {
    document.getElementById('sell-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('title', document.getElementById('item-title').value);
      formData.append('description', document.getElementById('item-description').value);
      formData.append('price', document.getElementById('item-price').value);
      formData.append('category', document.getElementById('item-category').value);
      
      // Append all selected images
      const imageInput = document.getElementById('item-images');
      for (let i = 0; i < imageInput.files.length; i++) {
        formData.append('images', imageInput.files[i]);
      }

      try {
        // In a real app, you would post to your API
        // const response = await fetch('/api/marketplace/list', {
        //   method: 'POST',
        //   body: formData
        // });
        
        // Mock success response
        alert('Item listed successfully!');
        hideSellModal();
        this.reset();
        document.getElementById('image-preview').innerHTML = '';
        loadMarketplaceItems();
      } catch (error) {
        console.error('Listing failed:', error);
        alert('Failed to list item. Please try again.');
      }
    });
  }
</script>

<style>
  .marketplace-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .marketplace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
  }

  .btn-sell {
    background: #1877f2;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .search-bar {
    display: flex;
    align-items: center;
    background: #f0f2f5;
    padding: 10px 15px;
    border-radius: 50px;
    width: 300px;
  }

  .search-bar input {
    border: none;
    background: transparent;
    margin-left: 8px;
    width: 100%;
    outline: none;
  }

  .categories-nav {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .category {
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
  }

  .category.active {
    background: #e7f3ff;
    color: #1877f2;
    font-weight: 600;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .marketplace-item {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
    background: white;
  }

  .marketplace-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .item-image {
    height: 200px;
    background-size: cover;
    background-position: center;
  }

  .item-details {
    padding: 15px;
  }

  .item-title {
    margin: 0 0 5px 0;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-price {
    margin: 0 0 10px 0;
    font-weight: 600;
    color: #1877f2;
  }

  .seller-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .seller-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }

  .seller-name {
    font-size: 14px;
    color: #65676b;
  }

  /* Modal Styles */
  .modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  }

  .modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    position: relative;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    cursor: pointer;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .form-group textarea {
    min-height: 100px;
    resize: vertical;
  }

  .image-upload {
    margin-top: 10px;
  }

  .upload-btn {
    display: inline-block;
    padding: 8px 15px;
    background: #f0f2f5;
    border-radius: 4px;
    cursor: pointer;
  }

  .preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .preview-container img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }

  .btn-submit {
    background: #42b72a;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    width: 100%;
    margin-top: 10px;
  }

  .loading-spinner,
  .empty-state,
  .error-message {
    text-align: center;
    padding: 40px;
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    .marketplace-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .search-bar {
      width: 100%;
    }
    
    .items-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
</style>