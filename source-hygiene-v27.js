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
  const NON_ATOMIC={
    'HIS-0247':'avertissement comparatif sans information autonome exploitable',
    'HIS-0396':'avertissement comparatif sans information autonome exploitable',
    'EMC-0002':'fragment absorbé par l’article 11 reconstitué dans l’entrée suivante',
    'EMC-0048':'fragment éditorial de titre sans fait autonome',
    'EMC-0049':'fragment éditorial sans fait autonome',
    'MAT-0075':'ligne de vérification rattachée à l’exercice précédent',
    'MAT-0076':'ligne de vérification et consigne méthodologique, non fait autonome',
    'MAT-0135':'avertissement sans définition ni propriété autonome'
  };

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
    if(/valeur|bilan humain|anciennete/.test(f))return'valeur';
    if(/association/.test(f))return'association';
    if(/repere/.test(f))return'repère';
    if(/notion.?cle/.test(f))return'notion-clé';
    if(/caracteristique|particularite|details?|a retenir|interpretation qcm|information \d+|priorite concours|statut|lien|regime|portee|cause|mode d.election|action|consequence|heritage|influence|repartition|organisation|composition|fondement/.test(f))return'caractéristiques';
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

  function rewriteById(x){
    const M={
      'HIS-0014':['Néolithique — date: vers 10 000 av. J.-C.','Apparition de l’écriture — date: vers 3 000 av. J.-C.','Australopithèques — valeur: 3,3 millions d’années'],
      'HIS-0025':['Vallée des Rois — caractéristiques: accueille des tombeaux royaux plus récents que les pyramides'],
      'HIS-0038':['Civilisation grecque — association: philosophie, théâtre et mathématiques','Athènes — caractéristiques: démocratie directe','Civilisation grecque — association: influence sur Rome'],
      'HIS-0039':['Sparte — caractéristiques: régime oligarchique'],
      'HIS-0040':['Platon — caractéristiques: conception fondée sur le monde des Idées','Aristote — caractéristiques: conception fondée sur l’empirisme'],
      'HIS-0057':['Chute de l’Empire romain d’Occident — date: 476','Chute de l’Empire romain d’Orient — date: 1453'],
      'HIS-0069':['Hégire — date: 622','Hégire — définition: fuite de Mahomet de La Mecque à Médine'],
      'HIS-0080':['Royaume franc chrétien — caractéristiques: alliance étroite entre pouvoir et Église','Royaume franc chrétien — repère: origine du futur royaume de France'],
      'HIS-0082':['Charles Martel — rôle: maire du palais','Victoire de Poitiers de Charles Martel — date: 732','Charlemagne — caractéristiques: empereur en 800'],
      'HIS-0092':['Guerre de Cent Ans — caractéristiques: durée de 116 ans avec des trêves'],
      'HIS-0105':['Renaissance — association: diffusion de l’imprimerie autour de 1450','Réforme — caractéristiques: affaiblissement de l’Église romaine','Renaissance — caractéristiques: ouverture au monde'],
      'HIS-0118':['Monarchie de Louis XIV — caractéristiques: centralisation de l’administration','Classicisme — association: Molière, Racine et Lully','Révocation de l’édit de Nantes — caractéristiques: désaffection des protestants','Règne de Louis XIV — caractéristiques: crise financière'],
      'HIS-0119':['Louis XIV — association: agrandissement du château de Versailles'],
      'HIS-0130':['Les Lumières — repère: préparent le terreau intellectuel de la Révolution française'],
      'HIS-0131':['Les Lumières — caractéristiques: diffusion des idées républicaines et libérales en Europe et en Amérique'],
      'HIS-0132':['Montaigne — association: Renaissance'],
      'HIS-0133':['Diderot — rôle: coordonnateur et contributeur de l’Encyclopédie avec d’Alembert et de nombreux auteurs'],
      'HIS-0142':['Crise de 1788 — caractéristiques: causes multiples, financières, politiques et intellectuelles'],
      'HIS-0153':['Proclamation de la République française — date: 1792','Déclaration des droits de l’homme et du citoyen — date: 1789'],
      'HIS-0154':['Terreur — caractéristiques: gouvernement collégial impliquant notamment Saint-Just et Couthon'],
      'HIS-0166':['Empire napoléonien — caractéristiques: diffusion des idées révolutionnaires en Europe','Administration napoléonienne — repère: réorganisation administrative durable','Campagnes napoléoniennes — caractéristiques: pertes humaines'],
      'HIS-0167':['Code civil — domaine: droit des personnes, des biens et des contrats'],
      'HIS-0168':['Napoléon — caractéristiques: instaure un Empire autoritaire tout en conservant certaines conquêtes révolutionnaires'],
      'HIS-0172':['Cent-Jours — date: 1815','Cent-Jours — repère: se terminent avec Waterloo'],
      'HIS-0192':['Loi de 1905 — caractéristiques: comporte certaines exceptions, notamment en Alsace-Moselle'],
      'HIS-0200':['Loi Le Chapelier — date: 1791','Reconnaissance légale des syndicats — date: 1884'],
      'HIS-0209':['Première Guerre mondiale — bilan humain: plus de 9 millions de morts'],
      'HIS-0210':['Première Guerre mondiale — conséquences: bouleversements territoriaux'],
      'HIS-0211':['Après la Première Guerre mondiale — repère: montée des tensions conduisant à la Seconde Guerre mondiale'],
      'HIS-0213':['Assassinat de François-Ferdinand — rôle: déclenche un système d’alliances déjà tendu'],
      'HIS-0219':['Crise de 1929 — caractéristiques: s’étend rapidement au monde entier'],
      'HIS-0232':['Seconde Guerre mondiale — bilan humain: plus de 60 millions de morts','Création de l’ONU — date: 1945','Après la Seconde Guerre mondiale — repère: début de la Guerre froide'],
      'HIS-0233':['Appel du 18 juin — date: 18 juin 1940','Capitulation française — date: 22 juin 1940'],
      'HIS-0246':['Fin de la Guerre froide — date: 1991'],
      'HIS-0256':['Création de la Sécurité sociale — date: 1945','Création du régime général de retraite — date: 1946'],
      'HIS-0257':['IVe République — caractéristiques: régime d’assemblée'],
      'HIS-0271':['Charles de Gaulle — repère: même personne pendant la Résistance et comme président de la Ve République'],
      'HIS-0272':['Article 49-3 — rôle: engage la responsabilité du gouvernement'],
      'HIS-0292':['Sénateurs — caractéristiques: élus au suffrage universel indirect par un collège de grands électeurs'],
      'HIS-0293':['Référendum — définition: vote direct des citoyens sur un texte','Motion de censure — définition: vote parlementaire pouvant renverser le gouvernement'],
      'HIS-0372':['Déclaration d’indépendance américaine — auteur: Thomas Jefferson'],
      'HIS-0397':['Invasion du Koweït par l’Irak — date: 1990'],
      'HIS-0412':['Annexion de la Crimée — date: 2014'],
      'GEO-0297':['Population française — caractéristiques: forte concentration en Île-de-France, dans les grandes métropoles, les vallées fluviales, les façades littorales et certains espaces frontaliers'],
      'EMC-0005':['Liberté — caractéristiques: comprend notamment les libertés de conscience, de culte, de presse, de réunion, d’association, de circulation et d’entreprendre'],
      'EMC-0081':['Conseil constitutionnel — composition: neuf membres nommés pour neuf ans','Conseil constitutionnel — composition: trois membres nommés par le Président de la République, trois par le président de l’Assemblée nationale et trois par le président du Sénat','Conseil constitutionnel — composition: anciens Présidents de la République membres de droit'],
      'EMC-0085':['Justice administrative — organisation: tribunaux administratifs, cours administratives d’appel et Conseil d’État'],
      'EMC-0102':['Modes de scrutin — caractéristiques: majoritaire à deux tours, proportionnel, uninominal ou de liste'],
      'EMC-0183':['Procès équitable — définition: droit à un procès public, équitable et dans un délai raisonnable'],
      'ACT-0058':['António Costa — rôle: président du Conseil européen depuis le 1er décembre 2024'],
      'MAT-0014':['-3² — valeur: -9','(-3)² — valeur: 9']
    };
    return M[x.id]||null;
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
    window.QSMART_SOURCE_BASE=base.map(x=>({...x}));
    window.QSMART_SOURCE_RESOLVED={};
    const resolve=(x,reason)=>{window.QSMART_SOURCE_RESOLVED[x.id]=reason};
    for(let i=0;i<base.length;i++){
      const x=base[i],s=clean(x.text),n=base[i+1],ns=clean(n&&n.text);

      if(NON_ATOMIC[x.id]){resolve(x,NON_ATOMIC[x.id]);continue;}

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

      const byId=rewriteById(x);
      if(byId){
        byId.forEach((text,j)=>out.push(atom(x,text,byId.length>1?`${x.id}-${j+1}`:x.id)));
        continue;
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