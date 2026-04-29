const CACHE_NAME = 'mining-safety-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/src/engine/VisionSystem.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs', // Cacheado para uso posterior
    // Incluir aquí las URLs de los modelos descargados
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});
