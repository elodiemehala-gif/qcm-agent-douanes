window.QSMART=(()=>{
  const BASE=window.QKNOW,CH=window.QCHAPTER;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\bouvoir théocratique\b/gi,'Pouvoir théocratique').replace(/\bouvoir politique\b/gi,'Pouvoir politique').replace(/^[•●▪◦–—-]\s*/,'').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const trim=s=>clean(s).replace(/^[,:;–—-]+\s*/,'').replace(/[.;:,]+$/,'').trim();
  const uniq=a=>[...new Set((a||[]).filter(Boolean).map(v=>trim(v)).filter(Boolean))];
  const lower=s=>s.replace(/^(Le|La|Les|L’|L')\b/,m=>m.toLowerCase());
  const editorial=/^(?:pièges?|à retenir|fiche|stratégie|exemple|méthode|correction|remarque|version|cours source|programme|priorité concours|conséquences historiques|personnages\/vestiges clés|définition et contexte)/i;
  const bad=/https?:\/\/|^Q\d+\b|^Réponse\s*:/i;
  const pair=s=>{const m=clean(s).match(/^([^:]{2,85})\s*:\s*(.+)$/);if(!m)return null;const term=trim(m[1]),desc=trim(m[2]);if(editorial.test(term)||term.length>80||desc.length<3)return null;return[term,desc]};
  const wc=s=>trim(s).split(/\s+/).filter(Boolean).length;
  const capWords=s=>(s.match(/\b[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜ][A-Za-zÀ-ÿ'’-]+(?:\s+[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜ][A-Za-zÀ-ÿ'’-]+)+\b/g)||[]);
  function topic(x){const s=clean(x.text).toLowerCase(),c=CH.chapter(x);
    if(x.cat==='Histoire'){
      if(/paléolith|néolith|homo\s|sédent|chasseur|cueilleur|lascaux|chauvet|pierre taill|pierre poli|premiers outils|révolution agricole/.test(s))return'Préhistoire';
      if(/mésopot|sumér|uruk|hammourabi|ziggourat|cunéiform|tigre.*euphrate/.test(s))return'Mésopotamie';
      if(/égypte|pharaon|narmer|nil|haute et basse égypte|théocr|pyramide|chéops|khephren|mykérinos|hiéroglyph|ramsès|akhenaton|toutankhamon/.test(s))return'Égypte antique';
      if(/grèc|athèn|sparte|périclès|ecclésia|ostracisme|parthénon|alexandre le grand/.test(s))return'Grèce antique';
      if(/rome|romain|césar|auguste|pax romana|sénat romain|république romaine/.test(s))return'Rome antique';
      if(/judaïsme|christianisme|islam|torah|bible|coran|mahomet|moïse|jésus/.test(s))return'Religions monothéistes';
      if(/clovis|méroving|caroling|charlemagne|franc/.test(s))return'Royaumes francs';
      if(/féodal|seigneur|vassal|croisade|moyen âge|gothique/.test(s))return'Moyen Âge';
      if(/renaissance|humanisme|imprimerie|gutenberg|léonard de vinci/.test(s))return'Renaissance et humanisme';
      if(/louis xiv|versailles|monarchie absolue|absolutisme/.test(s))return'Monarchie absolue';
      if(/lumières|voltaire|rousseau|montesquieu|encyclopédie/.test(s))return'Les Lumières';
      if(/1789|bastille|états généraux|ddhc|révolution française|terreur|robespierre/.test(s))return'Révolution française';
      if(/napoléon|bonaparte|waterloo|austerlitz|empire/.test(s))return'Napoléon et Empire';
      if(/1914|1918|verdun|première guerre mondiale|poilus/.test(s))return'Première Guerre mondiale';
      if(/1939|1945|seconde guerre mondiale|vichy|pétain|résistance|de gaulle|shoah/.test(s))return'Seconde Guerre mondiale';
      if(/guerre froide|urss|otan|pacte de varsovie|berlin|cuba/.test(s))return'Guerre froide';
      if(/décolon|algérie|indochine|inde.*indépend|évian/.test(s))return'Décolonisation';
      if(/iran|israël|palestin|golfe|koweït|11 septembre|crimée|covid/.test(s))return'Monde contemporain';
      return c;
    }
    if(x.cat==='Géographie'){
      if(/climat|köppen|océanique|méditerranéen|continental|polaire|tropical|biome/.test(s))return'Climats et biomes';
      if(/fleuve|lac|loire|seine|rhône|garonne|nil|amazone|mississippi|yangzi/.test(s))return'Fleuves et lacs';
      if(/montagne|massif|himalaya|alpes|and|désert|sahara/.test(s))return'Reliefs et déserts';
      if(/population|démograph|habitants|densité|urbanis|métropole/.test(s))return'Démographie';
      if(/g7|g20|brics|pib|mondialisation|commerce|puissance économique/.test(s))return'Économie mondiale';
      if(/otan|onu|conflit|géopolit|alliance/.test(s))return'Géopolitique';
      return c;
    }
    if(x.cat==='Enseignement moral et civique'){
      if(/président|premier ministre|gouvernement|parlement|assemblée nationale|sénat|conseil constitutionnel|conseil d'état|cour de cassation/.test(s))return'Institutions françaises';
      if(/laïc|religion|neutralité/.test(s))return'Laïcité';
      if(/liberté|égalité|fraternité|indivisib|république sociale/.test(s))return'Valeurs de la République';
      if(/ddhc|préambule|constitution|charte|cedh/.test(s))return'Textes fondamentaux';
      if(/justice|juridiction|pénal|administratif|judiciaire/.test(s))return'Justice';
      if(/citoyen|nationalité|suffrage|devoir/.test(s))return'Citoyenneté';
      return c;
    }
    if(x.cat==='Organisation et missions des ministères économiques et financiers'||x.cat==='Organisation et missions'){
      if(/dgfip|impôt|fiscal|cadastre|recouvr/.test(s))return'DGFiP et fiscalité';
      if(/dgddi|douane|frontière|marchandise|tarif douanier|accise/.test(s))return'DGDDI et douane';
      if(/dgccrf|consommateur|concurrence/.test(s))return'DGCCRF';
      if(/tracfin|blanchiment|renseignement financier/.test(s))return'Tracfin et fraude';
      if(/ordonnateur|comptable public|comptabilité publique/.test(s))return'Comptabilité publique';
      if(/facturation électronique/.test(s))return'Facturation électronique';
      return c;
    }
    if(x.cat==='Culture générale'){
      if(/peint|artiste|tableau|œuvre|impressionnisme|cubisme|surréalisme|baroque|gothique|roman|musique|cinéma|film|festival/.test(s))return'Arts';
      if(/newton|joule|watt|pascal|hertz|volt|ohm|ampère|ph\b|atome|darwin|pasteur|einstein|planète|astronom/.test(s))return'Sciences';
      if(/pib|inflation|chômage|monnaie|banque|bourse|cac 40|nikkei|dax|ftse|fmi|omc|ocde|gini|idh|économie/.test(s))return'Économie';
      return c;
    }
    return c;
  }
  function factOk(x){const s=clean(x.text);if(!s||s.length<8||s.length>330||bad.test(s)||editorial.test(s))return false;if(/^\d+$/.test(s))return false;return true}
  function enrich(raw){const e=BASE.expand(raw).map(x=>({...x,text:clean(x.text),sourceText:clean(x.sourceText||x.text)})).filter(factOk);return e.map(x=>({...x,chapter:CH.chapter(x),topicName:topic(x)}))}
  function opts(correct,wrong,H){let d=uniq(wrong).filter(v=>v!==trim(correct));if(d.length<3)return null;d=H.sh(d.slice(0,12)).slice(0,3);const o=H.sh([trim(correct),...d]);return{o,ans:o.indexOf(trim(correct))}}
  function q(x,prompt,correct,wrong,H,why){const z=opts(correct,wrong,H);if(!z)return null;return{kind:'k',cat:x.cat,topic:x.topicName||topic(x),chapter:x.chapter||CH.chapter(x),prompt,o:z.o,ans:z.ans,x,why:why||clean(x.sourceText||x.text)}}
  function yearWrong(y){const n=+String(y).replace(/\D/g,'');if(!n)return[];const step=n<1000?50:(n<1800?10:5);return[n-step,n-Math.max(2,Math.floor(step/2)),n+Math.max(2,Math.floor(step/2)),n+step].filter(v=>v>0).map(String)}
  function numberWrong(raw){const m=String(raw).match(/-?\d+(?:[,.]\d+)?/);if(!m)return[];const n=parseFloat(m[0].replace(',','.'));const suffix=String(raw).replace(m[0],'');let ds=Math.abs(n)>=1000?[.8,.9,1.1,1.2]:Math.abs(n)>=100?[.9,.95,1.05,1.1]:[.8,.9,1.1,1.2];return ds.map(k=>{const v=Math.round(n*k*10)/10;return String(v).replace('.',',')+suffix})}
  const subjectKind=s=>{s=trim(s);if(/^(?:Le|La|Les|L’|L')\s/.test(s))return'entity';if(/\b(?:DGFiP|DGDDI|DGCCRF|Tracfin|Insee|AFT|Parlement|Conseil|Cour|BCE|FMI|ONU|OTAN)\b/i.test(s))return'institution';if(capWords(s).length)return'person';return'concept'};
  const termKind=s=>{s=trim(s);if(/\b(?:DGFiP|DGDDI|DGCCRF|Tracfin|Insee|AFT|BCE|FMI|ONU|OTAN|Conseil|Cour|Parlement)\b/i.test(s))return'institution';if(/climat/i.test(s))return'climate';if(/Paléolithique|Néolithique|Révolution|Guerre|Empire|République/i.test(s))return'period';if(capWords(s).length&&wc(s)<=4)return'person';return'concept'};
  function pairTerms(x,K,kind){let same=K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.topicName===x.topicName);let terms=same.map(y=>pair(y.text)).filter(Boolean).map(z=>z[0]).filter(t=>termKind(t)===kind);if(uniq(terms).length<3){terms=K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.chapter===x.chapter).map(y=>pair(y.text)).filter(Boolean).map(z=>z[0]).filter(t=>termKind(t)===kind)}return uniq(terms)}
  function relation(s){s=clean(s);let m=s.match(/^(.+?)\s+(sont|est)\s+considéré(?:e|es|s)?\s+comme\s+(.+)$/i);if(m)return{subject:trim(m[1]),verb:'considered',object:trim(m[3])};m=s.match(/^(.+?)\s+(a pour mission(?: principale)? de|assure|contrôle|gère|recouvre|collecte|dirige|vote|représente|désigne|correspond à|comprend)\s+(.+)$/i);if(m)return{subject:trim(m[1]),verb:m[2].toLowerCase(),object:trim(m[3])};m=s.match(/^(.+?)\s+(est|sont)\s+(.+)$/i);if(m&&wc(m[1])<=10)return{subject:trim(m[1]),verb:m[2].toLowerCase(),object:trim(m[3])};return null}
  function relationSubjects(x,K,r){const k=subjectKind(r.subject);let pool=K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.topicName===x.topicName).map(y=>relation(y.text)).filter(Boolean).map(z=>z.subject).filter(s=>subjectKind(s)===k);if(uniq(pool).length<3)pool=K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.chapter===x.chapter).map(y=>relation(y.text)).filter(Boolean).map(z=>z.subject).filter(s=>subjectKind(s)===k);return uniq(pool)}
  function specials(x,H){const s=clean(x.text),sl=s.toLowerCase();
    if(x.cat==='Histoire'&&/paléolithique\s*:\s*débute.*2,5 millions/.test(sl))return q(x,'Il y a environ combien de temps débute le Paléolithique ?','2,5 millions d’années',['1,5 million d’années','2 millions d’années','3 millions d’années','3,5 millions d’années'],H);
    if(x.cat==='Histoire'&&/les hommes sont nomades, chasseurs et cueilleurs/.test(sl))return q(x,'Quel mode de vie caractérise principalement les hommes du Paléolithique ?','Nomades, chasseurs et cueilleurs',['Sédentaires, agriculteurs et éleveurs','Nomades, agriculteurs et artisans','Sédentaires, chasseurs et cueilleurs'],H);
    if(x.cat==='Histoire'&&/néolithique\s*:.*9 000.*révolution agricole/.test(sl))return q(x,'À partir de quelle période situe-t-on généralement le début du Néolithique dans le cours ?','Vers 9 000 av. J.-C.',['Vers 12 000 av. J.-C.','Vers 6 000 av. J.-C.','Vers 3 000 av. J.-C.'],H);
    if(x.cat==='Histoire'&&/sédentarisation\s*:.*sites permanents/.test(sl))return q(x,'Que désigne la sédentarisation ?','Le regroupement durable des populations sur des sites permanents',['Le déplacement saisonnier régulier des populations','La disparition de toute activité agricole','Le retour à un mode de vie exclusivement nomade'],H);
    if(x.cat==='Histoire'&&/premières civilisations\s*:.*fleuves/.test(sl))return q(x,'Autour de quels milieux apparaissent les premières grandes civilisations mentionnées dans le cours ?','Autour de grands fleuves',['Autour des grands déserts uniquement','Sur les hauts plateaux isolés','Uniquement sur les littoraux océaniques'],H);
    if(x.cat==='Histoire'&&/homo habilis.*premier outil.*homo erectus.*maîtrise du feu/.test(sl))return q(x,'Quelle association est correcte ?','Homo erectus — maîtrise du feu',['Homo habilis — maîtrise du feu','Homo sapiens — invention de l’écriture','Homo erectus — apparition de l’agriculture'],H);
    if(x.cat==='Histoire'&&/mésopotamie\s*:.*tigre.*euphrate/.test(sl))return q(x,'Entre quels fleuves se situe la Mésopotamie ?','Le Tigre et l’Euphrate',['Le Nil et le Jourdain','L’Indus et le Gange','Le Danube et le Rhin'],H);
    if(x.cat==='Histoire'&&/sumériens.*écriture cunéiforme/.test(sl))return q(x,'Quel peuple est associé à l’invention de l’écriture cunéiforme ?','Les Sumériens',['Les Égyptiens','Les Phéniciens','Les Romains'],H);
    if(x.cat==='Histoire'&&/égypte antique.*unifi.*narmer/.test(sl))return q(x,'Quel pharaon est associé à l’unification de l’Égypte antique vers -3150 ?','Narmer',['Ramsès II','Akhenaton','Toutankhamon'],H);
    if(x.cat==='Histoire'&&/pharaons sont considérés comme des dieux vivants/.test(sl))return q(x,'Dans l’Égypte antique, comment les pharaons sont-ils considérés ?','Comme des dieux vivants',['Comme de simples chefs militaires','Comme des magistrats élus','Comme des prêtres sans pouvoir politique'],H);
    if(x.cat==='Histoire'&&/pouvoir théocratique\s*:.*pharaon chef politique et religieux/.test(sl))return q(x,'Que signifie le caractère théocratique du pouvoir du pharaon ?','Le pharaon est à la fois chef politique et religieux',['Le pharaon exerce seulement le pouvoir militaire','Le pharaon exerce seulement une fonction religieuse','Les pouvoirs politique et religieux sont totalement séparés'],H);
    if(x.cat==='Histoire'&&/fleuves nourriciers\s*:.*nil/.test(sl))return q(x,'Quel fleuve joue un rôle central dans la civilisation égyptienne antique ?','Le Nil',['Le Tigre','L’Euphrate','L’Indus'],H);
    if((x.cat==='Organisation et missions des ministères économiques et financiers'||x.cat==='Organisation et missions')&&/contrôle fiscal.*vérifi.*déclarations/.test(sl))return q(x,'Quel est le rôle du contrôle fiscal ?','Vérifier l’exactitude et la sincérité des déclarations fiscales',['Encaisser directement les impôts dus','Fixer les taux d’imposition votés par le Parlement','Gérer uniquement les dépenses publiques'],H);
    if((x.cat==='Organisation et missions des ministères économiques et financiers'||x.cat==='Organisation et missions')&&/recouvrement.*paiement.*créance/.test(sl))return q(x,'Que désigne le recouvrement fiscal ?','L’encaissement d’une créance fiscale',['La vérification de la sincérité d’une déclaration','La fixation de l’assiette d’un impôt','L’élaboration d’une loi de finances'],H);
    if((x.cat==='Organisation et missions des ministères économiques et financiers'||x.cat==='Organisation et missions')&&/ordonnateur/.test(sl)&&/comptable public/.test(sl))return q(x,'Dans la comptabilité publique, quelle affirmation est correcte ?','L’ordonnateur décide l’opération et le comptable public manie les fonds',['Le comptable public décide seul de la dépense','L’ordonnateur encaisse et paie directement les fonds publics','Ordonnateur et comptable public ont exactement la même fonction'],H);
    return null
  }
  function make(x,K,H){x={...x,text:clean(x.text),sourceText:clean(x.sourceText||x.text),chapter:x.chapter||CH.chapter(x),topicName:x.topicName||topic(x)};let s=x.text,m;
    let sp=specials(x,H);if(sp)return sp;
    const pp=pair(s);if(pp){const [term,desc]=pp;
      const yr=(desc.match(/\b(1[5-9]\d{2}|20\d{2})\b/g)||[]);if(yr.length===1&&wc(desc)<=28){const y=yr[0],context=trim(desc.replace(y,'_____'));return q(x,`Quelle année complète correctement l’information sur « ${term} » ?\n${context}`,y,yearWrong(y),H)}
      const num=(desc.match(/\b\d+(?:[,.]\d+)?\s*(?:%|millions? d['’]habitants|milliards? d['’]habitants|km|m²|m³|€)\b/i)||[])[0];if(num&&wc(desc)<=28)return q(x,`Quelle valeur complète correctement l’information sur « ${term} » ?`,num,numberWrong(num),H);
      if(wc(desc)<=34){const k=termKind(term),cands=pairTerms(x,K,k);if(cands.length>=3)return q(x,`Quelle notion correspond à cette définition ?\n« ${desc} »`,term,cands,H)}
    }
    m=s.match(/^(.+?)\s+(?:siège à|est situé(?:e)? à|se situe à)\s+(.+)$/i);if(m){const subj=trim(m[1]),ans=trim(m[2]);let places=[];for(const y of K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.chapter===x.chapter)){const mm=clean(y.text).match(/(?:siège à|est situé(?:e)? à|se situe à)\s+(.+)$/i);if(mm)places.push(trim(mm[1]))}if(uniq(places).length>=3)return q(x,`Où se situe ${subj} ?`,ans,places,H)}
    const r=relation(s);if(r){const pool=relationSubjects(x,K,r);if(pool.length>=3){let prompt=`Quel élément correspond à l’affirmation suivante ?\n« ${r.object} »`;if(r.verb==='considered')prompt=`Qui est ${lower('considéré comme '+r.object)} ?`;else if(/mission|assure|contrôle|gère|recouvre|collecte/.test(r.verb))prompt=`Quelle institution ou quel acteur ${r.verb.replace('a pour mission de','a pour mission de')} ${r.object} ?`;else if(r.verb==='désigne'||r.verb==='correspond à')prompt=`Quelle notion désigne « ${r.object} » ?`;return q(x,prompt,r.subject,pool,H)}}
    const years=s.match(/\b(?:1[5-9]\d{2}|20\d{2})\b/g)||[];if(years.length===1&&wc(s)<=30){const y=years[0],context=trim(s.replace(y,'_____'));return q(x,`Quelle année complète correctement cette information ?\n${context}`,y,yearWrong(y),H)}
    m=s.match(/\b(?:écrit(?:e)?|fondé(?:e)?|créé(?:e)?|dirigé(?:e)?|présidé(?:e)?|signé(?:e)?|adopté(?:e)?)\s+par\s+([A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜ][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜ][A-Za-zÀ-ÿ'’.-]+)+)/i);if(m){const ans=m[1],names=uniq(K.filter(y=>y.id!==x.id&&y.cat===x.cat&&y.chapter===x.chapter).flatMap(y=>capWords(clean(y.text)))).filter(n=>n!==ans);if(names.length>=3)return q(x,'Quelle personne complète correctement cette information ?',ans,names,H)}
    return null
  }
  function topics(cat,K,chapter){return uniq(K.filter(x=>x.cat===cat&&(!chapter||x.chapter===chapter)).map(x=>x.topicName||topic(x)))}
  return{enrich,make,topic,topics};
})();