// ==========================================
// SERVICE WORKER - RACE 95 PWA
// ==========================================

const CACHE_NAME = "race95-cache-v1";

// Archivos principales de la aplicación
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/styles.css",
    "./js/app.js",
    "./icons/icon192x192.png",
    "./icons/icon512x512.png"
];


// ==========================================
// INSTALACIÓN
// ==========================================

self.addEventListener("install", (event) => {

    console.log("Race 95: instalando Service Worker...");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {

                console.log("Race 95: guardando archivos en caché");

                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});


// ==========================================
// ACTIVACIÓN
// ==========================================

self.addEventListener("activate", (event) => {

    console.log("Race 95: Service Worker activado");

    event.waitUntil(

        caches.keys().then((cacheNames) => {

            return Promise.all(

                cacheNames.map((cacheName) => {

                    if (cacheName !== CACHE_NAME) {

                        console.log(
                            "Eliminando caché anterior:",
                            cacheName
                        );

                        return caches.delete(cacheName);
                    }

                })

            );

        })

    );

    self.clients.claim();
});


// ==========================================
// FETCH / FUNCIONAMIENTO OFFLINE
// ==========================================

self.addEventListener("fetch", (event) => {

    // Solo manejar peticiones GET
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request)

            .then((cachedResponse) => {

                // Si existe en caché
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Si no existe, buscar en red
                return fetch(event.request)

                    .then((networkResponse) => {

                        return networkResponse;

                    })

                    .catch(() => {

                        // Si estamos offline y es navegación,
                        // regresar index.html

                        if (event.request.mode === "navigate") {

                            return caches.match("./index.html");

                        }

                    });

            })

    );

});