// Define o nome e a versão do cache
const CACHE_NAME = 'meu-carro-pro-cache-v2'; // Versão incrementada para forçar a atualização
// Lista de arquivos essenciais para o funcionamento offline do app
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/default-car.png',
  './icons/pdf-icon.png',
  './icons/doc-crlv.png',
  './icons/doc-cnh.png',
  './icons/music-acdc.png',
  './icons/music-queen.png',
  './icons/music-nirvana.png'
];

// Evento de Instalação: Salva os arquivos essenciais no cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e arquivos salvos');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Ativação: Limpa caches antigos para manter o app atualizado.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento Fetch: Intercepta as solicitações de rede.
// Tenta buscar primeiro do cache para o app funcionar offline.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o arquivo existir no cache, retorna ele.
        if (response) {
          return response;
        }
        // Se não, busca na rede.
        return fetch(event.request);
      }
    )
  );
});
