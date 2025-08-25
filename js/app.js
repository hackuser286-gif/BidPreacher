/* ================================================
   unRYL - Main Frontend Entry Point (app.js)
   ================================================ */

// 🔹 Import helpers
import { initStore } from './store.js';
import { renderProducts } from './productService.js';
import { initCart } from './cartService.js';
import { initRouter } from './router.js';
import { initUI } from './ui.js';
import { fetchConfig } from './utils.js';
import { initSearchFilter } from './searchFilter.js';
import { initOrderService } from './orderService.js';

/* ================================================
   App Initialization
   ================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 unRYL App Starting...');

    // 1. Initialize global store
    await initStore();

    // 2. Fetch site config
    const config = await fetchConfig('/data/site-config.json');
    console.log('✅ Site Config Loaded:', config);

    // 3. Initialize UI + Router
    initUI(config);
    initRouter();

    // 4. Load products into homepage/product grid
    await renderProducts('/data/products.json');

    // 5. Initialize Cart + Orders
    initCart();
    initOrderService();

    // 6. Initialize Search & Filters
    initSearchFilter();

    // 7. Register Service Worker (PWA support)
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/service-worker.js');
        console.log('✅ Service Worker registered');
      } catch (err) {
        console.warn('⚠️ Service Worker registration failed:', err);
      }
    }
  } catch (error) {
    console.error('❌ App Initialization Error:', error);
  }
});
