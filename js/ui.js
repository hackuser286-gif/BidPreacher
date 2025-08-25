// ===============================
// js/ui.js - unRYL Frontend UI Manager
// ===============================

import { 
  state, subscribe, publish, addToCart 
} from './store.js';
import { showToast, formatPrice } from './utils.js';

// -------------------------------
// TEMPLATE HELPERS
// -------------------------------

function productCardTemplate(product) {
  return `
    <div class="card">
      <div class="card-image">
        <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}">
      </div>
      <div class="card-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${formatPrice(product.price)}</p>
        <div class="card-actions">
          <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
          <button class="btn btn-accent buy-now" data-id="${product.id}">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

function cartItemTemplate(item) {
  return `
    <div class="cart-item">
      <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" class="cart-thumb">
      <div class="cart-details">
        <h4>${item.name}</h4>
        <p>Seller: ${item.seller || 'Unknown'}</p>
        <p>Price: ${formatPrice(item.price)}</p>
        <div class="cart-qty">
          <button class="qty-minus" data-id="${item.id}">-</button>
          <span class="qty">${item.quantity}</span>
          <button class="qty-plus" data-id="${item.id}">+</button>
        </div>
        <button class="btn btn-error remove-item" data-id="${item.id}">Remove 🗑️</button>
      </div>
    </div>
  `;
}

function orderCardTemplate(order) {
  return `
    <div class="card order-card">
      <h4>Order #${order.id}</h4>
      <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p>Status: <span class="badge ${order.status}">${order.status}</span></p>
      <p>Total: ${formatPrice(order.total)}</p>
      <button class="btn btn-accent view-order" data-id="${order.id}">View Details</button>
    </div>
  `;
}
// -------------------------------
// RENDERING FUNCTIONS
// -------------------------------

export function renderProducts(productList = state.products, containerId = 'productGrid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (!productList || productList.length === 0) {
    container.innerHTML = `<p class="text-center">No products found 😢</p>`;
    return;
  }

  productList.forEach(product => {
    container.insertAdjacentHTML('beforeend', productCardTemplate(product));
  });

  bindAddToCartButtons();
}

export function renderCart(containerId = 'cartContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const cartItems = state.cart.items || [];

  if (cartItems.length === 0) {
    container.innerHTML = `<p class="text-center">Your cart is empty 🛒</p>
      <a href="index.html" class="btn btn-primary mt-2">Go Shopping</a>`;
    updateCartBadge();
    return;
  }

  cartItems.forEach(item => {
    container.insertAdjacentHTML('beforeend', cartItemTemplate(item));
  });

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const summary = document.createElement('div');
  summary.className = 'cart-summary';
  summary.innerHTML = `
    <h3>Subtotal: ${formatPrice(subtotal)}</h3>
    <a href="checkout.html" class="btn btn-primary">Proceed to Checkout</a>
  `;
  container.appendChild(summary);

  bindCartActions();
  updateCartBadge();
}

export function renderOrders(containerId = 'ordersContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const orders = state.orders || [];
  container.innerHTML = '';

  if (orders.length === 0) {
    container.innerHTML = `<p class="text-center">You haven’t ordered anything yet 😎</p>
      <a href="index.html" class="btn btn-primary mt-2">Go Shopping</a>`;
    return;
  }

  orders.forEach(order => {
    container.insertAdjacentHTML('beforeend', orderCardTemplate(order));
  });
}

export function updateCartBadge(badgeId = 'cartBadge') {
  const badge = document.querySelector(`.${badgeId}`) || document.getElementById(badgeId);
  if (!badge) return;
  const count = state.cart.items.reduce((acc, i) => acc + i.quantity, 0);
  badge.textContent = count;
}

// -------------------------------
// EVENT BINDERS
// -------------------------------

export function bindAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      addToCart(id);
      publish('cartUpdated');
      showToast('Added to cart!', 'success');
    };
  });

  document.querySelectorAll('.buy-now').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      addToCart(id);
      publish('cartUpdated');
      window.location.href = 'checkout.html';
    };
  });
}

export function bindCartActions() {
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.target.dataset.id;
      const item = state.cart.items.find(i => i.id === id);
      if (!item) return;
      item.quantity += 1;
      publish('cartUpdated');
    };
  });

  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.target.dataset.id;
      const item = state.cart.items.find(i => i.id === id);
      if (!item) return;
      item.quantity = Math.max(1, item.quantity - 1);
      publish('cartUpdated');
    };
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.target.dataset.id;
      const index = state.cart.items.findIndex(i => i.id === id);
      if (index > -1) {
        state.cart.items.splice(index, 1);
        publish('cartUpdated');
        showToast('Removed from cart', 'error');
      }
    };
  });
}

// -------------------------------
// INITIALIZER
// -------------------------------

export function initUI(config = {}) {
  subscribe('cartUpdated', () => {
    renderCart();
    updateCartBadge();
  });

  subscribe('ordersUpdated', () => {
    renderOrders();
  });

  subscribe('productsLoaded', (products) => {
    renderProducts(products);
  });

  subscribe('productsFiltered', (filteredProducts) => {
    renderProducts(filteredProducts);
  });

  if (state.products.length) renderProducts();
  if (state.cart.items.length) renderCart();
  if (state.orders.length) renderOrders();
}
// ================================
// js/ui.js - Search & Filter Integration
// ================================

import { getAllProducts } from './productService.js';
import { publish } from './store.js';
import { debounce } from './utils.js';

// -------------------------------
// SEARCH & FILTER STATE
// -------------------------------

let currentSearchQuery = '';
let currentFilters = {
  category: 'all',      // tshirt, pants, hoodies, caps, accessories, sneakers, etc.
  priceRange: [0, Infinity],
  seller: null,
  sort: 'newest',       // newest, priceAsc, priceDesc
};

// -------------------------------
// EVENT HANDLERS
// -------------------------------

function handleSearchInput(e) {
  currentSearchQuery = e.target.value.trim();
  applySearchAndFilter();
}

function handleCategoryFilter(e) {
  currentFilters.category = e.target.value;
  applySearchAndFilter();
}

function handleSortFilter(e) {
  currentFilters.sort = e.target.value;
  applySearchAndFilter();
}

// -------------------------------
// APPLY SEARCH + FILTER
// -------------------------------

export function applySearchAndFilter() {
  let products = getAllProducts();

  // 1. SEARCH
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.title?.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // 2. CATEGORY FILTER
  if (currentFilters.category && currentFilters.category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === currentFilters.category.toLowerCase());
  }

  // 3. PRICE FILTER
  products = products.filter(p => p.price >= currentFilters.priceRange[0] && p.price <= currentFilters.priceRange[1]);

  // 4. SORT
  if (currentFilters.sort === 'priceAsc') {
    products.sort((a,b) => a.price - b.price);
  } else if (currentFilters.sort === 'priceDesc') {
    products.sort((a,b) => b.price - a.price);
  } else if (currentFilters.sort === 'newest') {
    products.sort((a,b) => b.id - a.id); // assuming id increases with newest
  }

  // PUBLISH filtered products to UI
  publish('productsFiltered', products);
}

// -------------------------------
// INITIALIZE SEARCH + FILTER UI
// -------------------------------

export function initSearchAndFilters(searchInputId='searchInput', categorySelectId='categoryFilter', sortSelectId='sortFilter') {
  const searchInput = document.getElementById(searchInputId);
  const categorySelect = document.getElementById(categorySelectId);
  const sortSelect = document.getElementById(sortSelectId);

  if (searchInput) searchInput.addEventListener('input', debounce(handleSearchInput, 300));
  if (categorySelect) categorySelect.addEventListener('change', handleCategoryFilter);
  if (sortSelect) sortSelect.addEventListener('change', handleSortFilter);
}

// -------------------------------
// RESET FILTERS FUNCTION
// -------------------------------

export function resetFilters() {
  currentSearchQuery = '';
  currentFilters = { category: 'all', priceRange: [0, Infinity], seller: null, sort: 'newest' };
  publish('productsFiltered', getAllProducts());
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortFilter');
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'all';
  if (sortSelect) sortSelect.value = 'newest';
}
