/* IQ Math offline cache */
const CACHE_NAME = 'iq-math-v5';
const CORE_FILES = [
    './',
    './index.html',
    './test.html',
    './boss.html',
    './achievements.html',
    './flashcards.html',
    './speedrun.html',
    './detective.html',
    './quests.html',
    './bases.html',
    './cosmetics.html',
    './report.html',
    './beltmatic_factorial_factory.html',
    './cbrt.html',
    './emc2.html',
    './factorial.html',
    './finding_numbers.html',
    './hexation.html',
    './log.html',
    './pentation.html',
    './pi.html',
    './pi_explorer.html',
    './powers.html',
    './sqrt.html',
    './tesseract.html',
    './tetration.html',
    './styles.css',
    './script.js',
    './features.js',
    './extras.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(response => {
                if (!response || response.status >= 500) {
                    throw new Error('Server unavailable');
                }
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                return response;
            }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request).then(response => {
            if (response && response.status === 200) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
            return response;
        }))
    );
});
