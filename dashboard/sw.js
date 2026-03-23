// Phoebe Dashboard Service Worker
const CACHE_NAME = "phoebe-dashboard-v1";
const URLS_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(n) { return n !== CACHE_NAME; })
                     .map(function(n) { return caches.delete(n); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, clone);
                });
            }
            return response;
        }).catch(function() {
            return caches.match(event.request);
        })
    );
});
