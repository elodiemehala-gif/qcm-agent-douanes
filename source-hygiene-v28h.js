(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'LOG-0001':'repère de reconnaissance d’un type d’exercice, utile comme conseil de méthode mais pas comme fait autonome de QCM',
    'LOG-0005':'liste d’astuces de calcul rapide, non autonome comme connaissance',
    'LOG-0015':'fragment tronqué d’une liste d’astuces sur les pourcentages',
    'LOG-0047':'repère de reconnaissance d’un exercice de conversion, non autonome comme connaissance',
    'LOG-0059':'repère de reconnaissance d’un exercice sur tableaux ou graphiques',
    'LOG-0063':'liste d’astuces de lecture graphique, non autonome comme connaissance',
    'LOG-0069':'fragment tronqué de reconnaissance d’une conclusion logique',
    'LOG-0072':'fragment tronqué d’une liste d’astuces de logique',
    'LOG-0073':'suite d’une liste de conseils de méthode, non autonome comme connaissance',
    'LOG-0079':'repère de reconnaissance d’un exercice de logique verbale',
    'LOG-0082':'liste de conseils de méthode pour les affirmations vrai/faux',
    'LOG-0084':'exemple de variante piège, non autonome comme connaissance',
    'LOG-0092':'repère de reconnaissance d’un exercice d’intrus ou d’analogie',
    'LOG-0093':'procédé de résolution d’un exercice d’intrus ou d’analogie',
    'LOG-0095':'liste d’astuces générales d’analogie, non autonome comme connaissance',
    'LOG-0097':'exemple de variante piège pour un intrus',
    'LOG-0099':'repère de reconnaissance d’un exercice de déplacement sur grille',
    'LOG-0103':'liste d’astuces de représentation sur grille',
    'LOG-0107':'repère de reconnaissance d’un exercice de raisonnement spatial',
    'LOG-0108':'procédé mental général de transformation spatiale',
    'LOG-0123':'fragment tronqué d’une liste d’astuces de matrice',
    'LOG-0124':'fragment intermédiaire d’une liste d’astuces de matrice',
    'LOG-0125':'fin d’une liste d’astuces de matrice',
    'LOG-0139':'fragment tronqué d’une liste d’astuces de rotation spatiale',
    'LOG-0140':'fragment intermédiaire d’une liste d’astuces de rotation spatiale',
    'LOG-0141':'fin d’une liste d’astuces de rotation spatiale',
    'LOG-0146':'repère de reconnaissance d’un exercice de file ou de rang',
    'LOG-0151':'objectif méthodologique de la section, pas une connaissance autonome',
    'LOG-0152':'liste d’astuces de résolution de positions relatives',
    'LOG-0154':'exemple de variante piège sur les rangs',
    'LOG-0155':'repère de reconnaissance d’un exercice de calendrier ou de durée',
    'LOG-0158':'fragment tronqué d’une liste de repères calendaires',
    'LOG-0163':'repère de reconnaissance d’un exercice de planification',
    'LOG-0168':'fragment tronqué d’une liste d’astuces de planification',
    'LOG-0169':'fin d’une liste d’astuces de planification',
    'LOG-0178':'liste d’heuristiques pour rechercher une règle de suite',
    'LOG-0189':'repère de reconnaissance d’une suite de lettres ou d’une analogie',
    'LOG-0208':'liste d’astuces de résolution de matrices visuelles',
    'LOG-0213':'repère de reconnaissance d’une grille logique à attributs',
    'LOG-0216':'liste d’astuces de remplissage d’une grille logique',
    'LOG-0228':'liste de conseils de représentation généalogique',
    'LOG-0236':'liste d’heuristiques générales d’optimisation',
    'LOG-0238':'exemple de contrainte piège, non autonome comme connaissance'
  };

  const FIX={
    'HIS-0398':['Les Misérables — association: Victor Hugo'],
    'HIS-0431':['Notre-Dame de Paris — association: Victor Hugo'],

    'LOG-0002':[
      'Proportionnalité — méthode: règle de trois',
      'Relation directement proportionnelle — caractéristiques: si une grandeur est multipliée par un facteur, l’autre est multipliée par le même facteur',
      'Relation inversement proportionnelle — caractéristiques: si une grandeur est multipliée par un facteur, l’autre est divisée par ce facteur'
    ],
    'LOG-0008':[
      'Raisonnement numérique — association: manipulation de nombres',
      'Raisonnement numérique — association: relations quantitatives',
      'Raisonnement numérique — association: pourcentages et proportions',
      'Raisonnement numérique — association: vitesses, temps et conversions',
      'Raisonnement numérique — association: tableaux et graphiques'
    ],
    'LOG-0018':[
      'Remise de 20 % — formule: multiplier par 0,8',
      'Réduction de 50 % — formule: multiplier par 0,5'
    ],
    'LOG-0025':[
      'Vitesses relatives de deux mouvements opposés — méthode: additionner les vitesses'
    ],
    'LOG-0033':[
      'Vitesse moyenne sur deux distances égales parcourues aux vitesses v1 et v2 — formule: 2v1v2/(v1+v2)',
      'Moyenne de plusieurs notes de même poids — formule: somme des notes / nombre de notes'
    ],
    'LOG-0053':[
      'Conversion de m/s en km/h — formule: multiplier par 3,6',
      'Conversion de km/h en m/s — formule: diviser par 3,6'
    ],
    'LOG-0078':[
      'Logique verbale — association: compréhension et interprétation du langage',
      'Logique verbale — association: déduction d’informations implicites',
      'Logique verbale — association: raisonnement sur des relations sémantiques'
    ],
    'LOG-0088':[
      'Implication « si A alors B » — caractéristiques: n’implique pas la réciproque « si B alors A »'
    ],
    'LOG-0106':[
      'Raisonnement spatial — association: visualisation mentale d’objets en deux dimensions',
      'Raisonnement spatial — association: visualisation mentale d’objets en trois dimensions',
      'Raisonnement spatial — association: manipulation mentale d’objets'
    ],
    'LOG-0110':[
      'Patron d’un cube — règle: deux faces opposées ne se touchent jamais une fois le cube formé'
    ],
    'LOG-0156':[
      'Semaine — valeur: 7 jours',
      'Année civile ordinaire — valeur: 365 jours',
      'Année bissextile — valeur: 366 jours'
    ],
    'LOG-0160':[
      'Calcul du jour de la semaine — méthode: arithmétique modulo 7',
      'Février — valeur: 28 jours en année ordinaire',
      'Février — valeur: 29 jours en année bissextile'
    ],
    'LOG-0192':[
      'Suites logiques — rôle: détecter des régularités et des progressions',
      'Analogies — rôle: détecter des relations entre des éléments',
      'Matrices logiques — rôle: détecter des relations entre des éléments'
    ],
    'LOG-0194':[
      'Alphabet latin — valeur: 26 lettres',
      'A dans la numérotation alphabétique — valeur: 1',
      'Z dans la numérotation alphabétique — valeur: 26',
      'Suite alphabétique cyclique — méthode: appliquer un modulo 26'
    ]
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
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28h-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();
