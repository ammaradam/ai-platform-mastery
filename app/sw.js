/* Offline-first service worker. Bump VERSION when shell files change. */
const VERSION = "apm-v2-96060ce5eb";
const SHELL = ["./", "index.html", "styles.css", "art.js", "app.js", "data/curriculum.json", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png",
  "icons/favicon-32.png", "icons/favicon-64.png", "icons/logo-192.png", "img/hero.jpg", ...["cap","calendar-check","calendar-star","calendar-medal","hourglass","stopwatch","books","trophy","target","pipeline","server","chip","evals","shield","megaphone","rocket"].map(n => `img/badges/${n}.png`), ...["p1", "p2", "p3", "p4", "p5", "p6"].flatMap(p => [`img/${p}.jpg`, `img/${p}-sm.jpg`])];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Fonts: cache first.
  if (url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com")) {
    e.respondWith(caches.open(VERSION + "-fonts").then(c => c.match(req).then(hit => hit || fetch(req).then(r => { c.put(req, r.clone()); return r; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // App shell + content: stale-while-revalidate.
  e.respondWith(caches.open(VERSION).then(c => c.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
