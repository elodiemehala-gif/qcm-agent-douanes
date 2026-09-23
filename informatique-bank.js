(()=>{
const validated=window.QCULTURENUMERIQUE_REVIEW;
if(!Array.isArray(validated)||validated.length!==320){throw new Error('La banque validée de culture numérique (320 questions) est indisponible.');}
window.QINFO_BANK={
 chapters:[
  {
    "id": "A1",
    "title": "1. Informations et données",
    "group": "A. Socle de compétences numériques"
  },
  {
    "id": "A2",
    "title": "2. Communication et collaboration",
    "group": "A. Socle de compétences numériques"
  },
  {
    "id": "A3",
    "title": "3. Création de contenus",
    "group": "A. Socle de compétences numériques"
  },
  {
    "id": "A4",
    "title": "4. Protection et sécurité",
    "group": "A. Socle de compétences numériques"
  },
  {
    "id": "A5",
    "title": "5. S’insérer dans le monde numérique",
    "group": "A. Socle de compétences numériques"
  },
  {
    "id": "B1",
    "title": "1. Services publics et administration numérique",
    "group": "B. Enjeux et politiques de l’administration numérique"
  },
  {
    "id": "B2",
    "title": "2. Données publiques, cloud, IA et inclusion",
    "group": "B. Enjeux et politiques de l’administration numérique"
  },
  {
    "id": "B3",
    "title": "3. Politiques numériques françaises et européennes",
    "group": "B. Enjeux et politiques de l’administration numérique"
  },
  {
    "id": "C1",
    "title": "1. RGPD et protection des données",
    "group": "C. Réglementation de l’administration numérique"
  },
  {
    "id": "C2",
    "title": "2. CNIL et loi Informatique et Libertés",
    "group": "C. Réglementation de l’administration numérique"
  }
],
 questions:validated.map(item=>({
  c:item.chapterId,
  t:item.topic,
  q:item.prompt,
  o:[...item.o],
  a:item.ans,
  e:item.why,
  s:item.source
 }))
};
})();
