// Goldthorne Wood Studio Safety and Machine Care Program: emergency alerts on this phone.
// This file only shows the emergency alert notifications sent by the AI Assistant and opens
// the map when one is tapped. It doesn't cache the map or change how it loads.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let m = {};
  try {
    m = e.data ? e.data.json() : {};
  } catch (err) {
    m = { t: "Goldthorne Wood Studio", b: e.data ? e.data.text() : "" };
  }
  const base = self.registration.scope;
  const url = typeof m.u === "string" && m.u.startsWith(base) ? m.u : base + "#p=emergency";
  e.waitUntil(
    self.registration.showNotification(m.t || "Goldthorne Wood Studio", {
      body: m.b || "",
      tag: m.tag || "goldthorne",
      renotify: true,
      requireInteraction: !!m.rq,
      vibrate: m.rq ? [400, 150, 400, 150, 400, 150, 800] : [200],
      icon: base + "icon-180.png",
      badge: base + "icon-180.png",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.startsWith(self.registration.scope) && "focus" in c) {
          c.postMessage({ goldthorne: "open", url });
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
