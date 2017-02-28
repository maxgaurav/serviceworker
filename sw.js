var currentDate = '';

var CACHES_NAMES = ['v1'];

var urlsToCache = [
    '/serviceworker/css/bootstrap.min.css',
    '/serviceworker/js/jquery.min.js',
    '/serviceworker/js/bootstrap.min.js',
    '/serviceworker/offline-page.html'
];

/**
 * This event is fired when service worker is first installed/registered
 */
self.addEventListener('install', function (event) {
    console.log('install event');

    event.waitUntil(
        Promise.all(
            CACHES_NAMES.map(function (cacheName) {
                return caches.open(cacheName).then(function (cache) {
                    return cache.addAll(urlsToCache);
                })

            })
        )
    )
});

/**
 * This event is fired when a request of same origin is called from the system
 * It could be a css request, javascript request, ajax request or even a url hit request
 */
self.addEventListener('fetch', function (event) {
    console.log('fetch');

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});


/**
 * This event is fired when a service worker calls an update action on the running process
 */
self.addEventListener('activate', function (event) {
    console.log('activate event');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if(CACHES_NAMES.indexOf(cacheName) === -1){
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    );

});


