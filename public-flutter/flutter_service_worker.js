'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "876341a15421dd2fe71ea6cf9ba2e278",
"assets/assets/0.jpg": "33a7b0e82e4c0ce8475052e8f82a6cae",
"assets/assets/1.jpg": "70c2b6b323224666f0281972a57574b4",
"assets/assets/10.jpg": "dca4d3a7b0e74433d64e911e7ccfab26",
"assets/assets/11.jpg": "4fbdc145b8328279440f72add26b9c7d",
"assets/assets/12.jpg": "ab2efc5d5837da910be1a49b51f91259",
"assets/assets/13.jpg": "54f2a26cc23855736b7655a4e1d92815",
"assets/assets/14.jpg": "9fb0c438c0909319b62e832aca2a7ee9",
"assets/assets/15.jpg": "d5069dd8c0e2ed7ed24bbf691a5e452f",
"assets/assets/16.jpg": "399921aabc1a4fb9b51a2d82b95ca166",
"assets/assets/17.jpg": "3bfc34a1144aee13ddf1eef05dab7744",
"assets/assets/2.jpg": "49ba04bb5950ce0647147e7222041e09",
"assets/assets/3.jpg": "e04864f1cb7c862a4d02147d38d5382c",
"assets/assets/4.jpg": "81985830d6e9c3293dafd39a4b2dccf5",
"assets/assets/5.jpg": "22ee24459bca1b4f7b515f6727bbe8c0",
"assets/assets/6.jpg": "fc1f52b0c79faafc88d4d2a2138b3eb1",
"assets/assets/7.jpg": "6f4de9304178791b45e639e05b13efb6",
"assets/assets/8.jpg": "5de5cce7c5c52835a22024e65d47f094",
"assets/assets/9.jpg": "ab361c3d70786a57d0db66aa7bbb1320",
"assets/assets/fonts/Billabong.ttf": "52b04f1c2bd73f240b4ad620924a40c9",
"assets/assets/images/InstagramLogo.png": "9bc682be5882492a0bf0bbef1bd4134c",
"assets/assets/images/play.png": "9efcff8e031a95df1478dd7c9fa6f319",
"assets/assets/images/post0.jpg": "c903b417efddb32ad4272a73d380a342",
"assets/assets/images/post1.jpg": "6ceaea22842f34e599f9d309dcc0316c",
"assets/assets/images/post2.jpg": "930527ec355cebbbb36c7618ef9414ef",
"assets/assets/images/user0.png": "a1236aa6b89aa6a253d381350ea9d2e7",
"assets/assets/images/user1.png": "675bbef2c6eb3e2ea583884d3dc455e9",
"assets/assets/images/user2.png": "d5bf49fcf5f48ede02bab350a86df519",
"assets/assets/images/user3.png": "472f5852cf93fba4e440894cb4f8f06e",
"assets/assets/images/user4.png": "3cd229fbc63e73ada82a373962b30bbf",
"assets/assets/images/user5.png": "10c0259f315857e20c3a69c9a48a6224",
"assets/assets/images/user6.png": "48ef3e2ee0ad40e274989a8398d10c79",
"assets/assets/images/user7.png": "3e735f5aa9c8a961b16a0bd055c6bf70",
"assets/FontManifest.json": "5ab3404641aba6f34720d79f43452a1c",
"assets/fonts/MaterialIcons-Regular.otf": "a68d2a28c526b3b070aefca4bac93d25",
"assets/NOTICES": "b0e211d9859926c9eee635195b8aed89",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "9bc682be5882492a0bf0bbef1bd4134c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "1dd5a82061d2bab29bfd65c59d6f085b",
"/": "1dd5a82061d2bab29bfd65c59d6f085b",
"main.dart.js": "e00707a50625851874c0f4034ce41996",
"manifest.json": "c0ab592106f335507b8dfaee3a67721e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }
  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
