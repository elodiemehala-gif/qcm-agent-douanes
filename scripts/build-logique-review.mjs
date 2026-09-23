import fs from 'node:fs';

const chapters={
 A:{id:'A',title:'A. Logique mathématique',source:'Guide stratégique de raisonnement logique · p. 2-7'},
 B:{id:'B',title:'B. Logique verbale',source:'Guide stratégique de raisonnement logique · p. 7-10'},
 C:{id:'C',title:'C. Logique spatiale',source:'Guide stratégique de raisonnement logique · p. 10-13'},
 D:{id:'D',title:'D. Logique organisationnelle',source:'Guide stratégique de raisonnement logique · p. 13-15'},
 E:{id:'E',title:'E. Suites et structures',source:'Guide stratégique de raisonnement logique · p. 16-18'},
 F:{id:'F',title:'F. Logique combinatoire et tableaux de déduction',source:'Guide stratégique de raisonnement logique · p. 18-20'}
};
const questions=[];
const clean=x=>typeof x==='number'?String(Number(x.toFixed(3))).replace('.',','):String(x);
function add(ch,topic,kind,prompt,correct,wrong,why){
 const allWrong=[...new Set(wrong.map(clean).filter(x=>x!==clean(correct)))];
 if(allWrong.length<3)throw new Error(`Distracteurs insuffisants: ${prompt}`);
 const ans=questions.length%4,o=allWrong.slice(0,3);o.splice(ans,0,clean(correct));
 questions.push({number:questions.length+1,id:`LOG-${String(questions.length+1).padStart(4,'0')}`,chapterId:ch,chapter:chapters[ch].title,topic,kind,prompt,o,ans,why,source:chapters[ch].source});
}
const nw=(correct,candidates)=>{
 const c=Number(correct),out=[];
 for(const x of candidates){const s=clean(x);if(s!==clean(c)&&!out.includes(s))out.push(s)}
 for(const d of [1,-1,2,-2,5,-5,10,-10]){const s=clean(c+d);if(!out.includes(s)&&s!==clean(c))out.push(s)}
 return out.slice(0,3);
};

// A — 40 questions
[
 ['Proportionnalité','Reconnaissance','Deux grandeurs augmentent dans le même rapport. Quel premier réflexe est le plus efficace ?','Vérifier que leur quotient reste constant',['Additionner systématiquement les valeurs','Chercher une différence constante','Multiplier toutes les données entre elles'],'Une proportionnalité directe se reconnaît à un coefficient multiplicateur constant entre les deux grandeurs.'],
 ['Proportionnalité','Piège','Douze agents terminent une tâche en 15 jours. Si le nombre d’agents augmente à rendement identique, quelle relation faut-il utiliser ?','Une proportionnalité inverse entre effectif et durée',['Une proportionnalité directe entre effectif et durée','Une moyenne arithmétique des deux effectifs','Une addition de la durée et de l’effectif'],'À travail fixe, davantage d’agents réduisent la durée : le produit effectif × durée reste constant.'],
 ['Pourcentages','Méthode','Pour appliquer une hausse de 18 %, quel coefficient multiplicateur faut-il utiliser ?','1,18',['0,18','0,82','18'],'Une hausse de 18 % revient à multiplier la valeur initiale par 1 + 18/100 = 1,18.'],
 ['Pourcentages','Piège','Une valeur augmente de 20 %, puis diminue de 20 %. Quelle affirmation est correcte ?','Elle finit 4 % en dessous de sa valeur initiale',['Elle revient exactement à sa valeur initiale','Elle finit 4 % au-dessus de sa valeur initiale','Elle diminue de 20 % au total'],'Les coefficients 1,20 et 0,80 donnent 0,96 : la valeur finale représente 96 % de la valeur initiale.'],
 ['Vitesses','Méthode','Deux véhicules se rapprochent l’un de l’autre à 70 km/h et 50 km/h. Quelle vitesse relative faut-il retenir ?','120 km/h',['20 km/h','60 km/h','3 500 km/h'],'Lorsqu’ils se rapprochent, les distances parcourues s’additionnent : la vitesse relative est 70 + 50.'],
 ['Moyennes','Piège','Pour calculer une moyenne de notes lorsque les coefficients sont différents, quelle opération est indispensable ?','Pondérer chaque note par son coefficient',['Additionner les notes puis diviser par deux','Retenir uniquement la meilleure note','Faire la moyenne des coefficients'],'Une moyenne pondérée est la somme des produits note × coefficient divisée par la somme des coefficients.'],
 ['Intérêts','Distinction','Quelle différence fondamentale sépare les intérêts simples des intérêts composés ?','Les intérêts composés produisent eux-mêmes des intérêts',['Les intérêts simples utilisent toujours un taux plus élevé','Les intérêts composés ne dépendent pas du temps','Les intérêts simples exigent une mensualité'],'En intérêts composés, chaque période applique le taux au capital déjà augmenté des intérêts antérieurs.'],
 ['Conversions','Réflexe','Avant d’utiliser distance = vitesse × temps, que faut-il vérifier en priorité ?','La compatibilité des unités',['La parité des nombres','Le nombre de chiffres après la virgule','L’ordre alphabétique des données'],'Une vitesse en km/h ne peut être combinée directement avec un temps en minutes sans conversion.'],
 ['Tableaux et graphiques','Lecture','Un graphique annonce des valeurs « en milliers ». Une barre atteint 38. Quelle valeur réelle représente-t-elle ?','38 000',['38','380','3 800'],'La mention « en milliers » signifie que chaque unité lue doit être multipliée par 1 000.'],
 ['Ordre de grandeur','Contrôle','Après un calcul, quel contrôle permet le mieux de repérer une erreur grossière ?','Comparer le résultat à un ordre de grandeur attendu',['Compter uniquement les décimales','Refaire le calcul avec les mêmes étapes','Choisir la réponse la plus longue'],'Un ordre de grandeur révèle immédiatement un résultat impossible, même si les opérations semblent correctement posées.']
].forEach(x=>add('A',...x));
[[3,12,7],[5,20,9],[8,14,18],[6,27,10]].forEach(([a,b,c])=>{const correct=b*c/a;add('A','Proportionnalité','Application',`${a} dossiers nécessitent ${b} minutes à traiter à rythme constant. Combien de minutes faut-il pour ${c} dossiers ?`,correct,nw(correct,[b*c,correct/a,correct+a]),`Le temps par dossier vaut ${b}/${a}. Pour ${c} dossiers : ${b} × ${c} ÷ ${a} = ${correct} minutes.`)});
[[6,18,9],[8,15,12],[10,24,16],[14,20,8]].forEach(([workers,days,newWorkers])=>{const correct=workers*days/newWorkers;add('A','Proportionnalité inverse','Application',`${workers} agents accomplissent une mission en ${days} jours. À rendement identique, combien de jours faudra-t-il à ${newWorkers} agents ?`,correct,nw(correct,[days*newWorkers/workers,days+(newWorkers-workers),workers*days]),`La quantité de travail est fixe : ${workers} × ${days} = ${workers*days} journées-agent, puis ${workers*days} ÷ ${newWorkers} = ${correct} jours.`)});
[[240,15,'hausse'],[480,25,'baisse'],[1250,8,'hausse'],[360,30,'baisse'],[840,12.5,'hausse']].forEach(([base,p,dir])=>{const correct=dir==='hausse'?base*(1+p/100):base*(1-p/100);add('A','Pourcentages','Application',`Une valeur de ${base} subit une ${dir} de ${p} %. Quelle est sa nouvelle valeur ?`,correct,nw(correct,[base*p/100,base+(dir==='hausse'?p:-p),base]),`On multiplie ${base} par ${dir==='hausse'?`1 + ${p}/100`:`1 − ${p}/100`}, soit ${correct}.`)});
[[150,75],[210,70],[96,48],[180,90]].forEach(([dist,speed])=>{const h=dist/speed,correct=Number.isInteger(h)?`${h} h`:`${h*60} min`;add('A','Vitesses, temps et distances','Application',`Un véhicule parcourt ${dist} km à vitesse constante de ${speed} km/h. Combien de temps dure le trajet ?`,correct,[`${dist*speed} h`,`${speed/dist} h`,`${dist/speed+1} h`],`Le temps est la distance divisée par la vitesse : ${dist} ÷ ${speed} = ${h} heure(s), soit ${correct}.`)});
[[[12,2],[16,3]],[[8,1],[14,4]],[[10,3],[18,2]]].forEach((pairs)=>{const sum=pairs.reduce((s,[v,w])=>s+v*w,0),weights=pairs.reduce((s,[,w])=>s+w,0),correct=sum/weights;add('A','Moyennes pondérées','Application',`Une valeur de ${pairs[0][0]} a un coefficient ${pairs[0][1]} et une valeur de ${pairs[1][0]} un coefficient ${pairs[1][1]}. Quelle est la moyenne pondérée ?`,correct,nw(correct,[(pairs[0][0]+pairs[1][0])/2,sum,weights]),`La somme pondérée vaut ${sum} et la somme des coefficients ${weights}. La moyenne est ${sum} ÷ ${weights} = ${correct}.`)});
[[1000,4,3],[2500,3,2],[800,5,4]].forEach(([capital,rate,years])=>{const correct=capital*rate/100*years;add('A','Intérêts simples','Application',`Un capital de ${capital} € est placé à intérêts simples au taux annuel de ${rate} % pendant ${years} ans. Quel montant total d’intérêts produit-il ?`,`${correct} €`,nw(correct,[capital*(1+rate/100)**years-capital,capital*rate/100,capital+correct]).map(x=>`${x} €`),`En intérêts simples : ${capital} × ${rate/100} × ${years} = ${correct} €.`)});
[
 ['2,4 km','2 400 m',['240 m','24 000 m','0,24 m'],'Un kilomètre vaut 1 000 mètres : 2,4 × 1 000 = 2 400.'],
 ['3 h 25 min','205 min',['185 min','325 min','225 min'],'Trois heures représentent 180 minutes ; 180 + 25 = 205.'],
 ['0,75 L','750 mL',['75 mL','7 500 mL','0,075 mL'],'Un litre vaut 1 000 millilitres : 0,75 × 1 000 = 750.'],
 ['18 m/s','64,8 km/h',['5 km/h','50 km/h','180 km/h'],'Pour passer de m/s à km/h, on multiplie par 3,6 : 18 × 3,6 = 64,8.']
].forEach(([from,correct,wrong,why])=>add('A','Conversions','Application',`Quelle conversion de ${from} est correcte ?`,correct,wrong,why));
[
 ['Un tableau indique 120 inscrits en janvier et 150 en février. Quelle est l’augmentation en pourcentage ?','25 %',['20 %','30 %','125 %'],'L’augmentation est de 30 sur une base de 120 : 30 ÷ 120 = 25 %.'],
 ['Dans un diagramme circulaire, une catégorie occupe 90°. Quelle part du total représente-t-elle ?','25 %',['9 %','40 %','90 %'],'Un cercle mesure 360°. La part vaut 90 ÷ 360 = 1/4, soit 25 %.'],
 ['Un axe vertical commence à 90 au lieu de 0. Quel risque principal faut-il identifier ?','Une faible variation peut paraître visuellement spectaculaire',['Les valeurs deviennent nécessairement fausses','Le graphique ne peut plus comporter de légende','Toutes les barres deviennent proportionnelles à zéro'],'Un axe tronqué amplifie visuellement les écarts ; il faut donc lire les valeurs et pas seulement la forme.']
].forEach(([p,c,w,e])=>add('A','Tableaux et graphiques','Interprétation',p,c,w,e));

// B — 30 questions
[
 ['Tous les archivistes sont méthodiques. Léa est archiviste. Quelle conclusion est nécessaire ?','Léa est méthodique',['Léa est la seule personne méthodique','Toute personne méthodique est archiviste','Aucun archiviste n’est méthodique'],'L’appartenance de Léa au groupe des archivistes entraîne la propriété attribuée à tous les archivistes.'],
 ['Aucun dossier incomplet n’est recevable. Ce dossier est recevable. Que peut-on conclure ?','Ce dossier n’est pas incomplet',['Ce dossier est nécessairement prioritaire','Tous les dossiers recevables sont complets au même degré','Aucun dossier complet n’est recevable'],'Si aucun dossier incomplet n’est recevable, un dossier recevable ne peut appartenir au groupe des dossiers incomplets.'],
 ['Certains agents sont juristes. Tous les juristes maîtrisent le droit public. Quelle conclusion est certaine ?','Certains agents maîtrisent le droit public',['Tous les agents sont juristes','Tous ceux qui maîtrisent le droit public sont agents','Aucun agent ne maîtrise le droit public'],'Les agents qui sont juristes appartiennent aussi au groupe de ceux qui maîtrisent le droit public.'],
 ['Tous les A sont B. Certains B sont C. Peut-on conclure que certains A sont C ?','Non, l’intersection entre A et C n’est pas garantie',['Oui, nécessairement','Oui, car tous les C sont A','Non, car aucun B ne peut être C'],'Les éléments de B qui sont C peuvent être extérieurs au sous-ensemble A.'],
 ['Aucun A n’est B. Certains C sont A. Quelle conclusion est nécessaire ?','Certains C ne sont pas B',['Tous les C sont B','Aucun C n’est A','Certains B sont A'],'Les C qui appartiennent à A ne peuvent appartenir à B puisque A et B sont disjoints.'],
 ['Tous les contrôleurs sont attentifs. Aucun inattentif n’est attentif. Quelle conclusion est valide ?','Aucun contrôleur n’est inattentif',['Tous les attentifs sont contrôleurs','Certains contrôleurs sont inattentifs','Aucun attentif n’est contrôleur'],'Les contrôleurs sont dans l’ensemble des attentifs, lequel est incompatible avec les inattentifs.'],
 ['Certains candidats ne sont pas admissibles. Quelle conclusion peut-on tirer avec certitude ?','Au moins un candidat n’est pas admissible',['Aucun candidat n’est admissible','La majorité des candidats n’est pas admissible','Tous les admissibles sont candidats'],'« Certains » affirme seulement l’existence d’au moins un cas, sans renseigner sur la majorité ni sur tous les autres.'],
 ['Tous les X sont Y et tous les Y sont Z. Quelle relation découle nécessairement ?','Tous les X sont Z',['Tous les Z sont X','Aucun X n’est Z','Certains Z ne sont pas Y'],'L’inclusion est transitive : X est inclus dans Y, lui-même inclus dans Z.'],
 ['Certains A sont B et aucun B n’est C. Quelle conclusion est certaine ?','Certains A ne sont pas C',['Tous les A sont C','Aucun A n’est B','Tous les C sont B'],'Les A qui sont B ne peuvent être C puisque B et C sont incompatibles.'],
 ['Aucun musicien n’est silencieux en répétition. Paul est silencieux en répétition. Que sait-on ?','Paul n’est pas musicien',['Paul est musicien débutant','Paul n’aime pas la musique','Tous les non-musiciens sont silencieux'],'La propriété observée exclut Paul du groupe des musiciens décrit par la prémisse.']
].forEach(([p,c,w,e])=>add('B','Syllogismes et déductions','Déduction',p,c,w,e));
[
 ['Si le serveur est arrêté, le site est indisponible. Le site est disponible. Quelle déduction est valide ?','Le serveur n’est pas arrêté',['Le serveur est arrêté','Le site sera indisponible demain','Aucun serveur ne fonctionne'],'C’est la contraposée : si l’arrêt implique l’indisponibilité, la disponibilité exclut l’arrêt.'],
 ['Si A alors B. B est vrai. Peut-on conclure A ?','Non, B peut avoir une autre cause',['Oui, toujours','Oui, si A est faux','Non, car B est nécessairement faux'],'Affirmer le conséquent ne permet pas d’affirmer l’antécédent : c’est le piège de la réciproque.'],
 ['Si un dossier est urgent, il est traité aujourd’hui. Il n’est pas traité aujourd’hui. Que peut-on conclure ?','Il n’est pas urgent',['Il est urgent','Il sera traité hier','Tous les dossiers sont urgents'],'La contraposée de « urgent ⇒ traité aujourd’hui » est « non traité aujourd’hui ⇒ non urgent ».'],
 ['« La porte s’ouvre seulement si le badge est valide. » Quelle reformulation est correcte ?','Si la porte s’ouvre, alors le badge est valide',['Si le badge est valide, la porte s’ouvre nécessairement','La porte s’ouvre même sans badge valide','Aucun badge valide n’ouvre la porte'],'« P seulement si Q » signifie P ⇒ Q : l’ouverture exige la validité, sans garantir que celle-ci suffise.'],
 ['Une règle affirme : « Si le voyant est rouge, il y a une alerte. » Le voyant n’est pas rouge. Quelle conclusion est justifiée ?','Aucune conclusion certaine sur l’existence d’une alerte',['Il n’y a aucune alerte','Il y a nécessairement une alerte','Le voyant est forcément vert'],'L’absence de voyant rouge n’exclut pas une alerte signalée autrement. Nier l’antécédent est invalide.'],
 ['Quelle proposition est logiquement équivalente à « Tous les dossiers signés sont valides » ?','Aucun dossier signé n’est invalide',['Tous les dossiers valides sont signés','Aucun dossier valide n’est signé','Certains dossiers non signés sont invalides'],'Dire que les signés sont tous valides revient à exclure l’existence d’un dossier à la fois signé et invalide.']
].forEach(([p,c,w,e])=>add('B','Implications','Piège logique',p,c,w,e));
[
 ['Thermomètre est à température ce que balance est à…','poids',['vitesse','distance','temps'],'Le premier objet mesure la première grandeur ; la balance mesure le poids.'],
 ['Boussole est à direction ce que chronomètre est à…','durée',['masse','surface','couleur'],'La relation est instrument → grandeur mesurée.'],
 ['Architecte est à plan ce que compositeur est à…','partition',['pinceau','roman','sculpture'],'La relation unit le créateur à la représentation écrite qui guide son œuvre.'],
 ['Clé est à serrure ce que mot de passe est à…','compte',['écran','clavier','message'],'La clé permet l’accès à une serrure ; le mot de passe permet l’accès à un compte.'],
 ['Quel mot est l’intrus : triangle, carré, cercle, cube ?','cube',['triangle','carré','cercle'],'Le cube est un solide en trois dimensions ; les trois autres sont des figures planes.'],
 ['Quel mot est l’intrus : lundi, jeudi, octobre, dimanche ?','octobre',['lundi','jeudi','dimanche'],'Octobre est un mois ; les autres éléments sont des jours de la semaine.'],
 ['Généreux est à avare ce que courageux est à…','lâche',['brave','prudent','fort'],'La relation est une opposition de sens : le contraire de courageux est lâche.'],
 ['Chapitre est à livre ce que scène est à…','pièce de théâtre',['acteur','public','costume'],'La relation est partie → ensemble : une scène compose une pièce de théâtre.']
].forEach(([p,c,w,e])=>add('B','Analogies et intrus','Relation verbale',p,c,w,e));
[
 ['Nora arrive avant Léo, qui arrive avant Inès. Qui arrive nécessairement en premier ?','Nora',['Léo','Inès','Impossible à déterminer'],'La chaîne Nora < Léo < Inès place nécessairement Nora en tête.'],
 ['Le contrôle a lieu après la réunion mais avant le déjeuner. Quel ordre est correct ?','Réunion → contrôle → déjeuner',['Contrôle → réunion → déjeuner','Réunion → déjeuner → contrôle','Déjeuner → contrôle → réunion'],'Les deux relations temporelles imposent la réunion avant le contrôle, puis le déjeuner.'],
 ['Une panne survient, puis l’alarme retentit. Peut-on en conclure que la panne a causé l’alarme ?','Non, la succession ne prouve pas à elle seule la causalité',['Oui, toute succession est causale','Oui, car l’alarme précède la panne','Non, car deux événements ne peuvent jamais être liés'],'L’ordre temporel est compatible avec une causalité mais ne suffit pas à la démontrer sans information supplémentaire.'],
 ['A est plus ancien que B. C est plus récent que B. Quelle affirmation est certaine ?','A est plus ancien que C',['C est plus ancien que A','A et C ont le même âge','B est plus ancien que A'],'A précède B, et B précède C : A est donc plus ancien que C.'],
 ['L’absence d’une information dans un énoncé permet-elle de conclure que cette information est fausse ?','Non, elle peut simplement être inconnue',['Oui, toujours','Oui, si l’énoncé est court','Non, car toute information absente est vraie'],'En logique, ne pas savoir qu’une proposition est vraie ne signifie pas savoir qu’elle est fausse.'],
 ['Trois rapports sont classés du plus court au plus long. X est plus long que Y, et Z est plus court que Y. Quel ordre obtient-on ?','Z → Y → X',['X → Y → Z','Y → Z → X','Z → X → Y'],'Z est inférieur à Y, lui-même inférieur à X.']
].forEach(([p,c,w,e])=>add('B','Relations et chronologie','Organisation logique',p,c,w,e));

// C — 30 questions
const moves=[
 [[['E',3],['N',2],['O',1]],2,2],[[['N',4],['E',2],['S',1]],2,3],
 [[['O',2],['S',3],['E',5]],3,-3],[[['S',2],['E',4],['N',5]],4,3],
 [[['E',1],['N',1],['E',2],['S',4]],3,-3],[[['N',3],['O',4],['S',2],['E',1]],-3,1],
 [[['O',5],['N',2],['E',3],['S',1]],-2,1],[[['S',4],['E',6],['N',2],['O',1]],5,-2],
 [[['N',2],['E',2],['S',2],['O',2]],0,0],[[['E',7],['O',3],['N',4],['S',1]],4,3]
];
moves.forEach(([seq,x,y])=>{const dir={N:'le nord',S:'le sud',E:'l’est',O:'l’ouest'},desc=seq.map(([d,n])=>`${n} case${n>1?'s':''} vers ${dir[d]}`).join(', puis '),correct=`(${x} ; ${y})`,alts=[[y,x],[-x,y],[x,-y],[-x,-y],[x+1,y],[x,y+1],[1,1],[-1,0]].map(([a,b])=>`(${a} ; ${b})`);add('C','Positions et déplacements','Application',`Depuis l’origine (0 ; 0), on se déplace de ${desc}. Quelle est la position finale ?`,correct,alts,`Les déplacements est-ouest déterminent x et nord-sud déterminent y. Le bilan donne ${correct}.`)});
[
 ['↑','90° horaire','→',['←','↓','↑'],'Une rotation de 90° horaire transforme le nord en est.'],
 ['→','180°','←',['↑','↓','→'],'Un demi-tour inverse la direction : l’est devient l’ouest.'],
 ['↓','90° antihoraire','→',['←','↑','↓'],'En tournant de 90° vers la gauche, le sud devient l’est.'],
 ['←','270° horaire','↓',['↑','→','←'],'270° horaire équivalent à 90° antihoraire : l’ouest devient le sud.'],
 ['↗','90° horaire','↘',['↖','↙','↗'],'La diagonale nord-est devient sud-est après un quart de tour horaire.'],
 ['↙','180°','↗',['↖','↘','↙'],'Un demi-tour remplace chaque direction par son opposée.'],
 ['↖','90° antihoraire','↙',['↗','↘','↖'],'Un quart de tour antihoraire déplace nord-ouest vers sud-ouest.'],
 ['↘','270° antihoraire','↙',['↗','↖','↘'],'270° antihoraire équivalent à 90° horaire : sud-est devient sud-ouest.']
].forEach(([arrow,rot,c,w,e])=>add('C','Rotations et symétries','Transformation',`Que devient la flèche ${arrow} après une rotation de ${rot} ?`,c,w,e));
[
 [[2,5,7],[4,3,7],6,1,7],[[3,6,18],[5,4,20],7,3,21],
 [[9,4,5],[12,7,5],15,6,9],[[2,3,6],[4,5,20],6,7,42],
 [[1,4,5],[3,7,10],5,9,14],[[8,2,6],[18,3,15],28,4,24]
].forEach(([r1,r2,a,b,c])=>{let rule,why;if(r1[2]===r1[0]+r1[1]&&r2[2]===r2[0]+r2[1]){rule='la troisième case est la somme des deux premières';why=`${a} + ${b} = ${c}`}else if(r1[2]===r1[0]*r1[1]&&r2[2]===r2[0]*r2[1]){rule='la troisième case est le produit des deux premières';why=`${a} × ${b} = ${c}`}else{rule='la troisième case est la différence entre la première et la deuxième';why=`${a} − ${b} = ${c}`}add('C','Matrices','Règle visuelle',`Dans chaque ligne, ${rule}. Ligne à compléter : ${a} | ${b} | ?`,c,nw(c,[a+b,a*b,Math.abs(a-b)]),why+'.')});
[
 ['Un cube peint sur toutes ses faces est découpé en 27 petits cubes identiques. Combien de petits cubes n’ont aucune face peinte ?','1',['0','6','8'],'Seul le cube central ne touche aucune face extérieure. Dans un découpage 3×3×3, il y en a (3−2)³ = 1.'],
 ['Un cube peint sur toutes ses faces est découpé en 8 petits cubes identiques. Combien ont exactement trois faces peintes ?','8',['4','6','12'],'Dans un découpage 2×2×2, chaque petit cube occupe un coin et possède donc trois faces extérieures peintes.'],
 ['Sur un cube, deux faces opposées peuvent-elles partager une arête ?','Non, jamais',['Oui, toujours','Oui, seulement après rotation','Oui, si elles portent la même couleur'],'Deux faces opposées sont parallèles et séparées ; une arête relie nécessairement deux faces adjacentes.'],
 ['Lorsqu’un patron de cube est plié, quel indice est le plus fiable pour repérer deux faces opposées ?','Suivre leur position relative à travers les plis',['Comparer uniquement leurs couleurs','Compter leurs lettres dans l’alphabet','Observer leur taille apparente sur le dessin'],'Les oppositions dépendent de la structure du patron et des plis, pas de la couleur ni de la perspective dessinée.'],
 ['Une vue de dessus d’un empilement indique deux cases occupées. Que ne permet-elle pas de connaître à elle seule ?','Le nombre exact de cubes superposés sur chaque case',['Les positions horizontales occupées','Le nombre de colonnes visibles','L’alignement des cases au sol'],'La vue de dessus masque les hauteurs : plusieurs cubes peuvent être empilés dans une même colonne.'],
 ['Pour vérifier mentalement une rotation 3D, quelle stratégie réduit le plus les erreurs ?','Choisir un repère distinctif et suivre sa position face par face',['Regarder seulement la silhouette globale','Changer simultanément plusieurs axes de référence','Ignorer les faces cachées'],'Un repère stable permet de suivre l’orientation sans confondre rotation, miroir et changement de point de vue.']
].forEach(([p,c,w,e])=>add('C','Raisonnement spatial 3D','Visualisation',p,c,w,e));

// D — 25 questions
[
 ['Dans une file de 31 personnes, Lina est exactement au milieu. Quelle est sa position en partant du début ?','16e',['15e','17e','31e'],'Avec 15 personnes devant et 15 derrière, Lina occupe la 16e place.'],
 ['Marc est 8e en partant du début et 12e en partant de la fin. Combien de personnes compte la file ?','19',['20','18','96'],'On additionne les deux rangs puis on retire Marc compté deux fois : 8 + 12 − 1 = 19.'],
 ['Une personne est 14e sur 40 en partant du début. Quel est son rang en partant de la fin ?','27e',['26e','28e','54e'],'Le rang depuis la fin vaut 40 − 14 + 1 = 27.'],
 ['Emma est devant Noé mais derrière Jade. Quel ordre est imposé ?','Jade → Emma → Noé',['Emma → Jade → Noé','Noé → Emma → Jade','Jade → Noé → Emma'],'Jade précède Emma, qui précède Noé.'],
 ['Dans un classement, Paul gagne trois places et passe 7e. Quelle était sa position initiale ?','10e',['4e','7e','11e'],'Gagner trois places fait diminuer le numéro du rang : il était 7 + 3 = 10e.'],
 ['Chloé est 5e. Deux personnes placées devant elle quittent la file. Quel devient son rang ?','3e',['5e','7e','2e'],'Deux départs devant elle la font avancer de deux rangs : 5 − 2 = 3.'],
 ['Dans une file, Amir a 9 personnes devant lui et 6 derrière lui. Combien y a-t-il de personnes ?','16',['15','17','54'],'Il faut compter les 9 devant, Amir lui-même et les 6 derrière : 9 + 1 + 6 = 16.']
].forEach(([p,c,w,e])=>add('D','Files et classements','Application',p,c,w,e));
const days=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
[['mardi',10],['vendredi',17],['dimanche',15],['mercredi',22],['samedi',9],['lundi',30]].forEach(([start,n])=>{const correct=days[(days.indexOf(start)+n)%7];add('D','Calendriers','Cycle',`Si aujourd’hui est ${start}, quel jour sera-t-on dans ${n} jours ?`,correct,days.filter(x=>x!==correct).slice(0,3),`${n} laisse un reste de ${n%7} dans une division par 7. On avance donc de ${n%7} jour(s) à partir de ${start}.`)});
[
 ['Une réunion commence à 9 h 35 et dure 1 h 50. À quelle heure se termine-t-elle ?','11 h 25',['10 h 85','11 h 15','12 h 25'],'9 h 35 + 1 h = 10 h 35, puis + 50 min = 11 h 25.'],
 ['Un délai de 72 heures commence un lundi à 14 h. Quand s’achève-t-il ?','Jeudi à 14 h',['Mercredi à 14 h','Jeudi à 2 h','Vendredi à 14 h'],'72 heures correspondent exactement à trois jours : lundi + 3 jours = jeudi, à la même heure.']
].forEach(([p,c,w,e])=>add('D','Horaires','Calcul de durée',p,c,w,e));
[
 ['A doit précéder B, et C doit avoir lieu après B. Quel ordre est obligatoire ?','A → B → C',['B → A → C','C → B → A','A → C → B'],'Les deux contraintes forment une chaîne : A avant B, puis B avant C.'],
 ['Quatre tâches durent chacune une heure. A et B ne peuvent pas être simultanées. Quelle information manque pour déterminer un planning unique ?','Les autres contraintes d’ordre ou de ressources',['Le nom complet des tâches','La couleur du planning','Le jour de naissance des agents'],'Une seule incompatibilité autorise plusieurs organisations ; il faut davantage de contraintes pour obtenir une solution unique.'],
 ['A dure 2 h et doit être terminée avant B, qui dure 1 h. Si A commence à 8 h sans interruption, quelle heure de début la plus précoce pour B ?','10 h',['8 h','9 h','11 h'],'A occupe la période 8 h–10 h ; B peut commencer à 10 h.'],
 ['Deux tâches indépendantes durent 3 h et 2 h et peuvent être réalisées simultanément par deux agents. Quelle durée minimale faut-il prévoir ?','3 h',['5 h','2 h','6 h'],'En parallèle, la durée totale est celle de la tâche la plus longue, soit 3 heures.'],
 ['Deux tâches durent 3 h et 2 h mais doivent être réalisées successivement par le même agent. Quelle durée minimale faut-il prévoir ?','5 h',['3 h','2 h','6 h'],'Sans chevauchement possible, les durées s’additionnent : 3 + 2 = 5 heures.'],
 ['B doit commencer après la fin de A. C peut se dérouler pendant A. Quel schéma réduit le plus la durée totale ?','Faire C en parallèle de A, puis B',['Faire A, puis C, puis B','Faire B avant A','Attendre la fin de B pour commencer A'],'C n’a pas de dépendance avec A et peut donc être parallélisée, tandis que B reste bloquée par A.'],
 ['Dans un planning, quelle tâche faut-il placer en priorité ?','Une tâche dont plusieurs autres dépendent',['La tâche au nom le plus court','La tâche la moins importante','Une tâche sans aucune contrainte'],'Une tâche située en amont de plusieurs dépendances peut bloquer tout le planning si elle est retardée.'],
 ['Un planning respecte toutes les contraintes mais comporte une longue période inutilisée. Quel contrôle effectuer ?','Chercher si des tâches indépendantes peuvent être parallélisées',['Supprimer une contrainte au hasard','Allonger toutes les tâches','Changer seulement les couleurs du tableau'],'Les temps morts peuvent souvent être réduits en exécutant simultanément les tâches sans dépendance commune.'],
 ['Pourquoi un tableau ou un diagramme simplifié est-il utile dans un problème d’organisation ?','Il rend visibles les incompatibilités et les dépendances',['Il remplace toutes les données numériques','Il garantit qu’une seule solution existe','Il dispense de vérifier la réponse'],'La représentation externe réduit la charge mentale et permet de contrôler l’ensemble des contraintes.'],
 ['A précède B ; D précède B ; C vient après B. Quelles tâches peuvent être réalisées en parallèle au début ?','A et D',['B et C','A et C','C et D'],'A et D n’ont pas de relation d’ordre entre elles mais doivent toutes deux précéder B.']
].forEach(([p,c,w,e])=>add('D','Emplois du temps','Contraintes',p,c,w,e));

// E — 30 questions
[
 ['2 ; 5 ; 8 ; 11 ; ?','14',['13','15','22'],'La suite ajoute constamment 3.'],
 ['3 ; 6 ; 12 ; 24 ; ?','48',['30','36','42'],'Chaque terme est le double du précédent.'],
 ['1 ; 4 ; 9 ; 16 ; ?','25',['20','24','32'],'Les termes sont les carrés successifs : 1², 2², 3², 4², puis 5².'],
 ['2 ; 6 ; 12 ; 20 ; ?','30',['28','32','40'],'Les termes valent n(n+1) : 1×2, 2×3, 3×4, 4×5, puis 5×6.'],
 ['5 ; 9 ; 17 ; 33 ; ?','65',['49','64','66'],'Chaque terme est obtenu en doublant le précédent puis en retranchant 1.'],
 ['100 ; 50 ; 25 ; 12,5 ; ?','6,25',['5','7,5','10'],'Chaque terme est divisé par 2.'],
 ['1 ; 2 ; 4 ; 7 ; 11 ; ?','16',['15','17','22'],'Les écarts sont +1, +2, +3, +4, puis +5.'],
 ['4 ; 7 ; 14 ; 17 ; 34 ; ?','37',['51','68','31'],'Les opérations alternent +3 puis ×2. Après 34, on ajoute 3.'],
 ['81 ; 27 ; 9 ; 3 ; ?','1',['0','2','6'],'Chaque terme est divisé par 3.'],
 ['7 ; 10 ; 8 ; 11 ; 9 ; ?','12',['10','13','18'],'Les opérations alternent +3 puis −2.'],
 ['2 ; 3 ; 5 ; 8 ; 13 ; ?','21',['18','20','26'],'Chaque terme est la somme des deux précédents.'],
 ['64 ; 32 ; 16 ; 8 ; ?','4',['2','6','12'],'Chaque terme est la moitié du précédent.']
].forEach(([seq,c,w,e])=>add('E','Suites numériques','Complétion',`Quel nombre complète la suite : ${seq}`,c,w,e));
[
 ['A ; C ; F ; J ; O ; ?','U',['T','V','W'],'Les déplacements augmentent : +2, +3, +4, +5, puis +6. O avancé de 6 lettres donne U.'],
 ['Z ; W ; T ; Q ; ?','N',['M','O','P'],'On recule de trois lettres à chaque étape.'],
 ['B ; D ; G ; K ; P ; ?','V',['U','W','X'],'Les écarts sont +2, +3, +4, +5, puis +6 : P + 6 = V.'],
 ['A ; Z ; B ; Y ; C ; ?','X',['D','W','Z'],'Deux suites s’entrelacent : A, B, C croît tandis que Z, Y, X décroît.'],
 ['C ; F ; I ; L ; ?','O',['N','P','R'],'On avance de trois lettres à chaque terme.'],
 ['M ; K ; I ; G ; ?','E',['D','F','H'],'On recule de deux lettres à chaque terme.'],
 ['A ; D ; H ; M ; ?','S',['R','T','U'],'Les écarts sont +3, +4, +5, puis +6 : M + 6 = S.'],
 ['E ; J ; O ; T ; ?','Y',['X','Z','A'],'On avance de cinq lettres à chaque terme, sans dépasser Z ici.']
].forEach(([seq,c,w,e])=>add('E','Suites alphabétiques','Complétion',`Quelle lettre complète la suite : ${seq}`,c,w,e));
[
 ['Médecin est à patient ce que avocat est à…','client',['juge','loi','tribunal'],'La relation est professionnel → personne qu’il conseille ou soigne.'],
 ['Oiseau est à nid ce que abeille est à…','ruche',['miel','fleur','aile'],'La relation est animal → habitat construit ou occupé.'],
 ['Graine est à plante ce que œuf est à…','animal',['plume','nid','coquille'],'La relation est forme initiale → organisme qui se développe.'],
 ['Minute est à heure ce que centimètre est à…','mètre',['kilomètre','seconde','litre'],'La relation est sous-unité → unité supérieure correspondante.'],
 ['Livre est à bibliothèque ce que œuvre est à…','musée',['artiste','cadre','peinture'],'La relation est objet conservé → lieu de collection.'],
 ['Question est à réponse ce que problème est à…','solution',['erreur','doute','calcul'],'La relation est demande ou difficulté → élément qui la résout.']
].forEach(([p,c,w,e])=>add('E','Analogies','Relation',p,c,w,e));
[
 ['Dans chaque ligne : 2, 3, 6 ; 4, 5, 20 ; 6, 7, ?. Quel nombre manque ?','42',['13','35','48'],'La troisième valeur est le produit des deux premières : 6 × 7 = 42.'],
 ['Dans chaque ligne : 9, 4, 5 ; 13, 6, 7 ; 18, 8, ?. Quel nombre manque ?','10',['26','11','9'],'La troisième valeur est la différence entre la première et la deuxième : 18 − 8 = 10.'],
 ['Une matrice suit la règle : la troisième case superpose les symboles des deux premières sans conserver les symboles communs. Que faut-il examiner ?','Les éléments présents dans une seule des deux cases',['Uniquement la couleur du fond','Le nombre de lignes de la matrice','L’ordre alphabétique des formes'],'La règle décrite est une différence symétrique : les éléments présents deux fois disparaissent, les autres restent.'],
 ['Dans une matrice, une règle fonctionne sur la première ligne mais pas sur les autres. Quel réflexe adopter ?','Rejeter cette règle et en chercher une valable partout',['Conserver la règle malgré les exceptions','Modifier les valeurs qui gênent','Choisir l’option la plus proche'],'Une règle de matrice doit expliquer de façon cohérente toutes les lignes ou colonnes utilisées comme référence.']
].forEach(([p,c,w,e])=>add('E','Matrices et structures','Analyse',p,c,w,e));

// F — 25 questions
[
 ['Trois personnes, Ana, Bilal et Chloé, choisissent rouge, bleu et vert. Ana ne choisit pas rouge. Bilal choisit bleu. Chloé ne choisit pas vert. Quelle couleur choisit Ana ?','vert',['rouge','bleu','Impossible à déterminer'],'Bilal prend bleu. Chloé ne peut prendre ni bleu ni vert, donc prend rouge. Il reste vert pour Ana.'],
 ['Trois bureaux sont numérotés 1, 2 et 3. Léa n’est ni au 1 ni au 3. Où est-elle ?','Au bureau 2',['Au bureau 1','Au bureau 3','Impossible à déterminer'],'L’exclusion des bureaux 1 et 3 ne laisse que le bureau 2.'],
 ['Paul, Rania et Sami arrivent à des heures différentes : 8 h, 9 h et 10 h. Paul arrive avant Rania. Sami arrive à 8 h. À quelle heure arrive Paul ?','9 h',['8 h','10 h','Impossible à déterminer'],'Sami occupe 8 h. Paul doit être avant Rania parmi 9 h et 10 h : Paul arrive donc à 9 h.'],
 ['Quatre dossiers A, B, C, D sont classés. A précède B. D précède A. C vient après B. Quel dossier est premier ?','D',['A','B','C'],'Les contraintes forment D → A → B → C.'],
 ['Trois animaux sont un chat, un chien et un poisson. Zoé n’a pas le chat. Yanis a un animal qui vit dans l’eau. Inès n’a pas le chien. Quel animal a Yanis ?','Le poisson',['Le chat','Le chien','Impossible à déterminer'],'Parmi les trois animaux, seul le poisson vit dans l’eau.'],
 ['Un code utilise une fois chacun des chiffres 2, 4 et 7. Le 7 est avant le 2, et le 4 après le 2. Quel est le code ?','724',['742','274','247'],'Les contraintes imposent l’ordre 7 avant 2 avant 4.'],
 ['A, B et C occupent trois étages. A est au-dessus de B. C est au-dessous de B. Quel ordre du haut vers le bas est correct ?','A, B, C',['C, B, A','B, A, C','A, C, B'],'A est au-dessus de B, lui-même au-dessus de C.'],
 ['Quatre réunions ont lieu lundi, mardi, mercredi, jeudi. X est mardi. Y a lieu après X mais avant Z. Quel jour est nécessairement celui de Y ?','Mercredi',['Lundi','Mardi','Jeudi'],'Après mardi et avant Z, Y ne peut être que mercredi, ce qui place Z jeudi.'],
 ['Trois livres sont rouge, jaune et noir. Le livre d’histoire n’est pas rouge. Le livre de droit est noir. Le livre de philosophie n’est pas jaune. Quelle couleur a le livre d’histoire ?','jaune',['rouge','noir','Impossible à déterminer'],'Le droit prend noir. L’histoire ne peut être rouge ni noir, donc il est jaune.'],
 ['Dans une grille de déduction, une catégorie ne possède plus qu’une seule case possible. Que faut-il faire ?','Valider cette case et éliminer la même valeur ailleurs',['Effacer toutes les exclusions','Laisser la ligne inchangée','Valider toutes les cases restantes'],'L’unicité permet une attribution certaine, qui entraîne de nouvelles exclusions dans les autres lignes et colonnes.']
].forEach(([p,c,w,e])=>add('F','Tableaux de déduction','Contraintes',p,c,w,e));
[
 ['La sœur de mon père est ma…','tante',['cousine','nièce','belle-sœur'],'La sœur d’un parent est une tante.'],
 ['Le fils de la sœur de ma mère est mon…','cousin',['neveu','oncle','frère'],'La sœur de la mère est une tante ; son fils est donc un cousin.'],
 ['La mère de mon père est ma…','grand-mère paternelle',['tante maternelle','belle-mère','sœur'],'La mère du père est une grand-mère du côté paternel.'],
 ['Le frère de ma fille est mon…','fils',['neveu','oncle','cousin'],'Les enfants d’une même personne sont frère et sœur ; le frère de ma fille est donc mon fils.'],
 ['La fille de mon frère est ma…','nièce',['cousine','tante','petite-fille'],'L’enfant de mon frère est ma nièce si c’est une fille.'],
 ['Le mari de la sœur de ma mère est mon…','oncle par alliance',['cousin','beau-frère','grand-père'],'La sœur de ma mère est ma tante ; son mari est mon oncle par alliance.'],
 ['Pour mon conjoint, ma mère est sa…','belle-mère',['tante','sœur','cousine'],'La mère de l’un des conjoints est la belle-mère de l’autre.']
].forEach(([p,c,w,e])=>add('F','Relations familiales','Parenté',p,c,w,e));
[
 ['Combien d’ordres différents peut-on former avec trois dossiers distincts A, B et C ?','6',['3','8','9'],'Il existe 3! = 3 × 2 × 1 = 6 permutations.'],
 ['On choisit deux personnes parmi quatre, sans tenir compte de l’ordre. Combien de binômes différents existe-t-il ?','6',['4','8','12'],'Les binômes sont AB, AC, AD, BC, BD et CD, soit 6.'],
 ['Un code comporte deux chiffres distincts choisis parmi 1, 2 et 3. Combien de codes ordonnés peut-on former ?','6',['3','4','9'],'Il y a 3 choix pour le premier chiffre puis 2 pour le second : 3 × 2 = 6.'],
 ['Trois itinéraires coûtent respectivement 12 €, 15 € et 11 € pour des durées identiques. Lequel minimise le coût ?','Celui à 11 €',['Celui à 12 €','Celui à 15 €','Tous sont équivalents'],'Lorsque la durée et les autres contraintes sont identiques, il suffit de comparer directement les coûts.'],
 ['Une tâche peut être réalisée par A en 4 h ou par B en 6 h. Si l’objectif unique est de finir au plus vite, qui choisir ?','A',['B','A et B sont équivalents','Impossible à déterminer'],'Avec les mêmes autres contraintes, 4 heures est inférieur à 6 heures.'],
 ['Pour vérifier une optimisation portant sur seulement quatre possibilités, quelle méthode est la plus sûre ?','Énumérer les quatre possibilités et comparer',['Choisir la première possibilité','Calculer une moyenne','Écarter les contraintes gênantes'],'Une recherche exhaustive courte garantit de ne pas manquer la meilleure solution.'],
 ['Une solution respecte l’objectif mais viole une contrainte. Est-elle admissible ?','Non, une solution doit respecter toutes les contraintes',['Oui, si son résultat est meilleur','Oui, si une seule contrainte est violée','Oui, si le calcul est rapide'],'L’optimisation s’effectue dans l’ensemble des solutions admissibles ; une contrainte violée exclut la solution.'],
 ['Deux solutions ont le même coût minimal. Que peut-on conclure ?','Le problème possède plusieurs solutions optimales',['Aucune solution n’est optimale','La solution la plus longue est forcément meilleure','Les contraintes sont nécessairement fausses'],'Un optimum peut être atteint par plusieurs configurations différentes.']
].forEach(([p,c,w,e])=>add('F','Optimisation et combinatoire','Application',p,c,w,e));

const expected={A:40,B:30,C:30,D:25,E:30,F:25};
for(const [ch,n] of Object.entries(expected)){const got=questions.filter(q=>q.chapterId===ch).length;if(got!==n)throw new Error(`${ch}: ${got}/${n}`)}
if(questions.length!==180)throw new Error(`Total ${questions.length}/180`);
for(const q of questions){if(q.o.length!==4||new Set(q.o).size!==4||q.ans<0||q.ans>3)throw new Error(`Q invalide ${q.id}`)}
if(new Set(questions.map(q=>q.prompt)).size!==180)throw new Error('Prompts dupliqués');

const familySeeds={
 A:[
  ['Proportion directe à deux grandeurs','Calculer une quatrième proportionnelle','Tableau puis produit en croix','Unités différentes','Si 7 dossiers prennent 21 minutes, combien pour 12 dossiers ?'],
  ['Proportion inverse effectif-durée','Conserver une quantité de travail fixe','Produit effectif × durée','Traiter la relation comme directe','8 agents terminent en 15 jours ; durée avec 12 agents ?'],
  ['Pourcentage d’une base','Calculer une part proportionnelle','Base × taux/100','Prendre le taux comme résultat','Combien représentent 18 % de 450 ?'],
  ['Évolution simple','Appliquer une hausse ou une baisse','Coefficient 1 ± taux','Ajouter le nombre de points','Un prix de 240 € baisse de 15 %.'],
  ['Évolutions successives','Composer plusieurs variations','Multiplier les coefficients','Additionner les pourcentages','Hausse de 10 %, puis baisse de 10 %.'],
  ['Vitesse-distance-temps','Isoler une grandeur','d = v × t','Mélanger heures et minutes','Parcourir 180 km à 72 km/h.'],
  ['Rencontre de mobiles','Utiliser une vitesse relative','Additionner les vitesses opposées','Soustraire les vitesses','Deux trains distants de 300 km se rapprochent.'],
  ['Moyenne pondérée','Tenir compte des coefficients','Somme valeur×poids / somme poids','Faire une moyenne simple','Notes 12 coeff. 2 et 17 coeff. 3.'],
  ['Intérêts simples ou composés','Choisir la bonne évolution du capital','Identifier si les intérêts capitalisent','Employer toujours C×t×n','Capital placé plusieurs années avec capitalisation.'],
  ['Lecture de tableau et d’échelle','Extraire puis convertir une donnée','Lire unités, légende et base','Ignorer « en milliers »','Barre à 42 sur un axe exprimé en milliers.']
 ],
 B:[
  ['Syllogisme inclusif','Déduire une inclusion certaine','Diagramme mental d’ensembles','Inverser « tous les »','Tous les A sont B ; x est A.'],
  ['Syllogisme négatif','Exploiter une incompatibilité','Repérer deux ensembles disjoints','Confondre aucun et certains','Aucun A n’est B ; x est A.'],
  ['Quantificateur « certains »','Limiter la conclusion à une existence','Chercher au moins un cas','Transformer certains en tous','Certains agents sont juristes.'],
  ['Chaîne d’inclusions','Appliquer la transitivité','A⊂B et B⊂C donc A⊂C','Renverser la chaîne','Tous les A sont B ; tous les B sont C.'],
  ['Contraposée','Déduire non-A à partir de non-B','Si A⇒B, alors non-B⇒non-A','Affirmer la réciproque','S’il pleut, le sol est mouillé ; sol sec.'],
  ['Réciproque invalide','Résister à l’affirmation du conséquent','Chercher d’autres causes de B','Conclure A dès que B est vrai','Si A alors B ; B est vrai.'],
  ['Chronologie verbale','Ordonner des événements','Transformer avant/après en chaîne','Confondre ordre et causalité','X après Y mais avant Z.'],
  ['Analogie fonctionnelle','Transférer exactement une relation','Formuler A est à B parce que…','Choisir un mot seulement associé','Thermomètre/température ; balance/?'],
  ['Intrus sémantique','Identifier le critère commun le plus précis','Tester catégorie, fonction et forme','Choisir le mot le moins familier','Triangle, cercle, carré, cube.'],
  ['Information absente','Distinguer faux et indéterminé','Ne conclure que ce qui est imposé','Prendre le silence pour une négation','L’énoncé ne précise pas la couleur.']
 ],
 C:[
  ['Déplacement sur quadrillage','Cumuler des vecteurs','Est-ouest sur x, nord-sud sur y','Inverser les axes','3 est, 2 nord, 1 ouest.'],
  ['Orientation après virages','Mettre à jour la direction','Tracer chaque quart de tour','Tourner la carte au lieu du mobile','Face au nord, droite, gauche, demi-tour.'],
  ['Rotation de flèche','Appliquer un angle orienté','Repérer sens horaire et nombre de quarts','Confondre rotation et miroir','Flèche nord tournée de 270° horaire.'],
  ['Symétrie axiale','Refléter par rapport à un axe','Conserver les distances à l’axe','Faire une rotation de 180°','Figure réfléchie par un axe vertical.'],
  ['Pliage simple','Suivre faces et marques','Fixer un repère distinctif','Se fier à la perspective','Patron de cube avec une face marquée.'],
  ['Faces opposées d’un cube','Identifier adjacence et opposition','Plier mentalement autour d’une face pivot','Déclarer opposées deux faces éloignées sur le papier','Choisir la face opposée à A.'],
  ['Matrice par addition','Combiner deux cases','Tester la règle sur chaque ligne','Valider une règle sur une seule ligne','Troisième case = somme des deux premières.'],
  ['Matrice à paramètres multiples','Suivre forme, nombre et orientation','Analyser un paramètre à la fois','Ne regarder que le nombre','Forme tourne et nombre augmente.'],
  ['Empilement de cubes','Déduire une vue ou un nombre','Distinguer empreinte et hauteur','Compter seulement les cases visibles','Vue de dessus avec colonnes de hauteurs variées.'],
  ['Cube peint puis découpé','Compter coins, arêtes, faces, centre','Classer selon le nombre de faces peintes','Compter les petits cubes sans leur position','Cube 4×4×4 peint sur six faces.']
 ],
 D:[
  ['Rang depuis les deux extrémités','Calculer l’effectif total','rang début + rang fin − 1','Oublier le double comptage','8e du début et 12e de la fin.'],
  ['Rang après départs','Mettre à jour une position','Compter seulement les départs devant','Déplacer le rang pour les départs derrière','Deux personnes devant quittent la file.'],
  ['Position médiane','Trouver le milieu d’un effectif impair','(n+1)/2','Diviser n par 2 sans ajuster','Milieu d’une file de 31 personnes.'],
  ['Chaîne de classement','Fusionner les relations avant/après','Écrire une ligne ordonnée','Traiter les indices séparément','A devant B, C derrière B.'],
  ['Cycle hebdomadaire','Calculer modulo 7','Garder le reste de la division par 7','Compter le jour de départ deux fois','Quel jour dans 45 jours ?'],
  ['Addition d’horaires','Normaliser heures et minutes','Regrouper 60 minutes en 1 heure','Écrire 10 h 85','Départ 9 h 35, durée 1 h 50.'],
  ['Planning séquentiel','Additionner des durées incompatibles','Respecter les dépendances','Superposer des tâches du même agent','A avant B, même agent.'],
  ['Planning parallèle','Réduire la durée par simultanéité','Prendre la durée du chemin critique','Additionner toutes les tâches','Deux agents sur tâches indépendantes.'],
  ['Chemin critique','Repérer la chaîne la plus longue','Additionner chaque chaîne de dépendances','Choisir la tâche la plus longue isolée','Deux branches convergent vers une tâche finale.'],
  ['Créneau compatible','Croiser plusieurs disponibilités','Faire l’intersection des plages','Additionner les horaires','Trouver une heure commune à trois personnes.']
 ],
 E:[
  ['Suite arithmétique','Trouver un écart constant','Calculer les différences','Chercher d’abord une multiplication','4, 9, 14, 19…'],
  ['Suite géométrique','Trouver un rapport constant','Calculer les quotients','Confondre rapport et différence','3, 9, 27, 81…'],
  ['Écarts croissants','Étudier la suite des différences','Calculer les écarts successifs','Prolonger le dernier écart seulement','2, 4, 7, 11, 16…'],
  ['Opérations alternées','Séparer les positions ou opérations','Tester +a puis ×b','Forcer une règle unique','4, 7, 14, 17, 34…'],
  ['Deux suites imbriquées','Séparer rangs pairs et impairs','Lire deux sous-suites','Calculer seulement les écarts globaux','1, 10, 2, 9, 3, 8…'],
  ['Suite de type Fibonacci','Additionner les deux précédents','Vérifier sur plusieurs termes','Doubler le dernier terme','2, 3, 5, 8, 13…'],
  ['Suite alphabétique régulière','Convertir lettres en rangs','A=1…Z=26','Compter uniquement les voyelles','C, F, I, L…'],
  ['Suite alphabétique cyclique','Utiliser un retour après Z','Calcul modulo 26','S’arrêter à Z','V, Y, B, E…'],
  ['Analogie relationnelle','Nommer précisément la relation','Transférer la même relation','Choisir un voisin sémantique','Auteur/livre ; peintre/?'],
  ['Matrice lignes-colonnes','Valider la règle dans deux directions','Tester lignes puis colonnes','Accepter la première coïncidence','Case manquante dans une matrice 3×3.']
 ],
 F:[
  ['Grille personne-attribut','Procéder par exclusions croisées','Tableau X/O','Tout garder en mémoire','Trois personnes, trois villes, trois métiers.'],
  ['Ordre sous contraintes','Construire une chaîne partielle','Placer d’abord les contraintes fortes','Tester au hasard les options','A avant B, C après D, B avant C.'],
  ['Affectation unique','Exploiter la dernière possibilité','Valider une ligne à une seule case','Recommencer toute la grille','Une personne n’a plus qu’un choix.'],
  ['Indice négatif','Transformer une interdiction en exclusion','Cocher immédiatement impossible','Ignorer les formulations négatives','Léa n’habite ni Paris ni Lyon.'],
  ['Contrainte conditionnelle','Traiter une implication sans réciproque','Tester les deux cas admissibles','Transformer si en si et seulement si','Si A choisit rouge, B choisit bleu.'],
  ['Lien de parenté simple','Dessiner générations et fratries','Arbre vertical parents-enfants','Raisonner seulement sur les noms','Fils de la sœur de ma mère.'],
  ['Parenté par alliance','Distinguer sang et mariage','Tracer les conjoints horizontalement','Confondre beau-frère et cousin','Mari de la sœur de mon père.'],
  ['Permutation','Compter des ordres distincts','n! pour n objets tous utilisés','Utiliser 2ⁿ','Ordres possibles de quatre dossiers.'],
  ['Combinaison','Choisir sans tenir compte de l’ordre','Éliminer les doublons AB/BA','Compter AB et BA séparément','Choisir deux personnes parmi cinq.'],
  ['Optimisation sous contraintes','Comparer seulement les solutions admissibles','Filtrer contraintes puis optimiser','Optimiser avant de vérifier','Choisir l’itinéraire le moins cher avec délai maximal.']
 ]
};
const families=[];
for(const ch of Object.keys(familySeeds))for(const [title,skill,method,trap,sample] of familySeeds[ch])families.push({number:families.length+1,id:`LOG-FAM-${String(families.length+1).padStart(3,'0')}`,chapterId:ch,chapter:chapters[ch].title,title,skill,method,trap,sample,source:chapters[ch].source});
if(families.length!==60)throw new Error(`Familles ${families.length}/60`);

fs.writeFileSync('logic-180-bank.js',`window.QLOGIC_REVIEW=${JSON.stringify(questions,null,2)};\n`);
fs.writeFileSync('logic-60-families.js',`window.QLOGIC_FAMILIES=${JSON.stringify(families,null,2)};\n`);
const counts=Object.fromEntries(Object.keys(chapters).map(ch=>[ch,questions.filter(q=>q.chapterId===ch).length]));
const answerPositions=[0,1,2,3].map(i=>questions.filter(q=>q.ans===i).length);
const audit={generatedAt:new Date().toISOString(),total:questions.length,chapters:counts,answerPositions,families:families.length,duplicatePrompts:questions.length-new Set(questions.map(q=>q.prompt)).size,invalidOptions:questions.filter(q=>q.o.length!==4||new Set(q.o).size!==4).map(q=>q.id)};
fs.mkdirSync('drafts',{recursive:true});fs.writeFileSync('drafts/audit-logique-180.json',JSON.stringify(audit,null,2)+'\n');
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Raisonnement logique — Banque à valider</title><style>
:root{--bg:#f5f4fb;--card:#fff;--text:#202235;--muted:#6f7385;--line:#dedfeb;--primary:#7458df;--soft:#eee9ff;--ok:#13795b}*{box-sizing:border-box}body{margin:0;background:linear-gradient(135deg,#f4fff9,#f7f4ff);color:var(--text);font:15px/1.55 system-ui,sans-serif}.wrap{max-width:1040px;margin:auto;padding:24px 18px 70px}header,.panel,.q,.family{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 8px 28px #34315112}header{margin-bottom:16px;border-left:4px solid var(--primary)}h1{margin:0 0 6px;font-size:27px}h2{margin:28px 0 10px}.muted{color:var(--muted)}.stats,.filters,.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.tag,.filter,.tab{border:1px solid var(--line);border-radius:999px;padding:7px 11px;background:#fff}.tag{background:var(--soft);color:var(--primary);font-weight:750}.filter,.tab{cursor:pointer}.filter.on,.tab.on{background:var(--primary);color:#fff;border-color:var(--primary)}input{width:100%;margin-top:14px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;font:inherit}.q,.family{margin:12px 0}.meta{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px}.q h3,.family h3{margin:8px 0 12px;font-size:18px}.opts{display:grid;gap:7px}.opt{padding:9px 11px;background:#fafaff;border:1px solid var(--line);border-radius:11px}.answer{margin-top:12px;padding:12px;border-radius:12px;background:#ecfaf4;border:1px solid #bde7d7}.answer b{color:var(--ok)}.family-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.family{margin:0}.family p{margin:6px 0}@media(max-width:700px){.family-grid{grid-template-columns:1fr}.wrap{padding:14px 10px 60px}.q,.family,header,.panel{padding:14px}h1{font-size:23px}}
</style></head><body><div class="wrap"><header><h1>Raisonnement logique — banque à valider</h1><p class="muted">180 QCM de méthode et 60 modèles de familles à transformer en exercices variables après validation. Rien n’est encore intégré à l’application.</p><div class="stats"><span class="tag">180 questions</span><span class="tag">60 familles-modèles</span><span class="tag">6 chapitres</span></div></header><div class="panel"><div class="tabs"><button class="tab on" data-view="questions">180 questions</button><button class="tab" data-view="families">60 familles-modèles</button></div><input id="search" type="search" placeholder="Rechercher une notion, un piège ou un mot-clé"><div class="filters"><button class="filter on" data-ch="">Tous les chapitres</button>${Object.values(chapters).map(ch=>`<button class="filter" data-ch="${ch.id}">${ch.title}</button>`).join('')}</div></div><main id="content"></main></div><script src="logic-180-bank.js"></script><script src="logic-60-families.js"></script><script>
const content=document.getElementById('content'),search=document.getElementById('search');let view='questions',chapter='';const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));function render(){const term=search.value.trim().toLowerCase();if(view==='questions'){const a=QLOGIC_REVIEW.filter(q=>(!chapter||q.chapterId===chapter)&&(!term||JSON.stringify(q).toLowerCase().includes(term)));content.innerHTML='<h2>'+a.length+' questions affichées</h2>'+a.map(q=>'<article class="q"><div class="meta"><span>Question '+q.number+' · '+esc(q.topic)+'</span><span>'+esc(q.kind)+'</span></div><h3>'+esc(q.prompt)+'</h3><div class="opts">'+q.o.map((o,i)=>'<div class="opt">'+String.fromCharCode(65+i)+'. '+esc(o)+'</div>').join('')+'</div><div class="answer"><b>Réponse : '+String.fromCharCode(65+q.ans)+'</b><div>'+esc(q.why)+'</div></div></article>').join('')}else{const a=QLOGIC_FAMILIES.filter(f=>(!chapter||f.chapterId===chapter)&&(!term||JSON.stringify(f).toLowerCase().includes(term)));content.innerHTML='<h2>'+a.length+' familles affichées</h2><div class="family-grid">'+a.map(f=>'<article class="family"><div class="meta">Famille '+f.number+' · '+esc(f.chapter)+'</div><h3>'+esc(f.title)+'</h3><p><b>Compétence :</b> '+esc(f.skill)+'</p><p><b>Méthode :</b> '+esc(f.method)+'</p><p><b>Piège :</b> '+esc(f.trap)+'</p><p><b>Exemple :</b> '+esc(f.sample)+'</p></article>').join('')+'</div>'}}document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===b));render()});document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{chapter=b.dataset.ch;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('on',x===b));render()});search.oninput=render;render();
</script></body></html>`;
fs.writeFileSync('logique-180-questions.html',html);
console.log(JSON.stringify(audit,null,2));
