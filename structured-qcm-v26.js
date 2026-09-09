(()=>{
 const S=window.QSMART;if(!S)return;const old=S.make;
 const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
 const trim=s=>clean(s).replace(/^[,;:–—-]+\s*/,'').replace(/[.;:,]+$/,'').trim();
 const norm=s=>trim(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'");
 const uniq=a=>[...new Map((a||[]).filter(Boolean).map(v=>[norm(v),trim(v)])).values()];
 const wc=s=>trim(s).split(/\s+/).filter(Boolean).length;
 const parse=s=>{let m=clean(s).match(/^(.+?)\s+[—–-]\s+([^:]{1,55})\s*:\s*(.+)$/);return m?{subject:trim(m[1]),field:trim(m[2]),answer:trim(m[3])}:null};
 const badField=/^(?:détails?|particularités?|repères?|à retenir|à retenir pour le qcm|priorité concours|information \d+|interprétation qcm|définition \/ piège|exemples?)$/i;
 function type(v){const s=trim(v),l=norm(v);if(/^[-−]?\d{3,4}$/.test(s)||/^[-−]?\d{1,4}\s*(?:av\.?\s*j\.?-?c\.?|apr\.?\s*j\.?-?c\.?)$/i.test(s))return'year';if(/^(?:de\s+)?[-−]?\d{1,4}\s*[–—‑-]\s*[-−]?\d{1,4}$/.test(s))return'period';if(/^\d+(?:[,.]\d+)?\s*%$/.test(s))return'percent';if(/^\d+(?:[,.]\d+)?(?:\s*(?:millions?|milliards?|milliers?|ans|km2?|m|cm|mm|€|euros?|habitants?|°c|kg|g|l))?$/i.test(s))return'number';if(/^(?:à|en|au|aux|dans|sur|entre|autour de)\s+/i.test(s)&&wc(s)<=12)return'place';if(/^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+){1,3}$/.test(s))return'person';if(wc(s)<=5)return'term';return'phrase';}
 function mk(x,H,prompt,a,ds){let d=uniq(ds).filter(v=>norm(v)!==norm(a)&&type(v)===type(a));if(d.length<3)return null;d=H.sh(d.slice(0,20)).slice(0,3);const o=H.sh([a,...d]);return{kind:'k',cat:x.cat,chapter:x.chapter,topic:x.topicName,prompt:clean(prompt),o,ans:o.findIndex(v=>norm(v)===norm(a)),x,why:clean(x.sourceText||x.text)};}
 function pool(x,K,z){let a=K.filter(y=>y.id!==x.id&&y.cat===x.cat).map(y=>parse(y.sourceText||y.text)).filter(Boolean).filter(p=>norm(p.field)===norm(z.field)).map(p=>p.answer);if(uniq(a).length<3)a=K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.topicName===x.topicName).map(y=>parse(y.sourceText||y.text)).filter(Boolean).map(p=>p.answer);return a;}
 function prompt(z){const f=norm(z.field),s=z.subject;
   if(/auteur/.test(f))return `Qui est l’auteur de « ${s} » ?`;
   if(/artiste/.test(f))return `Quel artiste est associé à « ${s} » ?`;
   if(/créateur|origine/.test(f))return `Qui est à l’origine de « ${s} » ?`;
   if(/lauréat/.test(f))return `Quel lauréat est associé à « ${s} » ?`;
   if(/localisation|siège|relie \/ localise/.test(f))return `Où se situe « ${s} » ?`;
   if(/^date$/.test(f)||/événement/.test(f)&&type(z.answer)==='year')return `Quelle date est associée à « ${s} » ?`;
   if(/population/.test(f))return `Quel est l’ordre de grandeur de la population de ${s} ?`;
   if(/volume/.test(f))return `Quel volume est associé à ${s} ?`;
   if(/valeur/.test(f))return `Quelle valeur faut-il associer à ${s} ?`;
   if(/formule/.test(f))return `Quelle formule correspond à ${s} ?`;
   if(/rôle|mission/.test(f))return `Quel est le rôle principal de ${s} ?`;
   if(/symbole/.test(f))return `Quel symbole est associé à ${s} ?`;
   if(/domaine/.test(f))return `Dans quel domaine classe-t-on ${s} ?`;
   if(/œuvre emblématique|œuvre \/ monument|œuvres? \/ repères?|œuvres? ou repères/.test(f))return `Quelle œuvre ou quel repère est associé à ${s} ?`;
   if(/association principale|association à retenir|association/.test(f))return `Quelle association faut-il connaître pour ${s} ?`;
   if(/origine \/ genre/.test(f))return `Quelle origine ou quel genre est associé à ${s} ?`;
   if(/type \/ repère/.test(f))return `Quel repère est associé à ${s} ?`;
   if(/repère stratégique/.test(f))return `Quel repère stratégique concerne ${s} ?`;
   if(/caractéristiques?/.test(f))return `Quelle caractéristique définit ${s} ?`;
   if(/notion-clé/.test(f))return `Quelle notion est associée à ${s} ?`;
   if(/obligation/.test(f))return `Quelle obligation concerne ${s} ?`;
   return null;
 }
 S.make=function(x,K,H){const z=parse(x.sourceText||x.text);if(z&&!badField.test(z.field)){const p=prompt(z);if(p){const q=mk(x,H,p,z.answer,pool(x,K,z));if(q)return q;}}return old.call(S,x,K,H)};
})();