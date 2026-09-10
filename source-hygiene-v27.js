(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'");
  const sameContext=(a,b)=>a&&b&&a.cat===b.cat&&a.page===b.page;
  const metaStart=/^(?:Penser|Croire|Confondre|Mélanger|Attribuer|Ne pas confondre)\b/i;
  const metaQcm=/\b(?:reviennent souvent dans les QCM|point de QCM|demandée?s? dans les QCM|pré[\s‐-]?admissibilité|articles importants pour les concours)\b/i;
  const bareContext=/^(?:Conséquences|Applications|Répartition|Organisation|Composition|Vérification)\s*:/i;
  const brokenStart=/^(?:\d+\)\s+et\s+la\s+liberté|J\.-C\.(?!\s+par les réformes))/i;
  const brokenEnd=/\b(?:art|av)\.\s*$/i;
  const fields='Définition constitutionnelle|Définition|Principe|Sens|Structure|Rôle du Premier ministre|Rôle|Portée|Niveaux|Concept|Obligation|Mission|Missions|Fonction|Fonctions';
  const genericColon=/^(?:Conséquences|Applications|Compléments|Illustrations|Répartition|Organisation|Composition|Vérification|Particularités|Détails|Repères?)$/i;

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
      return `Article 11 de la DDHC — définition: ${rest}`;
    }
    return s;
  }

  function fieldFor(term,answer){
    const t=norm(term),a=norm(answer);
    if(/auteur|ecrivain|peintre|compositeur/.test(t))return'auteur';
    if(/population|habitants/.test(t))return'population';
    if(/formule|calcul|relation/.test(t))return'formule';
    if(/role|mission|fonction/.test(t))return'rôle';
    if(/siege|localisation|situe/.test(t)||/^(?:situee?|se situe|siege)\b/.test(a))return'localisation';
    if(/date|annee|periode/.test(t)||/^(?:vers|en|a partir de)\s*[~−-]?\s*\d/.test(a)||/^[−-]?\d{3,4}(?:\s|$)/.test(a))return'date';
    if(/definition|sens|concept|principe/.test(t)||/^(?:designe|correspond a|est un|est une|principe|systeme|regime|courant|capacite)\b/.test(a))return'définition';
    return'caractéristiques';
  }

  function canonicalField(subject,field,answer){
    const f=norm(field);
    if(/definition/.test(f))return'définition';
    if(/population/.test(f))return'population';
    if(/auteur|artiste|createur/.test(f))return'auteur';
    if(/localisation|siege|localise/.test(f))return'localisation';
    if(/date|annee|periode/.test(f))return'date';
    if(/formule/.test(f))return'formule';
    if(/role|mission|fonction/.test(f))return'rôle';
    if(/obligation/.test(f))return'obligation';
    if(/valeur/.test(f))return'valeur';
    if(/association/.test(f))return'association';
    if(/repere/.test(f))return'repère';
    if(/notion.?cle/.test(f))return'notion-clé';
    if(/caracteristique|particularite|details?|a retenir|interpretation qcm|information \d+|priorite concours|statut|lien/.test(f))return'caractéristiques';
    if(/sens|concept|principe/.test(f))return'définition';
    return fieldFor(subject,answer);
  }

  function normalizeStructuredField(s){
    s=clean(s);
    const m=s.match(/^(.+?)\s+[—–]\s+([^:]{1,55})\s*:\s*(.+)$/);
    if(!m)return s;
    const subject=clean(m[1]),field=clean(m[2]),answer=clean(m[3]);
    return `${subject} — ${canonicalField(subject,field,answer)}: ${answer}`;
  }

  function structureSimpleColon(s){
    s=normalizeStructuredField(clean(s));
    if(/\s[—–]\s[^:]{1,55}\s*:/.test(s))return s;
    const m=s.match(/^([^:]{2,90})\s*:\s*(.+)$/);
    if(!m)return s;
    const term=clean(m[1]),answer=clean(m[2]);
    if(genericColon.test(term)||!answer)return s;
    return `${term} — ${fieldFor(term,answer)}: ${answer}`;
  }

  function rewriteEditorial(s){
    s=clean(s);let m;
    m=s.match(/^(?:Penser|Croire) que (.+?) est de .+?;\s*c[’']est de (.+?)\.?$/i);
    if(m)return [`${clean(m[1])} — auteur: ${clean(m[2])}`];
    m=s.match(/^(?:Penser|Croire) que (.+?) est (.+?);\s*(?:il|elle) est (.+?)\.?$/i);
    if(m)return [`${clean(m[1])} — caractéristiques: ${clean(m[3])}`];
    m=s.match(/^(?:Penser|Croire) que (.+?) est (?:un|une) .+?;\s*c[’']est (?:un|une) (.+?)\.?$/i);
    if(m)return [`${clean(m[1])} — définition: ${clean(m[2])}`];
    m=s.match(/^Attribuer (.+?) à .+?;\s*il est (.+?)\.?$/i);
    if(m)return [`${clean(m[1])} — caractéristiques: ${clean(m[2])}`];
    m=s.match(/^Confondre (.+?)\s*\(([^)]+)\) et (.+?)\s*\(([^)]+)\)\.?$/i);
    if(m)return [`${clean(m[1])} — date: ${clean(m[2])}`,`${clean(m[3])} — date: ${clean(m[4])}`];
    m=s.match(/^Confondre (.+?) et (.+?);\s*la première (.+?),\s*la seconde (.+?)\.?$/i);
    if(m)return [`${clean(m[1])} — caractéristiques: ${clean(m[3])}`,`${clean(m[2])} — caractéristiques: ${clean(m[4])}`];
    m=s.match(/^Mélanger (.+?) et (.+?);\s*l[’']un (.+?),\s*l[’']autre (.+?)\.?$/i);
    if(m)return [`${clean(m[1])} — caractéristiques: ${clean(m[3])}`,`${clean(m[2])} — caractéristiques: ${clean(m[4])}`];
    m=s.match(/^Ne pas confondre\s*:\s*([^=]+?)\s*=\s*(.+)$/i);
    if(m)return [`${clean(m[1])} — définition: ${clean(m[2])}`];
    m=s.match(/^Ne pas confondre (.+?) et (.+?)\s*:\s*(.+)$/i);
    if(m)return [`${clean(m[1])} et ${clean(m[2])} — formule: ${clean(m[3])}`];
    return null;
  }

  function invalidStandalone(s){
    if(!s)return true;
    if(metaQcm.test(s)||bareContext.test(s))return true;
    if(brokenStart.test(s)||brokenEnd.test(s))return true;
    if(/^C’est cette définition qui est souvent demandée/i.test(s))return true;
    return false;
  }

  function atom(x,text,id=x.id){
    const s=structureSimpleColon(normalizeHeading(rewriteKnown(clean(text))));
    return {...x,id,text:s,sourceText:s};
  }

  S.enrich=function(raw){
    const base=old.call(S,raw),out=[];
    // Référentiel stable avant nettoyage source : c'est le dénominateur historique (2 203 éléments).
    window.QSMART_SOURCE_BASE=base.map(x=>({...x}));
    for(let i=0;i<base.length;i++){
      const x=base[i],s=clean(x.text),n=base[i+1],ns=clean(n&&n.text);

      if(/\bav\.\s*$/i.test(s)&&/^J\.-C\./i.test(ns)&&sameContext(x,n)){
        const left=clean(s.replace(/\bav\.\s*$/i,''));
        const after=clean(ns.replace(/^J\.-C\.\s*,?\s*/i,''));
        const m=left.match(/^Néolithique\s*:\s*à partir de\s*~?\s*([\d ]+)$/i);
        if(m){
          out.push(atom(x,`Néolithique — date: vers ${clean(m[1])} av. J.-C.`,`${x.id}-a`));
          const desc=clean(after.replace(/^révolution agricole\s*:\s*/i,''));
          if(desc)out.push(atom(n,`Révolution agricole néolithique — caractéristiques: ${desc}`,`${n.id}-b`));
          i++;continue;
        }
      }

      if(/^\d+\)\s+et\s+la\s+liberté d’expression\s*\(art\.\s*$/i.test(s)&&/^11\)\s*:/i.test(ns)&&sameContext(x,n)){
        out.push(atom(n,rewriteKnown(ns),`${n.id}-article11`));
        i++;continue;
      }

      const editorial=rewriteEditorial(s);
      if(editorial){
        editorial.forEach((text,j)=>out.push(atom(x,text,editorial.length>1?`${x.id}-${j+1}`:x.id)));
        continue;
      }
      if(metaStart.test(s))continue;

      const fixed=structureSimpleColon(normalizeHeading(rewriteKnown(s)));
      if(invalidStandalone(fixed))continue;
      out.push({...x,text:fixed,sourceText:fixed});
    }
    return out;
  };
})();
