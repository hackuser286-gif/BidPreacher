/* ============================================================
   unRYL - Utility Functions (utils.js)
   Reusable helpers for data fetching, storage, UI, validation
   ============================================================ */

/* -------------------------------
   1. Data Fetching Helpers
--------------------------------- */
/**
 * Fetch a JSON file from /data/ directory
 * @param {string} path - Path to JSON file
 * @returns {Promise<Object|Array>} Parsed JSON or fallback
 */
export async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`⚠️ Failed to fetch ${path}:`, err.message);
    return path.includes('products') ? [] : {};
  }
}

/* -------------------------------
   2. Price Helpers
--------------------------------- */
/**
 * Format a number into INR currency
 * @param {number} value - Price value
 * @returns {string} Formatted currency
 */
export function formatPrice(value) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
}

/* -------------------------------
   3. ID & Slug Helpers
--------------------------------- */
export function generateID(prefix = '') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

/* -------------------------------
   4. LocalStorage Helpers
--------------------------------- */
export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('❌ Storage save failed:', err);
  }
}

export function getFromStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error('❌ Storage get failed:', err);
    return fallback;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('❌ Storage remove failed:', err);
  }
}

/* -------------------------------
   5. UI Helpers
--------------------------------- */
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Minimal styling (can be enhanced in CSS)
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    padding: '0.75rem 1rem',
    background: type === 'success'
      ? 'var(--color-accent)'
      : type === 'error'
      ? 'var(--color-secondary)'
      : 'var(--color-primary)',
    color: '#fff',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    zIndex: 9999,
    opacity: '0',
    transition: 'opacity 0.3s ease',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* -------------------------------
   6. Validation Helpers
--------------------------------- */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

/* -------------------------------
   7. Date Helpers
--------------------------------- */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now - past) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return formatDate(dateString);
}

/* -------------------------------
   8. Loader Helpers
--------------------------------- */
let loaderElement = null;

export function showLoader() {
  if (loaderElement) return; // already visible
  loaderElement = document.createElement('div');
  loaderElement.className = 'loader-overlay';

  loaderElement.innerHTML = `
    <div class="loader-spinner"></div>
  `;

  Object.assign(loaderElement.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  });

  const spinner = loaderElement.querySelector('.loader-spinner');
  Object.assign(spinner.style, {
    width: '40px',
    height: '40px',
    border: '4px solid var(--color-muted)',
    borderTop: '4px solid var(--color-secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  });

  // Keyframes for spin
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    styleSheet.insertRule(
      `@keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }`,
      styleSheet.cssRules.length
    );
  }

  document.body.appendChild(loaderElement);
}

export function hideLoader() {
  if (!loaderElement) return;
  loaderElement.remove();
  loaderElement = null;
}
