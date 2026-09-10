(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'ORG-0002':'titre de partie sans fait autonome',
    'ORG-0039':'mission dont le sujet institutionnel a disparu lors du découpage; ne pas l’attribuer par inférence',
    'ORG-0044':'mission dont le sujet institutionnel a disparu lors du découpage; ne pas l’attribuer par inférence',
    'ORG-0045':'caractéristique dont le sujet institutionnel a disparu lors du découpage; ne pas l’attribuer par inférence',
    'ORG-0046':'mission dont le sujet institutionnel a disparu lors du découpage; ne pas l’attribuer par inférence',
    'ORG-0053':'question-type éditoriale redondante avec le fait autonome donnant déjà la signification de TVA'
  };

  const FIX={
    'ACT-0078':[
      'Suspension partielle de la réforme des retraites — date: 1er septembre 2026'
    ],
    'ACT-0094':[
      'Application des règles principales relatives à de nombreux systèmes à haut risque de l’annexe III — date: 2 décembre 2027'
    ],

    'ORG-0026':[
      'DGFiP — caractéristiques: réunit des missions fiscales et des missions de gestion publique'
    ],
    'ORG-0027':[
      'DGFiP — rôle: produit et contrôle la qualité des comptes de l’État'
    ],
    'ORG-0029':[
      'DGFiP — association: impôts et recettes publiques',
      'DGFiP — association: comptes publics',
      'DGFiP — association: foncier',
      'DGFiP — association: conseil financier au secteur public'
    ],
    'ORG-0036':[
      'DGCCRF — rôle: garantit l’ordre public économique',
      'DGCCRF — rôle: contribue à la confiance entre consommateurs et entreprises'
    ],
    'ORG-0037':[
      'DGCCRF — rôle: mène des enquêtes et des contrôles',
      'DGCCRF — rôle: prononce ou propose des sanctions selon les cas'
    ],
    'ORG-0047':[
      'TVA — définition: taxe sur la valeur ajoutée'
    ],
    'ORG-0051':[
      'TVA à payer — formule: TVA collectée − TVA déductible'
    ],
    'ORG-0054':[
      'Tarif douanier — définition: droit de douane appliqué aux marchandises importées'
    ],
    'ORG-0062':[
      'Recouvrement des impôts — définition: collecte ou encaissement des impôts'
    ],
    'ORG-0073':[
      'Régime unifié de responsabilité financière des gestionnaires publics — date: 1er janvier 2023',
      'Responsabilité financière des gestionnaires publics depuis 2023 — caractéristiques: remplace l’ancien régime spécifique de responsabilité personnelle et pécuniaire des comptables'
    ],
    'ORG-0074':[
      'Comptable public — caractéristiques: ne réquisitionne pas l’ordonnateur'
    ],
    'ORG-0081':[
      'Réception des factures électroniques par toutes les entreprises — date: 1er septembre 2026',
      'Émission des factures électroniques par les PME et micro-entreprises — date: 1er septembre 2027'
    ],
    'ORG-0094':[
      'Fraude fiscale — définition: fait de se soustraire illégalement à l’impôt',
      'Fraude fiscale — association: dissimulation volontaire de revenus, d’une activité ou d’opérations imposables'
    ],
    'ORG-0095':[
      'Optimisation fiscale licite — caractéristiques: utilise les règles prévues par la loi',
      'Fraude fiscale — caractéristiques: se distingue de l’optimisation fiscale licite'
    ],
    'ORG-0097':[
      'Tracfin — caractéristiques: n’est pas un service auquel les particuliers adressent directement leurs signalements ordinaires'
    ]
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
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28c-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();