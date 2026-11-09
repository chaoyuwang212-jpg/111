const CACHE = 'novel-workshop-v1';
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png']))
));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
));
// 网络优先：联网时拿到最新版本，离线时使用缓存
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
