self.addEventListener('fetch', event => {
  const excludeUrl = ['chrome-extension']
  
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (excludeUrl.includes(event.request.url.split('://')[0])) {
        return fetch(event.request)
      }
      // If cached, return from cache
      if (cached) {        
        return cached
      };

      // Otherwise fetch from network and cache it
      return fetch(event.request).then(response => {
        return caches.open('sw-cache').then(cache => {
          cache.put(event.request, response.clone())
          return response
        });
      });
    })
  );
});

// setInterval(() => {
//   console.log('Hello from service worker')
// }, 1000)
