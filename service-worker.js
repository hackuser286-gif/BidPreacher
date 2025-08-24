// service-worker.js
// unRYL - GenZ Fashion Store PWA Service Worker

const CACHE_NAME = "unryl-cache-v1";

// ✅ Core files to cache for offline usage
const FILES_TO_CACHE = [
  "/index.html",
  "/product.html",
  "/cart.html",
  "/checkout.html",
  "/orders.html",
  "/success.html",
  "/404.html",
  "/offline.html", // fallback page

  "/css/styles.css",
  "/css/components.css",
  "/css/variables.css",

  "/js/app.js",
  "/js/utils.js",
  "/js/store.js",
  "/js/ui.js",
  "/js/productService.js",
  "/js/cartService.js",
  "/js/orderService.js",
  "/js/searchFilter.js",
  "/js/router.js",

  "/data/products.json",
  "/data/sellers.json",
  "/data/categories.json",

  "/assets/logo.svg",
  "/assets/logo-192.png",
  "/assets/logo-512.png",

  "/manifest.webmanifest"
];

// ✅ Install: cache essential files
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ✅ Activate: clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch: serve cached files, fallback to network, then offline page
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return; // only cache GET requests

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // serve from cache
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache new files dynamically
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Offline fallback for navigation requests (HTML pages)
          if (event.request.destination === "document") {
            return caches.match("/offline.html");
          }
        });
    })
  );
});
