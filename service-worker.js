self.addEventListener("install", e => self.skipWaiting());

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow("./"));
});
