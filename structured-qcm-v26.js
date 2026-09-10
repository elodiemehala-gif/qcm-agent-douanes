(()=>{
 const S=window.QSMART;if(!S)return;const old=S.make;
 const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
 const trim=s=>clean(s).replace(/^[,;:–—-]+\s*/,'').replace(/[.;:,]+$/,'').trim();
 const norm=s=>trim(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'");
 const uniq=a=>[...new Map((a||[]).filter(Boolean).map(v=>[norm(v),trim(v)])).values()];
 const wc=s=>trim(s).split(/\s+/).filter(Boolean).length;
 const parse=s=>{let m=clean(s).match(/^(.+?)\s+[—–-]\s+([^:]{1,55})\s*:\s*(.+)$/);return m?{subject:trim(m[1]),field:trim(m[2]),answer:trim(m[3])}:null};
 const badField=/^(?:détails?|particularités?|repères?|à retenir|à retenir pour le qcm|priorité concours|information \d+|interprétation qcm|définition \/ piège|exemples?)$/i;
 function type(v){const raw=clean(v),s=trim(v),t=s.replace(/(\d)\s(?=\d{3}\b)/g,'$1');if(/^(?:vers|en|à partir de)\s*[~−-]?\s*\d{1,5}\s*(?:av\.?\s*j\.?-?c\.?|apr\.?\s*j\.?-?c\.?)$/i.test(t))return'year';if(/^[-−]?\d{3,5}$/.test(t)||/^[-−]?\d{1,5}\s*(?:av\.?\s*j\.?-?c\.?|apr\.?\s*j\.?-?c\.?)$/i.test(t))return'year';if(/^(?:de\s+)?[-−]?\d{1,4}\s*[–—‑-]\s*[-−]?\d{1,4}$/.test(t))return'period';if(/^\d+(?:[,.]\d+)?\s*%$/.test(t))return'percent';if(/^\d+(?:[,.]\d+)?(?:\s*(?:millions?|milliards?|milliers?|ans|km2?|m|cm|mm|€|euros?|habitants?|°c|kg|g|l))?$/i.test(t))return'number';if(/^(?:à|en|au|aux|dans|sur|entre|autour de)\s+/i.test(s)&&wc(s)<=12)return'place';if(/^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+){1,3}$/.test(s))return'person';if(wc(s)<=5)return'term';if(/[.;:]$/.test(raw)||wc(s)>=10)return'sentence';return'phrase';}
 function synthetic(a){const k=type(a),s=trim(a),out=[];
   if(k==='year'){
     const m=s.match(/[-−]?\d[\d\s]{0,5}/);if(!m)return out;const raw=m[0],n=parseInt(raw.replace(/[\s−]/g,c=>c==='−'?'-':''),10);if(!Number.isFinite(n))return out;
     const abs=Math.abs(n),step=abs>=5000?1000:abs>=1800?10:abs>=1000?50:abs>=100?25:10;
     const fmt=v=>{let z=String(v);if(/\d\s\d{3}/.test(raw)){const neg=z.startsWith('-');let q=neg?z.slice(1):z;q=q.replace(/\B(?=(\d{3})+(?!\d))/g,' ');z=(neg?'−':'')+q}return z};
     for(const d of [-2*step,-step,step,2*step]){const v=n+d;if(v===n)continue;out.push(s.replace(raw,fmt(v)));}
   }else if(k==='percent'||k==='number'){
     const m=s.match(/-?\d+(?:[,.]\d+)?/);if(!m)return out;const raw=m[0],n=parseFloat(raw.replace(',','.'));if(!Number.isFinite(n))return out;
     for(const f of [.8,.9,1.1,1.2]){const v=Math.round(n*f*10)/10;out.push(s.replace(raw,String(v).replace('.',',')));}
   }
   return uniq(out);
 }
 function mk(x,H,prompt,a,ds){let d=uniq(ds).filter(v=>norm(v)!==norm(a)&&type(v)===type(a));if(d.length<3)return null;const core=d.slice(0,Math.min(2,d.length)),extra=H.sh(d.slice(core.length,Math.min(9,d.length))).slice(0,3-core.length);d=[...core,...extra];if(d.length<3)d=d.concat(d.slice(d.length,3));const o=H.sh([a,...d.slice(0,3)]);return{kind:'k',cat:x.cat,chapter:x.chapter,topic:x.topicName,prompt:clean(prompt),o,ans:o.findIndex(v=>norm(v)===norm(a)),x,why:clean(x.sourceText||x.text)};}
 function ranked(list,z){const want=type(z.answer),len=wc(z.answer);return uniq(list.map(y=>parse(y.sourceText||y.text)).filter(Boolean).filter(p=>norm(p.field)===norm(z.field)&&type(p.answer)===want).map(p=>p.answer)).sort((a,b)=>Math.abs(wc(a)-len)-Math.abs(wc(b)-len));}
 function pool(x,K,z){
   let a=ranked(K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.topicName===x.topicName),z);a=uniq(a);
   if(a.length<3)a=uniq(a.concat(ranked(K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.chapter===x.chapter),z)));
   if(a.length<3)a=uniq(a.concat(ranked(K.filter(y=>y.id!==x.id&&y.cat===x.cat),z)));
   if(a.length<3)a=uniq(a.concat(synthetic(z.answer)));
   return a;
 }
 function prompt(z){const f=norm(z.field),s=z.subject;
   if(/auteur/.test(f))return `Qui est l’auteur de « ${s} » ?`;
   if(/artiste/.test(f))return `Quel artiste est associé à « ${s} » ?`;
   if(/createur|origine/.test(f))return `Qui est à l’origine de « ${s} » ?`;
   if(/laureat/.test(f))return `Quel lauréat est associé à « ${s} » ?`;
   if(/localisation|siege|relie \/ localise/.test(f))return `Où se situe « ${s} » ?`;
   if(/^date(?: de debut)?$/.test(f)||/evenement/.test(f)&&type(z.answer)==='year')return `Quelle date est associée à « ${s} » ?`;
   if(/population/.test(f))return `Quel est l’ordre de grandeur de la population de ${s} ?`;
   if(/volume/.test(f))return `Quel volume est associé à ${s} ?`;
   if(/valeur/.test(f))return `Quelle valeur faut-il associer à ${s} ?`;
   if(/formule/.test(f))return `Quelle formule correspond à ${s} ?`;
   if(/role|mission|fonction/.test(f))return `Quel est le rôle principal de ${s} ?`;
   if(/symbole/.test(f))return `Quel symbole est associé à ${s} ?`;
   if(/domaine/.test(f))return `Dans quel domaine classe-t-on ${s} ?`;
   if(/definition|sens|concept|principe/.test(f))return `Que désigne « ${s} » ?`;
   if(/oeuvre emblematique|oeuvre \/ monument|oeuvres? \/ reperes?|oeuvres? ou reperes/.test(f))return `Quelle œuvre ou quel repère est associé à ${s} ?`;
   if(/association principale|association a retenir|association/.test(f))return `Quelle association faut-il connaître pour ${s} ?`;
   if(/origine \/ genre/.test(f))return `Quelle origine ou quel genre est associé à ${s} ?`;
   if(/type \/ repere|^repere$/.test(f))return `Quel repère est associé à ${s} ?`;
   if(/repere strategique/.test(f))return `Quel repère stratégique concerne ${s} ?`;
   if(/caracteristiques?|statut|lien/.test(f))return `Quelle caractéristique définit ${s} ?`;
   if(/notion-cle/.test(f))return `Quelle notion est associée à ${s} ?`;
   if(/obligation/.test(f))return `Quelle obligation concerne ${s} ?`;
   return null;
 }
 S.make=function(x,K,H){const z=parse(x.sourceText||x.text);if(z&&!badField.test(z.field)){const p=prompt(z);if(p){const q=mk(x,H,p,z.answer,pool(x,K,z));if(q)return q;}}return old.call(S,x,K,H)};
})();