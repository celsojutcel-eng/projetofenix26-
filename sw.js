// ===== SERVICE WORKER - PROJETO FÊNIX =====
const CACHE_NAME = 'fenix-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/script.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// INSTALAÇÃO: cache dos assets essenciais
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ATIVAÇÃO: limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH: responde com cache primeiro, depois rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .then(fetchRes => {
          // opcional: cache de novas requisições
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        })
        .catch(() => {
          // fallback se offline (opcional)
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
