const CACHE='qcm-agent-douanes-v3';
const ASSETS=[
  './v2.html','./style-v2.css','./helper.js','./engine-math.js','./engine-logic.js','./knowledge-engine.js','./math-course-links.js','./app.js','./cours-maths.html','./manifest.webmanifest','./icon-192.svg','./icon-512.svg',
  './bank-01.txt','./bank-02.txt','./bank-03.txt','./bank-04.txt','./bank-05.txt','./bank-06.txt','./bank-07.txt','./bank-08.txt','./bank-09.txt','./bank-10.txt','./bank-11.txt','./bank-12.txt'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const isCore=event.request.mode==='navigate'||/\.(?:js|css|html|webmanifest)$/.test(url.pathname);
  if(isCore){
    event.respondWith(fetch(event.request).then(async r=>{if(r&&r.ok&&url.origin===self.location.origin){const c=await caches.open(CACHE);c.put(event.request,r.clone())}return r}).catch(async()=>await caches.match(event.request,{ignoreSearch:true})||await caches.match('./v2.html')));
    return;
  }
  event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(cached=>cached||fetch(event.request).then(async r=>{if(r&&r.ok&&url.origin===self.location.origin){const c=await caches.open(CACHE);c.put(event.request,r.clone())}return r})));
});