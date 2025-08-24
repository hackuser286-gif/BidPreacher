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

  els.drawerBody.innerHTML = lines || `<li class="muted small"
