const APP_PREFIX = 'BudgetTracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// Define which files to cache
// Files to cache would be the homepage, index html, index js, idb js, and styles
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/idb.js",
    "/styles.css"
];

// use e.waitUntil to tell the browser to wait until the work is complete before terminating the service worker.
self.addEventListener('install', function (e) {
    e.waitUntil(
        // Use caches.open to find the specific cache by name, then add every file in the FILES_TO_CACHE array to the cache.
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
        })
    )
})
// self.addEventListener('activate', function(e) {})

// self.addEventListener('fetch', function (e) {})