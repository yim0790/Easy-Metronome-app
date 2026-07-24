// 이지 메트로놈 서비스워커: 오프라인 캐시로 PWA 설치/실행 지원
const CACHE = 'easy-metronome-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './metronome-icon-192.png',
  './metronome-icon-512.png',
  './metronome-icon-maskable-512.png'
];

// 설치: 필수 파일 캐시
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// 활성화: 이전 버전 캐시 정리
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 요청: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
