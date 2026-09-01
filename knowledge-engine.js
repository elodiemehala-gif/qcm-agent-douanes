window.QKNOW=(()=>{
  const clean=s=>String(s||'').replace(/^[•●▪–—-]\s*/,'').replace(/\s+/g,' ').trim();
  const uniq=a=>[...new Set(a.filter(Boolean).map(String))];
  const near=(x,K)=>K.filter(y=>y.ci===x.ci&&y.id!==x.id).sort((a,b)=>Math.abs((a.page||0)-(x.page||0))-Math.abs((b.page||0)-(x.page||0)));
  const pickOptions=(answer,pool,H)=>{
    let d=uniq(pool).filter(v=>v!==String(answer));
    d=H.sh(d).slice(0,3);
    while(d.length<3){
      const filler=String(Number(answer)+H.r(1,9));
      if(!d.includes(filler)&&filler!==String(answer))d.push(filler);
    }
    const o=H.sh([String(answer),...d]);
    return {o,ans:o.indexOf(String(answer))};
  };
  const yearPool=(x,K)=>uniq(near(x,K).flatMap(y=>clean(y.text).match(/\b(?:1[5-9]\d{2}|20\d{2})\b/g)||[]));
  const periodPool=(x,K)=>uniq(near(x,K).flatMap(y=>clean(y.text).match(/\b(?:1[5-9]\d{2}|20\d{2})\s*[–—‑-]\s*(?:1[5-9]\d{2}|20\d{2})\b/g)||[]));
  const numPool=(x,K)=>uniq(near(x,K).flatMap(y=>clean(y.text).match(/\b\d+(?:[,.]\d+)?\s*%|\b\d+(?:[,.]\d+)?\b/g)||[]));
  const colonParts=s=>{const i=s.indexOf(':');if(i<2||i>s.length-4)return null;return [s.slice(0,i).trim(),s.slice(i+1).trim()]};
  const defPool=(x,K)=>uniq(near(x,K).map(y=>colonParts(clean(y.text))).filter(Boolean).map(p=>p[1]).filter(v=>v.length>2&&v.length<240));
  const rhsPool=(x,K)=>uniq(near(x,K).map(y=>{const s=clean(y.text),m=s.match(/^(.{1,80}?)\s*=\s*(.{1,180})$/);return m&&m[2].trim()}).filter(Boolean));
  const properNames=s=>uniq((s.match(/\b[A-ZÉÈÀÂÊÎÔÛÙÇ][a-zéèàâêîôûùç'’-]+(?:\s+[A-ZÉÈÀÂÊÎÔÛÙÇ][a-zéèàâêîôûùç'’-]+)+\b/g)||[]).filter(v=>!/^Version|Cours|Préparation/.test(v)));
  const namePool=(x,K)=>uniq(near(x,K).flatMap(y=>properNames(clean(y.text))));
  function make(x,K,H){
    const s=clean(x.text);
    let m;

    // Mandats / périodes, ex. « Mitterrand (1981-1995) : ... »
    m=s.match(/^([^:()]{2,70}?)\s*\(((?:1[5-9]\d{2}|20\d{2})\s*[–—‑-]\s*(?:1[5-9]\d{2}|20\d{2}))\)\s*:/);
    if(m){
      const subject=m[1].trim(),answer=m[2].replace(/\s+/g,' '), pool=periodPool(x,K);
      const q=pickOptions(answer,pool.length>=3?pool:[answer.replace(/\d{4}/g,y=>String(+y-7)),answer.replace(/\d{4}/g,y=>String(+y+5)),answer.replace(/\d{4}/g,y=>String(+y+10))],H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt:`Quelle est la période correspondant à ${subject} ?`,o:q.o,ans:q.ans,x,why:s};
    }

    // Année placée en tête : tableau « 1981 Abolition de la peine de mort... »
    m=s.match(/^((?:1[5-9]\d{2}|20\d{2}))\s+(.{4,220})$/);
    if(m){
      const answer=m[1],event=m[2].replace(/[.;]$/,'').trim(),q=pickOptions(answer,yearPool(x,K),H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt:`En quelle année ${event.charAt(0).toLowerCase()+event.slice(1)} ?`,o:q.o,ans:q.ans,x,why:s};
    }

    // Période n'importe où dans la phrase
    m=s.match(/\b((?:1[5-9]\d{2}|20\d{2})\s*[–—‑-]\s*(?:1[5-9]\d{2}|20\d{2}))\b/);
    if(m){
      const answer=m[1],context=s.replace(m[0],'_____').replace(/\s+/g,' '),q=pickOptions(answer,periodPool(x,K),H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt:`Quelle période complète correctement cette information ?\n${context}`,o:q.o,ans:q.ans,x,why:s};
    }

    // Une date précise
    const years=s.match(/\b(?:1[5-9]\d{2}|20\d{2})\b/g)||[];
    if(years.length===1){
      const answer=years[0],context=s.replace(answer,'_____'),q=pickOptions(answer,yearPool(x,K),H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt:`Quelle année complète correctement cette information ?\n${context}`,o:q.o,ans:q.ans,x,why:s};
    }

    // Définitions / associations de type « Notion : définition »
    const cp=colonParts(s);
    if(cp&&cp[0].length<=90&&cp[1].length<=240){
      const [term,answer]=cp,q=pickOptions(answer,defPool(x,K),H);
      const low=term.toLowerCase();
      let prompt=/siège|capitale/.test(answer.toLowerCase())?`Quelle information est correcte concernant ${term} ?`:`Que faut-il associer à « ${term} » ?`;
      if(/définition|désigne|processus|principe|notion/.test((term+' '+answer).toLowerCase()))prompt=`Quelle définition correspond à « ${term} » ?`;
      return {kind:'k',cat:x.cat,topic:x.id,prompt,o:q.o,ans:q.ans,x,why:s};
    }

    // Formule / égalité
    m=s.match(/^(.{1,90}?)\s*=\s*(.{1,180})$/);
    if(m){
      const left=m[1].trim(),answer=m[2].trim(),q=pickOptions(answer,rhsPool(x,K),H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt:`À quoi correspond « ${left} » ?`,o:q.o,ans:q.ans,x,why:s};
    }

    // Missions, sièges et relations « X est / a pour mission / comprend... »
    m=s.match(/^(.{2,90}?)\s+(a pour mission(?:s)?(?: principale(?:s)?)?|siège à|est situé(?:e)? à|est|sont|désigne|correspond à|comprend|compte)\s+(.{2,180})$/i);
    if(m){
      const subject=m[1].trim(),verb=m[2].toLowerCase(),answer=m[3].replace(/[.;]$/,'').trim(),pool=defPool(x,K).concat(rhsPool(x,K));
      let prompt=`Que faut-il associer à « ${subject} » ?`;
      if(verb.startsWith('a pour mission'))prompt=`Quelle est la mission de ${subject} ?`;
      else if(verb.includes('siège')||verb.includes('situé'))prompt=`Où se situe ${subject} ?`;
      else if(verb==='désigne'||verb==='correspond à')prompt=`Que désigne « ${subject} » ?`;
      else if(verb==='comprend'||verb==='compte')prompt=`Que comprend ${subject} ?`;
      else if(verb==='est'||verb==='sont')prompt=`Qu'est-ce qui caractérise ${subject} ?`;
      const q=pickOptions(answer,pool,H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt,o:q.o,ans:q.ans,x,why:s};
    }

    // Valeurs, pourcentages, nombres : masquer uniquement la valeur à retenir.
    const nums=s.match(/\b\d+(?:[,.]\d+)?\s*%|\b\d+(?:[,.]\d+)?\b/g)||[];
    if(nums.length===1){
      const answer=nums[0],context=s.replace(answer,'_____'),q=pickOptions(answer,numPool(x,K),H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt:`Quelle valeur complète correctement cette information ?\n${context}`,o:q.o,ans:q.ans,x,why:s};
    }

    // Personne / auteur / responsable : question à trou sur le nom propre.
    const names=properNames(s);
    if(names.length){
      const answer=names[names.length-1],context=s.replace(answer,'_____'),q=pickOptions(answer,namePool(x,K),H);
      return {kind:'k',cat:x.cat,topic:x.id,prompt:`Qui complète correctement cette information ?\n${context}`,o:q.o,ans:q.ans,x,why:s};
    }

    // Dernier recours : transformer une relation en question de rappel, sans jamais demander « est-ce dans le cours ? ».
    const words=s.split(' ');
    const cut=Math.max(2,Math.min(7,Math.floor(words.length/3)));
    const subject=words.slice(0,cut).join(' '),answer=words.slice(cut).join(' ');
    const pool=near(x,K).map(y=>clean(y.text).split(' ').slice(cut).join(' ')).filter(v=>v.length>3&&v.length<220);
    const q=pickOptions(answer,pool,H);
    return {kind:'k',cat:x.cat,topic:x.id,prompt:`Quelle proposition complète correctement : « ${subject}… » ?`,o:q.o,ans:q.ans,x,why:s};
  }
  return {make};
})();