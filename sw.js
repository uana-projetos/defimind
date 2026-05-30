const CACHE = 'defimind-v2.0.3';

self.addEventListener('install', e => {
  // NÃO chama skipWaiting automaticamente — espera mensagem do app
  // Isso permite mostrar o banner "Atualização disponível" para o usuário
});

// Recebe mensagem do app para aplicar update
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[DefiMind SW] Removendo cache antigo:', k);
        return caches.delete(k);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;

  // Network-first para HTML — nunca serve versão velha
  if (url.endsWith('/') || url.endsWith('.html') || (url.includes('/defimind/') && !url.includes('.'))) {
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Network-first para APIs externas
  if (url.includes('defillama') || url.includes('coingecko') || url.includes('publicnode') || url.includes('solana.com')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // Cache-first para fontes e libs estáticas
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      if (resp.ok) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
