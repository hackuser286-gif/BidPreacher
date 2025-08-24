/* ==========================================================================
   BidPreacher • script.js
   Zero-cost connector storefront (vanilla JS, no build tools)
   ========================================================================== */

/* =========================
   1) CONFIG (owner edits)
   ========================= */
const config = {
  siteName: "BidPreacher",
  ownerPhone: "+919999999999",            // WhatsApp number (E.164 recommended)
  ownerEmail: "owner@example.com",        // Owner email
  currency: "₹",                          // Display currency symbol
  locale: "en-IN",                        // Locale for number formatting
  enableEmail: true,                      // Toggle mailto channel
  enableWhatsApp: true                    // Toggle WhatsApp channel
};
// Helper to detect placeholder configuration (shows banner)
function isPlaceholderConfig() {
  const defaultPhone = "+919999999999";
  const defaultEmail = "owner@example.com";
  const phoneLooksPlaceholder = !config.ownerPhone || config.ownerPhone.trim() === defaultPhone;
  const emailLooksPlaceholder = !config.ownerEmail || config.ownerEmail.trim() === defaultEmail;
  return phoneLooksPlaceholder || emailLooksPlaceholder;
}

/* =========================
   2) PRODUCT DATA (owner can extend)
   Schema:
   {
     id, title, description, price, images[], category,
     seller:{name,city,contactHint}, tags[], rating (3..5)
   }
   ========================= */
const products = [
  {
    id: "BP-GAD-001",
    title: "Aurora Smart Lamp",
    description: "Touch-dimmable bedside lamp with warm/cool modes.",
    price: 1499,
    images: [
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Home",
    seller: { name: "GlowCraft", city: "Mumbai", contactHint: "bulk ok, ships fast" },
    tags: ["lamp", "lighting", "home"],
    rating: 4.5
  },
  {
    id: "BP-FAS-002",
    title: "Heritage Canvas Tote",
    description: "Reinforced canvas tote with inner zipper pocket.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Fashion",
    seller: { name: "Thread & Co.", city: "Pune", contactHint: "custom logo possible" },
    tags: ["bag", "tote", "canvas"],
    rating: 4.2
  },
  {
    id: "BP-GAD-003",
    title: "Nimbus Wireless Earbuds",
    description: "Bluetooth 5.3 with ENC mic and 30-hour case.",
    price: 2299,
    images: [
      "https://images.unsplash.com/photo-1518443882831-c6d7b1b3a52d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518445710233-0f1f1f2a0f86?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Gadgets",
    seller: { name: "AudioLeaf", city: "Delhi", contactHint: "1-year warranty" },
    tags: ["audio", "earbuds", "bluetooth"],
    rating: 4.3
  },
  {
    id: "BP-BEA-004",
    title: "Citrus Glow Face Serum",
    description: "Vitamin C + hyaluronic acid for daily radiance.",
    price: 749,
    images: [
      "https://images.unsplash.com/photo-1610986603168-3e6db3c6c7f8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9b9c15?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Beauty",
    seller: { name: "Bloom Lab", city: "Bengaluru", contactHint: "dermat tested" },
    tags: ["serum", "skincare", "vitamin c"],
    rating: 4.6
  },
  {
    id: "BP-FIT-005",
    title: "AirFlex Yoga Mat",
    description: "Non-slip TPE with body alignment markers.",
    price: 1199,
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Fitness",
    seller: { name: "ZenFit", city: "Hyderabad", contactHint: "bulk studio pricing" },
    tags: ["yoga", "mat", "fitness"],
    rating: 4.4
  },
  {
    id: "BP-CRA-006",
    title: "Hand-poured Soy Candle",
    description: "Lavender & cedarwood blend, 40-hour burn.",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Crafts",
    seller: { name: "Wick & Willow", city: "Jaipur", contactHint: "custom scents available" },
    tags: ["candle", "home", "soy"],
    rating: 4.1
  },
  {
    id: "BP-HOM-007",
    title: "Nordic Throw Blanket",
    description: "Soft knit throw, breathable, machine washable.",
    price: 1399,
    images: [
      "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Home",
    seller: { name: "NestWorks", city: "Ahmedabad", contactHint: "festive discounts" },
    tags: ["throw", "blanket", "cozy"],
    rating: 4.0
  },
  {
    id: "BP-FAS-008",
    title: "Minimalist Wristwatch",
    description: "Slim analog with leather strap, 5 ATM.",
    price: 2599,
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Fashion",
    seller: { name: "Time&Form", city: "Surat", contactHint: "gift packaging" },
    tags: ["watch", "leather", "fashion"],
    rating: 4.5
  },
  {
    id: "BP-GAD-009",
    title: "MagCharge 10K Power Bank",
    description: "Magnetic wireless + USB-C 20W fast charge.",
    price: 1999,
    images: [
      "https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Gadgets",
    seller: { name: "VoltEdge", city: "Noida", contactHint: "1-year replacement" },
    tags: ["power bank", "battery", "charge"],
    rating: 4.2
  },
  {
    id: "BP-BEA-010",
    title: "Pure Argan Hair Oil",
    description: "Cold-pressed argan for frizz control & shine.",
    price: 699,
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589988699836-7b3da8932e8e?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Beauty",
    seller: { name: "Root Rituals", city: "Kolkata", contactHint: "salon bundles" },
    tags: ["hair", "oil", "argan"],
    rating: 4.3
  },
  {
    id: "BP-FIT-011",
    title: "Steel Shaker Bottle 750ml",
    description: "Double-wall insulated, leak-proof flip cap.",
    price: 799,
    images: [
      "https://images.unsplash.com/photo-1599050751795-5d0df6f5f3f3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599050745934-8b9a1f0493fe?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Fitness",
    seller: { name: "IronPeak", city: "Chennai", contactHint: "team logos available" },
    tags: ["bottle", "gym", "steel"],
    rating: 4.2
  },
  {
    id: "BP-CRA-012",
    title: "Terracotta Planter Set (2)",
    description: "Handcrafted planters with drainage trays.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop"
    ],
    category: "Crafts",
    seller: { name: "ClayStories", city: "Udaipur", contactHint: "fragile shipping" },
    tags: ["planter", "terracotta", "garden"],
    rating: 4.4
  }
];

/* =========================
   3) STORAGE HELPERS & FORMATTERS
   ========================= */
const STORAGE_KEYS = {
  CART: "bp_cart",
  LIKES: "bp_likes"
};
function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn("Storage save failed:", e); }
}
function getFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn("Storage read failed:", e);
    return fallback;
  }
}
function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat(config.locale, { style: "currency", currency: "INR", currencyDisplay: "symbol" })
      .format(amount).replace("₹", config.currency);
  } catch {
    return `${config.currency}${amount}`;
  }
}
function numberOnlyPhone(str) {
  return (str || "").replace(/[^\d]/g, "");
}
function encodeRFC3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}
function nowIST() {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });
}
function debounce(fn, wait = 250) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* =========================
   4) STATE
   ========================= */
const state = {
  likes: new Set(getFromStorage(STORAGE_KEYS.LIKES, [])),
  cart: getFromStorage(STORAGE_KEYS.CART, []), // [{id, qty}]
  searchQuery: "",
  activeCategory: "All",
  sortBy: "popular", // 'popular' | 'new' | 'price_asc' | 'price_desc'
  quickViewProductId: null
};

/* =========================
   5) DOM HOOKS (defensive: optional chaining)
   ========================= */
const els = {
  // Header
  cartCount: document.querySelector("[data-cart-count], #cart-count"),
  likesCount: document.querySelector("[data-likes-count], #likes-count"),
  openCartBtn: document.querySelector("[data-open-cart], #btn-open-cart"),
  searchInput: document.querySelector("#search-input, [data-search]"),
  sortSelect: document.querySelector("#sort-select, [data-sort]"),
  categoryRow: document.querySelector("#featured-categories .category-grid, #category-row"),
  // Grids & sections
  productGrid: document.querySelector("#product-grid, .product-grid"),
  // Drawer & modals
  drawer: document.querySelector("#cart-drawer, [data-drawer='cart']"),
  drawerBody: document.querySelector("#cart-items, .cart-items"),
  drawerSubtotal: document.querySelector("#cart-subtotal, [data-cart-subtotal]"),
  // Quick view modal
  qvModal: document.querySelector("#quickview-modal"),
  qvTitle: document.querySelector("#qv-title"),
  qvPrice: document.querySelector("#qv-price"),
  qvDesc: document.querySelector("#qv-desc"),
  qvMainImg: document.querySelector("#modal-main-image"),
  qvThumbs: document.querySelector("#qv-thumbs"),
  qvBuyBtn: document.querySelector("#qv-buy"),
  // Buyer modal
  buyerModal: document.querySelector("#buyer-modal"),
  buyerForm: document.querySelector("#buyer-form"),
  orderSummaryList: document.querySelector("#order-summary-list"),
  privacyNote: document.querySelector("#privacy-note"),
  confirmWrap: document.querySelector("#confirm-wrap"),
  btnSendWA: document.querySelector("#btn-send-wa"),
  btnSendEmail: document.querySelector("#btn-send-email"),
  payloadText: document.querySelector("#payload-text"),
  btnCopyPayload: document.querySelector("#btn-copy-payload"),
  // Seller CTA
  sellerForm: document.querySelector("#seller-form"),
  // Misc
  noticeConfig: document.querySelector("#config-warning, .notice-config"),
  offlineBanner: document.querySelector("#offline-banner"),
  toast: document.querySelector("#toast"),
  footerWA: document.querySelector("#footer-contact-whatsapp"),
  footerEmail: document.querySelector("#footer-contact-email")
};

/* =========================
   6) INITIALIZATION
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  setSiteName();
  showConfigWarningIfNeeded();
  setupChannelAvailability();
  setupConnectivityBanner();
  wireHeader();
  renderCategories();
  renderProducts();
  renderLikesCount();
  renderCartDrawer();
  injectJSONLD(products.slice(0, 12));

  // Close on ESC for modals/drawer
  document.addEventListener("keydown", globalEscHandler);
  // Backdrop clicks (event delegation)
  document.body.addEventListener("click", backdropCloseHandler);

  // Footer deeplinks (static contact)
  setFooterContactLinks();
});

function setSiteName() {
  document.title = `${config.siteName} – Discover. Like. Request.`;
  const logoText = document.querySelector(".logo-text");
  if (logoText) logoText.textContent = config.siteName;
}

function showConfigWarningIfNeeded() {
  if (!els.noticeConfig) return;
  if (isPlaceholderConfig()) {
    els.noticeConfig.classList.remove("hidden");
    els.noticeConfig.querySelector("[data-dismiss]")?.addEventListener("click", () => {
      els.noticeConfig.classList.add("hidden");
    });
  } else {
    els.noticeConfig.classList.add("hidden");
  }
}

function setupChannelAvailability() {
  // Disable channel buttons globally if turned off
  if (els.btnSendWA) els.btnSendWA.setAttribute("aria-disabled", String(!config.enableWhatsApp));
  if (els.btnSendEmail) els.btnSendEmail.setAttribute("aria-disabled", String(!config.enableEmail));
  if (els.footerWA) els.footerWA.setAttribute("aria-disabled", String(!config.enableWhatsApp));
  if (els.footerEmail) els.footerEmail.setAttribute("aria-disabled", String(!config.enableEmail));
}

function setupConnectivityBanner() {
  if (!els.offlineBanner) return;
  function update() {
    if (navigator.onLine) {
      els.offlineBanner.classList.add("hidden");
    } else {
      els.offlineBanner.classList.remove("hidden");
    }
  }
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

function wireHeader() {
  // Search
  els.searchInput?.addEventListener("input", debounce((e) => {
    state.searchQuery = String(e.target.value || "").trim().toLowerCase();
    renderProducts();
  }, 200));

  // Sorting
  els.sortSelect?.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Open cart drawer
  els.openCartBtn?.addEventListener("click", () => openDrawer(true));
}

/* =========================
   7) RENDERERS
   ========================= */
function renderCategories() {
  const el = els.categoryRow;
  if (!el) return;
  const categories = ["All", "Home", "Fashion", "Gadgets", "Beauty", "Fitness", "Crafts"];
  el.innerHTML = categories.map(cat => `
    <button class="category-card" type="button" data-category="${cat}" aria-pressed="${state.activeCategory === cat}">
      <img src="https://picsum.photos/seed/${encodeURIComponent(cat)}/480/320" alt="${cat} category image" loading="lazy" width="480" height="130">
      <h3>${cat}</h3>
    </button>
  `).join("");

  el.querySelectorAll("[data-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.getAttribute("data-category");
      // Update pressed states
      el.querySelectorAll("[data-category]").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      renderProducts();
      // Scroll to products
      document.querySelector("#products, .products-section")?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
    });
  });
}

function prefersReduced() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function productMatchesSearch(prod) {
  if (!state.searchQuery) return true;
  const str = `${prod.title} ${prod.description} ${prod.tags?.join(" ")}`.toLowerCase();
  return str.includes(state.searchQuery);
}

function currentSortFn() {
  switch (state.sortBy) {
    case "price_asc": return (a, b) => a.price - b.price;
    case "price_desc": return (a, b) => b.price - a.price;
    case "new": return (a, b) => a.id.localeCompare(b.id) * -1; // assuming higher id ~ newer
    case "popular":
    default:
      return (a, b) => (getLikeCountFor(a.id) === getLikeCountFor(b.id))
        ? a.title.localeCompare(b.title)
        : getLikeCountFor(b.id) - getLikeCountFor(a.id);
  }
}

function filterProductsList() {
  return products
    .filter(p => state.activeCategory === "All" || p.category === state.activeCategory)
    .filter(productMatchesSearch)
    .sort(currentSortFn());
}

function renderProducts() {
  const grid = els.productGrid;
  if (!grid) return;

  const list = filterProductsList();
  grid.innerHTML = list.map(prod => renderProductCardHTML(prod)).join("");

  // Wire actions
  grid.querySelectorAll("[data-like]").forEach(btn => {
    btn.addEventListener("click", () => toggleLike(btn.getAttribute("data-like")));
  });
  grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add"), 1));
  });
  grid.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => openBuyerForProduct(btn.getAttribute("data-buy")));
  });
  grid.querySelectorAll("[data-quickview]").forEach(btn => {
    btn.addEventListener("click", () => openQuickView(btn.getAttribute("data-quickview")));
  });
}

function renderProductCardHTML(p) {
  const liked = state.likes.has(p.id);
  const stars = renderStars(p.rating);
  return `
  <article class="product-card" data-id="${p.id}">
    <button class="like-btn" type="button" data-like="${p.id}" aria-pressed="${liked}" aria-label="Like ${escapeHTML(p.title)}">
      ${svgHeart()}
    </button>
    <div class="product-media">
      <button type="button" class="btn ghost" style="position:absolute;inset:0;opacity:0" data-quickview="${p.id}" aria-label="Quick view ${escapeHTML(p.title)}"></button>
      <img src="${p.images[0]}" alt="${escapeHTML(p.title)}" loading="lazy" width="480" height="320">
    </div>
    <div class="product-body">
      <div class="product-title">${escapeHTML(p.title)}</div>
      <div class="rating" aria-label="Rating ${p.rating} out of 5">${stars}</div>
      <div class="price-row">
        <div class="price">${formatCurrency(p.price)}</div>
        <span class="small muted">${escapeHTML(p.category)}</span>
      </div>
      <div class="product-actions">
        <button class="btn ghost" type="button" data-add="${p.id}">${svgCart(16)} Add</button>
        <button class="btn primary" type="button" data-buy="${p.id}">Buy Now</button>
      </div>
    </div>
  </article>
  `;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return `${"".padStart(full, "★")}${half ? "☆" : ""}${"".padStart(empty, "✩")}`;
}

function renderLikesCount() {
  const count = state.likes.size;
  if (els.likesCount) els.likesCount.textContent = String(count);
}

function renderCartDrawer() {
  if (!els.drawerBody) return;
  const lines = state.cart.map(line => {
    const p = productById(line.id);
    if (!p) return "";
    return `
      <li>
        <img src="${p.images[0]}" alt="${escapeHTML(p.title)}" width="64" height="64" loading="lazy">
        <div>
          <div class="line-title">${escapeHTML(p.title)}</div>
          <div class="muted small">${formatCurrency(p.price)} × ${line.qty} = <strong>${formatCurrency(p.price * line.qty)}</strong></div>
          <div class="qty" aria-label="Quantity controls for ${escapeHTML(p.title)}">
            <button type="button" data-qty-decr="${line.id}" aria-label="Decrease">−</button>
            <input type="number" min="1" step="1" value="${line.qty}" data-qty-input="${line.id}" aria-label="Quantity">
            <button type="button" data-qty-incr="${line.id}" aria-label="Increase">＋</button>
          </div>
        </div>
        <button class="remove small" type="button" data-remove="${line.id}">Remove</button>
      </li>
    `;
  }).join("");

  els.drawerBody.innerHTML = lines || `<li class="muted small">Your cart is empty.</li>`;
  const subtotal = cartSubtotal();
  if (els.drawerSubtotal) els.drawerSubtotal.textContent = formatCurrency(subtotal);
  if (els.cartCount) els.cartCount.textContent = String(totalCartQty());

  // Wire controls
  els.drawerBody.querySelectorAll("[data-qty-decr]").forEach(btn => {
    btn.addEventListener("click", () => decrQty(btn.getAttribute("data-qty-decr")));
  });
  els.drawerBody.querySelectorAll("[data-qty-incr]").forEach(btn => {
    btn.addEventListener("click", () => incrQty(btn.getAttribute("data-qty-incr")));
  });
  els.drawerBody.querySelectorAll("[data-qty-input]").forEach(input => {
    input.addEventListener("change", () => setQty(input.getAttribute("data-qty-input"), parseInt(input.value || "1", 10)));
  });
  els.drawerBody.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.getAttribute("data-remove")));
  });

  // Drawer Buy Now button
  document.querySelector("#cart-buy-now, [data-cart-buy]")?.addEventListener("click", () => openBuyerForCart());
}

/* =========================
   8) LIKES
   ========================= */
function toggleLike(id) {
  if (state.likes.has(id)) state.likes.delete(id); else state.likes.add(id);
  saveToStorage(STORAGE_KEYS.LIKES, Array.from(state.likes));
  renderLikesCount();
  // Update button state without re-rendering everything
  document.querySelectorAll(`[data-like="${cssEscape(id)}"]`).forEach(btn => btn.setAttribute("aria-pressed", String(state.likes.has(id))));
}

function getLikeCountFor(id) {
  return state.likes.has(id) ? 1 : 0; // simple liked/not-liked metric for demo sorting
}

/* =========================
   9) CART
   ========================= */
function productById(id) {
  return products.find(p => p.id === id);
}
function addToCart(id, qty = 1) {
  const p = productById(id);
  if (!p) return;
  const line = state.cart.find(l => l.id === id);
  if (line) line.qty += qty;
  else state.cart.push({ id, qty });
  persistCart();
  renderCartDrawer();
  openDrawer(true);
  toast(`Added “${p.title}” to cart`);
}
function setQty(id, qty) {
  qty = Math.max(1, qty || 1);
  const line = state.cart.find(l => l.id === id);
  if (!line) return;
  line.qty = qty;
  persistCart(); renderCartDrawer();
}
function incrQty(id) { setQty(id, (state.cart.find(l => l.id === id)?.qty || 1) + 1); }
function decrQty(id) { setQty(id, (state.cart.find(l => l.id === id)?.qty || 1) - 1); }
function removeFromCart(id) {
  const p = productById(id);
  state.cart = state.cart.filter(l => l.id !== id);
  persistCart();
  renderCartDrawer();
  toast(`Removed “${p?.title || id}”`);
}
function totalCartQty() {
  return state.cart.reduce((sum, l) => sum + l.qty, 0);
}
function cartSubtotal() {
  return state.cart.reduce((sum, l) => {
    const p = productById(l.id); return sum + (p ? p.price * l.qty : 0);
  }, 0);
}
function clearCart() {
  state.cart = [];
  persistCart();
  renderCartDrawer();
}
function persistCart() {
  saveToStorage(STORAGE_KEYS.CART, state.cart);
}

/* =========================
   10) QUICK VIEW MODAL
   ========================= */
function openQuickView(productId) {
  const p = productById(productId);
  if (!p || !els.qvModal) return;
  state.quickViewProductId = productId;

  els.qvTitle && (els.qvTitle.textContent = p.title);
  els.qvPrice && (els.qvPrice.textContent = formatCurrency(p.price));
  els.qvDesc && (els.qvDesc.textContent = p.description);
  if (els.qvMainImg) {
    els.qvMainImg.src = p.images[0];
    els.qvMainImg.alt = p.title;
  }
  if (els.qvThumbs) {
    els.qvThumbs.innerHTML = p.images.map((src, i) => `
      <button type="button" data-thumb="${i}">
        <img src="${src}" alt="Thumbnail ${i + 1} for ${escapeHTML(p.title)}" loading="lazy" width="100" height="56">
      </button>
    `).join("");
    els.qvThumbs.querySelectorAll("[data-thumb]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-thumb"), 10);
        els.qvMainImg.src = p.images[idx];
      });
    });
  }
  els.qvBuyBtn?.replaceWith(els.qvBuyBtn.cloneNode(true)); // remove previous listeners
  const freshBuyBtn = document.querySelector("#qv-buy");
  freshBuyBtn?.addEventListener("click", () => openBuyerForProduct(p.id));

  openModal(els.qvModal);
}

/* =========================
   11) BUYER FORM & FLOW
   ========================= */
function openBuyerForProduct(productId) {
  // Ensure the product in cart (qty 1) for order summary convenience
  const existing = state.cart.find(l => l.id === productId);
  if (!existing) addToCart(productId, 1);
  openBuyerForCart();
}

function openBuyerForCart() {
  if (!els.buyerModal) return;
  // Render order summary
  if (els.orderSummaryList) {
    els.orderSummaryList.innerHTML = state.cart.map(l => {
      const p = productById(l.id); if (!p) return "";
      return `<div><strong>${escapeHTML(p.title)}</strong> — ${l.qty} × ${formatCurrency(p.price)} = <strong>${formatCurrency(p.price * l.qty)}</strong></div>`;
    }).join("") || `<div class="muted small">Your cart is empty.</div>`;
  }
  // Reset form to input stage
  els.confirmWrap?.classList.add("hidden");
  els.buyerForm?.classList.remove("hidden");
  els.btnSendWA?.setAttribute("aria-disabled", String(!config.enableWhatsApp));
  els.btnSendEmail?.setAttribute("aria-disabled", String(!config.enableEmail));
  openModal(els.buyerModal);

  // Wire submit (remove old listeners by cloning)
  if (els.buyerForm) {
    const fresh = els.buyerForm.cloneNode(true);
    els.buyerForm.replaceWith(fresh);
    els.buyerForm = fresh;
    els.buyerForm.addEventListener("submit", onBuyerFormSubmit);
  }
}

function onBuyerFormSubmit(e) {
  e.preventDefault();
  const data = readBuyerForm(e.target);
  const errors = validateBuyer(data);
  if (errors.length) {
    showFormErrors(e.target, errors);
    return;
  }
  const payload = buildOrderPayload(data, state.cart);
  showConfirmation(payload);
}

function readBuyerForm(form) {
  const get = (sel) => form.querySelector(sel)?.value?.trim() || "";
  return {
    name: get("[name='buyer_name']"),
    phone: get("[name='buyer_phone']"),
    email: get("[name='buyer_email']"),
    address1: get("[name='buyer_address1']"),
    address2: get("[name='buyer_address2']"),
    city: get("[name='buyer_city']"),
    state: get("[name='buyer_state']"),
    pincode: get("[name='buyer_pincode']"),
    notes: get("[name='buyer_notes']"),
    consent: form.querySelector("[name='buyer_consent']")?.checked || false
  };
}

function validateBuyer(d) {
  const errs = [];
  if (!d.name) errs.push(["[name='buyer_name']", "Name is required"]);
  if (!/^\+?\d[\d\s-]{7,}$/.test(d.phone)) errs.push(["[name='buyer_phone']", "Valid phone is required"]);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errs.push(["[name='buyer_email']", "Valid email is required"]);
  if (!d.address1) errs.push(["[name='buyer_address1']", "Address Line 1 is required"]);
  if (!d.city) errs.push(["[name='buyer_city']", "City is required"]);
  if (!d.state) errs.push(["[name='buyer_state']", "State is required"]);
  if (!/^\d{5,7}$/.test(d.pincode)) errs.push(["[name='buyer_pincode']", "Valid pincode is required"]);
  if (!d.consent) errs.push(["[name='buyer_consent']", "Please accept the privacy notice"]);
  if (!state.cart.length) errs.push([null, "Your cart is empty"]);
  return errs;
}

function showFormErrors(form, errors) {
  // Clear previous
  form.querySelectorAll(".error-text").forEach(n => n.remove());
  errors.forEach(([sel, msg]) => {
    if (!sel) { toast(msg); return; }
    const field = form.querySelector(sel);
    if (!field) return;
    const small = document.createElement("div");
    small.className = "error-text small";
    small.style.color = "#fca5a5";
    small.style.marginTop = ".25rem";
    small.textContent = msg;
    field.closest("label, .field")?.appendChild(small);
    field.setAttribute("aria-invalid", "true");
  });
}

function buildOrderPayload(buyer, cartLines) {
  const ts = nowIST();
  const lines = cartLines.map(l => {
    const p = productById(l.id);
    const unit = p ? formatCurrency(p.price) : "?";
    const total = p ? formatCurrency(p.price * l.qty) : "?";
    return `• ${l.id} | ${p?.title || "Unknown"} | Qty: ${l.qty} | Unit: ${unit} | Line: ${total}`;
  }).join("\n");

  const meta = cartLines.map(l => {
    const p = productById(l.id);
    return p ? `• ${p.id}: seller=${p.seller.name} (${p.seller.city}) [${p.seller.contactHint}]` : "";
  }).join("\n");

  const payload =
`${config.siteName} – NEW BUY REQUEST
Timestamp (IST): ${ts}

Buyer:
Name: ${buyer.name}
Phone: ${buyer.phone}
Email: ${buyer.email}
Address: ${buyer.address1}${buyer.address2 ? ", " + buyer.address2 : ""}, ${buyer.city}, ${buyer.state} – ${buyer.pincode}

Cart:
${lines}

Subtotal: ${formatCurrency(cartSubtotal())}

Notes:
${buyer.notes || "-"}

Product/Seller meta:
${meta}

Consent: ${buyer.consent ? "Yes" : "No"}
(Forwarded via client-side bridge. No payment processed on site.)`;
  return payload;
}

function showConfirmation(payload) {
  if (!els.buyerModal) return;
  // Switch view
  els.buyerForm?.classList.add("hidden");
  els.confirmWrap?.classList.remove("hidden");

  // Set payload preview
  if (els.payloadText) {
    els.payloadText.value = payload;
  }

  // Generate links
  const wa = config.enableWhatsApp ? buildWhatsAppLink(payload, config.ownerPhone) : null;
  const mail = config.enableEmail ? buildMailtoLink(payload, config.ownerEmail) : null;

  if (els.btnSendWA) {
    if (wa) {
      els.btnSendWA.removeAttribute("aria-disabled");
      els.btnSendWA.href = wa;
      els.btnSendWA.target = "_blank";
      els.btnSendWA.addEventListener("click", onOrderSent);
    } else {
      els.btnSendWA.setAttribute("aria-disabled", "true");
      els.btnSendWA.removeAttribute("href");
    }
  }
  if (els.btnSendEmail) {
    if (mail) {
      els.btnSendEmail.removeAttribute("aria-disabled");
      els.btnSendEmail.href = mail;
      els.btnSendEmail.target = "_blank";
      els.btnSendEmail.addEventListener("click", onOrderSent);
    } else {
      els.btnSendEmail.setAttribute("aria-disabled", "true");
      els.btnSendEmail.removeAttribute("href");
    }
  }
  if (els.btnCopyPayload) {
    els.btnCopyPayload.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(payload); toast("Details copied"); }
      catch { toast("Copy failed"); }
    }, { once: true });
  }
}

function buildWhatsAppLink(payload, phone) {
  const num = numberOnlyPhone(phone);
  const text = encodeRFC3986(payload);
  return `https://wa.me/${num}?text=${text}`;
}
function buildMailtoLink(payload, email) {
  const subject = encodeRFC3986(`New Buy Request – ${config.siteName}`);
  const body = encodeRFC3986(payload);
  return `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
}

function onOrderSent() {
  // When user clicks either WA or Email, clear cart and notify
  clearCart();
  toast("Request sent. We’ll connect you with the seller!");
  closeModal(els.buyerModal);
  closeDrawer();
}

/* =========================
   12) SELLER ONBOARDING (mini form)
   ========================= */
if (els.sellerForm) {
  const fresh = els.sellerForm.cloneNode(true);
  els.sellerForm.replaceWith(fresh);
  els.sellerForm = fresh;
  els.sellerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const data = {
      name: f.querySelector("[name='seller_name']")?.value?.trim() || "",
      phone: f.querySelector("[name='seller_phone']")?.value?.trim() || "",
      email: f.querySelector("[name='seller_email']")?.value?.trim() || "",
      product: f.querySelector("[name='seller_product']")?.value?.trim() || "",
      notes: f.querySelector("[name='seller_notes']")?.value?.trim() || ""
    };
    const errs = [];
    if (!data.name) errs.push("Name required");
    if (!/^\+?\d[\d\s-]{7,}$/.test(data.phone)) errs.push("Valid phone required");
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.push("Email invalid");
    if (!data.product) errs.push("Product description required");
    if (errs.length) return toast(errs[0]);

    const payload =
`${config.siteName} – SELLER LEAD
Timestamp (IST): ${nowIST()}

Seller:
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || "-"}

Product/Service:
${data.product}

Notes:
${data.notes || "-"}

(Forwarded via client-side bridge)`;

    const wa = config.enableWhatsApp ? buildWhatsAppLink(payload, config.ownerPhone) : null;
    const mail = config.enableEmail ? buildMailtoLink(payload, config.ownerEmail) : null;

    if (wa) window.open(wa, "_blank");
    else if (mail) window.location.href = mail;
    toast("Thanks! We received your submission.");
    f.reset();
  });
}

/* =========================
   13) MODALS & DRAWER UTILS
   ========================= */
const focusTrap = {
  lastActive: null,
  trapEl: null
};

function openModal(el) {
  if (!el) return;
  focusTrap.lastActive = document.activeElement;
  focusTrap.trapEl = el;
  el.setAttribute("aria-hidden", "false");
  el.style.display = "grid";
  // Focus the first focusable element
  const focusable = getFocusable(el);
  (focusable[0] || el).focus();
  document.body.style.overflow = "hidden";
  el.addEventListener("keydown", trapTabKey);
}

function closeModal(el) {
  if (!el) return;
  el.setAttribute("aria-hidden", "true");
  el.style.display = "none";
  document.body.style.overflow = "";
  el.removeEventListener("keydown", trapTabKey);
  if (focusTrap.lastActive) focusTrap.lastActive.focus();
  focusTrap.trapEl = null;
}

function trapTabKey(e) {
  if (e.key !== "Tab") return;
  const focusable = getFocusable(focusTrap.trapEl);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus(); e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus(); e.preventDefault();
  }
}
function getFocusable(root) {
  return Array.from(root.querySelectorAll("a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])"))
    .filter(el => !el.hasAttribute("disabled") && !el.getAttribute("aria-disabled") && el.offsetParent !== null);
}

function globalEscHandler(e) {
  if (e.key === "Escape") {
    const anyOpenModal = document.querySelector(".modal[aria-hidden='false']");
    if (anyOpenModal) closeModal(anyOpenModal);
    else closeDrawer();
  }
}
function backdropCloseHandler(e) {
  const isModal = e.target.classList?.contains("modal");
  if (isModal) closeModal(e.target);
}

function openDrawer(focus = false) {
  if (!els.drawer) return;
  els.drawer.setAttribute("aria-hidden", "false");
  els.drawer.classList.add("open");
  if (focus) getFocusable(els.drawer)[0]?.focus();
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  if (!els.drawer) return;
  els.drawer.setAttribute("aria-hidden", "true");
  els.drawer.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close], .modal [data-close-modal]").forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    if (modal) closeModal(modal);
  });
});
document.querySelectorAll("[data-open-cart]").forEach(btn => btn.addEventListener("click", () => openDrawer(true)));
document.querySelectorAll("[data-close-cart]").forEach(btn => btn.addEventListener("click", () => closeDrawer()));

/* =========================
   14) TOAST
   ========================= */
function toast(message = "Done", timeout = 2200) {
  const el = els.toast || createToastEl();
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), timeout);
}
function createToastEl() {
  const t = document.createElement("div");
  t.id = "toast";
  t.className = "toast";
  document.body.appendChild(t);
  els.toast = t;
  return t;
}

/* =========================
   15) FOOTER CONTACT LINKS
   ========================= */
function setFooterContactLinks() {
  const payload = `${config.siteName} – Hello! I'd like to know more.`;
  const wa = config.enableWhatsApp ? buildWhatsAppLink(payload, config.ownerPhone) : null;
  const mail = config.enableEmail ? buildMailtoLink(payload, config.ownerEmail) : null;
  if (els.footerWA && wa) { els.footerWA.href = wa; els.footerWA.target = "_blank"; }
  if (els.footerEmail && mail) { els.footerEmail.href = mail; }
}

/* =========================
   16) JSON-LD INJECTION (enhancement)
   ========================= */
function injectJSONLD(list) {
  try {
    // Organization
    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": config.siteName,
      "url": location.href,
      "logo": `${location.origin}${location.pathname.replace(/\/[^/]*$/, "/")}assets/favicon.png`
    };
    addJSONLD(org);

    // Products (limited to avoid overlong head)
    list.slice(0, 12).forEach(p => {
      addJSONLD({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.title,
        "sku": p.id,
        "category": p.category,
        "description": p.description,
        "image": p.images,
        "brand": { "@type": "Brand", "name": p.seller.name },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": p.rating,
          "reviewCount": Math.floor(25 + Math.random() * 100)
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "url": location.href
        }
      });
    });
  } catch (e) {
    console.warn("JSON-LD injection skipped:", e);
  }
}
function addJSONLD(obj) {
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.text = JSON.stringify(obj);
  document.head.appendChild(s);
}

/* =========================
   17) SVG ICONS (inline helpers)
   ========================= */
function svgHeart(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.053-4.236-9.428-8.58C1.04 9.916 2.44 6.5 5.756 6.05A5.1 5.1 0 0 1 12 8.2a5.1 5.1 0 0 1 6.244-2.15c3.316.45 4.716 3.866 2.184 6.37C19.053 16.764 12 21 12 21z"/></svg>`;
}
function svgCart(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4h-2l-1 2H1v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 7 21h12v-2H7.42a.25.25 0 0 1-.22-.37L8.1 16h7.45a2 2 0 0 0 1.79-1.11l3.58-7.16A1 1 0 0 0 20 6H6.21l-.94-2z"/></svg>`;
}

/* =========================
   18) SAFE HELPERS
   ========================= */
function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}
function cssEscape(sel = "") {
  // Minimal escape for attribute selector usage
  return sel.replace(/"/g, '\\"');
}

/* =========================
   19) GLOBAL ACTION BINDINGS (if present in DOM)
   ========================= */
// Buttons with [data-open-modal="#id"] and [data-close-modal]
document.querySelectorAll("[data-open-modal]").forEach(btn => {
  const target = document.querySelector(btn.getAttribute("data-open-modal"));
  btn.addEventListener("click", () => openModal(target));
});
document.querySelectorAll("[data-close-modal]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
});

// Programmatic hooks for “Explore Products” CTA
document.querySelectorAll("[data-scroll-to='products']").forEach(btn => {
  btn.addEventListener("click", () => document.querySelector("#products, .products-section")?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" }));
});

/* =========================
   END
   ========================= */
