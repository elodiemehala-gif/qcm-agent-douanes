(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];
  const NON_ATOMIC={
    'ORG-0014':'consigne de méthode pour le QCM (« associer chaque sigle à sa mission »), pas une connaissance autonome',
    'LOG-0106':'description générale de ce que mesure un type d’exercice, conservée dans le cours mais non traitée comme fait à mémoriser',
    'LOG-0192':'description générale de ce que mesurent suites, analogies et matrices, conservée dans le cours mais non traitée comme fait à mémoriser'
  };
  S.enrich=function(raw){
    const out=old.call(S,raw),resolved=window.QSMART_SOURCE_RESOLVED||(window.QSMART_SOURCE_RESOLVED={});
    const targets=new Set(Object.keys(NON_ATOMIC));
    const kept=out.filter(x=>!targets.has(rootId(x.id)));
    for(const id of targets)resolved[id]=NON_ATOMIC[id];
    return kept;
  };
})();
