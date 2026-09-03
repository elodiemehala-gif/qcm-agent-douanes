window.QCHAPTER=(()=>{
  const maps={
    'Histoire':[
      [2,5,'I. Fondements de la civilisation'],[6,7,'II. France des origines à la Révolution'],[8,9,'III. Révolution française et Empire'],[10,10,'IV. XIXe siècle'],[11,12,'V. Guerres mondiales et totalitarismes'],[13,14,'VI. France contemporaine'],[15,16,'VII. Présidents et hommes d’État'],[17,18,'VIII. Révolutions, indépendances et monde contemporain'],[19,20,'IX. Culture, arts et littérature'],[21,22,'X. Repères chronologiques']
    ],
    'Géographie':[
      [2,4,'I.1 Continents, océans et détroits'],[5,6,'I.2 Reliefs, montagnes et déserts'],[7,8,'I.3 Fleuves, lacs et hydrographie'],[9,9,'I.4 Climats et biomes'],[10,10,'I.5 Démographie mondiale'],[11,13,'I.6 Économie mondiale et mondialisation'],[14,15,'I.7 Géopolitique mondiale'],[16,17,'II.1 Relief, climats et hydrologie de la France'],[18,18,'II.2 Démographie et urbanisation françaises'],[19,19,'II.3 Économie française'],[20,21,'II.4 Administration territoriale et régions'],[22,22,'II.5 Symboles et institutions de la République']
    ],
    'Enseignement moral et civique':[
      [2,4,'A-B. Valeurs et symboles de la République'],[5,6,'C. Textes fondamentaux'],[7,8,'D. Institutions françaises'],[9,9,'E-F. Principes démocratiques, droits et libertés'],[10,11,'G-H. Laïcité, citoyenneté et devoirs'],[12,12,'I-J. Justice, Europe et organisations internationales'],[13,14,'K-L. Environnement et responsabilités'],[15,16,'M. Égalité et lutte contre les discriminations']
    ],
    'Raisonnement logique':[
      [1,6,'A. Logique mathématique'],[7,9,'B. Logique verbale'],[10,12,'C. Logique spatiale'],[13,14,'D. Logique organisationnelle'],[15,17,'E. Suites et structures'],[18,20,'F. Logique combinatoire et tableaux de déduction']
    ],
    'Mathématiques':[
      [2,5,'A. Nombres et arithmétique'],[5,6,'B. Algèbre'],[6,8,'C. Mesures et géométrie'],[8,9,'D. Mouvement et problèmes appliqués'],[9,9,'E. Statistiques et probabilités'],[10,10,'F. Fiche express QCM']
    ],
    'Actualité':[
      [2,2,'1. Politique française'],[3,4,'2. Économie et finances'],[5,6,'3. Actualité internationale'],[6,7,'4. Écologie et énergie'],[7,8,'5. Santé et société'],[8,9,'6. Technologie et numérique'],[9,10,'7. Organisations internationales'],[10,11,'8. Culture générale contemporaine'],[12,12,'9. Fiche express QCM']
    ],
    'Organisation et missions des ministères économiques et financiers':[
      [1,2,'1-2. Bercy, directions et services'],[3,4,'3-6. DGFiP, DGDDI, DGCCRF et grandes directions'],[5,5,'7. Impôts, TVA et tarif douanier'],[6,6,'8-9. Contrôle fiscal, recouvrement et contentieux'],[7,8,'10-11. Comptabilité publique et facturation électronique'],[9,9,'12-13. Fraude, Tracfin et fiche express']
    ],
    'Culture générale':[
      [2,6,'I. Arts'],[7,11,'II. Sciences'],[12,17,'III. Économie'],[18,20,'IV. Fiches express à mémoriser'],[21,26,'V. Entraînement QCM'],[27,27,'VI. Sources']
    ]
  };
  const normalizeCat=c=>{
    if(c==='Organisation et missions')return'Organisation et missions des ministères économiques et financiers';
    return c;
  };
  function chapter(x){const cat=normalizeCat(x.cat),p=+x.page||0,rows=maps[cat]||[];for(const [a,b,name] of rows)if(p>=a&&p<=b)return name;return'Autres repères';}
  function chapters(cat){cat=normalizeCat(cat);return (maps[cat]||[]).map(r=>r[2]);}
  function same(a,b){return normalizeCat(a.cat)===normalizeCat(b.cat)&&chapter(a)===chapter(b)}
  return{chapter,chapters,same,maps};
})();