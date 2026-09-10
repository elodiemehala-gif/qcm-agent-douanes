(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'EMC-0175':'en-tête de tableau (« Institution — Caractéristiques: Citations ») sans connaissance autonome',
    'ORG-0003':'en-tête de tableau (« Responsable — Lauréat(s): Portefeuille ») sans connaissance autonome',
    'ORG-0078':'commentaire éditorial sur le sujet test, pas une connaissance autonome',
    'CG-0314':'en-tête de tableau (« Système — Repère: Repères ») sans connaissance autonome',
    'CG-0350':'phrase dont l’antécédent a disparu au découpage; ne pas reconstruire le sujet par inférence'
  };

  const FIX={
    'HIS-0091':[
      'Évolution du pouvoir royal au Moyen Âge — association: affirmation de l’autorité royale',
      'Évolution du pouvoir royal au Moyen Âge — association: affaiblissement de la féodalité',
      'Évolution du pouvoir royal au Moyen Âge — association: naissance de l’État moderne'
    ],
    'HIS-0211':['Après la Première Guerre mondiale — association: montée des tensions conduisant à la Seconde Guerre mondiale'],
    'HIS-0236':[
      'Guerre froide — définition: affrontement idéologique et géopolitique entre les États-Unis et l’URSS',
      'Guerre froide — caractéristiques: absence de confrontation militaire directe entre les deux superpuissances'
    ],
    'HIS-0245':[
      'OTAN — définition: Organisation du traité de l’Atlantique Nord',
      'OTAN — date: 1949',
      'Pacte de Varsovie — date: 1955'
    ],

    'GEO-0342':[
      'Arrivées touristiques internationales en France en 2025 — valeur: 102 millions',
      'France en 2025 pour le nombre d’arrivées touristiques internationales — repère: premier rang mondial',
      'Arrivées touristiques internationales en France en 2025 — association: Atout France'
    ],
    'GEO-0352':[
      'Loi NOTRe — date: 7 août 2015',
      'Loi NOTRe — rôle: redéfinit la répartition des compétences entre collectivités'
    ],
    'GEO-0369':[
      'Mayotte — statut: Département-Région',
      'Mayotte comme Département-Région — date: 1er janvier 2026',
      'Mayotte — localisation: océan Indien'
    ],

    'EMC-0181':['Tribunal des conflits — rôle: tranche les conflits de compétence'],
    'EMC-0192':[
      'CJUE — siège: Luxembourg',
      'CJUE — rôle: assure le respect du droit de l’Union européenne',
      'CJUE — rôle: interprète les traités',
      'Arrêts de la CJUE — caractéristiques: contraignants'
    ],
    'EMC-0193':[
      'Banque centrale européenne — rôle: gère l’euro',
      'Banque centrale européenne — rôle: conduit la politique monétaire de la zone euro'
    ],
    'EMC-0194':[
      'Comité européen des régions — rôle: organe consultatif représentant les collectivités territoriales',
      'Comité économique et social — rôle: organe consultatif représentant les partenaires sociaux'
    ],
    'EMC-0196':['Conseil de l’Europe — caractéristiques: n’a aucun pouvoir législatif sur l’Union européenne'],
    'EMC-0198':[
      'ONU — association: Assemblée générale',
      'ONU — association: Conseil de sécurité',
      'ONU — association: Secrétariat général',
      'ONU — association: Cour internationale de justice',
      'Conseil de sécurité de l’ONU — nombre: 15',
      'Membres permanents du Conseil de sécurité de l’ONU — nombre: 5'
    ],
    'EMC-0199':['France — association: membre permanent du Conseil de sécurité de l’ONU'],

    'ACT-0048':[
      'Cessez-le-feu à Gaza soutenu par les États-Unis — date: octobre 2025',
      'Gaza en 2026 malgré le cessez-le-feu — caractéristiques: des frappes et incidents armés continuent',
      'Mise en œuvre du cessez-le-feu à Gaza en 2026 — caractéristiques: fragile'
    ],
    'ACT-0053':['Sommet de l’OTAN à Ankara — date: juillet 2026'],
    'ACT-0078':['Suspension partielle de la réforme des retraites — date: 1er septembre 2026'],
    'ACT-0095':[
      'Obligations de signalement des fabricants — date: 11 septembre 2026',
      'Fabricants à partir du 11 septembre 2026 — obligation: signaler certaines vulnérabilités activement exploitées',
      'Fabricants à partir du 11 septembre 2026 — obligation: signaler certains incidents graves'
    ],

    'ORG-0018':[
      'Direction des affaires juridiques — association: conseil juridique',
      'Direction des affaires juridiques — rôle: expertise des textes',
      'Direction des affaires juridiques — association: commande publique'
    ],
    'ORG-0029':[
      'DGFiP — association: impôts et recettes publiques',
      'DGFiP — association: comptes publics',
      'DGFiP — association: foncier',
      'DGFiP — rôle: conseil financier au secteur public'
    ],

    'MAT-0063':[
      'Identité remarquable (a-b)² — formule: a² - 2ab + b²',
      'Identité remarquable (a-b)(a+b) — formule: a² - b²',
      'Monôme — définition: produit d’un nombre et de puissances de variables',
      'Monôme — exemple: 3x²'
    ],

    'CG-0087':[
      'Colisée — définition: amphithéâtre',
      'Colisée — localisation: Rome',
      'Panthéon de Rome — association: coupole'
    ],
    'CG-0090':[
      'Apparition de l’architecture gothique — période: XIIe siècle',
      'Architecture gothique — association: arc brisé',
      'Architecture gothique — association: croisée d’ogives',
      'Architecture gothique — association: arcs-boutants',
      'Architecture gothique — caractéristiques: permet des édifices plus hauts et plus lumineux'
    ],
    'CG-0279':['Vitesse — formule: distance parcourue / durée'],
    'CG-0484':[
      'BCE — définition: Banque centrale européenne',
      'BCE — siège: Francfort'
    ],
    'CG-0533':['Taux de change — définition: prix d’une monnaie exprimé dans une autre']
  };

  S.enrich=function(raw){
    const out=old.call(S,raw),base=window.QSMART_SOURCE_BASE||[];
    const resolved=window.QSMART_SOURCE_RESOLVED||(window.QSMART_SOURCE_RESOLVED={});
    const targets=new Set([...Object.keys(FIX),...Object.keys(NON_ATOMIC)]);
    const kept=out.filter(x=>!targets.has(rootId(x.id)));
    for(const x of base){
      const id=rootId(x.id);
      if(NON_ATOMIC[id]){resolved[id]=NON_ATOMIC[id];continue;}
      const facts=FIX[id];if(!facts)continue;
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28i-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();
