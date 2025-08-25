/**
 * unRYL - searchFilter.js
 * -------------------------------------------
 * Provides search and filtering functionality for the product catalog.
 * Works with productService.js and store.js to manage filtered product data.
 */

import {
  getAllProducts
} from './productService.js';
import { publish } from './store.js';

/**
 * Current state of filters
 */
let currentFilters = {
  searchQuery: '',
  category: 'all',
  priceRange: null, // [min, max]
  seller: null,
  sort: null // 'priceAsc', 'priceDesc', 'newest'
};

/**
 * Search products by query string (name, title, description, category)
 * @param {string} query
 * @returns {Array} filtered products
 */
export function searchProducts(query) {
  const allProducts = getAllProducts();
  const normalizedQuery = query.trim().toLowerCase();

  const results = allProducts.filter(product => {
    return (
      product.name?.toLowerCase().includes(normalizedQuery) ||
      product.title?.toLowerCase().includes(normalizedQuery) ||
      product.description?.toLowerCase().includes(normalizedQuery) ||
      product.category?.toLowerCase().includes(normalizedQuery)
    );
  });

  currentFilters.searchQuery = normalizedQuery;
  publish('productsFiltered', results);
  return results;
}

/**
 * Filter products based on multiple criteria
 * @param {Object} filters
 * @returns {Array} filtered products
 */
export function filterProducts(filters = {}) {
  const allProducts = getAllProducts();
  let results = [...allProducts];

  // Category filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter(p => p.category === filters.category);
    currentFilters.category = filters.category;
  }

  // Price range filter
  if (filters.priceRange && Array.isArray(filters.priceRange)) {
    const [min, max] = filters.priceRange;
    results = results.filter(p => p.price >= min && p.price <= max);
    currentFilters.priceRange = filters.priceRange;
  }

  // Seller filter
  if (filters.seller) {
    results = results.filter(p => p.sellerId === filters.seller);
    currentFilters.seller = filters.seller;
  }

  // Sorting
  if (filters.sort) {
    switch (filters.sort) {
      case 'priceAsc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    currentFilters.sort = filters.sort;
  }

  publish('productsFiltered', results);
  return results;
}

/**
 * Apply search query + filter criteria together
 * @param {string} query
 * @param {Object} filters
 * @returns {Array} filtered products
 */
export function applySearchAndFilter(query = '', filters = {}) {
  let results = getAllProducts();

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();
    results = results.filter(product =>
      product.name?.toLowerCase().includes(normalizedQuery) ||
      product.title?.toLowerCase().includes(normalizedQuery) ||
      product.description?.toLowerCase().includes(normalizedQuery) ||
      product.category?.toLowerCase().includes(normalizedQuery)
    );
    currentFilters.searchQuery = normalizedQuery;
  }

  // Apply filters on top
  results = filterProducts({
    ...filters,
    // Keep existing search query intact
    category: filters.category || currentFilters.category,
    priceRange: filters.priceRange || currentFilters.priceRange,
    seller: filters.seller || currentFilters.seller,
    sort: filters.sort || currentFilters.sort
  });

  publish('productsFiltered', results);
  return results;
}

/**
 * Reset all filters and search query
 * @returns {Array} all products
 */
export function resetFilters() {
  currentFilters = {
    searchQuery: '',
    category: 'all',
    priceRange: null,
    seller: null,
    sort: null
  };
  const allProducts = getAllProducts();
  publish('productsFiltered', allProducts);
  return allProducts;
}
