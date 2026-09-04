window.QCHAPTER=(()=>{
  const maps={
    'Histoire':[
      [2,5,'I. Fondements de la civilisation'],[5,7,'II. France des origines à la Révolution'],[8,9,'III. Révolution française et Empire'],[9,10,'IV. XIXe siècle'],[11,12,'V. Guerres mondiales et totalitarismes'],[12,14,'VI. France contemporaine'],[15,16,'VII. Présidents et hommes d’État'],[17,18,'VIII. Révolutions, indépendances et monde contemporain'],[19,20,'IX. Culture, arts et littérature'],[20,22,'X. Repères chronologiques']
    ],
    'Géographie':[
      [2,4,'I.1 Continents, océans et détroits'],[5,6,'I.2 Reliefs, montagnes et déserts'],[7,8,'I.3 Fleuves, lacs et hydrographie'],[8,9,'I.4 Climats et biomes'],[9,10,'I.5 Démographie mondiale'],[11,13,'I.6 Économie mondiale et mondialisation'],[14,15,'I.7 Géopolitique mondiale'],[16,17,'II.1 Relief, climats et hydrologie de la France'],[17,18,'II.2 Démographie et urbanisation françaises'],[18,19,'II.3 Économie française'],[19,21,'II.4 Administration territoriale et régions'],[22,22,'II.5 Symboles et institutions de la République']
    ],
    'Enseignement moral et civique':[
      [2,4,'A-B. Valeurs et symboles de la République'],[5,6,'C. Textes fondamentaux'],[6,8,'D. Institutions françaises'],[8,10,'E-F. Principes démocratiques, droits et libertés'],[10,11,'G-H. Laïcité, citoyenneté et devoirs'],[11,12,'I-J. Justice, Europe et organisations internationales'],[13,14,'K-L. Environnement et responsabilités'],[15,16,'M. Égalité et lutte contre les discriminations']
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
  const normalizeCat=c=>c==='Organisation et missions'?'Organisation et missions des ministères économiques et financiers':c;
  function override(cat,text){const s=String(text||'').toLowerCase();
    if(cat==='Histoire'){
      if(/clovis|méroving|caroling|charlemagne|féodal|seigneur|vassal|renaissance|humanisme|louis xiv|monarchie absolue|lumières|voltaire|rousseau|montesquieu/.test(s))return'II. France des origines à la Révolution';
      if(/révolution française|bastille|états généraux|ddhc|robespierre|napoléon|bonaparte|congrès de vienne/.test(s))return'III. Révolution française et Empire';
      if(/second empire|troisième république|1848|napoléon iii|industrialisation|transformations sociales/.test(s))return'IV. XIXe siècle';
      if(/première guerre mondiale|1914|1918|verdun|entre-deux-guerres|seconde guerre mondiale|1939|1945|vichy|guerre froide/.test(s))return'V. Guerres mondiales et totalitarismes';
      if(/ive république|ve république|constitution de 1958|mai 1968|abolition de la peine de mort/.test(s))return'VI. France contemporaine';
      if(/révolution américaine|révolution russe|décolon|algérie|indochine|révolution iranienne|11 septembre|crimée|covid/.test(s))return'VIII. Révolutions, indépendances et monde contemporain';
      if(/victor hugo|molière|balzac|zola|camus|picasso|monet|cinéma|musique/.test(s))return'IX. Culture, arts et littérature';
    }
    if(cat==='Géographie'){
      if(/climat|köppen|méditerranéen|océanique|continental|polaire|tropical|biome/.test(s))return s.includes('france')?'II.1 Relief, climats et hydrologie de la France':'I.4 Climats et biomes';
      if(/population mondiale|démograph|inde.*milliard|chine.*milliard|pays le plus peuplé/.test(s))return'I.5 Démographie mondiale';
      if(/pib|g7|g20|brics|mondialisation|commerce international/.test(s))return'I.6 Économie mondiale et mondialisation';
      if(/otan|onu|géopolit|conflit|alliance/.test(s))return'I.7 Géopolitique mondiale';
    }
    if(cat==='Enseignement moral et civique'){
      if(/ddhc|préambule de 1946|constitution de 1958|charte de l'environnement|cedh/.test(s))return'C. Textes fondamentaux';
      if(/président de la république|premier ministre|parlement|assemblée nationale|sénat|conseil constitutionnel|conseil d'état|cour de cassation/.test(s))return'D. Institutions françaises';
      if(/laïc|neutralité religieuse/.test(s))return'G-H. Laïcité, citoyenneté et devoirs';
      if(/juridiction|justice pénale|justice judiciaire|justice administrative/.test(s))return'I-J. Justice, Europe et organisations internationales';
    }
    return null
  }
  function chapter(x){const cat=normalizeCat(x.cat),o=override(cat,x.text);if(o)return o;const p=+x.page||0,rows=maps[cat]||[];for(const [a,b,name] of rows)if(p>=a&&p<=b)return name;return'Autres repères'}
  function chapters(cat){cat=normalizeCat(cat);return (maps[cat]||[]).map(r=>r[2])}
  function same(a,b){return normalizeCat(a.cat)===normalizeCat(b.cat)&&chapter(a)===chapter(b)}
  return{chapter,chapters,same,maps};
})();