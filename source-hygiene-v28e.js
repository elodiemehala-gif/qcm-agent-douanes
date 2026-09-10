(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'CG-0052':'pied de page du cours, pas un fait de culture générale',
    'CG-0089':'phrase à pronom sans antécédent identifiable avec certitude dans le fragment',
    'CG-0094':'pied de page du cours, pas un fait de culture générale',
    'CG-0156':'pied de page du cours, pas un fait de culture générale',
    'CG-0216':'pied de page du cours, pas un fait de culture générale',
    'CG-0270':'pied de page du cours, pas un fait de culture générale',
    'CG-0289':'pied de page du cours, pas un fait de culture générale',
    'CG-0312':'pied de page du cours, pas un fait de culture générale',
    'CG-0354':'pied de page du cours, pas un fait de culture générale',
    'CG-0389':'pied de page du cours, pas un fait de culture générale',
    'CG-0415':'pied de page du cours, pas un fait de culture générale',
    'CG-0426':'commentaire sur une annale indiquant le thème d’une question sans en donner la réponse',
    'CG-0444':'pied de page du cours, pas un fait de culture générale',
    'CG-0470':'pied de page du cours, pas un fait de culture générale',
    'CG-0500':'pied de page du cours, pas un fait de culture générale',
    'CG-0528':'pied de page du cours, pas un fait de culture générale',
    'CG-0545':'pied de page du cours, pas un fait de culture générale',
    'CG-0576':'titre de fiche et pied de page, pas un fait autonome',
    'CG-0594':'titre de fiche et pied de page, pas un fait autonome',
    'CG-0616':'titre de fiche et pied de page, pas un fait autonome'
  };

  const FIX={
    'CG-0088':['Panthéon — définition: nom générique de certains temples','Panthéon de Rome — caractéristiques: monument célèbre à Rome','Panthéon de Paris — rôle: nécropole nationale'],
    'CG-0215':['Les Quatre Saisons — auteur: Vivaldi'],
    'CG-0229':['À bout de souffle — auteur: Jean-Luc Godard'],
    'CG-0248':['Projections publiques des frères Lumière — date: 1895'],
    'CG-0264':['En attendant Godot — auteur: Samuel Beckett'],
    'CG-0274':['Manga — définition: bande dessinée japonaise'],
    'CG-0275':['Cosplay — définition: pratique consistant à incarner visuellement un personnage par costume et accessoires'],
    'CG-0280':['Accélération — définition: variation de la vitesse'],
    'CG-0286':['Énergie totale dans un système isolé — caractéristiques: se conserve'],
    'CG-0306':['Proton — caractéristiques: charge électrique positive','Électron — caractéristiques: charge électrique négative','Neutron — caractéristiques: électriquement neutre'],
    'CG-0335':['ADN — définition: acide désoxyribonucléique','ADN — rôle: support principal de l’information génétique'],
    'CG-0336':['Gène — définition: segment d’ADN contribuant à un caractère ou à la production d’un ARN ou d’une protéine'],
    'CG-0340':['Modèle de double hélice de l’ADN — association: Watson et Crick','Modèle de double hélice de l’ADN proposé par Watson et Crick — date: 1953','Données expérimentales utilisées pour le modèle de double hélice — association: Rosalind Franklin et Maurice Wilkins'],
    'CG-0342':['Évolution des populations — association: variations héréditaires','Évolution des populations — association: différences de succès reproductif'],
    'CG-0343':['Évolution — caractéristiques: ne poursuit pas un objectif prédéterminé'],
    'CG-0381':['Augmentation anthropique de CO2, CH4 et N2O — rôle: renforce l’effet de serre','Augmentation anthropique de CO2, CH4 et N2O — rôle: contribue au réchauffement climatique'],
    'CG-0382':['Météo — définition: état de l’atmosphère à court terme','Climat — définition: statistiques du temps sur une longue période'],
    'CG-0433':['Valeur ajoutée — formule: valeur de la production − consommations intermédiaires'],
    'CG-0437':['Prix d’équilibre — définition: niveau où la quantité offerte et la quantité demandée coïncident'],
    'CG-0459':['PIB — définition: valeur de la production finale réalisée sur un territoire pendant une période donnée'],
    'CG-0463':['Population active — définition: personnes en emploi et chômeurs'],
    'CG-0464':['Taux de chômage — formule: nombre de chômeurs / population active × 100'],
    'CG-0482':['Création de monnaie scripturale — association: octroi de crédits par les banques commerciales','Création de monnaie scripturale par les banques commerciales — caractéristiques: soumise à des contraintes réglementaires et financières'],
    'CG-0483':['Banques centrales — rôle: émettent la monnaie centrale','Banques centrales — rôle: conduisent la politique monétaire'],
    'CG-0484':['BCE — définition: Banque centrale européenne','BCE — localisation: à Francfort'],
    'CG-0485':['BCE — rôle: conduit la politique monétaire de la zone euro avec les banques centrales nationales de l’Eurosystème'],
    'CG-0495':['Déficit budgétaire annuel — caractéristiques: peut coexister avec une dette déjà importante accumulée'],
    'CG-0527':['Obligation — définition: dette'],
    'CG-0534':['Appréciation d’une monnaie — définition: gain de valeur par rapport à une autre monnaie','Dépréciation d’une monnaie — définition: perte de valeur par rapport à une autre monnaie']
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
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28e-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();