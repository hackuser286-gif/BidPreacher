/**
 * unRYL - orderService.js
 * -------------------------------------------
 * Manages order creation, checkout, and retrieval.
 * Connects cart → checkout → success → orders flow.
 */

import { state, addOrder, clearCart, publish } from './store.js';

/**
 * Calculate total amount for an array of cart items
 * @param {Array} items - Array of cart items { productId, quantity, product }
 * @returns {number} total amount
 */
export function calculateOrderTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
}

/**
 * Checkout and create a new order
 * @param {Object} userInfo - Customer info { name, email, phone, address, city, state, zip, country }
 * @returns {Object} orderData
 */
export function checkoutOrder(userInfo) {
  // Validate cart
  if (!state.cart?.items?.length) {
    throw new Error('Cart is empty. Cannot checkout.');
  }

  // Validate user info
  const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
  const missingFields = requiredFields.filter(f => !userInfo[f]);
  if (missingFields.length) {
    throw new Error(`Invalid customer information. Missing: ${missingFields.join(', ')}`);
  }

  // Build order object
  const orderData = {
    id: `ORD-${Date.now()}`, // Unique order ID
    items: JSON.parse(JSON.stringify(state.cart.items)), // Deep copy
    userInfo,
    total: calculateOrderTotal(state.cart.items),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  // Save order to store
  addOrder(orderData);

  // Clear cart
  clearCart();

  // Publish events
  publish('orderPlaced', orderData);
  publish('ordersUpdated', state.orders);

  return orderData;
}

/**
 * Get order by ID
 * @param {string} orderId
 * @returns {Object|null}
 */
export function getOrderById(orderId) {
  if (!orderId) return null;
  return state.orders.find(order => order.id === orderId) || null;
}

/**
 * Get all orders
 * @returns {Array} orders
 */
export function getAllOrders() {
  return state.orders || [];
}
