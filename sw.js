/* Κρατάει την εφαρμογή στο κινητό ώστε να δουλεύει ΧΩΡΙΣ ίντερνετ.
   Καμία σύνδεση σε εξωτερική υπηρεσία. */
var APOTHIKI = 'lista-kopis-v1';
var ARXEIA = [
  './',
  './index.html',
  './kanones.js',
  './manifest.webmanifest',
  './eikonidio.svg',
  './eikonidio-180.png',
  './eikonidio-192.png',
  './eikonidio-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(APOTHIKI).then(function (c) { return c.addAll(ARXEIA); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (k) {
      return Promise.all(k.map(function (n) {
        return n === APOTHIKI ? null : caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (apothikevmeno) {
      if (apothikevmeno) return apothikevmeno;
      return fetch(e.request).then(function (apantisi) {
        if (apantisi && apantisi.status === 200 && apantisi.type === 'basic') {
          var antigrafo = apantisi.clone();
          caches.open(APOTHIKI).then(function (c) { c.put(e.request, antigrafo); });
        }
        return apantisi;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
