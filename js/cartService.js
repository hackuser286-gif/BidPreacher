/**
 * unRYL - cartService.js
 * -------------------------------------------
 * Provides cart-related logic and utilities.
 * Interacts with global store.js and UI components.
 */

import {
  state,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  publish
} from './store.js';

/**
 * Get cart items with product details merged in
 * @returns {Array} cart items
 */
export function getCartItems() {
  return state.cart.items.map(item => {
    const product = state.products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product || {},
      subtotal: product ? product.price * item.quantity : 0
    };
  });
}

/**
 * Get total count of items in the cart
 * @returns {number}
 */
export function getCartCount() {
  return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Get subtotal (total price of items without taxes/shipping)
 * @returns {number}
 */
export function getCartSubtotal() {
  return getCartItems().reduce((sum, item) => sum + item.subtotal, 0);
}

/**
 * Get final total (currently same as subtotal; extendable for taxes/shipping)
 * @returns {number}
 */
export function getCartTotal() {
  return getCartSubtotal();
}

/**
 * Add item to cart
 * @param {string} productId
 * @param {number} qty
 */
export function addItem(productId, qty = 1) {
  if (!productId || qty <= 0) return;
  addToCart(productId, qty);
  publish('cartUpdated', state.cart);
}

/**
 * Remove item completely from cart
 * @param {string} productId
 */
export function removeItem(productId) {
  if (!productId) return;
  removeFromCart(productId);
  publish('cartUpdated', state.cart);
}

/**
 * Update quantity of an item in the cart
 * @param {string} productId
 * @param {number} qty
 */
export function updateItemQuantity(productId, qty) {
  if (!productId) return;
  if (qty < 0) qty = 0;
  updateCartQuantity(productId, qty);
  publish('cartUpdated', state.cart);
}

/**
 * Empty the entire cart
 */
export function emptyCart() {
  clearCart();
  publish('cartUpdated', state.cart);
}
