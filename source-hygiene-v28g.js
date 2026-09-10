(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'MAT-0073':'bloc de correction mathématique mal découpé; le résultat correct du système est déjà conservé dans MAT-0074 et les vérifications suivantes'
  };

  const FIX={
    'HIS-0027':['Démocratie athénienne — association: réformes de Clisthène et Périclès','Démocratie athénienne — association: assemblée des citoyens','Démocratie athénienne — association: tirage au sort','Démocratie athénienne — association: ostracisme'],
    'HIS-0031':['Platon — association: Socrate','Platon — association: La République','Platon — association: Académie'],
    'HIS-0157':['Napoléon — rôle: Premier consul','Napoléon — association: Banque de France créée en 1800','Napoléon — association: lycées','Napoléon — association: préfets','Napoléon — association: monnaie stable'],
    'HIS-0181':['Suffrage universel instauré en 1848 — caractéristiques: masculin','Droit de vote des femmes en France — date: 1944'],
    'HIS-0235':['Seconde Guerre mondiale — repère: conflit le plus meurtrier de l’histoire','Première Guerre mondiale — valeur: environ 10 millions de morts'],
    'HIS-0351':['Lénine — rôle: dirigeant bolchevik','Lénine — association: révolution russe de 1917','Lénine — rôle: met en place le pouvoir communiste en Russie'],
    'HIS-0358':['Gandhi — rôle: dirigeant du mouvement d’indépendance de l’Inde','Gandhi — association: non-violence','Indépendance de l’Inde — date: 1947'],
    'HIS-0442':['Monet — rôle: chef de file de l’impressionnisme','Monet — association: Impression, soleil levant','Impression, soleil levant — date: 1872','Monet — association: Les Nymphéas'],
    'HIS-0448':['Steven Spielberg — association: E.T.','E.T. — date: 1982','Steven Spielberg — association: La Liste de Schindler'],

    'GEO-0078':['Détroit — définition: passage maritime naturel','Canal — caractéristiques: voie artificielle'],
    'GEO-0081':['Panama — caractéristiques: canal artificiel','Suez — caractéristiques: canal artificiel','Gibraltar — caractéristiques: détroit naturel','Ormuz — caractéristiques: détroit naturel','Malacca — caractéristiques: détroit naturel','Béring — caractéristiques: détroit naturel'],
    'GEO-0339':['Hydraulique en France — localisation: dans les massifs','Éolien en France — localisation: surtout dans le nord et l’ouest ainsi qu’en mer','Solaire en France — caractéristiques: en forte croissance','Solaire en France — localisation: particulièrement dans le sud mais pas uniquement'],
    'GEO-0351':['Réduction de 22 à 13 régions métropolitaines — association: loi du 16 janvier 2015','Nouvelle carte des régions métropolitaines — date: 1er janvier 2016'],
    'GEO-0361':['Martinique — caractéristiques: collectivité territoriale unique','Martinique — association: article 73','Martinique — localisation: dans les Caraïbes'],
    'GEO-0396':['ZEE française située dans l’Indopacifique — valeur: plus de 90 %','ZEE française — repère: deuxième au monde','ZEE française — valeur: environ 10,2 millions de km2'],

    'EMC-0024':['Drapeau tricolore — repère: adopté définitivement sous la Révolution','Bleu et rouge du drapeau tricolore — association: couleurs de Paris','Blanc du drapeau tricolore — association: monarchie'],
    'EMC-0026':['Marianne — définition: figure allégorique de la République','Marianne — association: bonnet phrygien','Marianne — symbole: liberté','Marianne — symbole: citoyenneté'],
    'EMC-0028':['Marseillaise — définition: hymne national','Marseillaise — auteur: Rouget de Lisle','Composition de la Marseillaise — date: 1792','Adoption officielle de la Marseillaise comme hymne — date: 1879'],
    'EMC-0034':['République sociale — association: droit à la protection de la santé','République sociale — association: droit à la sécurité matérielle','République sociale — association: droit au repos et aux loisirs','République sociale — association: droit à l’instruction','République sociale — association: droit à l’emploi','République sociale — association: participation à la vie économique'],
    'EMC-0039':['Laïcité — caractéristiques: neutralité de l’État et absence de religion officielle','Laïcité — caractéristiques: ne signifie pas une interdiction générale des signes religieux dans l’espace public','Restrictions liées à la laïcité — association: services publics et écoles'],
    'EMC-0043':['14 juillet — rôle: fête nationale','14 juillet comme fête nationale — date: 1880','14 juillet — association: prise de la Bastille en 1789','14 juillet — association: Fête de la Fédération en 1790'],
    'EMC-0045':['Coq gaulois — définition: animal emblématique','Coq gaulois — repère: utilisé comme emblème depuis l’Antiquité','Coq gaulois — association: jeu de mots gallus / gallus','Coq gaulois — symbole: vigilance et orgueil national','Coq gaulois — association: sport'],
    'EMC-0050':['Préambule de 1946 — rôle: réaffirme les droits proclamés en 1789','Préambule de 1946 — association: droits économiques et sociaux','Préambule de 1946 — association: droit au travail','Préambule de 1946 — association: droit au repos','Préambule de 1946 — association: droit à la santé','Préambule de 1946 — association: droit à l’instruction','Préambule de 1946 — association: droit à la culture'],
    'EMC-0073':['Parlement français — caractéristiques: bicaméralisme','Assemblée nationale — caractéristiques: députés élus au suffrage universel direct','Mandat des députés — valeur: 5 ans','Sénat — caractéristiques: sénateurs élus au suffrage indirect','Mandat des sénateurs — valeur: 6 ans'],
    'EMC-0086':['Justice judiciaire — association: justice civile et justice pénale','Justice civile — rôle: traite les litiges entre particuliers','Justice civile — association: contrats, famille et succession','Justice pénale — rôle: sanctionne les comportements contraires à la loi','Justice pénale — association: contraventions, délits et crimes','Justice pénale — association: tribunal de police, tribunal correctionnel et cour d’assises'],
    'EMC-0098':['Conseil de l’Union européenne — caractéristiques: réunit des ministres des États membres','Conseil européen — caractéristiques: réunit les chefs d’État ou de gouvernement','Conseil de l’Europe — définition: organisation internationale des droits de l’homme'],
    'EMC-0136':['RGPD — date: 2016','Application du RGPD — date: 25 mai 2018','RGPD — rôle: établit un cadre juridique unique dans l’Union européenne','RGPD — rôle: renforce les droits des personnes sur leurs données','RGPD — association: droit d’accès','RGPD — association: droit de rectification','RGPD — association: droit d’effacement'],
    'EMC-0140':['Liberté de réunion — caractéristiques: réunion sans arme et à but licite','Manifestation sur la voie publique — obligation: peut nécessiter une déclaration préalable'],
    'EMC-0141':['RGPD — définition: règlement européen','RGPD — date: 2016','Application du RGPD — date: 2018','RGPD — rôle: protège les données personnelles','RGPD — association: article 8 de la Charte des droits fondamentaux'],
    'EMC-0142':['Laïcisation en France — repère: commence dès la Révolution française','Mariage civil — date: 1792','Lois Ferry sur l’enseignement public gratuit, laïque et obligatoire — date: 1882'],
    'EMC-0176':['Commission européenne — rôle: organe exécutif de l’Union européenne','Commission européenne — valeur: 27 commissaires','Commission européenne — caractéristiques: un commissaire par État membre','Commission européenne — rôle: propose les textes législatifs','Commission européenne — rôle: veille à l’application des textes','Commission européenne — rôle: met en œuvre les politiques de l’Union','Commission européenne — rôle: gère le budget','Commission européenne — rôle: négocie des accords internationaux','Commission européenne — rôle: représente l’Union dans les organisations internationales'],
    'EMC-0178':['Ordre administratif — association: tribunaux administratifs','Ordre administratif — association: cours administratives d’appel','Ordre administratif — association: Conseil d’État','Ordre judiciaire — rôle: juge les litiges entre particuliers','Ordre judiciaire — rôle: juge les infractions pénales'],
    'EMC-0189':['Parlement européen au 16 juillet 2024 — valeur: 720 députés','Députés européens — caractéristiques: élus au suffrage universel direct','Mandat des députés européens — valeur: 5 ans','Parlement européen — rôle: participe à l’adoption des actes législatifs avec le Conseil','Parlement européen — rôle: établit le budget de l’Union européenne','Parlement européen — rôle: contrôle la Commission européenne','Parlement européen — rôle: élit le président de la Commission européenne'],
    'EMC-0191':['Conseil européen — caractéristiques: réunit les chefs d’État ou de gouvernement des États membres','Conseil européen — association: président du Conseil européen et président de la Commission','Conseil européen — rôle: définit les grandes orientations politiques de l’Union européenne','Conseil européen — caractéristiques: n’exerce pas de rôle législatif'],
    'EMC-0192':['CJUE — localisation: à Luxembourg','CJUE — rôle: assure le respect du droit de l’Union','CJUE — rôle: interprète les traités','Arrêts de la CJUE — caractéristiques: contraignants'],
    'EMC-0212':['Droits des personnes sur leurs données — association: droit à l’information','Droits des personnes sur leurs données — association: droit d’accès','Droits des personnes sur leurs données — association: droit de rectification','Droits des personnes sur leurs données — association: droit d’effacement','Droits des personnes sur leurs données — association: droit à la limitation du traitement','Droits des personnes sur leurs données — association: droit à la portabilité','Droits des personnes sur leurs données — association: droit d’opposition'],
    'EMC-0213':['Responsables de traitement — obligation: tenir un registre et réaliser les analyses d’impact nécessaires','Responsables de traitement — obligation: nommer un délégué à la protection des données lorsque requis','Violation de données — obligation: notification dans les 72 heures'],
    'EMC-0246':['Loi Pleven — date: 1972','Loi Pleven — rôle: crée un délit de provocation à la discrimination et à la haine raciale','Loi Gayssot — date: 1990','Loi Gayssot — rôle: réprime la contestation des crimes contre l’humanité'],

    'ACT-0001':['Président de la République au 31 août 2026 — association: Emmanuel Macron','Première élection d’Emmanuel Macron à la présidence — date: 2017','Réélection d’Emmanuel Macron — date: 2022','Mandat présidentiel — valeur: 5 ans','Mandat présidentiel — caractéristiques: renouvelable une fois consécutivement'],
    'ACT-0011':['Suspension partielle de la montée en charge de la réforme des retraites de 2023 — association: loi de financement de la Sécurité sociale pour 2026','Suspension partielle de la réforme des retraites — repère: jusqu’en 2028'],
    'ACT-0048':['Cessez-le-feu à Gaza soutenu par les États-Unis — repère: en place depuis octobre 2025','Gaza en 2026 — caractéristiques: des frappes et incidents armés continuent','Cessez-le-feu à Gaza en 2026 — caractéristiques: mise en œuvre fragile'],
    'ACT-0055':['Objectif de dépenses de défense et de sécurité au sens large — valeur: 5 % du PIB','Échéance de l’objectif de 5 % du PIB pour la défense et la sécurité — date: 2035','Part minimale consacrée aux besoins de défense proprement dits — valeur: 3,5 % du PIB'],
    'ACT-0118':['Physique — lauréat: John Clarke','Physique — lauréat: Michel H. Devoret','Physique — lauréat: John M. Martinis'],
    'ACT-0119':['Médecine — lauréat: Mary E. Brunkow','Médecine — lauréat: Fred Ramsdell','Médecine — lauréat: Shimon Sakaguchi'],

    'ORG-0055':['Contrôle fiscal — définition: ensemble des vérifications effectuées par l’administration fiscale','Contrôle fiscal — rôle: vérifier le respect des obligations fiscales','Contrôle fiscal — rôle: vérifier l’exactitude des déclarations'],
    'ORG-0060':['Contrôle fiscal — rôle: vérifie et rectifie','Recouvrement — rôle: encaisse'],
    'ORG-0067':['Assiette — définition: déterminer ce qui est imposable','Liquidation — définition: calculer le montant','Recouvrement — définition: encaisser'],
    'ORG-0070':['Entreprises assujetties concernées au 1er septembre 2026 — obligation: pouvoir recevoir des factures électroniques','Grandes entreprises et ETI au 1er septembre 2026 — obligation: émettre des factures électroniques','Grandes entreprises et ETI au 1er septembre 2026 — obligation: transmettre les données prévues'],

    'MAT-0006':['Décomposition décimale de 3 482 — formule: 3×10³ + 4×10² + 8×10 + 2','Décomposition binaire de 10110₂ — formule: 1×2⁴ + 0×2³ + 1×2² + 1×2 + 0','Valeur décimale de 10110₂ — valeur: 22','Conversion binaire vers décimal — méthode: additionner les puissances de 2 correspondant aux chiffres 1'],
    'MAT-0025':['Addition de fractions — formule: a/b + c/d = (ad + bc)/(bd)','Multiplication de fractions — formule: a/b × c/d = ac/bd','Division de fractions — formule: a/b ÷ c/d = a/b × d/c','Simplification d’une fraction — méthode: diviser le numérateur et le dénominateur par leur PGCD'],
    'MAT-0030':['Règle de trois — formule: si a/b = c/x, alors x = bc/a','p % de Q — formule: Q×p/100','Coefficient multiplicateur pour une hausse de p % — formule: 1 + p/100'],
    'MAT-0038':['Obligation financière — définition: titre de dette','Investisseur obligataire — rôle: prête à un émetteur'],
    'MAT-0094':['Circonférence d’un cercle — formule: C = 2πr = πd','Longueur d’un arc d’angle θ en degrés — formule: L = (θ/360)×2πr','Latitude — définition: angle mesuré au nord ou au sud de l’équateur','Latitude — valeur: de 0° à 90°'],

    'CG-0001':['Antiquité grecque — repère: du Ve au IVe siècle av. J.-C.'],
    'CG-0004':['Art romain — repère: du Ier siècle av. J.-C. au Ve siècle'],
    'CG-0048':['Art contemporain — repère: depuis environ 1945'],
    'CG-0087':['Colisée — définition: amphithéâtre','Colisée — localisation: à Rome','Panthéon de Rome — association: coupole'],
    'CG-0112':['D’où venons-nous? Que sommes-nous? Où allons-nous? — auteur: Paul Gauguin'],
    'CG-0269':['Opéra — définition: œuvre dramatique chantée accompagnée de musique','Opéra — association: Mozart','Opéra — association: Verdi','Opéra — association: Puccini','Opéra — association: Wagner'],
    'CG-0310':['H2O — définition: eau','CO2 — définition: dioxyde de carbone','O2 — définition: dioxygène'],
    'CG-0311':['pH inférieur à 7 — association: solution acide','pH égal à 7 — association: solution neutre','pH supérieur à 7 — association: solution basique'],
    'CG-0386':['RE2020 — définition: réglementation environnementale française','RE2020 — association: bâtiments neufs','Application de la RE2020 — date: 2022'],
    'CG-0429':['Bien — définition: produit matériel','Service — définition: prestation immatérielle'],
    'CG-0438':['Substitut — définition: bien pouvant remplacer un autre','Substituts — association: train et avion selon l’usage'],
    'CG-0439':['Complément — définition: bien consommé avec un autre','Biens complémentaires — association: voiture et carburant'],
    'CG-0469':['Monnaie fiduciaire — définition: billets et pièces','Monnaie scripturale — définition: dépôts utilisables par des moyens de paiement'],
    'CG-0498':['Coût fixe — définition: coût qui ne varie pas directement avec le niveau de production à court terme','Coût fixe — association: loyer dans de nombreux cas'],
    'CG-0541':['IDH — définition: indice de développement humain','IDH — association: santé et espérance de vie','IDH — association: éducation','IDH — association: niveau de vie']
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
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28g-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();