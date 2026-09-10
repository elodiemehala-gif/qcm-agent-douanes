(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const sameContext=(a,b)=>a&&b&&a.cat===b.cat&&a.page===b.page;
  const metaStart=/^(?:Penser|Croire|Confondre|Mélanger|Attribuer|Ne pas confondre)\b/i;
  const metaQcm=/\b(?:reviennent souvent dans les QCM|point de QCM|demandée?s? dans les QCM|pré[\s‐-]?admissibilité|articles importants pour les concours)\b/i;
  const bareContext=/^(?:Conséquences|Applications|Répartition|Organisation|Composition|Vérification)\s*:/i;
  const brokenStart=/^(?:\d+\)\s+et\s+la\s+liberté|J\.-C\.(?!\s+par les réformes))/i;
  const brokenEnd=/\b(?:art|av)\.\s*$/i;
  const fields='Définition constitutionnelle|Définition|Principe|Sens|Structure|Rôle du Premier ministre|Rôle|Portée|Niveaux|Concept|Obligation|Mission|Missions|Fonction|Fonctions';

  function normalizeHeading(s){
    s=clean(s).replace(/^[A-Z]\.\d+(?:\.\d+)?\s+/,'');
    const re=new RegExp('^(.{2,100}?)\\s+('+fields+')\\s*:\\s*(.+)$','i');
    const m=s.match(re);
    if(m)return `${clean(m[1])} — ${clean(m[2])}: ${clean(m[3])}`;
    return s;
  }

  function rewriteKnown(s){
    if(/^J\.-C\.\s+par les réformes de Clisthène et Périclès\s*:/i.test(s)){
      const rest=clean(s.replace(/^J\.-C\.\s+par les réformes de Clisthène et Périclès\s*:\s*/i,''));
      return `Démocratie athénienne — caractéristiques: réformes de Clisthène et Périclès; ${rest}`;
    }
    if(/^11\)\s*:\s*tout citoyen peut/i.test(s)){
      const rest=clean(s.replace(/^11\)\s*:\s*/i,''));
      return `Article 11 de la DDHC — liberté d’expression: ${rest}`;
    }
    return s;
  }

  function invalidStandalone(s){
    if(!s)return true;
    if(metaStart.test(s)||metaQcm.test(s)||bareContext.test(s))return true;
    if(brokenStart.test(s)||brokenEnd.test(s))return true;
    if(/^C’est cette définition qui est souvent demandée/i.test(s))return true;
    return false;
  }

  function atom(x,text,id=x.id){
    const s=normalizeHeading(rewriteKnown(clean(text)));
    return {...x,id,text:s,sourceText:s};
  }

  S.enrich=function(raw){
    const base=old.call(S,raw),out=[];
    for(let i=0;i<base.length;i++){
      const x=base[i],s=clean(x.text),n=base[i+1],ns=clean(n&&n.text);

      // Répare la coupure fautive « av. » / « J.-C. » sans conserver deux pseudo-faits.
      if(/\bav\.\s*$/i.test(s)&&/^J\.-C\./i.test(ns)&&sameContext(x,n)){
        const left=clean(s.replace(/\bav\.\s*$/i,''));
        const after=clean(ns.replace(/^J\.-C\.\s*,?\s*/i,''));
        const m=left.match(/^Néolithique\s*:\s*à partir de\s*~?\s*([\d ]+)$/i);
        if(m){
          out.push(atom(x,`Néolithique — date de début: vers ${clean(m[1])} av. J.-C.`,`${x.id}-a`));
          const desc=clean(after.replace(/^révolution agricole\s*:\s*/i,''));
          if(desc)out.push(atom(x,`Révolution agricole néolithique — caractéristiques: ${desc}`,`${x.id}-b`));
          i++;continue;
        }
      }

      // La séquence « art. 11 » a été coupée en deux éléments: on supprime l’amorce et garde un fait complet.
      if(/^\d+\)\s+et\s+la\s+liberté d’expression\s*\(art\.\s*$/i.test(s)&&/^11\)\s*:/i.test(ns)&&sameContext(x,n)){
        out.push(atom(n,rewriteKnown(ns),`${n.id}-article11`));
        i++;continue;
      }

      const fixed=normalizeHeading(rewriteKnown(s));
      if(invalidStandalone(fixed))continue;
      out.push({...x,text:fixed,sourceText:fixed});
    }
    return out;
  };
})();
