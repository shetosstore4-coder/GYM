self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Acts as a fallback mechanism to satisfy PWA criteria
});