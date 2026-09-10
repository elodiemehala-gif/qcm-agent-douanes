(()=>{
  const S=window.QSMART;if(!S||!S.make)return;
  const old=S.make;
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').trim();
  const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'");
  const has=(s,n)=>norm(s).includes(norm(n));
  function q(x,H,prompt,correct,wrong){
    const vals=[correct,...wrong];
    const o=H.sh(vals);
    return {kind:'k',cat:x.cat,chapter:x.chapter,topic:x.topicName,prompt:clean(prompt),o,ans:o.findIndex(v=>norm(v)===norm(correct)),x,why:clean(x.sourceText||x.text)};
  }
  S.make=function(x,K,H){
    const id=rootId(x&&x.id),s=clean(x&& (x.sourceText||x.text));

    if(id==='HIS-0027'&&has(s,'ostracisme'))return q(x,H,'Quelle pratique politique est associée à la démocratie athénienne ?','ostracisme',['clientélisme','césarisme','féodalisme']);
    if(id==='HIS-0181'&&has(s,'masculin'))return q(x,H,'Comment est qualifié le suffrage universel instauré en France en 1848 ?','masculin',['féminin','censitaire','indirect']);
    if(id==='HIS-0271')return q(x,H,'Que faut-il comprendre à propos du général de Gaulle de la Résistance et du président de la Ve République ?','c’est la même personne',['ce sont deux personnes distinctes','il s’agit de son fils','il s’agit de son frère']);
    if(id==='HIS-0307')return q(x,H,'Quelle période est associée à la présidence de Charles de Gaulle dans cette fiche ?','1959‐1969',['1944‐1954','1969‐1979','1981‐1991']);
    if(id==='HIS-0398')return q(x,H,'Qui est l’auteur de « Les Misérables » ?','Victor Hugo',['Émile Zola','Gustave Flaubert','Marcel Proust']);
    if(id==='HIS-0431')return q(x,H,'Qui est l’auteur de « Notre-Dame de Paris » ?','Victor Hugo',['Émile Zola','Gustave Flaubert','Marcel Proust']);
    if(id==='HIS-0435')return q(x,H,'Qui est l’auteur de « Candide » ?','Voltaire',['Rousseau','Diderot','Montesquieu']);
    if(id==='HIS-0448'&&has(s,'E.T'))return q(x,H,'Lequel de ces films est associé à Steven Spielberg dans cette fiche ?','E.T.',['Titanic','Psychose','Amélie']);
    if(id==='HIS-0454')return q(x,H,'Qui est l’auteur de « Germinal » ?','Zola',['Hugo','Balzac','Flaubert']);

    if(id==='GEO-0077')return q(x,H,'Quelle conséquence stratégique est associée au blocage du canal de Suez ?','son blocage ou les tensions en mer Rouge entraînent des détours par le cap de Bonne-Espérance',['son blocage impose un détour par le canal de Panama','son blocage ferme directement le détroit de Gibraltar','son blocage oblige à contourner entièrement le continent américain']);
    if(id==='GEO-0116')return q(x,H,'Dans quel océan l’Amazone se jette-t-il ?','Atlantique',['Pacifique','Arctique','Indien']);
    if(id==='GEO-0127')return q(x,H,'Dans quel pays se situe principalement le système Mississippi-Missouri ?','États-Unis',['Canada','Mexique','Brésil']);
    if(id==='GEO-0240')return q(x,H,'Dans quelle partie de la France situe-t-on le Massif central ?','Centre-sud',['Nord-est','Sud-ouest','Centre-ouest']);
    if(id==='GEO-0243')return q(x,H,'Quelle région historique est associée au Massif central dans cette fiche ?','Auvergne',['Bretagne','Alsace','Normandie']);
    if(id==='GEO-0334')return q(x,H,'Où se situent les pôles historiques de l’automobile française mentionnés dans la fiche ?','dans le nord, l’est et l’ouest',['dans le sud, l’est et le centre','dans le nord, le centre et le sud','dans l’ouest, le sud et le centre']);
    if(id==='GEO-0352'&&has(s,'redéfinit'))return q(x,H,'Quel rôle la loi NOTRe de 2015 joue-t-elle dans l’organisation territoriale ?','redéfinit la répartition des compétences entre collectivités',['supprime l’ensemble des compétences des départements','fusionne automatiquement toutes les communes françaises','transfère toutes les compétences locales à l’État']);

    if(id==='EMC-0024'&&has(s,'Blanc du drapeau'))return q(x,H,'À quoi le blanc du drapeau tricolore est-il associé dans cette fiche ?','monarchie',['République','Empire','Commune']);
    if(id==='EMC-0073'&&has(s,'Parlement français'))return q(x,H,'Quel principe structure le Parlement français ?','bicaméralisme',['monocaméralisme','fédéralisme','présidentialisme']);
    if(id==='EMC-0146')return q(x,H,'Comment les manifestations religieuses dans l’espace public sont-elles décrites ?','réglementées',['interdites','obligatoires','illimitées']);
    if(id==='EMC-0192'&&has(s,'siège: Luxembourg'))return q(x,H,'Où siège la Cour de justice de l’Union européenne ?','Luxembourg',['Bruxelles','Strasbourg','Francfort']);
    if(id==='EMC-0192'&&has(s,'contraignants'))return q(x,H,'Comment sont les arrêts de la CJUE ?','contraignants',['consultatifs','facultatifs','indicatifs']);
    if(id==='EMC-0198'&&has(s,'nombre: 15'))return q(x,H,'Combien de membres compte le Conseil de sécurité de l’ONU ?','15',['10','20','25']);
    if(id==='EMC-0198'&&has(s,'nombre: 5'))return q(x,H,'Combien de membres permanents compte le Conseil de sécurité de l’ONU ?','5',['3','7','10']);

    if(id==='ACT-0048'&&has(s,'fragile'))return q(x,H,'Comment la mise en œuvre du cessez-le-feu à Gaza est-elle décrite en 2026 ?','fragile',['stable','complète','définitive']);
    if(id==='ACT-0056')return q(x,H,'Quel pays exerce la présidence tournante du Conseil de l’Union européenne du 1er juillet au 31 décembre 2026 ?','Irlande',['Espagne','Italie','Pologne']);
    if(id==='ACT-0091')return q(x,H,'Quelle juridiction est principalement associée au Conseil de l’Europe dans cette fiche ?','CEDH',['CJUE','CPI','CIJ']);

    if(id==='ORG-0018'&&has(s,'conseil juridique'))return q(x,H,'Quelle activité est associée à la Direction des affaires juridiques ?','conseil juridique',['contrôle fiscal','gestion douanière','statistique publique']);
    if(id==='ORG-0029'&&has(s,'conseil financier'))return q(x,H,'Quel rôle de la DGFiP concerne directement le secteur public ?','conseil financier au secteur public',['contrôle des frontières et marchandises','protection économique des consommateurs','gestion de la dette publique']);
    if(id==='ORG-0038')return q(x,H,'Quelle direction est associée aux marchandises et aux frontières ?','DGDDI',['DGFiP','DGCCRF','Insee']);
    if(id==='ORG-0060'&&has(s,'Recouvrement'))return q(x,H,'Quel verbe résume le rôle du recouvrement dans cette fiche ?','encaisse',['contrôle','calcule','liquide']);
    if(id==='ORG-0067'&&has(s,'Recouvrement'))return q(x,H,'Quel verbe correspond au recouvrement ?','encaisser',['calculer','contrôler','liquider']);
    if(id==='ORG-0096')return q(x,H,'Quel service de Bercy est spécialisé dans le renseignement financier ?','Tracfin',['Insee','DGFiP','DGCCRF']);

    if(id==='MAT-0063'&&has(s,'Monôme — exemple'))return q(x,H,'Lequel de ces termes est l’exemple de monôme donné dans la fiche ?','3x²',['4y³','2ab','5z²']);
    if(id==='MAT-0100')return q(x,H,'Quelle est la formule de l’aire d’un trapèze ?','(B+b)×h/2',['(B+b)×h','(B-b)×h/2','B×b×h/2']);

    if(id==='LOG-0033'&&has(s,'2v1v2/(v1+v2)'))return q(x,H,'Quelle formule donne la vitesse moyenne sur deux distances égales parcourues aux vitesses v1 et v2 ?','2v1v2/(v1+v2)',['(v1+v2)/2','v1v2/(v1+v2)','2(v1+v2)/(v1v2)']);
    if(id==='LOG-0033'&&has(s,'somme des notes / nombre de notes'))return q(x,H,'Quelle formule donne la moyenne de plusieurs notes de même poids ?','somme des notes / nombre de notes',['somme des notes / somme des coefficients','nombre de notes / somme des notes','somme des écarts / nombre de notes']);

    if(id==='CG-0174')return q(x,H,'À quel type d’œuvre Richard Wagner est-il associé dans cette fiche ?','Opéras',['Symphonies','Concertos','Ballets']);
    if(id==='CG-0215')return q(x,H,'Qui a composé « Les Quatre Saisons » ?','Vivaldi',['Bach','Haendel','Mozart']);
    if(id==='CG-0217')return q(x,H,'Quel personnage est associé à Charlie Chaplin ?','Charlot',['Tintin','Astérix','Spirou']);
    if(id==='CG-0220')return q(x,H,'Quel film est associé à Alfred Hitchcock dans cette fiche ?','Psychose',['Titanic','Amélie','Casablanca']);
    if(id==='CG-0226')return q(x,H,'Quel film est associé à Federico Fellini dans cette fiche ?','81⁄2',['Titanic','Psychose','Amélie']);
    if(id==='CG-0235')return q(x,H,'Quel film est associé à James Cameron dans cette fiche ?','Titanic',['Psychose','Amélie','Casablanca']);
    if(id==='CG-0260')return q(x,H,'Quelle pièce est associée à Jean Racine dans cette fiche ?','Phèdre',['Tartuffe','Hernani','Lorenzaccio']);
    if(id==='CG-0484'&&has(s,'siège: Francfort'))return q(x,H,'Où siège la Banque centrale européenne ?','Francfort',['Bruxelles','Strasbourg','Luxembourg']);
    if(id==='CG-0487')return q(x,H,'Quel taux d’inflation la BCE vise-t-elle à moyen terme ?','2 %',['1 %','3 %','4 %']);
    if(id==='CG-0529')return q(x,H,'Dans quelle ville siège la Banque mondiale ?','Washington',['Paris','Genève','Bruxelles']);
    if(id==='CG-0530')return q(x,H,'Quelle institution a pour mission le financement et l’expertise pour le développement ?','Banque mondiale',['FMI','BCE','OMC']);
    if(id==='CG-0541'&&has(s,'association: éducation'))return q(x,H,'Laquelle de ces dimensions entre dans l’IDH ?','éducation',['emploi','sécurité','logement']);

    return old.call(S,x,K,H);
  };
})();
