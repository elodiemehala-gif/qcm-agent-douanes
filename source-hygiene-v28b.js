(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'ACT-0006':'titre et date de version du cours; aucune information d’actualité autonome à interroger',
    'ACT-0016':'consigne éditoriale de révision; ne constitue pas un fait autonome',
    'ACT-0076':'fragment temporel sans sujet explicite; impossible de le rattacher sans inventer le référent',
    'ACT-0077':'phrase dépendante d’une stratégie dont le sujet n’est pas nommé dans cette entrée',
    'ACT-0081':'note de positionnement pédagogique entre deux parties du cours; ne constitue pas un fait autonome'
  };

  const FIX={
    'ACT-0012':['Âge légal de 64 ans à compter du 1er septembre 2026 — association: génération 1969'],
    'ACT-0015':['PME et micro-entreprises — obligation: émettre des factures électroniques à compter du 1er septembre 2027'],
    'ACT-0037':['Inflation — définition: évolution des prix'],
    'ACT-0038':['Croissance — définition: évolution du PIB'],
    'ACT-0039':['Droit additionnel de base instauré par les États-Unis en avril 2025 — valeur: 10 %','Droit additionnel américain d’avril 2025 — caractéristiques: concerne de nombreuses importations','Droit additionnel américain d’avril 2025 — caractéristiques: complété par des taux spécifiques selon les pays puis modifié par des négociations et décisions successives'],
    'ACT-0041':['Droit de douane — rôle: peut protéger un secteur national','Droit de douane — caractéristiques: peut renchérir le prix des produits importés','Droit de douane — caractéristiques: peut provoquer des mesures de rétorsion'],
    'ACT-0042':['Sommet du G7 de juin 2026 — localisation: Évian-les-Bains','Sommet du G7 à Évian-les-Bains — repère: du 15 au 17 juin 2026'],
    'ACT-0044':['G7 — association: Allemagne, Canada, États-Unis, France, Italie, Japon et Royaume-Uni','G7 — association: Union européenne représentée aux travaux'],
    'ACT-0046':['Ukraine — caractéristiques: n’est pas membre de l’OTAN'],
    'ACT-0053':['Sommet de l’OTAN à Ankara — date: juillet 2026'],
    'ACT-0054':['Sommet de l’OTAN d’Ankara en 2026 — association: réaffirmation de l’article 5','Sommet de l’OTAN d’Ankara en 2026 — association: poursuite du soutien à l’Ukraine'],
    'ACT-0056':['Présidence tournante du Conseil de l’Union européenne du 1er juillet au 31 décembre 2026 — association: Irlande'],
    'ACT-0057':['Irlande — association: succède à Chypre à la présidence tournante du Conseil de l’UE','Lituanie — association: présidence tournante du Conseil de l’UE au premier semestre 2027'],
    'ACT-0061':['Année 2025 — repère: l’une des trois années les plus chaudes jamais enregistrées selon l’OMM'],
    'ACT-0063':['Neutralité climatique de l’Union européenne — date: 2050'],
    'ACT-0066':['Canicule en France hexagonale de juillet 2026 — repère: du 4 au 22 juillet 2026','Canicule en France hexagonale de juillet 2026 — caractéristiques: tous les habitants ont connu au moins un jour de vigilance orange'],
    'ACT-0067':['Départements placés en vigilance rouge canicule du 10 au 15 juillet 2026 — valeur: 37'],
    'ACT-0068':['Nouvel épisode de canicule de fin juillet 2026 — repère: du 29 juillet au 10 août','Population hexagonale ayant connu au moins un jour de vigilance orange entre le 29 juillet et le 10 août — valeur: 28 %'],
    'ACT-0078':['Suspension partielle de la réforme des retraites à partir du 1er septembre 2026 — rôle: modifie le calendrier de relèvement de l’âge légal et de la durée d’assurance'],
    'ACT-0079':['Génération 1968 — association: âge légal de 63 ans et 9 mois','Génération 1969 — association: âge légal de 64 ans'],
    'ACT-0082':['AI Act — caractéristiques: adopte une approche fondée sur les niveaux de risque'],
    'ACT-0083':['AI Act à partir du 2 août 2026 — association: exigences de transparence pour certains systèmes d’IA'],
    'ACT-0094':['Règles principales de nombreux systèmes à haut risque de l’annexe III — repère: application à partir du 2 décembre 2027'],
    'ACT-0095':['Obligations de signalement des fabricants — repère: à partir du 11 septembre 2026','Fabricants — obligation: signaler certaines vulnérabilités activement exploitées et certains incidents graves']
  };

  S.enrich=function(raw){
    const out=old.call(S,raw);
    const base=window.QSMART_SOURCE_BASE||[];
    const resolved=window.QSMART_SOURCE_RESOLVED||(window.QSMART_SOURCE_RESOLVED={});
    const targets=new Set([...Object.keys(FIX),...Object.keys(NON_ATOMIC)]);
    const kept=out.filter(x=>!targets.has(rootId(x.id)));
    for(const x of base){
      const id=rootId(x.id);
      if(NON_ATOMIC[id]){resolved[id]=NON_ATOMIC[id];continue;}
      const facts=FIX[id];if(!facts)continue;
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28b-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();