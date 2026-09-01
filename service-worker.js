const CACHE='qcm-agent-douanes-v2';
const ASSETS=[
  './','./index.html','./helper.js','./engine-math.js','./engine-logic.js','./knowledge-engine.js','./math-course-links.js','./app.js','./cours-maths.html','./manifest.webmanifest','./icon-192.svg','./icon-512.svg',
  './bank-01.txt','./bank-02.txt','./bank-03.txt','./bank-04.txt','./bank-05.txt','./bank-06.txt','./bank-07.txt','./bank-08.txt','./bank-09.txt','./bank-10.txt','./bank-11.txt','./bank-12.txt'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request,{ignoreSearch:true});
    if(cached)return cached;
    try{
      const response=await fetch(event.request);
      if(response&&response.ok&&new URL(event.request.url).origin===self.location.origin){
        const cache=await caches.open(CACHE);cache.put(event.request,response.clone());
      }
      return response;
    }catch(err){
      if(event.request.mode==='navigate')return caches.match('./index.html');
      throw err;
    }
  })());
});