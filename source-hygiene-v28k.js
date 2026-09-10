(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];
  S.enrich=function(raw){
    const out=old.call(S,raw),base=window.QSMART_SOURCE_BASE||[];
    const kept=out.filter(x=>rootId(x.id)!=='HIS-0271');
    const x=base.find(y=>rootId(y.id)==='HIS-0271');
    if(x)kept.push({...x,id:'HIS-0271',text:'Charles de Gaulle — repère: c’est la même personne',sourceText:'Charles de Gaulle — repère: c’est la même personne'});
    return kept;
  };
})();
