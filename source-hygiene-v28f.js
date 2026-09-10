(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];
  const FIX={
    'HIS-0098':['Humanisme — association: valorisation de l’homme','Humanisme — association: culture antique'],
    'HIS-0154':['Terreur — caractéristiques: gouvernement collégial','Terreur — association: Saint-Just','Terreur — association: Couthon'],
    'HIS-0290':['Conseil d’État — rôle: conseille le gouvernement','Conseil d’État — rôle: juge suprême de l’administration'],
    'GEO-0050':['Océan Austral / Antarctique — association: courant circumpolaire'],
    'GEO-0122':['Fleuve — association: mer ou océan','Rivière — association: autre cours d’eau'],
    'ORG-0018':['Direction des affaires juridiques — rôle: conseil juridique','Direction des affaires juridiques — rôle: expertise des textes','Direction des affaires juridiques — association: commande publique']
  };
  S.enrich=function(raw){
    const out=old.call(S,raw),base=window.QSMART_SOURCE_BASE||[];
    const targets=new Set(Object.keys(FIX));
    const kept=out.filter(x=>!targets.has(rootId(x.id)));
    for(const x of base){const id=rootId(x.id),facts=FIX[id];if(!facts)continue;facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28f-${j+1}`:id,text:clean(text),sourceText:clean(text)}));}
    return kept;
  };
})();