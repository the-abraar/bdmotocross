/**
 * Bangladesh Motocross Club & Academy (BMCA)
 * Service Worker: Offline Trackside Shell & Circuit Cache
 */

const CACHE_NAME = 'bmca-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/site.css',
  '/js/site.js',
  '/manifest.webmanifest',
  '/images/logo-360.webp',
  '/images/favicon.png',
  '/images/logo.png',
  '/images/hero-competition-bike-workshop.jpg',
  '/images/hero-bikes.jpg',
  '/images/race-start.jpg',
  '/images/team-photo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[BMCA SW] Pre-caching asset failed, continuing:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip video streams and non-http schemes
  if (url.pathname.endsWith('.mp4') || !url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
