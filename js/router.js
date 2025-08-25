// ================================
// js/router.js
// ================================

import { publish } from './store.js';

/**
 * Route table mapping paths to HTML files.
 * Use "*" for 404 fallback.
 */
const routes = {
    '/': 'index.html',
    '/products': 'product.html',
    '/cart': 'cart.html',
    '/checkout': 'checkout.html',
    '/orders': 'orders.html',
    '/success': 'success.html',
    '*': '404.html'
};

/**
 * Dynamically loads a page into the <main> container.
 * @param {string} path - Path to navigate to (e.g., "/cart").
 */
export async function loadPage(path) {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return console.warn('No <main> container found!');

    let route = routes[path] || routes['*'];

    try {
        const res = await fetch(route);
        if (!res.ok) throw new Error(`Failed to fetch ${route}`);
        const html = await res.text();

        // Replace main content while keeping header/footer intact
        mainContainer.innerHTML = html;

        // Publish routeChanged event for other modules to react
        publish('routeChanged', path);

    } catch (err) {
        console.error('Router loadPage error:', err);

        // Fallback to 404 page
        if (route !== routes['*']) {
            loadPage('*');
        } else {
            mainContainer.innerHTML = `<section class="error-404"><h1>404 - Page Not Found</h1></section>`;
        }
    }
}

/**
 * Handles internal navigation clicks (<a> links)
 * Prevents full page reload.
 * @param {Event} e 
 */
function handleLinkClick(e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    e.preventDefault();
    history.pushState({}, '', href);
    loadPage(href);
}

/**
 * Initializes the router: binds events and loads initial route
 */
export function initRouter() {
    // Initial load
    loadPage(window.location.pathname);

    // Capture all clicks on links
    document.body.addEventListener('click', handleLinkClick);

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });
}
