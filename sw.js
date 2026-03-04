const CACHE = "fishlog-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE) return caches.delete(k);
        })
      )
    )
  );
});

self.addEventListener("fetch", e => {

  const url = e.request.url;

  // laat map tiles en CDN deurgaan
  if (
    url.includes("tile.openstreetmap.org") ||
    url.includes("unpkg.com")
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );

});
