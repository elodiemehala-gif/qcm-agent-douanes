(()=>{
  const S=window.QSMART;if(!S||!S.make)return;
  const old=S.make;
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'");
  function authorQ(x,H,title){
    const correct='Victor Hugo';
    const o=H.sh([correct,'Émile Zola','Gustave Flaubert','Honoré de Balzac']);
    return {kind:'k',cat:x.cat,chapter:x.chapter,topic:x.topicName,prompt:`Qui est l’auteur de « ${title} » ?`,o,ans:o.findIndex(v=>norm(v)===norm(correct)),x,why:String(x.sourceText||x.text||'')};
  }
  S.make=function(x,K,H){
    const id=rootId(x&&x.id);
    if(id==='HIS-0398')return authorQ(x,H,'Les Misérables');
    if(id==='HIS-0431')return authorQ(x,H,'Notre-Dame de Paris');
    return old.call(S,x,K,H);
  };
})();
