// Service Worker para PWA Zoe
const CACHE_NAME = 'zoe-v1.6.2'; // Versão atualizada para forçar a atualização do cache
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/home.html',
  '/escola.html',
  '/reino-kids.html',
  '/css/styles.css',
  '/css/reino-kids.css',
  '/js/firebase-init.js',
  '/js/menu.js',
  '/assets/images/zoe-logo.svg',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o novo SW a se tornar ativo imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Torna o SW o controlador para todos os clientes no escopo
});

// Estratégia de cache: Network First, fallback para Cache, ignorando API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignora requisições que não são GET (ex: POST para a API)
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignora requisições para a API ou Firebase para evitar problemas de cache
  if (url.pathname.startsWith('/api/') || url.hostname.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        // 1. Tenta buscar da rede primeiro
        const networkResponse = await fetch(event.request);
        
        // Se a resposta da rede for válida, armazena no cache e retorna
        if (networkResponse && networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // 2. Se a rede falhar, busca no cache
        console.log('Rede falhou, buscando no cache:', event.request.url);
        const cachedResponse = await cache.match(event.request);
        return cachedResponse;
      }
    })
  );
});
