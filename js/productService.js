/**
 * unRYL - productService.js
 * -------------------------------------------
 * Handles product fetching, searching, filtering, and sorting.
 * Works with global store.js and ui.js
 */

import { state, publish } from './store.js';

/**
 * Load products from /data/products.json
 * Populates global state and publishes productsLoaded event
 */
export async function loadProducts() {
  try {
    const res = await fetch('/data/products.json');
    if (!res.ok) throw new Error(`Failed to fetch products.json: ${res.status}`);
    const products = await res.json();

    // Ensure products is an array
    state.products = Array.isArray(products) ? products : [];

    // Notify subscribers
    publish('productsLoaded', state.products);
    return state.products;
  } catch (err) {
    console.warn('[productService] Error loading products:', err.message);
    state.products = [];
    publish('productsLoaded', state.products);
    return [];
  }
}

/**
 * Get a product by its ID
 * @param {string} productId
 * @returns {object|null}
 */
export function getProductById(productId) {
  return state.products.find(p => p.id === productId) || null;
}

/**
 * Get products by category
 * @param {string} category
 * @returns {Array}
 */
export function getProductsByCategory(category) {
  return state.products.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search products by query (name or description)
 * @param {string} query
 * @returns {Array}
 */
export function searchProducts(query) {
  if (!query) return state.products;
  const lower = query.toLowerCase();
  return state.products.filter(
    p =>
      p.name.toLowerCase().includes(lower) ||
      (p.description && p.description.toLowerCase().includes(lower))
  );
}

/**
 * Get all products
 * @returns {Array}
 */
export function getAllProducts() {
  return state.products;
}

/**
 * Sort products
 * @param {string} by - "price-asc", "price-desc", "newest"
 * @returns {Array}
 */
export function sortProducts(by) {
  const sorted = [...state.products];

  switch (by) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    default:
      return sorted;
  }
}

/**
 * Get unique categories from products
 * @returns {Array}
 */
export function getUniqueCategories() {
  const categories = state.products.map(p => p.category);
  return [...new Set(categories)];
}
