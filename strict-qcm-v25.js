(()=>{
  const S=window.QSMART;if(!S)return;
  const old=S.make;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const trim=s=>clean(s).replace(/^[,;:–—-]+\s*/,'').replace(/[.;:,]+$/,'').trim();
  const norm=s=>trim(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'");
  const uniq=a=>[...new Map((a||[]).filter(Boolean).map(v=>[norm(v),trim(v)])).values()];
  const wc=s=>trim(s).split(/\s+/).filter(Boolean).length;
  const pair=s=>{const m=clean(s).match(/^([^:]{2,100})\s*:\s*(.+)$/);return m?[trim(m[1]),trim(m[2])]:null};
  const malformed=/^(?:J\.-C\.|av\.?\s*J\.-C\.?|apr\.?\s*J\.-C\.?|\d+\)\s+et\b|sous la conduite de\b|mondial,\b)/i;
  const editorial=/^(?:pièges?|ne pas confondre|penser que|croire que|confondre|attention|à retenir|fiche|repères?|notions clés|programme|source|section)/i;
  const meta=/\b(?:dans|selon) le cours\b|quelle (?:information|proposition|affirmation) (?:est correcte|correspond|complète)|quelle notion correspond|que faut-il associer|_{3,}/i;
  function type(v){const s=trim(v),l=norm(v);if(/^[-−]?\d{2,4}$/.test(s)||/^[-−]?\d{1,4}\s*(?:av\.?\s*j\.?-?c\.?|apr\.?\s*j\.?-?c\.?)$/i.test(s))return'year';if(/^(?:de\s+)?[-−]?\d{1,4}\s*[–—‑-]\s*[-−]?\d{1,4}$/.test(s))return'period';if(/^\d+(?:[,.]\d+)?\s*%$/.test(s))return'percent';if(/^\d+(?:[,.]\d+)?(?:\s*(?:millions?|milliards?|milliers?|ans|km|m|cm|mm|€|euros?|habitants?|°c|kg|g|l))?$/i.test(s))return'number';if(/^(?:à|en|au|aux|dans|sur|entre|autour de)\s+/i.test(s)&&wc(s)<=12)return'place';if(/^(?:la|le|les|l’|l')?\s*(?:dgfip|dgddi|dgccrf|tracfin|insee|aft|bce|fmi|onu|otan|omc|ocde|arcom|cnil|anssi|dinum|conseil|cour|assemblée|sénat|parlement|gouvernement|commission|banque|agence|direction|ministère)/i.test(l)&&wc(s)<=12)return'institution';if(/^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+){1,3}$/.test(s))return'person';if(wc(s)<=5)return'term';return'phrase';}
  function valid(q){if(!q||q.kind!=='k'||!Array.isArray(q.o)||q.o.length!==4||!Number.isInteger(q.ans))return false;const p=clean(q.prompt);if(!p.endsWith('?')||meta.test(p))return false;const os=q.o.map(trim);if(uniq(os).length!==4)return false;const t=type(os[q.ans]);if(os.some(v=>type(v)!==t))return false;const lens=os.map(wc),cl=lens[q.ans],med=[...lens].sort((a,b)=>a-b)[1]||1;if(cl>Math.max(10,med*2.4)||Math.max(...lens)>Math.max(14,Math.min(...lens)*3.4))return false;return true;}
  function mk(x,H,prompt,answer,distractors){let d=uniq(distractors).filter(v=>norm(v)!==norm(answer)&&type(v)===type(answer));if(d.length<3)return null;d=H.sh(d.slice(0,18)).slice(0,3);const o=H.sh([trim(answer),...d]);return{kind:'k',cat:x.cat,chapter:x.chapter,topic:x.topicName,prompt:clean(prompt).replace(/\s+\?/g,'?'),o,ans:o.findIndex(v=>norm(v)===norm(answer)),x,why:clean(x.sourceText||x.text)};}
  function same(x,K,level='topic'){return K.filter(y=>y.id!==x.id&&y.cat===x.cat&&(level==='cat'||y.topicName===x.topicName));}
  function answerPool(x,K,answer,get){let a=same(x,K).map(get).filter(Boolean).filter(v=>type(v)===type(answer));if(uniq(a).length<3)a=same(x,K,'cat').map(get).filter(Boolean).filter(v=>type(v)===type(answer));return uniq(a);}
  function yearDistractors(a){const n=parseInt(String(a).replace(/\D/g,''));if(!n)return[];const step=n<1000?25:n<1800?10:5;return[n-step,n-Math.max(2,Math.round(step/2)),n+Math.max(2,Math.round(step/2)),n+step].filter(v=>v>0).map(String);}
  function numDistractors(a){const m=String(a).match(/-?\d+(?:[,.]\d+)?/);if(!m)return[];const n=parseFloat(m[0].replace(',','.')),suffix=String(a).replace(m[0],'');return [.8,.9,1.1,1.2].map(k=>(Math.round(n*k*10)/10).toString().replace('.',',')+suffix);}
  function extractYear(s){let m=s.match(/(?:vers\s+|en\s+|\(|^)([-−]?\d{3,4})(?:\)|\b)/);return m?m[1]:null;}
  function extractNumber(s){let m=s.match(/\b\d+(?:[,.]\d+)?\s*(?:%|millions?|milliards?|milliers?|ans|km|m|cm|mm|€|euros?|habitants?|°C|kg|g|l)\b/i);return m?trim(m[0]):null;}
  function termFamily(x,K,term,answer){return same(x,K,'cat').map(y=>pair(y.sourceText||y.text)).filter(Boolean).filter(z=>norm(z[0])===norm(term)).map(z=>z[1]).filter(v=>type(v)===type(answer));}
  function fallback(x,K,H){const s=clean(x.sourceText||x.text);if(!s||malformed.test(s)||s.length<8)return null;
    let p=pair(s),m;
    if(p){const [term,desc]=p;if(editorial.test(term)||wc(term)>12)return null;
      // Repeated label: Agriculture: riz en Asie / maïs en Amérique -> ask the precise association.
      const fam=termFamily(x,K,term,desc);
      if(uniq(fam).length>=4){
        m=desc.match(/^(.+?)\s+(?:en|au|aux|dans)\s+(.+)$/i);
        if(m){const item=trim(m[1]),place=trim(m[2]),answers=fam.map(v=>{const z=v.match(/^(.+?)\s+(?:en|au|aux|dans)\s+(.+)$/i);return z?trim(z[1]):null}).filter(Boolean);if(uniq(answers).length>=4)return mk(x,H,`Quel élément est associé à ${place} pour ${term.toLowerCase()} ?`,item,answers);}
        return mk(x,H,`Quelle caractéristique est associée à « ${term} » ?`,desc,fam);
      }
      // Explicit location.
      m=desc.match(/(?:situé(?:e)?|se situe|siège|localisé(?:e)?)\s+(à|en|au|aux|entre|dans)\s+(.+)/i);if(m){const a=trim(m[1]+' '+m[2]);const pool=answerPool(x,K,a,y=>{const z=pair(y.sourceText||y.text);if(!z)return null;const mm=z[1].match(/(?:situé(?:e)?|se situe|siège|localisé(?:e)?)\s+(à|en|au|aux|entre|dans)\s+(.+)/i);return mm?trim(mm[1]+' '+mm[2]):null});return mk(x,H,`Où se situe ${term} ?`,a,pool);}
      // Year/date.
      const y=extractYear(desc);if(y){let prompt=`En quelle année situe-t-on ${term} ?`;if(/naît|naissance/i.test(desc))prompt=`En quelle année naît ${term} ?`;else if(/meurt|décès/i.test(desc))prompt=`En quelle année meurt ${term} ?`;else if(/créé|fondé|création|fondation/i.test(desc))prompt=`En quelle année ${term} est-il créé ?`;else if(/bataille/i.test(term+' '+desc))prompt=`En quelle année a lieu ${term.replace(/^bataille\s+(?:de|d’|d')\s*/i,'la bataille de ')} ?`;return mk(x,H,prompt,y,[...answerPool(x,K,y,y2=>extractYear(clean(y2.sourceText||y2.text))||''),...yearDistractors(y)]);}
      // Quantified fact.
      const n=extractNumber(desc);if(n){const context=trim(desc.replace(n,'')).replace(/^[,:;–—-]+/,'').trim();const prompt=context?`Quel chiffre est associé à ${term} concernant ${context} ?`:`Quel chiffre est associé à ${term} ?`;return mk(x,H,prompt,n,[...answerPool(x,K,n,y2=>extractNumber(clean(y2.sourceText||y2.text))||''),...numDistractors(n)]);}
      // Definition / role / composition.
      if(/^(?:désigne|correspond à|est|sont)\s+/i.test(desc)){const a=trim(desc.replace(/^(?:désigne|correspond à|est|sont)\s+/i,''));const pool=answerPool(x,K,a,y=>{const z=pair(y.sourceText||y.text);if(!z)return null;const mm=z[1].match(/^(?:désigne|correspond à|est|sont)\s+(.+)/i);return mm?trim(mm[1]):null});const prompt=/^(?:désigne|correspond à)/i.test(desc)?`Que désigne « ${term} » ?`:`Quelle caractéristique définit ${term} ?`;return mk(x,H,prompt,a,pool);}
      if(/(?:a pour mission|assure|gère|contrôle|recouvre|collecte|représente|permet|comprend)/i.test(desc)){const pool=answerPool(x,K,desc,y=>{const z=pair(y.sourceText||y.text);return z?z[1]:null});return mk(x,H,`Quel rôle ou quelle fonction est associé à ${term} ?`,desc,pool);}
      const pool=answerPool(x,K,desc,y=>{const z=pair(y.sourceText||y.text);return z?z[1]:null});return mk(x,H,`Quelle caractéristique est associée à ${term} ?`,desc,pool);
    }
    // Natural relation sentence.
    m=s.match(/^(.+?)\s+(est|sont|devient|reste|désigne|correspond à|comprend|assure|gère|contrôle|représente|permet)\s+(.+)$/i);if(m&&wc(m[1])<=12){const subj=trim(m[1]),verb=m[2].toLowerCase(),a=trim(m[3]);const pool=answerPool(x,K,a,y=>{const mm=clean(y.sourceText||y.text).match(/^(.+?)\s+(?:est|sont|devient|reste|désigne|correspond à|comprend|assure|gère|contrôle|représente|permet)\s+(.+)$/i);return mm?trim(mm[2]):null});let prompt=`Quelle caractéristique correspond à ${subj} ?`;if(verb==='désigne'||verb==='correspond à')prompt=`Que désigne ${subj} ?`;return mk(x,H,prompt,a,pool);}
    // Named event + year.
    const y=extractYear(s);if(y){const event=trim(s.replace(/[([]?\s*(?:vers\s+)?[-−]?\d{3,4}\s*[)\]]?/,'').replace(/[.;]+$/,''));if(event&&wc(event)<=18)return mk(x,H,`En quelle année a lieu l’événement suivant : ${event} ?`,y,[...answerPool(x,K,y,y2=>extractYear(clean(y2.sourceText||y2.text))||''),...yearDistractors(y)]);}
    return null;
  }
  S.make=function(x,K,H){let q=null;try{q=old.call(S,x,K,H)}catch{}if(valid(q))return q;const f=fallback(x,K,H);return valid(f)?f:null;};
})();