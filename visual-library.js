(()=>{
  const V=[];
  const add=(cats,chapters,folder,items)=>{
    const cc=Array.isArray(cats)?cats:[cats],hh=Array.isArray(chapters)?chapters:[chapters];
    for(const cat of cc)for(const chapter of hh)for(const item of items)V.push({cat,chapter,folder,...item});
  };
  const img=(title,src,caption=title)=>({title,src,alt:title,caption});

  const HISTORY=[
    ['I. Les fondements de la civilisation','01-fondements-civilisation.svg','Des premiers humains aux grandes civilisations antiques'],
    ['II. La France des origines à la Révolution','02-france-origines-revolution.svg','De la Gaule à la monarchie d’Ancien Régime'],
    ['III. Révolution française et Empire','03-revolution-empire.svg','De 1789 à la chute de Napoléon'],
    ['IV. Le XIXe siècle','04-xixe-siecle.svg','Régimes, révolutions et transformations du XIXe siècle'],
    ['V. Les guerres mondiales et les totalitarismes','05-guerres-totalitarismes.svg','Guerres mondiales, totalitarismes et Guerre froide'],
    ['VI. La France contemporaine','06-france-contemporaine.svg','Républiques, société et construction européenne'],
    ['VII. Présidents et hommes d’État à connaître','07-presidents-hommes-etat.svg','Présidents et grandes figures politiques'],
    ['VIII. Révolutions, indépendances et monde contemporain','08-revolutions-independances-monde.svg','Révolutions, décolonisations et monde contemporain'],
    ['IX. Culture, arts et littérature','09-culture-arts-litterature.svg','Repères culturels, artistiques et littéraires'],
    ['X. Repères chronologiques fondamentaux','10-reperes-chronologiques.svg','Les grandes dates à remettre dans l’ordre'],
  ];
  for(const [chapter,file,caption] of HISTORY)add('Histoire',chapter,'Frise chronologique',[img(caption,`assets/history/timelines/${file}`,caption)]);

  const WORLD='I. Géographie mondiale',FRANCE='II. Géographie de la France métropolitaine et ultramarine';
  add('Géographie',WORLD,'Monde : océans, reliefs et passages',[
    img('Océans et mers du monde','assets/geography/oceans-et-mers.svg'),
    img('Passages maritimes stratégiques','assets/geography/passages-maritimes.svg'),
    img('Grands massifs montagneux','assets/geography/grands-massifs.svg')
  ]);
  add('Géographie',WORLD,'Ordres de grandeur',[
    img('Superficie des océans','assets/geography/ordre-superficie-oceans.svg'),
    img('Population des continents','assets/geography/ordre-population-continents.svg'),
    img('Superficie des grands déserts','assets/geography/ordre-superficie-deserts.svg'),
    img('Longueur des chaînes de montagnes','assets/geography/ordre-longueur-chaines.svg'),
    img('Altitude des grands sommets','assets/geography/ordre-altitude-sommets.svg'),
    img('Profondeurs et altitudes','assets/geography/ordre-profondeurs-altitudes.svg')
  ]);
  add('Géographie',WORLD,'Organisations internationales',[
    img('Chronologie et nature des organisations internationales','assets/geography/organisations-internationales-chronologie.svg')
  ]);
  add('Actualité',['3. Actualité internationale','7. Organisations internationales'],'Organisations internationales',[
    img('Chronologie et nature des organisations internationales','assets/geography/organisations-internationales-chronologie.svg')
  ]);
  add('Enseignement moral et civique','J. Europe et organisations internationales','Organisations internationales',[
    img('Chronologie et nature des organisations internationales','assets/geography/organisations-internationales-chronologie.svg')
  ]);
  add('Géographie',FRANCE,'France physique',[
    img('Reliefs et points culminants de la France','assets/geography/reliefs-france.svg'),
    img('Fleuves de France','assets/geography/fleuves-france.svg'),
    img('Mers et façades maritimes','assets/geography/mers-france.svg')
  ]);
  add('Géographie',FRANCE,'Régions et outre-mer',[
    img('Régions françaises et leurs capitales','assets/geography/regions-capitales-france.svg'),
    img('DROM, COM, TAAF et Nouvelle-Calédonie','assets/geography/outre-mer-statuts-carte.svg')
  ]);

  const fiscal=[
    img('Impôt, taxe, cotisation ou redevance ?','assets/visual-guides/fiscalite/impot-taxe-cotisation-redevance.svg'),
    img('Impôt direct ou indirect ?','assets/visual-guides/fiscalite/direct-indirect.svg'),
    img('Impôt progressif ou proportionnel ?','assets/visual-guides/fiscalite/progressif-proportionnel.svg')
  ];
  const tva=[img('Le circuit de la TVA','assets/visual-guides/fiscalite/tva-circuit.svg')];
  const chain=[img('La chaîne fiscale','assets/visual-guides/fiscalite/chaine-fiscale.svg')];
  const control=[img('Contrôle, recouvrement et contentieux','assets/visual-guides/fiscalite/controle-recouvrement-contentieux.svg')];
  add('Organisation et missions',['3. La DGFiP : fiscalité et gestion publique','7. Impôts, TVA et tarif douanier'],'Fiscalité : les bases',fiscal);
  add('Organisation et missions','7. Impôts, TVA et tarif douanier','Comprendre la TVA',tva);
  add('Organisation et missions',['3. La DGFiP : fiscalité et gestion publique','13. Fiche express et pièges classiques'],'La chaîne fiscale',chain);
  add('Organisation et missions',['8. Le contrôle fiscal','9. Le recouvrement et le contentieux'],'Contrôle et contentieux',control);
  add('Culture générale','3. Économie','Fiscalité',fiscal.concat(tva));

  const eco=[
    img('PIB : ce qu’il mesure vraiment','assets/visual-guides/economie/pib-definition.svg'),
    img('PIB nominal ou PIB en volume ?','assets/visual-guides/economie/pib-nominal-volume.svg'),
    img('Croissance, inflation et chômage','assets/visual-guides/economie/croissance-inflation-chomage.svg'),
    img('Déficit public ou dette publique ?','assets/visual-guides/economie/deficit-dette.svg')
  ];
  const circuitEco=[
    img('Les agents économiques','assets/visual-guides/economie/agents-circuit.svg'),
    img('La redistribution des revenus','assets/visual-guides/economie/redistribution.svg')
  ];
  add('Culture générale','3. Économie','PIB et grands indicateurs',eco);
  add('Culture générale','3. Économie','Circuit économique',circuitEco);
  add('Actualité','2. Économie et finances','Comprendre les indicateurs',eco.concat(circuitEco));

  const institutions=[
    img('Les institutions françaises','assets/visual-guides/institutions/institutions-francaises.svg'),
    img('Le parcours d’une loi','assets/visual-guides/institutions/parcours-loi.svg')
  ];
  const europe=[img('Les institutions de l’Union européenne','assets/visual-guides/institutions/institutions-europeennes.svg')];
  add('Enseignement moral et civique',['D. Les institutions françaises','E. Les principes démocratiques'],'Institutions françaises',institutions);
  add('Actualité','1. Politique française','Institutions françaises',institutions);
  add('Enseignement moral et civique','I. Justice et organisation judiciaire','Organisation de la justice',[
    img('Les deux ordres de juridiction','assets/visual-guides/institutions/justice-deux-ordres.svg')
  ]);
  add('Enseignement moral et civique','J. Europe et organisations internationales','Union européenne',europe);
  add('Actualité',['3. Actualité internationale','7. Organisations internationales'],'Union européenne',europe);

  add('Organisation et missions',['1. Les ministères économiques et financiers','2. Les grandes directions et services à connaître','6. DG Trésor, Direction du Budget, Insee et AFT'],'Bercy : directions et missions',[
    img('Bercy : qui fait quoi ?','assets/visual-guides/institutions/bercy-directions.svg'),
    img('DGFiP, DGDDI ou DGCCRF ?','assets/visual-guides/institutions/dgfip-dgddi-dgccrf.svg')
  ]);
  add('Organisation et missions',['3. La DGFiP : fiscalité et gestion publique','4. La DGDDI : douane, frontières et marchandises','5. La DGCCRF : concurrence, consommation et fraudes'],'Comparer les grandes directions',[
    img('DGFiP, DGDDI ou DGCCRF ?','assets/visual-guides/institutions/dgfip-dgddi-dgccrf.svg')
  ]);
  add('Organisation et missions','10. Comptabilité publique : ordonnateur et comptable','Comptabilité publique',[
    img('Ordonnateur et comptable public','assets/visual-guides/institutions/ordonnateur-comptable.svg')
  ]);
  add('Organisation et missions','12. Fraude, blanchiment et Tracfin','Lutte contre le blanchiment',[
    img('Le circuit d’un soupçon vers Tracfin','assets/visual-guides/institutions/tracfin.svg')
  ]);

  const art=[
    img('Grande chronologie des arts','assets/visual-guides/arts/chronologie-arts.svg'),
    img('Églises : roman ou gothique ?','assets/visual-guides/arts/eglises-roman-gothique.svg'),
    img('Renaissance : artistes et œuvres','assets/visual-guides/arts/renaissance-artistes.svg'),
    img('Baroque ou classicisme ?','assets/visual-guides/arts/baroque-classicisme.svg'),
    img('Les mouvements artistiques du XIXe siècle','assets/visual-guides/arts/xixe-mouvements.svg'),
    img('Impressionnisme : œuvres repères','assets/visual-guides/arts/impressionnisme-oeuvres.svg'),
    img('Art moderne : quatre ruptures','assets/visual-guides/arts/art-moderne.svg')
  ];
  const paintings=[
    img('La Joconde · Léonard de Vinci','https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1280px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg','Renaissance · portrait et sfumato · domaine public'),
    img('L’École d’Athènes · Raphaël','https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg','Renaissance · perspective et héritage antique · domaine public'),
    img('La Naissance de Vénus · Botticelli','https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg','Renaissance florentine · mythologie antique · domaine public'),
    img('La Vocation de saint Matthieu · Caravage','https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg/1280px-Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg','Baroque · clair-obscur dramatique · domaine public'),
    img('Et in Arcadia ego · Nicolas Poussin','https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Nicolas_Poussin_-_Et_in_Arcadia_ego_%28deuxi%C3%A8me_version%29.jpg/1280px-Nicolas_Poussin_-_Et_in_Arcadia_ego_%28deuxi%C3%A8me_version%29.jpg','Classicisme · ordre et composition maîtrisée · domaine public'),
    img('Le Radeau de la Méduse · Géricault','https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_%28Museo_del_Louvre%2C_1818-19%29.jpg/1280px-JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_%28Museo_del_Louvre%2C_1818-19%29.jpg','Romantisme · drame, mouvement et émotion · domaine public'),
    img('La Liberté guidant le peuple · Delacroix','https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg/1280px-Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg','Romantisme · événement contemporain et allégorie · domaine public'),
    img('Impression, soleil levant · Monet','https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg','Impressionnisme · lumière et instant · domaine public'),
    img('Bal du moulin de la Galette · Renoir','https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Renoir%2C_Pierre-Auguste_-_Dance_at_Le_Moulin_de_la_Galette%2C_1876.jpg/1280px-Renoir%2C_Pierre-Auguste_-_Dance_at_Le_Moulin_de_la_Galette%2C_1876.jpg','Impressionnisme · sociabilité et lumière colorée · domaine public'),
    img('La Nuit étoilée · Van Gogh','https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg','Postimpressionnisme · couleur expressive et mouvement · domaine public')
  ];
  add('Culture générale','1. Arts','Arts, œuvres et architecture',art);
  add('Culture générale','1. Arts','Tableaux à reconnaître',paintings);
  add('Histoire','IX. Culture, arts et littérature','Arts, œuvres et architecture',art);
  add('Histoire','IX. Culture, arts et littérature','Tableaux à reconnaître',paintings);

  add('Enseignement moral et civique','C. Les textes fondamentaux','Textes fondamentaux',[
    img('Textes fondamentaux : la chronologie','assets/visual-guides/emc/textes-fondamentaux.svg')
  ]);
  add('Enseignement moral et civique',['A. Les valeurs de la République','B. Les symboles de la République'],'Valeurs et symboles',[
    img('Valeurs, principes et symboles','assets/visual-guides/emc/valeurs-symboles.svg')
  ]);
  add('Enseignement moral et civique','G. La laïcité','Laïcité',[
    img('La laïcité en quatre idées','assets/visual-guides/emc/laicite.svg')
  ]);
  add('Enseignement moral et civique','H. Citoyenneté et devoirs','Citoyenneté et vote',[
    img('De la citoyenneté au vote','assets/visual-guides/emc/citoyennete-vote.svg')
  ]);

  const math={
    'Pourcentages et variations':[img('Pourcentages : la carte mentale','assets/visual-guides/mathematiques/pourcentages.svg')],
    'Vitesse, distance et temps':[img('Distance, vitesse et temps','assets/visual-guides/mathematiques/distance-vitesse-temps.svg')],
    'Heures, horaires et durées':[img('Heures et durées','assets/visual-guides/mathematiques/heures-durees.svg')],
    'Aires et surfaces':[img('Aires et volumes : unités et formules','assets/visual-guides/mathematiques/aires-volumes.svg')],
    'Volumes':[img('Aires et volumes : unités et formules','assets/visual-guides/mathematiques/aires-volumes.svg')],
    'Échelles':[img('Aires et volumes : unités et formules','assets/visual-guides/mathematiques/aires-volumes.svg')]
  };
  for(const [chapter,items] of Object.entries(math))add('Mathématiques',chapter,'Formules en image',items);

  add('Raisonnement logique',['A. Logique mathématique','E. Suites et structures','Suites numériques'],'Méthode des suites',[
    img('Suites : ordre de recherche','assets/visual-guides/logique/suites.svg')
  ]);
  add('Raisonnement logique',['D. Logique organisationnelle','F. Logique combinatoire et tableaux de déduction','Classements et déductions'],'Méthode de déduction',[
    img('Construire un tableau de déduction','assets/visual-guides/logique/deduction.svg')
  ]);

  add('Informatique / Culture numérique',['1. Informations et données','1. Services publics et administration numérique'],'Internet et données',[
    img('Comment une donnée circule sur Internet','assets/visual-guides/numerique/internet-donnees.svg')
  ]);
  add('Informatique / Culture numérique',['1. RGPD et protection des données','2. CNIL et loi Informatique et Libertés'],'RGPD et CNIL',[
    img('RGPD : acteurs et droits','assets/visual-guides/numerique/rgpd.svg')
  ]);
  add('Informatique / Culture numérique','4. Protection et sécurité','Cybersécurité',[
    img('Cybermenaces : le bon réflexe','assets/visual-guides/numerique/cyber-reflexes.svg')
  ]);
  add('Informatique / Culture numérique','2. Données publiques, cloud, IA et inclusion','Cloud et intelligence artificielle',[
    img('Cloud, algorithme et intelligence artificielle','assets/visual-guides/numerique/cloud-ia.svg')
  ]);

  window.QVISUAL_LIBRARY=V;
})();
