window.QKNOW=(()=>{
const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/^[•●▪◦–—-]\s*/,'').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
const trim=s=>clean(s).replace(/^[,:;–—-]+\s*/,'').replace(/[.;:,]+$/,'').trim();
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(v=>trim(v)).filter(Boolean))];
const head=/^(?:[A-Z](?:\.\d+)*|\d+(?:\.\d+)*)\s*[-–—.]?\s+[^.!?]{2,100}$/;
const editorial=/^(?:pièges?|à retenir|fiche|stratégie|exemple|méthode|correction|remarque|version|cours source|programme|priorité concours)/i;
const cp=s=>{const m=clean(s).match(/^([^:]{2,90})\s*:\s*(.+)$/);return m?[trim(m[1]),trim(m[2])]:null};
const low=s=>s.replace(/^(Le|La|Les|L’|L')\b/,m=>m.toLowerCase());
const neighbors=(x,K,range=3)=>K.filter(y=>y.cat===x.cat&&y.id!==x.id&&Math.abs((y.page||0)-(x.page||0))<=range);
const allSame=(x,K)=>K.filter(y=>y.cat===x.cat&&y.id!==x.id);
const wc=s=>trim(s).split(/\s+/).filter(Boolean).length;
const lengthScore=(a,b)=>{const x=Math.max(1,wc(a)),y=Math.max(1,wc(b));return 1-Math.min(1,Math.abs(x-y)/Math.max(x,y))};
const pageScore=(x,y)=>1/(1+Math.abs((x.page||0)-(y.page||0)));
function temporal(s){
 s=trim(s);
 let m=s.match(/\b(il y a\s+(?:environ\s+)?\d+(?:[,.]\d+)?\s+(?:millions?|milliards?|milliers?)\s+d['’]années)\b/i);if(m)return m[1];
 m=s.match(/\b(?:à partir de|vers|depuis|en)\s+~?[-−]?\s*\d{1,4}(?:\s*av\.\s*J\.-C\.|\s*apr\.\s*J\.-C\.)?/i);if(m)return trim(m[0]);
 m=s.match(/\b(?:1[5-9]\d{2}|20\d{2})\s*[–—‑-]\s*(?:1[5-9]\d{2}|20\d{2}|aujourd'hui|présent)\b/i);if(m)return m[0];
 return null;
}
function location(s){s=trim(s);let m=s.match(/(?:situé(?:e)?\s+|se situe\s+|siège\s+)(entre\s+.+|à\s+.+)$/i);if(m)return trim(m[1]);m=s.match(/(?:émergent|apparaissent|se développent)\s+(autour\s+.+)$/i);return m?trim(m[1]):null}
function relationAnswer(s){
 let m=trim(s).match(/^(.+?)\s+(?:est|sont)\s+(?:considéré(?:e|es|s)?\s+comme\s+)?(.+)$/i);if(m)return[trim(m[1]),trim(m[2])];
 m=trim(s).match(/^(.+?)\s+(désigne|correspond à|comprend|compte|permet|assure|contrôle|vote|dirige|conduit|conseille|gère|recouvre|collecte|représente)\s+(.+)$/i);return m?[trim(m[1]),trim(m[3]),m[2].toLowerCase()]:null;
}
function syntheticNumber(answer){
 const s=trim(answer),m=s.match(/(-?\d+(?:[,.]\d+)?)/);if(!m)return[];const raw=m[1],v=parseFloat(raw.replace(',','.'));if(!Number.isFinite(v))return[];
 let steps;if(Math.abs(v)>=1000)steps=[-200,-100,100,200];else if(Math.abs(v)>=100)steps=[-20,-10,10,20];else if(Math.abs(v)>=10)steps=[-5,-2,3,5];else steps=[-.8,-.5,.5,1];
 return steps.map(d=>{let n=Math.max(0,v+d);let txt=(Number.isInteger(v)?String(Math.round(n)):String(Math.round(n*10)/10).replace('.',','));return s.replace(raw,txt)}).filter(z=>z!==s)
}
function yearVariants(y){const n=+y;return[n-7,n-4,n-2,n+2,n+4,n+7].filter(v=>v>0&&v<2100).map(String)}
function periodVariants(p){const m=p.match(/(\d{4}).*?(\d{4})/);if(!m)return[];const a=+m[1],b=+m[2],dash='–';return[[a-7,b-7],[a-3,b-3],[a+4,b+4],[a+7,b+7]].map(([x,y])=>`${x}${dash}${y}`)}
function scoreCandidates(answer,x,list,get,tag){
 return list.map(y=>{const a=get(y);if(!a||trim(a)===trim(answer))return null;let s=3*pageScore(x,y)+2*lengthScore(answer,a);if(tag&&signature(a)===tag)s+=5;return{v:trim(a),s}}).filter(Boolean).sort((a,b)=>b.s-a.s).map(z=>z.v)
}
function signature(s){s=trim(s).toLowerCase();if(temporal(s))return'time';if(location(s))return'place';if(/religion|torah|bible|coran|monoth/.test(s))return'religion';if(/agric|sédent|nomad|chass|cueill|poterie|village/.test(s))return'prehistoire';if(/président|gouvernement|parlement|assemblée|sénat|constitution|ministre/.test(s))return'institution';if(/impôt|fiscal|tva|recouvr|douane|taxe|budget/.test(s))return'fiscal';if(/climat|température|précipitation|désert|océanique|continental/.test(s))return'climat';if(/art|peinture|mouvement|siècle|œuvre|artiste|roman|gothique|baroque|cubisme/.test(s))return'art';if(/processus|système|ensemble|rapport|principe|méthode|régime/.test(s))return'def';return'generic'}
function choose(answer,cands,H,synt=[]){let pool=uniq([...cands,...synt]).filter(v=>v!==trim(answer));if(pool.length<3)return null;const shortlist=pool.slice(0,9);const d=H.sh(shortlist).slice(0,3),o=H.sh([trim(answer),...d]);return{o,ans:o.indexOf(trim(answer))}}
function q(x,prompt,answer,cands,H,synt=[]){const z=choose(answer,cands,H,synt);if(!z)return null;return{kind:'k',cat:x.cat,topic:x.id,prompt,o:z.o,ans:z.ans,x,why:clean(x.text)}}
function colonCandidates(x,K,answer,tag){const list=neighbors(x,K,2).concat(neighbors(x,K,4));return scoreCandidates(answer,x,list,y=>{const z=cp(y.text);return z?z[1]:null},tag)}
function temporalCandidates(x,K,answer){const list=neighbors(x,K,4).concat(allSame(x,K));return scoreCandidates(answer,x,list,y=>{const z=cp(y.text),s=z?z[1]:y.text;return temporal(s)},'time')}
function placeCandidates(x,K,answer){const list=neighbors(x,K,4).concat(allSame(x,K));return scoreCandidates(answer,x,list,y=>{const z=cp(y.text),s=z?z[1]:y.text;return location(s)},'place')}
function make(x,K,H){let s=clean(x.text),m,z;
 if(!s||head.test(s)||editorial.test(s))s=s.replace(/^(?:[A-Z](?:\.\d+)*|\d+(?:\.\d+)*)\s*[-–—.]?\s*[^:]{2,90}:\s*/,'');
 // mandat / période explicite
 m=s.match(/^([^:()]{2,75}?)\s*\(((?:1[5-9]\d{2}|20\d{2})\s*[–—‑-]\s*(?:1[5-9]\d{2}|20\d{2}|aujourd'hui|présent))\)/i);
 if(m){const subject=trim(m[1]),answer=m[2],pool=allSame(x,K).flatMap(y=>{const mm=clean(y.text).match(/\b((?:1[5-9]\d{2}|20\d{2})\s*[–—‑-]\s*(?:1[5-9]\d{2}|20\d{2}|aujourd'hui|présent))\b/i);return mm?[mm[1]]:[]}).sort((a,b)=>Math.abs(parseInt(a)-parseInt(answer))-Math.abs(parseInt(b)-parseInt(answer)));return q(x,`Quelle est la période correspondant à ${subject} ?`,answer,pool,H,periodVariants(answer))}
 // entrée « terme : information »
 z=cp(s);if(z){let[term,ans]=z;term=term.replace(/^(?:[A-Z](?:\.\d+)*|\d+(?:\.\d+)*)\s*[-–—.]?\s*/,'').trim();if(/^définition$/i.test(term)){const rel=relationAnswer(ans);if(rel){term=rel[0];ans=rel[1]}}
   const t=temporal(ans);if(t){let prompt=`À quelle période associe-t-on « ${term} » ?`;if(/\bdébute|commence/i.test(ans))prompt=`Quand débute ${low(term)} ?`;else if(/\bà partir de/i.test(ans))prompt=`À partir de quand situe-t-on ${low(term)} ?`;const pool=temporalCandidates(x,K,t);const syn=/millions?|milliards?|milliers?/i.test(t)?syntheticNumber(t):(/^\D*(\d{4})\D*$/.test(t)?yearVariants((t.match(/\d{4}/)||[])[0]||''):[]);return q(x,prompt,t,pool,H,syn)}
   const loc=location(ans);if(loc){let prompt=`Où se situe ${term} ?`;if(/émergent|apparaissent|se développent/i.test(ans))prompt=`Autour de quels espaces ${low(term)} apparaissent-elles ?`;return q(x,prompt,loc,placeCandidates(x,K,loc),H)}
   m=ans.match(/(?:considéré(?:e|es|s)?\s+comme\s+)(.+)$/i);if(m){const answer=trim(m[1]),pool=colonCandidates(x,K,answer,'generic');return q(x,`Comment ${low(term)} sont-ils considérés ?`,answer,pool,H)}
   // chiffres : poser une question précise plutôt qu'une définition générale
   const nums=ans.match(/\b\d+(?:[,.]\d+)?(?:\s*%|\s*(?:millions?|milliards?|ans|km|m|€))?/g)||[];if(nums.length===1&&wc(ans)<=24){const answer=trim(nums[0]),context=trim(ans.replace(nums[0],'_____'));const pool=neighbors(x,K,4).flatMap(y=>{const zz=cp(y.text);const tx=zz?zz[1]:y.text;return tx.match(/\b\d+(?:[,.]\d+)?(?:\s*%|\s*(?:millions?|milliards?|ans|km|m|€))?/g)||[]});return q(x,`Quelle valeur complète correctement l'information sur ${term} ?\n${context}`,answer,pool,H,syntheticNumber(answer))}
   const answer=trim(ans.split(/(?<=[.!?])\s+/)[0]);const tag=signature(answer),pool=colonCandidates(x,K,answer,tag);let prompt=`Quelle définition correspond à « ${term} » ?`;if(tag==='institution')prompt=`Quelle proposition décrit correctement ${term} ?`;if(tag==='fiscal')prompt=`Quelle proposition est correcte concernant ${term} ?`;if(tag==='art')prompt=`Quelle caractéristique correspond à « ${term} » ?`;return q(x,prompt,answer,pool,H) || q(x,prompt,answer,colonCandidates(x,K,answer,null),H)
 }
 // année en tête
 m=s.match(/^((?:1[5-9]\d{2}|20\d{2}))\s+(.+)$/);if(m){const answer=m[1],event=trim(m[2]),pool=allSame(x,K).flatMap(y=>(clean(y.text).match(/^((?:1[5-9]\d{2}|20\d{2}))\b/)||[])[1]).filter(Boolean).sort((a,b)=>Math.abs(+a-+answer)-Math.abs(+b-+answer));return q(x,`En quelle année ${low(event)} ?`,answer,pool,H,yearVariants(answer))}
 // personne après « par »
 m=s.match(/^(.*?)\b(?:écrit(?:e)?|porté(?:e)?|élaboré(?:e)?|fondé(?:e)?|créé(?:e)?|dirigé(?:e)?|présidé(?:e)?|voulu(?:e)?|signé(?:e)?|adopté(?:e)?)\s+par\s+([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+)+)/i);if(m){const context=trim(m[1]),answer=m[2],pool=neighbors(x,K,6).flatMap(y=>{const mm=clean(y.text).match(/\bpar\s+([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+)+)/);return mm?[mm[1]]:[]});return q(x,`Qui est associé à ${low(context)} ?`,answer,pool,H)}
 // année unique au sein d'une phrase
 const ys=s.match(/\b(?:1[5-9]\d{2}|20\d{2})\b/g)||[];if(ys.length===1){const answer=ys[0],context=trim(s.replace(answer,'_____')),pool=neighbors(x,K,8).flatMap(y=>clean(y.text).match(/\b(?:1[5-9]\d{2}|20\d{2})\b/g)||[]).sort((a,b)=>Math.abs(+a-+answer)-Math.abs(+b-+answer));return q(x,`Quelle année complète correctement cette information ?\n${context}`,answer,pool,H,yearVariants(answer))}
 // pourcentage / nombre unique
 const ps=s.match(/\b\d+(?:[,.]\d+)?\s*%\b/g)||[];if(ps.length===1){const answer=ps[0],context=trim(s.replace(ps[0],'_____')),pool=neighbors(x,K,8).flatMap(y=>clean(y.text).match(/\b\d+(?:[,.]\d+)?\s*%\b/g)||[]);return q(x,`Quel pourcentage complète correctement cette information ?\n${context}`,answer,pool,H,syntheticNumber(answer))}
 // relation générale
 const r=relationAnswer(s);if(r){const subject=r[0],answer=r[1],tag=signature(answer),pool=scoreCandidates(answer,x,neighbors(x,K,5),y=>{const rr=relationAnswer(y.text);return rr?rr[1]:null},tag);let prompt=`Quelle proposition caractérise correctement ${low(subject)} ?`;if(r[2]==='désigne'||r[2]==='correspond à')prompt=`Que désigne « ${subject} » ?`;return q(x,prompt,answer,pool,H) || q(x,prompt,answer,scoreCandidates(answer,x,neighbors(x,K,8),y=>{const rr=relationAnswer(y.text);return rr?rr[1]:null},null),H)}
 // dernier recours : choisir une phrase voisine de même signature et longueur
 const answer=trim(s),tag=signature(answer),pool=scoreCandidates(answer,x,neighbors(x,K,4),y=>clean(y.text),tag);return q(x,'Quelle proposition est correcte ?',answer,pool,H) || q(x,'Quelle proposition est correcte ?',answer,scoreCandidates(answer,x,neighbors(x,K,8),y=>clean(y.text),null),H)
}
function kindOf(s){const z=cp(s),t=temporal(z?z[1]:s);if(t)return'time';if(location(z?z[1]:s))return'place';if((clean(s).match(/\b(?:1[5-9]\d{2}|20\d{2})\b/g)||[]).length===1)return'year';return signature(z?z[1]:s)}
function quizworthy(x){const s=clean(typeof x==='string'?x:x?.text);return!!s&&!head.test(s)&&!editorial.test(s)}
function canQuestion(x,K,H){try{return!!make(x,K,H)}catch{return false}}
function expand(K){return K.filter(quizworthy)}
return{make,canQuestion,quizworthy,kindOf,expand};
})();