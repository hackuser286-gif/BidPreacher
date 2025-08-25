/* ============================================================
   unRYL - UI Connector (ui.js)
   Connects store (state) with DOM: renders products, cart, orders,
   binds UI events, and reacts to store pub/sub events.
   ============================================================ */

import {
  subscribe,
  getProducts,
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  addOrder,
  publish
} from './store.js';

import {
  formatPrice,
  showToast,
  debounce,
  validateEmail,
  validatePhone,
  generateID,
  formatDate
} from './utils.js';

/* -------------------------------
   Utility DOM Helpers
--------------------------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* -------------------------------
   Render: Product Cards
--------------------------------- */
/**
 * Render product cards into a container.
 * productList: array of product objects
 * containerId: DOM id string (defaults to "productGrid")
 */
export function renderProducts(productList = null, containerId = 'productGrid') {
  try {
    const products = productList || getProducts();
    const container = document.getElementById(containerId);
    if (!container) return; // graceful if page doesn't have this container

    // clear
    container.innerHTML = '';

    // build cards
    products.forEach((p) => {
      const id = p.id ?? generateID('prod');
      const title = p.title || p.name || 'Untitled Product';
      const desc = p.description || p.desc || 'Fresh Gen Z drip — grab it while it’s hot.';
      const img = (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80';
      const price = typeof p.price === 'number' ? formatPrice(p.price) : (p.price || '—');

      const card = document.createElement('article');
      card.className = 'card product-item';
      card.innerHTML = `
        <img src="${img}" alt="${title}" loading="lazy" />
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <p class="card-text">${desc}</p>
          <p class="card-price">${price}</p>
          <div class="product-actions">
            <button class="btn btn-secondary add-to-cart" data-id="${id}">Add to Cart</button>
            <button class="btn btn-primary buy-now" data-id="${id}">Buy Now</button>
          </div>
        </div>
      `;

      // attach dataset product-id for later binding (use actual p.id if present)
      card.querySelectorAll('[data-id]').forEach(el => el.dataset.productId = (p.id ?? id));

      container.appendChild(card);
    });

    // bind buttons after render
    bindAddToCartButtons(container);
  } catch (err) {
    console.error('renderProducts error:', err);
  }
}

/* -------------------------------
   Render: Cart
--------------------------------- */
/**
 * Render cart UI into a container.
 * containerId default: "cartItems"
 */
export function renderCart(containerId = 'cartItems') {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cart = getCart();
    const products = getProducts();

    if (!cart || !cart.items || cart.items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add some fresh drops to get started.</p>
          <a href="index.html" class="btn btn-primary">Go Shopping</a>
        </div>
      `;
      updateCartBadge();
      return;
    }

    // Build list
    container.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'cart-list';

    cart.items.forEach((item) => {
      const product = products.find(p => p.id === item.productId) || {};
      const title = product.title || product.name || 'Unknown product';
      const img = (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80';
      const price = typeof item.price === 'number' ? formatPrice(item.price) : formatPrice(product.price || 0);
      const qty = item.quantity || 1;

      const card = document.createElement('article');
      card.className = 'cart-item';
      card.dataset.productId = item.productId;
      card.innerHTML = `
        <div style="display:flex;gap:1rem;align-items:center">
          <img src="${img}" alt="${title}" width="80" height="80" style="border-radius:8px;object-fit:cover" />
          <div>
            <h4 style="margin:0">${title}</h4>
            <p class="muted" style="margin:0">Sold by: ${product.sellerName || product.seller || 'Unknown'}</p>
            <p class="muted" style="margin:0">${price}</p>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem">
          <div class="cart-qty" style="display:flex;align-items:center;gap:0.5rem">
            <button class="qty-btn qty-decrease" aria-label="Decrease quantity">−</button>
            <input class="qty-input" type="number" min="1" value="${qty}" style="width:50px;text-align:center" />
            <button class="qty-btn qty-increase" aria-label="Increase quantity">+</button>
          </div>
          <div>
            <button class="btn-link btn-remove">🗑️ Remove</button>
          </div>
        </div>
      `;

      list.appendChild(card);
    });

    container.appendChild(list);

    // Render subtotal area if exists
    const subtotal = cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
    const summaryHtml = document.createElement('div');
    summaryHtml.className = 'cart-subtotal';
    summaryHtml.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem">
        <strong>Subtotal</strong>
        <strong>${formatPrice(subtotal)}</strong>
      </div>
    `;
    container.appendChild(summaryHtml);

    // Bind cart actions
    bindCartActions(container);
    updateCartBadge();
  } catch (err) {
    console.error('renderCart error:', err);
  }
}

/* -------------------------------
   Render: Orders
--------------------------------- */
export function renderOrders(containerId = 'ordersList') {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    const orders = getOrders();
    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div class="orders-empty">
          <h3>No orders yet</h3>
          <p class="muted">You haven't placed any orders. Time to cop some drip 😎</p>
          <a href="index.html" class="btn btn-primary">Shop Now</a>
        </div>
      `;
      return;
    }

    // Clear and render
    container.innerHTML = '';
    orders.slice().reverse().forEach((order) => {
      const created = formatDate(order.createdAt || order.created || new Date().toISOString());
      const total = formatPrice(order.total || 0);
      const itemsCount = (order.items || []).reduce((s, it) => s + (it.quantity || 1), 0);

      const card = document.createElement('article');
      card.className = 'order-card';
      card.innerHTML = `
        <div class="order-header" style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <h4 style="margin:0">Order ${order.id}</h4>
            <p class="muted" style="margin:0">${created} • ${itemsCount} items</p>
          </div>
          <div>
            <strong>${total}</strong>
          </div>
        </div>
        <div class="order-actions" style="margin-top:0.75rem">
          <button class="btn-sm btn-outline view-details" data-order="${order.id}">View Details</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('renderOrders error:', err);
  }
}

/* -------------------------------
   Update Cart Badge
--------------------------------- */
export function updateCartBadge(selector = '.cart-count') {
  try {
    const badgeEls = qsa(selector);
    const cart = getCart();
    const count = (cart && cart.items && cart.items.reduce((s, i) => s + (i.quantity || 0), 0)) || 0;
    badgeEls.forEach(el => (el.textContent = count));
  } catch (err) {
    console.error('updateCartBadge error:', err);
  }
}

/* -------------------------------
   Event Binding: Add to Cart / Buy Now
--------------------------------- */
export function bindAddToCartButtons(root = document) {
  try {
    const addButtons = qsa('.add-to-cart', root);
    addButtons.forEach(btn => {
      // avoid double-binding
      btn.onclick = null;
      btn.addEventListener('click', (e) => {
        const productId = btn.dataset.productId || btn.dataset.id;
        if (!productId) return;
        addToCart(productId, 1);
        showToast('Added to cart', 'success');
      });
    });

    // Buy Now buttons - add & go to checkout
    const buyButtons = qsa('.buy-now', root);
    buyButtons.forEach(btn => {
      btn.onclick = null;
      btn.addEventListener('click', (e) => {
        const productId = btn.dataset.productId || btn.dataset.id;
        if (!productId) return;
        addToCart(productId, 1);
        showToast('Preparing checkout...', 'info');
        // redirect to checkout
        window.location.href = 'checkout.html';
      });
    });
  } catch (err) {
    console.error('bindAddToCartButtons error:', err);
  }
}

/* -------------------------------
   Event Binding: Cart Actions
--------------------------------- */
export function bindCartActions(container = document) {
  try {
    const root = container;
    // Quantity increase
    qsa('.qty-increase', root).forEach(btn => {
      btn.onclick = null;
      btn.addEventListener('click', () => {
        const itemEl = btn.closest('.cart-item');
        if (!itemEl) return;
        const pid = itemEl.dataset.productId;
        const input = qs('.qty-input', itemEl);
        const val = parseInt(input.value || '1', 10) + 1;
        input.value = val;
        updateCartQuantity(pid, val);
      });
    });

    // Quantity decrease
    qsa('.qty-decrease', root).forEach(btn => {
      btn.onclick = null;
      btn.addEventListener('click', () => {
        const itemEl = btn.closest('.cart-item');
        if (!itemEl) return;
        const pid = itemEl.dataset.productId;
        const input = qs('.qty-input', itemEl);
        let val = parseInt(input.value || '1', 10) - 1;
        if (val < 1) val = 1;
        input.value = val;
        updateCartQuantity(pid, val);
      });
    });

    // Direct quantity input
    qsa('.qty-input', root).forEach(input => {
      input.onchange = null;
      input.addEventListener('change', () => {
        const itemEl = input.closest('.cart-item');
        if (!itemEl) return;
        const pid = itemEl.dataset.productId;
        let val = parseInt(input.value, 10) || 1;
        if (val < 1) val = 1;
        input.value = val;
        updateCartQuantity(pid, val);
      });
    });

    // Remove button
    qsa('.btn-remove', root).forEach(btn => {
      btn.onclick = null;
      btn.addEventListener('click', () => {
        const itemEl = btn.closest('.cart-item');
        if (!itemEl) return;
        const pid = itemEl.dataset.productId;
        removeFromCart(pid);
        showToast('Removed from cart', 'info');
      });
    });

    // Checkout from cart page
    const checkoutBtn = qs('.btn-primary[href="checkout.html"], a[href="checkout.html"]') || qs('a.btn-primary[href="checkout.html"]');
    // (If there's a dedicated checkout button element, its click will be a normal link)
  } catch (err) {
    console.error('bindCartActions error:', err);
  }
}

/* -------------------------------
   Event Binding: Checkout Actions
--------------------------------- */
/**
 * Binds checkout form submit: validates inputs, creates order, redirects to success.
 * Expects: #checkoutForm on checkout.html
 */
export function bindCheckoutActions() {
  try {
    const form = qs('#checkoutForm');
    if (!form) return;

    form.onsubmit = null;
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // collect form fields
      const formData = new FormData(form);
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const phone = formData.get('phone')?.trim();
      const address = formData.get('address')?.trim();
      const city = formData.get('city')?.trim();
      const stateField = formData.get('state')?.trim();
      const zip = formData.get('zip')?.trim();
      const country = formData.get('country')?.trim();
      const payment = formData.get('payment') || 'cod';

      // basic validation
      if (!name || !validateEmail(email) || !validatePhone(phone) || !address) {
        showToast('Please fill valid shipping details (name, email, phone, address).', 'error');
        return;
      }

      // build order object
      const orderData = {
        customer: { name, email, phone, address, city, state: stateField, zip, country },
        paymentMethod: payment,
        status: 'processing'
      };

      addOrder(orderData);
      showToast('Order placed — thanks! Redirecting...', 'success');

      // small delay for UX
      setTimeout(() => {
        window.location.href = 'success.html';
      }, 900);
    });
  } catch (err) {
    console.error('bindCheckoutActions error:', err);
  }
}

/* -------------------------------
   Initialization: initUI
--------------------------------- */
/**
 * Initialize UI wiring on page load.
 * - Render products (if container present)
 * - Render cart and orders (if relevant)
 * - Bind checkout form
 * - Subscribe to store events
 */
export function initUI(config = {}) {
  try {
    // Optionally use config (brand, owner email) to set site title etc.
    if (config && config.siteTitle) {
      document.title = config.siteTitle + ' | ' + (document.title || 'unRYL');
    }

    // Initial renders if containers exist
    renderProducts(null, 'productGrid'); // safe: will noop if container missing
    renderCart('cartItems');
    renderOrders('ordersList');

    // Bind checkout form actions
    bindCheckoutActions();

    // Subscribe to store events for reactivity
    subscribe('cartUpdated', (cart) => {
      // update cart UI and badge
      renderCart('cartItems');
      updateCartBadge('.cart-count');
    });

    subscribe('ordersUpdated', (orders) => {
      renderOrders('ordersList');
    });

    subscribe('productsLoaded', (products) => {
      // re-render products if product grid exists
      renderProducts(products, 'productGrid');
    });

    // Navbar search (if present)
    const searchInput = qs('#searchInput');
    if (searchInput) {
      const onSearch = debounce((e) => {
        const q = e.target.value.trim().toLowerCase();
        const all = getProducts();
        const filtered = all.filter(p => {
          const txt = `${p.title || p.name || ''} ${p.description || p.desc || ''}`.toLowerCase();
          return txt.includes(q);
        });
        renderProducts(filtered, 'productGrid');
      }, 300);
      searchInput.addEventListener('input', onSearch);
    }

    // update cart badge initially
    updateCartBadge('.cart-count');
  } catch (err) {
    console.error('initUI error:', err);
  }
}

/* -------------------------------
   Exports
--------------------------------- */
export {
  initUI,
  renderProducts,
  renderCart,
  renderOrders,
  updateCartBadge,
  bindAddToCartButtons,
  bindCartActions,
  bindCheckoutActions
};
