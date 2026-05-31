const CACHE = 'defimind-v3.1.0';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.endsWith('/') || url.endsWith('.html') || (url.includes('/defimind/') && !url.includes('.'))) {
    e.respondWith(fetch(e.request).then(resp => {
      if (resp.ok) { const c = resp.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); }
      return resp;
    }).catch(() => caches.match(e.request)));
    return;
  }
  if (url.includes('defillama') || url.includes('coingecko') || url.includes('publicnode') || url.includes('solana.com')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
    if (resp.ok) { const c = resp.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); }
    return resp;
  })));
});