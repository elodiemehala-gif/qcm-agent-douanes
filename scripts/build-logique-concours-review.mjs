import fs from 'node:fs';

const categories = {
  A: 'Suites numériques',
  B: 'Lettres, mots et codes',
  C: 'Classements et déductions',
  D: 'Calculs rapides et problèmes',
  E: 'Orientation et logique spatiale',
  F: 'Dominos, grilles et matrices',
  G: 'Lecture de tableaux et données'
};

const questions = [];
const add = (categoryId, topic, prompt, correct, distractors, explanation, visual = null) => {
  const number = questions.length + 1;
  const answer = (number - 1) % 4;
  const wrong = distractors.map(String).filter(x => x !== String(correct));
  if (new Set(wrong).size < 3) throw new Error(`Distracteurs insuffisants : ${prompt}`);
  const options = wrong.slice(0, 3);
  options.splice(answer, 0, String(correct));
  questions.push({
    id: `CONC-${String(number).padStart(4, '0')}`,
    number,
    mode: 'concours-dgfip',
    categoryId,
    category: categories[categoryId],
    topic,
    prompt,
    options,
    answer,
    explanation,
    visual
  });
};

// A — Suites numériques (18)
[
  ['4 – 7 – 10 – 13 – ?', '16', ['15','17','19'], 'On ajoute 3 à chaque terme.'],
  ['3 – 9 – 27 – 81 – ?', '243', ['162','324','729'], 'Chaque terme est multiplié par 3.'],
  ['2 – 5 – 10 – 17 – 26 – ?', '37', ['35','36','39'], 'Les écarts sont les nombres impairs successifs : +3, +5, +7, +9, puis +11.'],
  ['1 – 4 – 2 – 8 – 4 – 16 – ?', '8', ['6','12','32'], 'Deux suites sont imbriquées : 1, 2, 4, 8 aux rangs impairs et 4, 8, 16 aux rangs pairs.'],
  ['6 – 11 – 21 – 41 – 81 – ?', '161', ['121','160','162'], 'Chaque terme vaut le précédent multiplié par 2, puis diminué de 1.'],
  ['2 – 6 – 12 – 20 – 30 – ?', '42', ['36','40','44'], 'Les termes suivent n × (n + 1) : 1×2, 2×3, 3×4, etc.'],
  ['81 – 27 – 9 – 3 – ?', '1', ['0','2','6'], 'Chaque terme est divisé par 3.'],
  ['5 – 8 – 16 – 19 – 38 – 41 – ?', '82', ['44','79','84'], 'Les opérations alternent : +3, puis ×2.'],
  ['100 – 96 – 88 – 76 – 60 – ?', '40', ['36','42','44'], 'On retranche successivement 4, 8, 12, 16, puis 20.'],
  ['1 – 2 – 6 – 24 – 120 – ?', '720', ['600','625','840'], 'On multiplie successivement par 2, 3, 4, 5, puis 6.'],
  ['13 – 17 – 25 – 37 – 53 – ?', '73', ['69','71','75'], 'Les écarts sont +4, +8, +12, +16, puis +20.'],
  ['7 – 14 – 12 – 24 – 22 – 44 – ?', '42', ['40','46','88'], 'Les opérations alternent : ×2, puis −2.'],
  ['256 – 128 – 64 – 32 – ?', '16', ['8','24','30'], 'Chaque terme est la moitié du précédent.'],
  ['2 – 3 – 5 – 8 – 13 – 21 – ?', '34', ['29','32','35'], 'Chaque terme est la somme des deux précédents.'],
  ['9 – 18 – 16 – 32 – 30 – 60 – ?', '58', ['56','62','120'], 'Les opérations alternent : ×2, puis −2.'],
  ['121 – 144 – 169 – 196 – ?', '225', ['210','224','256'], 'Ce sont les carrés consécutifs de 11, 12, 13, 14 puis 15.'],
  ['3 – 4 – 7 – 11 – 18 – 29 – ?', '47', ['40','45','58'], 'À partir du troisième terme, on additionne les deux précédents.'],
  ['1 – 8 – 27 – 64 – ?', '125', ['81','100','216'], 'Ce sont les cubes de 1, 2, 3, 4 puis 5.']
].forEach(([s,c,w,e]) => add('A','Suite numérique',`Quel nombre complète la suite : ${s}`,c,w,e));

// B — Lettres, mots et codes (18)
[
  ['B – E – H – K – ?', 'N', ['M','O','P'], 'On avance de trois lettres à chaque étape.'],
  ['Z – V – R – N – ?', 'J', ['I','K','L'], 'On recule de quatre lettres à chaque étape.'],
  ['ABC – DEF – GHI – ?', 'JKL', ['IJK','JLM','MNO'], 'Les triplets se suivent dans l’alphabet sans lettre manquante.'],
  ['ACE – BDF – CEG – ?', 'DFH', ['DEG','DGH','EFH'], 'Chaque position avance d’une lettre : A-B-C-D, C-D-E-F et E-F-G-H.'],
  ['LUNDI (5), MARDI (5), MERCREDI (8), JEUDI (?)', '5', ['4','6','7'], 'Le nombre indique le nombre de lettres du mot.'],
  ['SAPIN (14), TULIPE (5), ROSE (5), LILAS (?)', '19', ['12','18','20'], 'Le nombre correspond au rang alphabétique de la dernière lettre : S est la 19e.'],
  ['BALAI (B), TABLE (T), CITRON (C), DOUANE (?)', 'D', ['A','E','N'], 'La lettre entre parenthèses est la première lettre du mot.'],
  ['LIVRE (F), POMME (Q), TAXE (?)', 'U', ['S','T','V'], 'On prend la lettre qui suit la première lettre du mot : L→M serait attendu, mais les exemples imposent ici un décalage incohérent.'],
].slice(0,7).forEach(([s,c,w,e]) => add('B','Code alphabétique',`Complétez le code : ${s}`,c,w,e));

add('B','Code alphabétique','Dans le code suivant, chaque lettre est remplacée par son rang dans l’alphabet. Quelle écriture correspond à FISC ?', '6-9-19-3', ['5-9-18-3','6-8-19-3','6-9-20-4'], 'F est la 6e lettre, I la 9e, S la 19e et C la 3e.');
add('B','Code alphabétique','Si A = 2, B = 4, C = 6 et ainsi de suite, quelle est la valeur de F ?', '12', ['6','10','14'], 'La valeur est le double du rang alphabétique : F est en 6e position, donc 6 × 2 = 12.');
add('B','Anagramme','Quel mot est formé exactement avec les mêmes lettres que « NICHE » ?', 'CHIEN', ['CHINEE','NICHEE','CHENE'], 'CHIEN et NICHE utilisent chacun une fois C, H, I, E et N.');
add('B','Chaîne de mots','Quel mot peut continuer la chaîne : DRAP → PIANO → ORAGE → ?', 'ÉTAPE', ['GARDE','NAVIRE','TASSE'], 'La dernière lettre d’un mot devient la première du suivant : DRAP→PIANO→ORAGE→ÉTAPE.');
add('B','Intrus','Quel couple ne suit pas la même règle que les autres ?', 'HUIT – T', ['DEUX – D','QUATRE – Q','ONZE – O'], 'La lettre attendue est l’initiale du nombre : HUIT devrait être associé à H.');
add('B','Analogie','Thermomètre est à température ce que balance est à…', 'poids', ['vitesse','distance','volume'], 'Le thermomètre mesure la température ; la balance mesure le poids ou la masse.');
add('B','Analogie','Auteur est à livre ce que compositeur est à…', 'musique', ['pinceau','scène','musée'], 'L’auteur crée un livre ; le compositeur crée une œuvre musicale.');
add('B','Ordre alphabétique','Quel mot serait classé en premier dans un dictionnaire ?', 'CAR', ['CARTE','CARTON','CAS'], 'CAR est le préfixe complet des deux mots CARTE et CARTON, et précède aussi CAS.');
add('B','Code de mot','Dans une règle, on note un mot par sa deuxième lettre puis son nombre de lettres. Comment coder « RECOURS » ?', 'E7', ['R7','E6','C7'], 'La deuxième lettre de RECOURS est E et le mot compte 7 lettres.');
add('B','Suite de mots','Quelle proposition continue logiquement : UN – TROIS – CINQ – ?', 'SEPT', ['SIX','HUIT','NEUF'], 'La suite énumère les nombres impairs dans l’ordre.');
add('B','Lettres imbriquées','A – Z – C – X – E – V – ?', 'G', ['F','H','T'], 'Une suite avance de deux lettres depuis A aux rangs impairs ; l’autre recule de deux depuis Z aux rangs pairs.');

// C — Classements et déductions (18)
add('C','Âges','Lina a 4 ans de plus que Marc. Marc a 3 ans de moins que Yannis. Qui est le plus âgé ?', 'Lina', ['Marc','Yannis','Impossible à déterminer'], 'Si Marc vaut M, Lina vaut M+4 et Yannis M+3 : Lina est la plus âgée.');
add('C','Âges','Éva a deux fois l’âge de Noé. Dans 6 ans, Éva aura 18 ans. Quel âge Noé a-t-il aujourd’hui ?', '6 ans', ['5 ans','9 ans','12 ans'], 'Éva a actuellement 12 ans ; Noé en a la moitié, soit 6 ans.');
add('C','Classement','Amir est devant Béa. Chloé est derrière Béa mais devant David. Quel ordre est imposé ?', 'Amir – Béa – Chloé – David', ['Béa – Amir – Chloé – David','Amir – Chloé – Béa – David','Amir – Béa – David – Chloé'], 'Les trois relations se chaînent directement dans cet ordre.');
add('C','Classement','Dans une file de 27 personnes, Zoé est 8e en partant du début. Combien de personnes sont derrière elle ?', '19', ['18','20','21'], 'Après les 8 premières positions, il reste 27 − 8 = 19 personnes.');
add('C','Classement','Paul est 11e depuis le début et 9e depuis la fin. Combien de personnes compte la file ?', '19', ['18','20','21'], 'On additionne les deux rangs puis on retranche Paul compté deux fois : 11 + 9 − 1 = 19.');
add('C','Parenté','Le frère de la mère de Léa est le… de Léa.', 'oncle', ['cousin','neveu','grand-père'], 'Le frère d’un parent est un oncle.');
add('C','Parenté','La fille de mon frère est ma…', 'nièce', ['cousine','tante','belle-sœur'], 'L’enfant de mon frère est mon neveu ou ma nièce ; ici il s’agit d’une fille.');
add('C','Parenté','Nora est la sœur de Sami. Sami est le père de Léo. Que représente Nora pour Léo ?', 'Sa tante', ['Sa cousine','Sa sœur','Sa grand-mère'], 'La sœur du père est la tante de l’enfant.');
add('C','Code sous contraintes','Un code contient trois chiffres distincts choisis entre 1 et 6. Le dernier est le double du deuxième, le premier est supérieur au dernier et la somme dépasse 9. Quel code convient ?', '5-2-4', ['4-2-4','6-3-5','3-1-2'], '5, 2 et 4 sont distincts ; 4 est le double de 2, 5 est supérieur à 4 et leur somme vaut 11.');
add('C','Déduction','Tous les contrôleurs sont agents publics. Certains agents publics travaillent de nuit. Quelle conclusion est certaine ?', 'Tous les contrôleurs sont agents publics', ['Tous les contrôleurs travaillent de nuit','Aucun contrôleur ne travaille de nuit','Tous les agents publics sont contrôleurs'], 'La première phrase donne directement la seule conclusion certaine ; « certains » ne permet pas de généraliser.');
add('C','Déduction','Si le dossier est complet, il est enregistré. Le dossier n’est pas enregistré. Que peut-on conclure ?', 'Le dossier n’est pas complet', ['Le dossier est complet','Le dossier est perdu','Aucune conclusion'], 'C’est la contraposée : complet implique enregistré, donc non enregistré implique non complet.');
add('C','Déduction','Aucun dossier urgent n’est archivé. Le dossier X est urgent. Que sait-on ?', 'X n’est pas archivé', ['X est archivé','X est incomplet','X est prioritaire après tous les autres'], 'L’incompatibilité entre urgent et archivé s’applique directement à X.');
add('C','Planning','Quatre rendez-vous A, B, C et D sont consécutifs. A précède immédiatement B ; D est après B ; C est avant A. Quel ordre convient ?', 'C – A – B – D', ['A – B – C – D','C – D – A – B','D – C – A – B'], 'C doit précéder le bloc A-B et D doit venir après B : seul cet ordre convient.');
add('C','Planning','Trois tâches durent 20, 35 et 15 minutes et doivent être réalisées successivement. Quelle est la durée totale ?', '1 h 10', ['55 min','1 h 05','1 h 20'], '20 + 35 + 15 = 70 minutes, soit 1 h 10.');
add('C','Jours','Nous sommes mardi. Quel jour serons-nous dans 17 jours ?', 'Vendredi', ['Jeudi','Samedi','Dimanche'], '17 laisse un reste de 3 après division par 7 : mardi + 3 jours = vendredi.');
add('C','Vérité-mensonge','Ana dit : « Bilal ment ». Bilal dit : « Nous disons tous les deux la vérité ». Une seule personne dit vrai. Qui dit vrai ?', 'Ana', ['Bilal','Les deux','Aucune'], 'Si Bilal disait vrai, les deux diraient vrai, contradiction. Bilal ment donc Ana dit vrai.');
add('C','Affectation','Léa, Max et Nour choisissent chacun une couleur différente : rouge, bleu ou vert. Léa ne choisit pas rouge ; Max choisit bleu ; Nour ne choisit pas vert. Quelle couleur choisit Léa ?', 'Vert', ['Rouge','Bleu','Impossible à déterminer'], 'Max prend bleu. Nour ne pouvant prendre ni bleu ni vert prend rouge ; Léa prend donc vert.');
add('C','Affectation','Trois dossiers X, Y et Z sont traités lundi, mardi et mercredi, un par jour. X est avant Y et Z est traité mercredi. Quand Y est-il traité ?', 'Mardi', ['Lundi','Mercredi','Impossible à déterminer'], 'Z occupe mercredi. X devant Y impose X lundi et Y mardi.');

// D — Calculs rapides et problèmes (18)
add('D','Débit de travail','Une machine produit 18 pièces en 3 heures. Combien en produit-elle en 7 heures au même rythme ?', '42', ['36','48','54'], 'Le rythme est de 6 pièces par heure ; 6 × 7 = 42.');
add('D','Débit combiné','Un agent traite 5 dossiers par heure et un autre 7. Combien en traitent-ils ensemble en 4 heures ?', '48', ['28','40','52'], 'Ensemble ils traitent 12 dossiers par heure, soit 12 × 4 = 48.');
add('D','Pourcentage','Un article à 80 € bénéficie d’une remise de 15 %. Quel est son nouveau prix ?', '68 €', ['65 €','72 €','74 €'], 'La remise vaut 12 € ; 80 − 12 = 68 €.');
add('D','Pourcentage','Un effectif passe de 200 à 230. Quelle est l’augmentation en pourcentage ?', '15 %', ['13 %','20 %','30 %'], 'La hausse est de 30 sur une base de 200 : 30/200 = 15 %.');
add('D','Proportion','Pour 6 personnes, une recette demande 450 g de farine. Quelle quantité faut-il pour 10 personnes ?', '750 g', ['600 g','700 g','900 g'], '450/6 = 75 g par personne ; 75 × 10 = 750 g.');
add('D','Vitesse','Un véhicule parcourt 150 km à 75 km/h. Combien de temps dure le trajet ?', '2 h', ['1 h 30','2 h 15','2 h 30'], 'Temps = distance/vitesse = 150/75 = 2 heures.');
add('D','Rencontre','Deux cyclistes distants de 90 km se rapprochent à 20 km/h et 25 km/h. Après combien de temps se rencontrent-ils ?', '2 h', ['1 h 30','2 h 30','4 h'], 'Leur vitesse de rapprochement est 45 km/h ; 90/45 = 2 heures.');
add('D','Moyenne','Quelle est la moyenne de 12, 15, 17 et 20 ?', '16', ['15','16,5','17'], 'La somme vaut 64 ; 64/4 = 16.');
add('D','Moyenne pondérée','Une note de 10 coefficient 2 et une note de 16 coefficient 3 donnent quelle moyenne ?', '13,6', ['13','14','14,5'], '(10×2 + 16×3)/(2+3) = 68/5 = 13,6.');
add('D','Âge algébrique','Dans 8 ans, Hugo aura le double de l’âge qu’il avait il y a 4 ans. Quel âge a-t-il aujourd’hui ?', '16 ans', ['12 ans','18 ans','20 ans'], 'Si x est son âge : x+8 = 2(x−4), donc x = 16.');
add('D','Partage','Une somme de 360 € est partagée dans le rapport 2:3:4. Quelle est la plus grande part ?', '160 €', ['80 €','120 €','180 €'], 'Il y a 9 parts unitaires de 40 € ; la plus grande vaut 4 × 40 = 160 €.');
add('D','Combinatoire','Dix personnes se serrent chacune la main une seule fois. Combien y a-t-il de poignées de main ?', '45', ['40','50','90'], 'Chaque paire est comptée une fois : 10×9/2 = 45.');
add('D','Combinaisons','Combien de binômes différents peut-on former avec 6 personnes ?', '15', ['12','18','30'], 'Le nombre de paires vaut 6×5/2 = 15.');
add('D','Monnaie','Un achat coûte 37,80 €. On paie avec 50 €. Quelle monnaie doit être rendue ?', '12,20 €', ['11,20 €','12,80 €','13,20 €'], '50 − 37,80 = 12,20 €.');
add('D','Conversions','Combien de minutes représentent 2 h 35 ?', '155', ['145','165','235'], '2 heures valent 120 minutes ; 120 + 35 = 155.');
add('D','Fractions','Les trois quarts d’un effectif de 84 personnes représentent…', '63 personnes', ['56 personnes','64 personnes','72 personnes'], '84 ÷ 4 × 3 = 21 × 3 = 63.');
add('D','Travail inverse','Six agents terminent une tâche en 10 jours. À rendement identique, combien faut-il de jours à 12 agents ?', '5 jours', ['4 jours','8 jours','20 jours'], 'Doubler l’effectif divise la durée par deux : 10/2 = 5 jours.');
add('D','Comparaison de croissance','Mila mesure 18 cm de moins que Sara. Mila gagne 3 cm par an et Sara 1 cm par an. Dans combien d’années auront-elles la même taille ?', '9 ans', ['6 ans','8 ans','18 ans'], 'Mila rattrape 2 cm par an ; 18/2 = 9 ans.');

// E — Orientation et logique spatiale (16)
add('E','Orientation','Vous êtes face au nord. Vous tournez à droite, puis faites demi-tour. Quelle direction regardez-vous ?', 'Ouest', ['Nord','Est','Sud'], 'Nord → droite = est ; demi-tour depuis l’est = ouest.', {type:'turns',start:'N',turns:['droite','demi-tour']});
add('E','Orientation','Vous êtes face au sud. Vous tournez deux fois à gauche. Quelle direction regardez-vous ?', 'Nord', ['Est','Sud','Ouest'], 'Deux quarts de tour à gauche forment un demi-tour : sud devient nord.', {type:'turns',start:'S',turns:['gauche','gauche']});
add('E','Orientation','Vous êtes face à l’est. Vous tournez de 270° dans le sens horaire. Quelle direction regardez-vous ?', 'Nord', ['Est','Sud','Ouest'], '270° horaire équivaut à 90° antihoraire : est devient nord.', {type:'turns',start:'E',turns:['270° horaire']});
add('E','Déplacement','Un marcheur avance de 4 cases vers l’est, 3 vers le nord puis 2 vers l’ouest. Où se trouve-t-il par rapport au départ ?', '2 cases à l’est et 3 au nord', ['2 cases à l’ouest et 3 au nord','6 cases à l’est et 3 au nord','2 cases à l’est et 1 au nord'], 'Le déplacement horizontal net est 4−2 = 2 vers l’est ; le déplacement vertical est 3 vers le nord.', {type:'path',moves:[['E',4],['N',3],['O',2]]});
add('E','Déplacement','Un mobile va 5 cases au nord, 5 à l’est, 5 au sud puis 2 à l’ouest. Où finit-il ?', '3 cases à l’est du départ', ['2 cases à l’ouest du départ','3 cases au nord du départ','Au point de départ'], 'Les déplacements nord-sud s’annulent ; 5−2 = 3 cases restent vers l’est.', {type:'path',moves:[['N',5],['E',5],['S',5],['O',2]]});
add('E','Coordonnées','Le point A est en (2 ; −1). On le déplace de 3 unités à gauche et 4 vers le haut. Quelles sont ses nouvelles coordonnées ?', '(−1 ; 3)', ['(5 ; 3)','(−1 ; −5)','(3 ; −1)'], 'x devient 2−3 = −1 et y devient −1+4 = 3.');
add('E','Symétrie','Quel est le symétrique du point (3 ; −2) par rapport à l’axe vertical ?', '(−3 ; −2)', ['(3 ; 2)','(−3 ; 2)','(2 ; −3)'], 'Une symétrie par rapport à l’axe vertical change le signe de x et conserve y.');
add('E','Rotation','Le point (2 ; 1) subit une rotation de 90° dans le sens antihoraire autour de l’origine. Où arrive-t-il ?', '(−1 ; 2)', ['(1 ; −2)','(−2 ; −1)','(2 ; −1)'], 'Une rotation antihoraire de 90° transforme (x,y) en (−y,x).');
add('E','Cube peint','Un cube 3×3×3 est peint sur toutes ses faces puis découpé. Combien de petits cubes ont exactement trois faces peintes ?', '8', ['4','12','27'], 'Seuls les huit cubes situés aux sommets ont trois faces peintes.');
add('E','Cube peint','Un cube 4×4×4 est peint puis découpé. Combien de petits cubes n’ont aucune face peinte ?', '8', ['4','16','24'], 'Les cubes intérieurs forment un bloc de côté 4−2 = 2, donc 2³ = 8.');
add('E','Cube peint','Un cube 5×5×5 est peint puis découpé. Combien de petits cubes ont exactement deux faces peintes ?', '36', ['24','48','60'], 'Sur chacune des 12 arêtes, les 5−2 = 3 cubes non situés aux sommets ont deux faces peintes : 12×3 = 36.');
add('E','Patron de cube','Dans le patron représenté, quelle face sera opposée à A ?', 'C', ['B','D','E'], 'En repliant la bande A-B-C-D autour de B, les faces A et C se retrouvent opposées.', {type:'cubeNet',cells:[['', 'E', '', ''],['A','B','C','D'],['', 'F', '', '']],focus:'A'});
add('E','Patron de cube','Dans le patron représenté, quelle face sera opposée à B ?', 'D', ['A','C','F'], 'Dans ce patron en croix, les faces placées de part et d’autre de la face centrale A deviennent opposées : B et D.', {type:'cubeNet',cells:[['', 'E', '', ''],['B','A','D','F'],['', 'C', '', '']],focus:'B'});
add('E','Vue de dessus','Trois colonnes de cubes ont des hauteurs 2, 4 et 3. Combien de cubes l’empilement contient-il ?', '9', ['7','10','12'], 'Le total est la somme des hauteurs : 2+4+3 = 9.', {type:'columns',values:[2,4,3]});
add('E','Vue de dessus','Une vue de dessus montre quatre cases occupées, de hauteurs 1, 3, 2 et 2. Combien de cubes sont utilisés ?', '8', ['4','7','9'], 'On additionne les hauteurs des quatre colonnes : 1+3+2+2 = 8.', {type:'columns',values:[1,3,2,2]});
add('E','Distance sur grille','Deux points sont placés en (−2 ; 3) et (4 ; 3). Quelle est leur distance horizontale ?', '6 unités', ['2 unités','4 unités','7 unités'], 'Les ordonnées sont identiques ; la distance vaut 4−(−2) = 6.');

// F — Dominos, grilles et matrices (18)
const domino = (prompt, series, correct, wrong, explanation) => {
  const index = questions.filter(q => q.categoryId === 'F' && q.topic === 'Dominos').length + 1;
  add('F','Dominos',`Série de dominos ${index} — ${prompt}`,correct,wrong,explanation,{type:'dominos',series});
};
domino('Quel domino complète la série ?', [[1,2],[2,3],[3,4],['?','?']], '4 | 5', ['4 | 4','5 | 4','5 | 6'], 'Les deux moitiés augmentent chacune de 1.',);
domino('Quel domino complète la série ?', [[6,1],[5,2],[4,3],['?','?']], '3 | 4', ['2 | 5','4 | 4','3 | 3'], 'La moitié gauche diminue de 1 tandis que la droite augmente de 1.');
domino('Quel domino complète la série ?', [[1,5],[2,4],[3,3],['?','?']], '4 | 2', ['4 | 3','5 | 1','2 | 4'], 'La somme des deux moitiés reste égale à 6.');
domino('Quel domino complète la série ?', [[0,2],[2,4],[4,6],['?','?']], '6 | 1', ['6 | 0','1 | 6','5 | 1'], 'Chaque moitié avance de 2 sur un cycle de 0 à 6 : après 6 vient 1.');
domino('Quel domino complète la série ?', [[2,2],[3,4],[4,6],['?','?']], '5 | 1', ['5 | 0','6 | 1','5 | 2'], 'La gauche augmente de 1 ; la droite augmente de 2 en revenant à 1 après 6.');
domino('Quel domino complète la série ?', [[6,6],[5,4],[4,2],['?','?']], '3 | 0', ['3 | 1','2 | 0','4 | 0'], 'La gauche diminue de 1 et la droite de 2.');

const grid = (prompt, rows, correct, wrong, explanation) => {
  const index = questions.filter(q => q.categoryId === 'F' && q.topic === 'Grille numérique').length + 1;
  add('F','Grille numérique',`Grille numérique ${index} — ${prompt}`,correct,wrong,explanation,{type:'grid',rows});
};
grid('Quel nombre remplace le point d’interrogation ?', [[2,3,5],[4,6,10],[7,8,'?']], '15', ['13','14','16'], 'Dans chaque ligne, la troisième case est la somme des deux premières.');
grid('Quel nombre remplace le point d’interrogation ?', [[3,4,12],[5,6,30],[7,8,'?']], '56', ['48','54','64'], 'Dans chaque ligne, la troisième case est le produit des deux premières.');
grid('Quel nombre remplace le point d’interrogation ?', [[9,2,7],[14,5,9],[20,8,'?']], '12', ['10','13','28'], 'Dans chaque ligne, la troisième case est la différence entre la première et la deuxième.');
grid('Quel nombre remplace le point d’interrogation ?', [[2,4,8],[3,6,18],[5,7,'?']], '35', ['30','40','42'], 'Dans chaque ligne, la troisième case est le produit des deux premières.');
grid('Quel nombre remplace le point d’interrogation ?', [[1,2,3],[2,3,5],[4,6,'?']], '10', ['8','9','12'], 'Dans chaque ligne, la troisième case est la somme des deux premières.');
grid('Quel nombre remplace le point d’interrogation ?', [[4,2,12],[5,3,20],[7,4,'?']], '35', ['28','32','42'], 'On multiplie le premier nombre par le deuxième augmenté de 1 : 7×(4+1)=35.');

add('F','Arbre de calcul','Dans chaque branche, le nombre central vaut le double de la différence entre les deux nombres extérieurs. Que vaut ? avec 31 et 19 ?', '24', ['12','25','50'], '31−19 = 12, puis 12×2 = 24.', {type:'tree',left:31,right:19,center:'?'});
add('F','Arbre de calcul','Dans chaque branche, le sommet vaut la somme des deux nombres du bas divisée par 2. Que vaut ? avec 18 et 30 ?', '24', ['12','36','48'], '(18+30)/2 = 24.', {type:'tree',left:18,right:30,center:'?'});
add('F','Matrice de formes','Dans chaque ligne, le nombre de côtés de la troisième forme est la somme de ceux des deux premières. Triangle + carré donne…', 'Un heptagone', ['Un hexagone','Un octogone','Un nonagone'], 'Un triangle a 3 côtés et un carré 4 : 3+4 = 7 côtés.');
add('F','Matrice de symboles','Dans une matrice, ● + ● = 8 et ● + ▲ = 11. Quelle est la valeur de ▲ ?', '7', ['3','4','15'], '● vaut 4 ; 4 + ▲ = 11, donc ▲ vaut 7.', {type:'symbols',lines:['● + ● = 8','● + ▲ = 11','▲ = ?']});
add('F','Matrice de symboles','Si ■ × ■ = 25 et ■ + ★ = 13, quelle est la valeur de ★ ?', '8', ['5','12','18'], '■ vaut 5 ; 5 + ★ = 13, donc ★ vaut 8.', {type:'symbols',lines:['■ × ■ = 25','■ + ★ = 13','★ = ?']});
add('F','Comptage visuel','Une grille contient 3 lignes de 4 carrés. Combien de carrés élémentaires contient-elle ?', '12', ['7','14','16'], 'Il y a 3×4 = 12 carrés élémentaires.', {type:'miniGrid',rows:3,cols:4});

// G — Lecture de tableaux et données (14)
const tableQ = (prompt, headers, rows, correct, wrong, explanation) => add('G','Lecture de données',prompt,correct,wrong,explanation,{type:'table',headers,rows});
const t1=[['A',120,30],['B',150,45],['C',90,18],['D',140,42]];
tableQ('Quel service a traité le plus de dossiers ?', ['Service','Dossiers','Erreurs'], t1, 'B', ['A','C','D'], 'Le maximum de la colonne Dossiers est 150 pour le service B.');
tableQ('Quel service présente le moins d’erreurs ?', ['Service','Dossiers','Erreurs'], t1, 'C', ['A','B','D'], 'Le minimum de la colonne Erreurs est 18 pour le service C.');
tableQ('Quel service a un taux d’erreur de 20 % ?', ['Service','Dossiers','Erreurs'], t1, 'C', ['A','B','D'], 'Pour C, 18 erreurs sur 90 dossiers donnent 18/90 = 20 %.');
tableQ('Combien de dossiers ont été traités au total ?', ['Service','Dossiers','Erreurs'], t1, '500', ['470','490','510'], '120+150+90+140 = 500.');
const t2=[['Lundi',48,36],['Mardi',54,45],['Mercredi',60,51],['Jeudi',45,42]];
tableQ('Quel jour l’écart entre entrées et sorties est-il le plus faible ?', ['Jour','Entrées','Sorties'], t2, 'Jeudi', ['Lundi','Mardi','Mercredi'], 'Les écarts sont 12, 9, 9 et 3 : le plus faible est celui de jeudi.');
tableQ('Quel est le total des sorties mardi et mercredi ?', ['Jour','Entrées','Sorties'], t2, '96', ['87','99','105'], '45+51 = 96.');
tableQ('Quel jour compte exactement 9 entrées de plus que de sorties ?', ['Jour','Entrées','Sorties'], t2, 'Mardi et mercredi', ['Lundi seulement','Jeudi seulement','Lundi et jeudi'], 'Mardi : 54−45 = 9 ; mercredi : 60−51 = 9.');
const t3=[['Nord',80,72],['Sud',95,76],['Est',75,60],['Ouest',100,85]];
tableQ('Quelle zone a le meilleur taux de réussite ?', ['Zone','Candidats','Admis'], t3, 'Nord', ['Sud','Est','Ouest'], 'Nord atteint 72/80 = 90 %, supérieur à 80 %, 80 % et 85 %.');
tableQ('Combien de candidats n’ont pas été admis dans la zone Sud ?', ['Zone','Candidats','Admis'], t3, '19', ['15','20','21'], '95−76 = 19 candidats non admis.');
tableQ('Combien de candidats ont été admis dans les quatre zones ?', ['Zone','Candidats','Admis'], t3, '293', ['285','300','350'], '72+76+60+85 = 293.');
const t4=[['Produit X',40,12],['Produit Y',55,10],['Produit Z',35,15],['Produit W',70,20]];
tableQ('Quel produit a la marge unitaire la plus élevée ?', ['Produit','Prix €','Coût €'], t4, 'Produit W', ['Produit X','Produit Y','Produit Z'], 'Les marges sont 28, 45, 20 et 50 € : W est maximal.');
tableQ('Quel produit coûte 25 € de moins que son prix de vente ?', ['Produit','Prix €','Coût €'], t4, 'Produit Z', ['Produit X','Produit Y','Produit W'], 'Pour Z, 35−15 = 20 et non 25 : aucune ligne ne satisfait en réalité la condition.', null);

// Replace the intentionally rejected draft immediately with two verified items.
questions.pop();
tableQ('Quel produit coûte exactement 20 € de moins que son prix de vente ?', ['Produit','Prix €','Coût €'], t4, 'Produit Z', ['Produit X','Produit Y','Produit W'], 'Pour Z, 35−15 = 20 €.');
tableQ('Quel est le coût total d’un exemplaire de chaque produit ?', ['Produit','Prix €','Coût €'], t4, '57 €', ['52 €','60 €','70 €'], '12+10+15+20 = 57 €.');
tableQ('Quelle est la somme des prix de vente de X et Y ?', ['Produit','Prix €','Coût €'], t4, '95 €', ['85 €','100 €','110 €'], '40+55 = 95 €.');

const expected = {A:18,B:18,C:18,D:18,E:16,F:18,G:14};
if (questions.length !== 120) throw new Error(`Total ${questions.length}/120`);
for (const [k,n] of Object.entries(expected)) {
  const got = questions.filter(q => q.categoryId === k).length;
  if (got !== n) throw new Error(`${k}: ${got}/${n}`);
}
for (const q of questions) {
  if (q.options.length !== 4 || new Set(q.options).size !== 4) throw new Error(`Options invalides ${q.id}`);
  if (q.answer < 0 || q.answer > 3) throw new Error(`Réponse invalide ${q.id}`);
  if (!q.explanation) throw new Error(`Explication manquante ${q.id}`);
}
if (new Set(questions.map(q => q.prompt)).size !== questions.length) throw new Error('Énoncés dupliqués');

const audit = {
  generatedAt: new Date().toISOString(),
  total: questions.length,
  categories: Object.fromEntries(Object.keys(categories).map(k => [k,questions.filter(q=>q.categoryId===k).length])),
  answerPositions: [0,1,2,3].map(i => questions.filter(q=>q.answer===i).length),
  visuals: questions.filter(q=>q.visual).length,
  duplicatePrompts: questions.length - new Set(questions.map(q=>q.prompt)).size,
  invalidOptions: questions.filter(q=>q.options.length!==4||new Set(q.options).size!==4).map(q=>q.id)
};

fs.writeFileSync('logic-concours-120-bank.js', `window.QLOGIC_CONCOURS_REVIEW=${JSON.stringify(questions,null,2)};\n`);
fs.mkdirSync('drafts',{recursive:true});
fs.writeFileSync('drafts/audit-logique-concours-120.json', JSON.stringify(audit,null,2)+'\n');

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Logique type concours DGFiP — 120 questions</title><style>
:root{--bg:#f4f6fb;--card:#fff;--text:#172033;--muted:#687186;--line:#dbe0ea;--primary:#1d4ed8;--soft:#eaf0ff;--ok:#08775a}*{box-sizing:border-box}body{margin:0;background:linear-gradient(145deg,#eef5ff,#faf7ff);color:var(--text);font:15px/1.52 system-ui,sans-serif}.wrap{max-width:1050px;margin:auto;padding:24px 18px 70px}header,.panel,.q{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 8px 28px #25325b12}header{border-left:5px solid var(--primary);margin-bottom:16px}h1{margin:0 0 6px;font-size:27px}.muted{color:var(--muted)}.stats,.filters{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.tag,.filter{border:1px solid var(--line);border-radius:999px;padding:7px 11px}.tag{background:var(--soft);color:var(--primary);font-weight:800}.filter{background:#fff;cursor:pointer}.filter.on{background:var(--primary);color:#fff;border-color:var(--primary)}input{width:100%;margin-top:14px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;font:inherit}.q{margin:12px 0}.meta{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px}.q h3{margin:8px 0 12px;font-size:18px}.opts{display:grid;gap:7px}.opt{padding:9px 11px;background:#fafbff;border:1px solid var(--line);border-radius:11px}.answer{margin-top:12px;padding:12px;border-radius:12px;background:#ecfaf4;border:1px solid #bde7d7}.answer b{color:var(--ok)}.visual{margin:12px 0;padding:14px;background:#f8faff;border:1px solid var(--line);border-radius:14px;overflow:auto}.dominos{display:flex;gap:10px;align-items:center;justify-content:center}.domino{display:flex;border:2px solid #253047;border-radius:7px;background:#fff}.half{width:42px;height:42px;display:grid;place-items:center;font-size:20px;font-weight:800}.half+ .half{border-left:2px solid #253047}.grid{border-collapse:collapse;margin:auto}.grid td{width:52px;height:46px;text-align:center;border:2px solid #33405a;font-weight:800;font-size:18px;background:#fff}.net{display:grid;grid-template-columns:repeat(4,46px);justify-content:center}.face{width:46px;height:46px;border:2px solid #33405a;display:grid;place-items:center;background:#fff;font-weight:800}.face.blank{border-color:transparent;background:transparent}.columns{display:flex;align-items:end;justify-content:center;gap:14px;height:120px}.column{width:45px;background:#80a8ff;border:2px solid #315dbb;display:grid;place-items:start center;font-weight:800;padding-top:4px}.tree{display:grid;grid-template-columns:1fr 1fr;max-width:240px;margin:auto;text-align:center;font-size:20px;font-weight:800}.tree .center{grid-column:1/3;border:2px solid #33405a;border-radius:50%;width:54px;height:54px;display:grid;place-items:center;margin:12px auto 0}.symbols{text-align:center;font-size:20px;font-weight:800;line-height:1.8}.mini-grid{display:grid;margin:auto;width:max-content}.mini-grid i{width:34px;height:34px;border:1px solid #33405a;background:#fff}.data{border-collapse:collapse;margin:auto}.data th,.data td{padding:7px 12px;border:1px solid #aeb7c8;text-align:center}.data th{background:#eaf0ff}.compass{text-align:center;font-weight:800;font-size:17px}.path{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.move{padding:8px 10px;border:1px solid #aeb7c8;border-radius:9px;background:#fff;font-weight:800}@media(max-width:700px){.wrap{padding:14px 10px 60px}.q,header,.panel{padding:14px}h1{font-size:23px}.meta{display:block}.data th,.data td{padding:6px}}
</style></head><body><div class="wrap"><header><h1>Logique — entraînement type concours DGFiP</h1><p class="muted">120 questions originales inspirées des mécanismes du concours. Cette banque reste entièrement séparée des 180 questions « Apprentissage et méthode » et n’est pas encore intégrée à l’application.</p><div class="stats"><span class="tag">120 questions</span><span class="tag">7 catégories</span><span class="tag">Choix unique</span><span class="tag">Visuels dédiés</span></div></header><div class="panel"><input id="search" type="search" placeholder="Rechercher une question ou une notion"><div class="filters"><button class="filter on" data-cat="">Toutes</button>${Object.entries(categories).map(([k,v])=>`<button class="filter" data-cat="${k}">${v}</button>`).join('')}</div></div><main id="content"></main></div><script src="logic-concours-120-bank.js"></script><script>
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function visual(v){if(!v)return '';let h='';if(v.type==='dominos')h='<div class="dominos">'+v.series.map(d=>'<div class="domino"><span class="half">'+esc(d[0])+'</span><span class="half">'+esc(d[1])+'</span></div>').join('')+'</div>';if(v.type==='grid')h='<table class="grid">'+v.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</table>';if(v.type==='cubeNet')h='<div class="net">'+v.cells.flat().map(x=>'<span class="face '+(!x?'blank':'')+'">'+esc(x)+'</span>').join('')+'</div>';if(v.type==='columns')h='<div class="columns">'+v.values.map(x=>'<span class="column" style="height:'+(25+x*20)+'px">'+x+'</span>').join('')+'</div>';if(v.type==='tree')h='<div class="tree"><span>'+v.left+'</span><span>'+v.right+'</span><span class="center">'+v.center+'</span></div>';if(v.type==='symbols')h='<div class="symbols">'+v.lines.map(esc).join('<br>')+'</div>';if(v.type==='miniGrid')h='<div class="mini-grid" style="grid-template-columns:repeat('+v.cols+',34px)">'+Array(v.rows*v.cols).fill('<i></i>').join('')+'</div>';if(v.type==='table')h='<table class="data"><thead><tr>'+v.headers.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+v.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';if(v.type==='turns')h='<div class="compass">Départ : '+esc(v.start)+' &nbsp;→&nbsp; '+v.turns.map(esc).join(' &nbsp;→&nbsp; ')+'</div>';if(v.type==='path')h='<div class="path">'+v.moves.map(m=>'<span class="move">'+m[1]+' × '+esc(m[0])+'</span>').join(' → ')+'</div>';return '<div class="visual">'+h+'</div>'}
const content=document.getElementById('content'),search=document.getElementById('search');let category='';function render(){const term=search.value.trim().toLowerCase();const a=QLOGIC_CONCOURS_REVIEW.filter(q=>(!category||q.categoryId===category)&&(!term||JSON.stringify(q).toLowerCase().includes(term)));content.innerHTML='<h2>'+a.length+' questions affichées</h2>'+a.map(q=>'<article class="q"><div class="meta"><span>Question '+q.number+' · '+esc(q.category)+'</span><span>'+esc(q.topic)+'</span></div><h3>'+esc(q.prompt)+'</h3>'+visual(q.visual)+'<div class="opts">'+q.options.map((o,i)=>'<div class="opt">'+String.fromCharCode(65+i)+'. '+esc(o)+'</div>').join('')+'</div><div class="answer"><b>Réponse : '+String.fromCharCode(65+q.answer)+'</b><div>'+esc(q.explanation)+'</div></div></article>').join('')}document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{category=b.dataset.cat;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('on',x===b));render()});search.oninput=render;render();
</script></body></html>`;

fs.writeFileSync('logique-concours-dgfip-120.html', html);
console.log(JSON.stringify(audit,null,2));
