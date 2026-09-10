(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'MAT-0008':'piège de lecture redondant avec la conversion binaire complète de l’entrée précédente; aucune nouvelle valeur autonome',
    'MAT-0102':'métadonnée de priorité au concours, pas un fait mathématique',
    'MAT-0103':'métadonnée de priorité au concours, pas un fait mathématique',
    'MAT-0105':'métadonnée de priorité au concours, pas un fait mathématique',
    'MAT-0108':'résultat numérique privé de la figure et des dimensions auxquelles il se rapporte; contexte insuffisant pour un fait autonome',
    'MAT-0130':'titre et commentaire de positionnement du complément Agent, pas un fait mathématique',
    'MAT-0131':'commentaire de positionnement du programme, pas un fait mathématique',
    'LOG-0009':'commentaire éditorial sur la fréquence de ce type d’épreuve dans les concours, pas une connaissance autonome'
  };

  const FIX={
    'ACT-0094':['Règles principales relatives à de nombreux systèmes à haut risque de l’annexe III applicables à partir du 2 décembre — date: 2027'],

    'MAT-0004':['Base du système binaire utilisant les chiffres 0 et 1 — valeur: 2'],
    'MAT-0009':['Exposant de la puissance de 2 associée au chiffre binaire le plus à droite — valeur: 0'],
    'MAT-0018':['PGCD — association: algorithme d’Euclide'],
    'MAT-0020':['Relation entre PGCD et PPCM — formule: PGCD(a,b) × PPCM(a,b) = |a×b|','Décomposition de 84 en facteurs premiers — formule: 2²×3×7'],
    'MAT-0021':['Décomposition de 60 en facteurs premiers — formule: 2²×3×5','PGCD de 84 et 60 dans l’exemple — valeur: 12'],
    'MAT-0022':['PPCM de 84 et 60 dans l’exemple — valeur: 420'],
    'MAT-0027':['Racine d’un produit — formule: √(ab) = √a × √b','Racine d’un quotient pour a ≥ 0 et b > 0 — formule: √(a/b) = √a / √b','Produit de puissances de même base — formule: aᵐ×aⁿ = aᵐ⁺ⁿ','Quotient de puissances de même base — formule: aᵐ/aⁿ = aᵐ⁻ⁿ','Puissance d’une puissance — formule: (aᵐ)ⁿ = aᵐⁿ','Notation scientifique — formule: a×10ⁿ avec 1 ≤ |a| < 10','√75 — formule: 5√3','3 500 en notation scientifique — formule: 3,5×10³','0,042 en notation scientifique — formule: 4,2×10⁻²'],
    'MAT-0028':['Égalité √(a+b) = √a + √b — caractéristiques: fausse en général'],
    'MAT-0037':['Prix de revient — formule: prix d’achat + frais','Bénéfice — formule: prix de vente − prix de revient','Perte — caractéristiques: apparaît lorsque le résultat du bénéfice est négatif'],
    'MAT-0040':['Taux de marge — formule: marge / coût d’achat × 100','Taux de marque — formule: marge / prix de vente × 100','Prix TTC — formule: prix HT × (1 + taux de TVA)'],
    'MAT-0041':['Prix HT — formule: prix TTC / (1 + taux)'],
    'MAT-0044':['Intérêt simple I — formule: C×t×n','Montant final en intérêt simple — formule: C + I','C dans la formule d’intérêt simple — définition: capital initial','t dans la formule d’intérêt simple — définition: taux par période sous forme décimale','n dans la formule d’intérêt simple — définition: nombre de périodes'],
    'MAT-0047':['Escompte simple E — formule: N×t×n','Valeur actuelle après escompte simple — formule: N − E','N dans la formule d’escompte — définition: valeur nominale','t dans la formule d’escompte — définition: taux','n dans la formule d’escompte — définition: durée exprimée dans l’unité compatible avec le taux'],
    'MAT-0048':['Calcul d’escompte lorsque l’énoncé utilise des jours — obligation: appliquer la convention indiquée dans la question'],
    'MAT-0049':['Action — définition: titre de propriété','Obligation — définition: créance'],
    'MAT-0050':['Valeur décimale d’un taux de 3 % dans un calcul — valeur: 0,03'],
    'MAT-0060':['Moyenne de 10 % et 20 % lorsque les volumes sont différents — caractéristiques: ne se calcule pas par une moyenne simple'],
    'MAT-0061':['Utilisation de ρ = m/V — obligation: harmoniser les unités au préalable'],
    'MAT-0079':['Somme nécessaire pour obtenir 40 €, 50 € et 60 € — valeur: 150 €'],
    'MAT-0088':['Inconnue représentant un nombre d’objets — obligation: donner un résultat entier physiquement possible'],
    'MAT-0097':['Longitude — caractéristiques: n’est pas mesurée depuis l’équateur'],
    'MAT-0099':['Périmètre d’un triangle — formule: somme des côtés'],
    'MAT-0101':['Périmètre d’un trapèze — formule: somme des côtés'],
    'MAT-0110':['Aire — association: unités au carré','Volume — association: unités au cube'],
    'MAT-0118':['Longueur réelle à l’échelle 1:n — formule: longueur sur le plan × n','Aire réelle à l’échelle 1:n — formule: aire sur le plan × n²','Volume réel à l’échelle 1:n — formule: volume sur le modèle × n³'],
    'MAT-0120':['Distance en mouvement uniforme — formule: vitesse × temps','Vitesse en mouvement uniforme — formule: distance / temps','Temps en mouvement uniforme — formule: distance / vitesse'],
    'MAT-0122':['Vitesse moyenne — caractéristiques: n’est généralement pas la moyenne arithmétique des vitesses'],
    'MAT-0125':['Calcul d’une vitesse en km/h avec une durée en minutes — obligation: convertir les minutes en heures'],
    'MAT-0126':['Débit — formule: quantité / temps','Quantité — formule: débit × temps','Deux robinets remplissant simultanément — formule: addition de leurs débits'],
    'MAT-0128':['Durée d’un travail fixe lorsque le nombre d’ouvriers augmente — caractéristiques: diminue si les productivités sont identiques'],
    'MAT-0132':['Moyenne — formule: somme des valeurs / effectif','Moyenne pondérée — formule: somme(valeur×coefficient) / somme(coefficients)','Médiane — définition: valeur centrale d’une série ordonnée','Médiane d’une série numérique d’effectif pair — formule: moyenne des deux valeurs centrales'],
    'MAT-0134':['Classe modale — définition: classe de plus grand effectif'],
    'MAT-0136':['Probabilité d’un événement A pour des issues équiprobables — formule: nombre de cas favorables / nombre de cas possibles'],
    'MAT-0149':['Événement contraire de A — formule: P(non A) = 1 − P(A)','Tirage sans remise — caractéristiques: le nombre de cas possibles change après le premier tirage'],

    'LOG-0008':['Test de raisonnement numérique — définition: évalue la capacité à manipuler des nombres, comprendre des relations quantitatives et raisonner avec des données'],
    'LOG-0078':['Logique verbale — définition: évalue la compréhension et l’interprétation du langage, la déduction d’informations implicites et le raisonnement sur des relations sémantiques'],
    'LOG-0106':['Raisonnement spatial — définition: aptitude à visualiser et manipuler mentalement des objets en deux et trois dimensions'],
    'LOG-0192':['Suites logiques, analogies et matrices — rôle: évaluent la capacité à détecter des régularités, des progressions ou des relations entre des éléments']
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
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28d-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();