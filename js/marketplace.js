/**
 * Agri-Bot - Marketplace JavaScript
 * Product display, filtering, and cart functionality
 */

class Marketplace {
  constructor() {
    this.products = [];
    this.cart = [];
    this.currentCategory = 'all';
    this.searchQuery = '';
    
    this.productsGrid = document.getElementById('productsGrid');
    this.searchInput = document.getElementById('marketplaceSearch');
    this.categorySelect = document.getElementById('categoryFilter');
    this.cartToggle = document.querySelector('.cart__toggle');
    this.cartPanel = document.querySelector('.cart__panel');
    this.cartItemsContainer = document.getElementById('cartItems');
    this.cartCount = document.querySelector('.cart__count');
    this.cartTotal = document.getElementById('cartTotal');
    
    this.init();
  }
  
  async init() {
    await this.loadProducts();
    this.loadCart();
    this.renderProducts();
    this.updateCartUI();
    this.bindEvents();
  }
  
  async loadProducts() {
    try {
      const response = await fetch('data/products.json');
      if (response.ok) {
        this.products = await response.json();
      }
    } catch (e) {
      console.log('Using default products data');
      this.products = this.getDefaultProducts();
    }
  }
  
  getDefaultProducts() {
    return [
      {
        id: 1,
        name: 'Organic Fertilizer - 25kg',
        category: 'fertilizers',
        price: 850,
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80',
        description: 'Premium organic fertilizer for healthy crops'
      },
      {
        id: 2,
        name: 'Hybrid Tomato Seeds - 100g',
        category: 'seeds',
        price: 450,
        image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80',
        description: 'High-yield hybrid tomato variety'
      },
      {
        id: 3,
        name: 'Neem Oil Pesticide - 1L',
        category: 'pesticides',
        price: 320,
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80',
        description: 'Natural neem-based pest control'
      },
      {
        id: 4,
        name: 'Drip Irrigation Kit',
        category: 'equipment',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=400&q=80',
        description: 'Complete drip irrigation system for small farms'
      },
      {
        id: 5,
        name: 'Hand Sprayer - 16L',
        category: 'equipment',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1622383563227-044011358d16?auto=format&fit=crop&w=400&q=80',
        description: 'Durable manual sprayer for pesticides'
      },
      {
        id: 6,
        name: 'Wheat Seeds - 5kg',
        category: 'seeds',
        price: 280,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
        description: 'Certified HD-2967 wheat variety'
      },
      {
        id: 7,
        name: 'NPK 10-26-26 - 50kg',
        category: 'fertilizers',
        price: 1450,
        image: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?auto=format&fit=crop&w=400&q=80',
        description: 'Balanced NPK fertilizer for all crops'
      },
      {
        id: 8,
        name: 'Garden Tool Set',
        category: 'equipment',
        price: 890,
        image: 'https://images.unsplash.com/photo-1416872927374-4c60faaf9569?auto=format&fit=crop&w=400&q=80',
        description: '5-piece essential garden tool set'
      },
      {
        id: 9,
        name: 'Bio Fungicide - 500ml',
        category: 'pesticides',
        price: 380,
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80',
        description: 'Organic fungicide for disease control'
      },
      {
        id: 10,
        name: 'Paddy Seeds - 10kg',
        category: 'seeds',
        price: 520,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
        description: 'High-yielding basmati variety'
      },
      {
        id: 11,
        name: 'Vermicompost - 50kg',
        category: 'fertilizers',
        price: 600,
        image: 'https://images.unsplash.com/photo-1603816664923-38c267a5df2d?auto=format&fit=crop&w=400&q=80',
        description: 'Premium quality vermicompost'
      },
      {
        id: 12,
        name: 'Solar Pest Trap',
        category: 'equipment',
        price: 1850,
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80',
        description: 'Solar-powered insect trap'
      }
    ];
  }
  
  loadCart() {
    const savedCart = localStorage.getItem('agribot_cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }
  }
  
  saveCart() {
    localStorage.setItem('agribot_cart', JSON.stringify(this.cart));
  }
  
  bindEvents() {
    // Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderProducts();
      });
    }
    
    // Category filter
    if (this.categorySelect) {
      this.categorySelect.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.renderProducts();
      });
    }
    
    // Cart toggle
    if (this.cartToggle) {
      this.cartToggle.addEventListener('click', () => {
        this.cartPanel.classList.toggle('active');
      });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (this.cartPanel && !this.cartPanel.contains(e.target) && 
          !this.cartToggle.contains(e.target)) {
        this.cartPanel.classList.remove('active');
      }
    });
  }
  
  getFilteredProducts() {
    return this.products.filter(product => {
      const matchesCategory = this.currentCategory === 'all' || 
                             product.category === this.currentCategory;
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery) ||
                           product.description.toLowerCase().includes(this.searchQuery);
      return matchesCategory && matchesSearch;
    });
  }
  
  renderProducts() {
    if (!this.productsGrid) return;
    
    const filtered = this.getFilteredProducts();
    
    if (filtered.length === 0) {
      this.productsGrid.innerHTML = `
        <div class="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      `;
      return;
    }
    
    this.productsGrid.innerHTML = filtered.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-card__image-wrapper" style="background:#f0f0f0; display:flex; align-items:center; justify-content:center; min-height:220px; border-radius:12px;">
          <div style="text-align:center; color:#666; font-size:0.9rem;">${product.name}</div>
        </div>
        <div class="product-card__content">
          <span class="product-card__category">${product.category}</span>
          <h3 class="product-card__title">${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-card__price">${this.formatPrice(product.price)}</div>
          <button class="btn btn-primary product-card__btn" onclick="marketplace.addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  }
  
  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartUI();
    this.showAddedAnimation(productId);
  }
  
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  }
  
  updateQuantity(productId, change) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.saveCart();
      this.updateCartUI();
    }
  }
  
  updateCartUI() {
    // Update count
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (this.cartCount) {
      this.cartCount.textContent = totalItems;
      this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update items list
    if (this.cartItemsContainer) {
      if (this.cart.length === 0) {
        this.cartItemsContainer.innerHTML = '<p class="cart__empty">Your cart is empty</p>';
      } else {
        this.cartItemsContainer.innerHTML = this.cart.map(item => `
          <div class="cart__item">
            <div class="cart__item-image" style="width:60px; height:60px; background:#f0f0f0; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.75rem; text-align:center; color:#999; flex-shrink:0;">${item.name}</div>
            <div class="cart__item-info">
              <div class="cart__item-title">${item.name}</div>
              <div class="cart__item-price">${this.formatPrice(item.price)} × ${item.quantity}</div>
            </div>
            <button class="cart__item-remove" onclick="marketplace.removeFromCart(${item.id})">×</button>
          </div>
        `).join('');
      }
    }
    
    // Update total
    if (this.cartTotal) {
      const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      this.cartTotal.textContent = this.formatPrice(total);
    }
  }
  
  showAddedAnimation(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (card) {
      card.classList.add('added');
      setTimeout(() => card.classList.remove('added'), 500);
    }
  }
  
  formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
  
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartUI();
  }
  
  checkout() {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Order Summary:\n\nItems: ${itemCount}\nTotal: ${this.formatPrice(total)}\n\nThank you for your order! (Demo - No actual payment)`);
    this.clearCart();
    this.cartPanel.classList.remove('active');
  }
}

// Initialize marketplace when DOM is ready
let marketplace;
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productsGrid')) {
    marketplace = new Marketplace();
  }
});
