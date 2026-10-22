// Service worker NAEYA — stratégie : network-first pour l'API et le HTML,
// cache-first pour les assets statiques (polices, icônes, bundles).
const STATIC_CACHE = "naeya-static-v1";
const RUNTIME_CACHE = "naeya-runtime-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(["/manifest.webmanifest", "/icons/icon.svg", "/icons/icon-maskable.svg"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  // API : toujours réseau, pas de cache (données privées)
  if (url.pathname.startsWith("/api/")) return;

  // Documents HTML : network-first avec repli cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // Assets statiques : cache-first
  if (
    url.origin === self.location.origin ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((c) => c.put(event.request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
