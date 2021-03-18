const CACHE_NAME = "budget_tracker"
const DATA_CACHE_NAME = 'budget-tracker-cache-v1'

// Define which files to cache
// Files to cache would be the homepage, index html, index js, idb js, and styles
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/js/index.js",
    "/js/idb.js",
    "/css/styles.css"
];

// Install Service-Workers
self.addEventListener('install', function(event) {
    event.waitUntil (
        caches.open(CACHE_NAME).then(cache => {
            console.log(CACHE_NAME + 'files successfully pre-cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Service-Worker
self.addEventListener('activate', function(event) {
    event.waitUntil (
        caches.keys().then(keyList => {
            return Promise.all (
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Deleting old' + CACHE_NAME + 'cache data', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch requests
self.addEventListener('fetch', function (event) {
    if (event.request.url.includes('/api/')) {
        console.log('fetch request : ' + event.request.url)
        event.respondWith (
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch( err => {
                    return cache.match(event.request);
                });
            })
        );
        return;
    }

    event.respondWith (
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request);
            });
        })
    )
});