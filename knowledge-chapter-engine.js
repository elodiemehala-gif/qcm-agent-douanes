(()=>{
  const base=window.QKNOW,CH=window.QCHAPTER;
  if(!base||!CH)return;
  const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
  const fix=s=>String(s||'').replace(/\bouvoir théocratique\b/gi,'Pouvoir théocratique').replace(/\bouvoir politique\b/gi,'Pouvoir politique').replace(/\s+/g,' ').trim();
  const wc=s=>fix(s).split(/\s+/).filter(Boolean).length;
  const family=q=>{
    const p=(q?.prompt||'').toLowerCase();
    if(/année|date/.test(p))return'year';
    if(/période/.test(p))return'period';
    if(/pourcentage/.test(p))return'percent';
    if(/où|capitale|siège/.test(p))return'place';
    if(/qui|par qui/.test(p))return'person';
    if(/définition/.test(p))return'def';
    if(/base repose|sur quelle base/.test(p))return'base';
    if(/comment .*considér/.test(p))return'character';
    return'fact';
  };
  const numericNear=(answer,fam)=>{
    const s=fix(answer),out=[];
    if(fam==='year'&&/^\d{4}$/.test(s)){const n=+s;[-10,-5,-3,3,5,10].forEach(d=>out.push(String(n+d)))}
    else if(fam==='percent'){const m=s.match(/(-?\d+(?:[,.]\d+)?)\s*%/);if(m){const n=parseFloat(m[1].replace(',','.'));[-2,-1,.5,1,2,5].forEach(d=>out.push(String(Math.max(0,n+d)).replace('.',',')+' %'))}}
    else if(fam==='period'){const m=s.match(/(\d{4}).*?(\d{4})/);if(m){const a=+m[1],b=+m[2];[-10,-5,5,10].forEach(d=>out.push(`${a+d}-${b+d}`));out.push(`${a}-${b+5}`,`${a+5}-${b}`)}}
    return out;
  };
  function make(x,K,H){
    const q=base.make(x,K,H);if(!q)return null;
    const answer=fix(q.o[q.ans]),fam=family(q),chap=CH.chapter(x),aw=Math.max(1,wc(answer));
    let candidates=[];
    const same=K.filter(y=>y.id!==x.id&&y.cat===x.cat&&CH.chapter(y)===chap);
    for(const y of same){
      let qy;try{qy=base.make(y,K,H)}catch{}
      if(!qy||family(qy)!==fam)continue;
      const a=fix(qy.o[qy.ans]);if(!a||a===answer)continue;
      const n=wc(a);if(n>=Math.max(1,Math.floor(aw*.55))&&n<=Math.ceil(aw*1.75))candidates.push(a);
    }
    candidates=uniq([...numericNear(answer,fam),...candidates]);
    if(candidates.length<3){
      for(const y of same){
        let qy;try{qy=base.make(y,K,H)}catch{}
        if(!qy)continue;const a=fix(qy.o[qy.ans]);if(a&&a!==answer)candidates.push(a);
      }
    }
    candidates=uniq(candidates);
    const chosen=H.sh(candidates).slice(0,3);
    if(chosen.length===3){const o=H.sh([answer,...chosen]);q.o=o;q.ans=o.indexOf(answer)}
    q.prompt=fix(q.prompt);q.why=fix(q.why);q.o=q.o.map(fix);q.chapter=chap;
    return q;
  }
  window.QKNOW={...base,make};
})();