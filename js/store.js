/* ============================================================
   unRYL - Global Store (store.js)
   Centralized state manager for products, cart, and orders.
   Supports persistence, pub/sub, and clean APIs.
   ============================================================ */

import { fetchJSON, saveToStorage, getFromStorage } from './utils.js';

/* -------------------------------
   1. State Structure
--------------------------------- */
const state = {
  products: [],
  cart: { items: [] },
  orders: []
};

/* -------------------------------
   2. Pub/Sub (Observer Pattern)
--------------------------------- */
const subscribers = {};

export function subscribe(channel, callback) {
  if (!subscribers[channel]) {
    subscribers[channel] = [];
  }
  subscribers[channel].push(callback);
}

function publish(channel, data) {
  if (subscribers[channel]) {
    subscribers[channel].forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`❌ Error in subscriber for ${channel}:`, err);
      }
    });
  }
}

/* -------------------------------
   3. Initialization
--------------------------------- */
export async function initStore() {
  try {
    // Load products
    state.products = await fetchJSON('/data/products.json');

    // Load persisted cart & orders
    state.cart = getFromStorage('cart', { items: [] });
    state.orders = getFromStorage('orders', []);

    publish('productsLoaded', state.products);
  } catch (err) {
    console.error('❌ initStore failed:', err);
  }
}

/* -------------------------------
   4. Getters
--------------------------------- */
export function getProducts() {
  return state.products;
}

export function getCart() {
  return state.cart;
}

export function getOrders() {
  return state.orders;
}

/* -------------------------------
   5. Cart Management
--------------------------------- */
export function addToCart(productId, quantity = 1) {
  const product = state.products.find(p => p.id === productId);
  if (!product) {
    console.warn(`⚠️ Product ${productId} not found`);
    return;
  }

  const existing = state.cart.items.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.items.push({
      productId,
      quantity,
      price: product.price
    });
  }

  persistCart();
  publish('cartUpdated', state.cart);
}

export function removeFromCart(productId) {
  state.cart.items = state.cart.items.filter(item => item.productId !== productId);

  persistCart();
  publish('cartUpdated', state.cart);
}

export function updateCartQuantity(productId, quantity) {
  const item = state.cart.items.find(i => i.productId === productId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = quantity;

  persistCart();
  publish('cartUpdated', state.cart);
}

export function clearCart() {
  state.cart.items = [];

  persistCart();
  publish('cartUpdated', state.cart);
}

/* -------------------------------
   6. Orders Management
--------------------------------- */
export function addOrder(orderData) {
  const order = {
    id: `order_${Date.now()}`,
    items: [...state.cart.items],
    total: state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    createdAt: new Date().toISOString(),
    ...orderData
  };

  state.orders.push(order);
  saveToStorage('orders', state.orders);

  clearCart();

  publish('ordersUpdated', state.orders);
}

/* -------------------------------
   7. Persistence Helpers
--------------------------------- */
function persistCart() {
  saveToStorage('cart', state.cart);
}

/* -------------------------------
   8. Export
--------------------------------- */
export {
  state,
  publish
};
