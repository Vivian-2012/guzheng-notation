/* 古筝简谱库 Service Worker
   只缓存谱子文件（Supabase Storage public 对象），缓存优先，实现"看过的谱子下次秒开、可离线"。
   页面、数据库(REST)、登录(Auth) 一律走网络，保证曲库和代码始终最新。 */
const CACHE_NAME = 'guzheng-scores-v1';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 只处理谱子文件请求：Supabase Storage 的 public 对象
function isScoreFile(url) {
  return url.includes('/storage/v1/object/public/guzheng-scores/');
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  if (isScoreFile(url)) {
    // 缓存优先：命中直接返回；未命中则下载并存入缓存
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(hit => {
          if (hit) return hit;
          return fetch(req).then(resp => {
            // 只缓存成功的完整响应
            if (resp && resp.status === 200) {
              try { cache.put(req, resp.clone()); } catch (err) {}
            }
            return resp;
          });
        })
      )
    );
  }
  // 其他请求：不拦截，走默认网络
});
