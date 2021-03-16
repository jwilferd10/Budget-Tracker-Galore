const APP_PREFIX = 'BudgetTracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// Define which files to cache
// Files to cache would be the homepage, index html, index js, idb js, and styles
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/js/index.js",
    "/js/idb.js",
    "/css/styles.css"
];

// use e.waitUntil to tell the browser to wait until the work is complete before terminating the service worker.
// self.addEventListener('install', function (e) {
//     e.waitUntil(
//         // Use caches.open to find the specific cache by name, then add every file in the FILES_TO_CACHE array to the cache.
//         caches.open(CACHE_NAME).then(function (cache) {
//             console.log('installing cache : ' + CACHE_NAME)
//         })
//     )
// })

// Clear out any old data from the cache and tell the service worker how to manage caches.
self.addEventListener('activate', function(e) {
    e.waitUntil(
        // // .keys() returns an array of all cache names which we're calling keyList.
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX); 
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all (
                keyList.map(function(key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keylist[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

// Tell the browser to check the cache when there's no network connection.
self.addEventListener('fetch', function (e) {
    // listen for the fetch event, log the URL of the requested resource, and then begin to define how we will respond to the request.
    console.log('fetch request: ' + e.request.url)
    e.respondWith (
        // use .match() to determine if the resource already exists in caches
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
            
        })
    )
})