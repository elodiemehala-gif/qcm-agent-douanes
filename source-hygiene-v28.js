(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'EMC-0087':'renvoi juridique tronqué; les notions complètes de présomption d’innocence et de procès équitable sont déjà conservées séparément',
    'HIS-0071':'récapitulatif éditorial de dates déjà portées par des faits autonomes',
    'HIS-0374':'fragment « sous la conduite de Lénine » dépourvu de sujet dans la source; ne constitue pas un fait autonome',
    'HIS-0405':'fragment temporel « de l’automne 2008 » rattaché au fait précédent; ne constitue pas un fait autonome',
    'GEO-0033':'titre de cours sans information géographique autonome',
    'GEO-0163':'énoncé de question comparant Nil et Amazone sans réponse factuelle autonome dans cette entrée',
    'GEO-0164':'précision méthodologique dépendante de la comparaison Nil/Amazone; ne constitue pas un fait autonome'
  };

  const FIX={
    'HIS-0091':['Évolution du pouvoir royal au Moyen Âge — caractéristiques: affirmation de l’autorité royale et affaiblissement de la féodalité','Évolution du pouvoir royal au Moyen Âge — repère: naissance progressive de l’État moderne'],
    'HIS-0015':['Mésopotamie — localisation: entre le Tigre et l’Euphrate (actuel Irak)'],
    'HIS-0042':['Expansion romaine — caractéristiques: s’étend d’abord en Italie puis en Méditerranée','Guerres puniques — association: Carthage','Bataille de Zama — date: 202 av. J.-C.'],
    'HIS-0058':['Empire romain — caractéristiques: christianisation tardive'],
    'HIS-0079':['Charlemagne — caractéristiques: crée des comtés et des capitulaires','Charlemagne — association: arts carolingiens'],
    'HIS-0113':['Louis XIV — association: « L’État, c’est moi »'],
    'HIS-0115':['Louis XIV — association: guerre de Hollande','Louis XIV — association: guerre de Succession d’Espagne'],
    'HIS-0117':['Intendants — rôle: représentent l’État dans les provinces'],
    'HIS-0120':['Monarchie absolue — caractéristiques: le roi reste lié aux lois fondamentales du royaume'],
    'HIS-0143':['Déclaration des droits de l’homme et du citoyen — date: 26 août'],
    'HIS-0165':['Bataille de Waterloo — date: 18 juin 1815','Napoléon — caractéristiques: abdique après sa défaite à Waterloo'],
    'HIS-0169':['Waterloo — repère: fin définitive de Napoléon','Cent-Jours — date: mars à juin 1815'],
    'HIS-0173':['Ordonnances de juillet 1830 de Charles X — rôle: provoquent les Trois Glorieuses'],
    'HIS-0186':['IIIe République — caractéristiques: repose sur les lois constitutionnelles de 1875','IIIe République — caractéristiques: régime parlementaire bicaméral','IIIe République — composition: Chambre des députés et Sénat'],
    'HIS-0202':['Attentat de Sarajevo — date: 28 juin 1914','Attentat de Sarajevo — rôle: déclenche la Première Guerre mondiale'],
    'HIS-0220':['Régimes totalitaires — caractéristiques: embrigadement idéologique et parti unique'],
    'HIS-0229':['Bombardement d’Hiroshima — date: 6 août 1945','Bombardement de Nagasaki — date: 9 août 1945'],
    'HIS-0243':['Détente — date: années 1970','Mikhaïl Gorbatchev — association: perestroïka et glasnost'],
    'HIS-0273':['Dissolution de l’Assemblée nationale — association: article 12 de la Constitution'],
    'HIS-0288':['Parlement — rôle: vote la loi et contrôle le gouvernement'],
    'HIS-0301':['Drapeau tricolore dans sa forme actuelle — date: 1794'],
    'HIS-0305':['Loi de 1901 — association: associations'],
    'HIS-0401':['Attentats du 11 septembre 2001 — association: World Trade Center et Pentagone','Attentats du 11 septembre 2001 — valeur: 2 977 morts'],
    'HIS-0402':['Attentats du 11 septembre 2001 — caractéristiques: provoquent une vague d’émotion et des mesures de sécurité renforcées'],
    'HIS-0403':['États-Unis après le 11 septembre — association: guerre contre le terrorisme','Intervention américaine en Afghanistan — date: octobre 2001'],
    'HIS-0406':['Crise financière mondiale de 2007-2008 — caractéristiques: diffusion favorisée par la titrisation et la défiance interbancaire','Crise financière mondiale de 2007-2008 — repère: pire récession depuis 1929'],
    'HIS-0408':['Annexion de la Crimée — caractéristiques: condamnée par l’ONU','Après l’annexion de la Crimée — caractéristiques: tensions persistantes dans l’est de l’Ukraine'],
    'HIS-0413':['Attentats du 11 septembre 2001 — localisation: aux États-Unis'],

    'GEO-0036':['Méridien de changement de date — repère: suit approximativement le 180e méridien mais présente des déviations'],
    'GEO-0037':['Statistiques démographiques de l’ONU — repère: utilisent de grandes régions géographiques'],
    'GEO-0079':['Détroit d’Ormuz — localisation: entre l’Iran et Oman'],
    'GEO-0120':['Plus grand désert selon la définition climatique — association: Antarctique','Plus grand désert chaud — association: Sahara'],
    'GEO-0121':['Désert d’Atacama — localisation: sur la façade pacifique de l’Amérique du Sud','Désert de Gobi — localisation: en Asie intérieure'],
    'GEO-0122':['Fleuve — définition: cours d’eau qui se jette dans une mer ou un océan','Rivière — définition: cours d’eau qui se jette dans un autre cours d’eau'],
    'GEO-0166':['Climat — caractéristiques: dépend principalement de la latitude, de l’altitude, de la continentalité, des courants marins et du relief'],
    'GEO-0168':['Biome — définition: combinaison d’un climat, d’une végétation dominante et d’une faune adaptée'],
    'GEO-0169':['Climat méditerranéen — caractéristiques: été chaud et sec, hiver plus doux et plus humide'],
    'GEO-0170':['Taïga — définition: forêt boréale de conifères','Toundra — définition: végétation basse sans forêt continue'],
    'GEO-0186':['Population mondiale — population: plus de 8,2 milliards d’habitants'],
    'GEO-0190':['World Urbanization Prospects 2025 — caractéristiques: utilise une nouvelle définition harmonisée','Nombre de mégapoles d’au moins 10 millions d’habitants recensées par l’ONU en 2025 — valeur: 33'],
    'GEO-0191':['Mégapole — définition: très grande agglomération, souvent définie par un seuil de 10 millions d’habitants'],
    'GEO-0192':['Mégalopole — définition: vaste région urbaine continue ou fortement connectée regroupant plusieurs métropoles'],
    'GEO-0194':['PIB — définition: valeur des biens et services produits sur un territoire pendant une période donnée'],
    'GEO-0206':['G20 — caractéristiques: représente plus de 75 % du commerce international et environ deux tiers de la population mondiale'],
    'GEO-0208':['G7 — caractéristiques: forum sans traité constitutif comparable à celui d’une organisation comme l’ONU'],
    'GEO-0295':['France au 1er janvier 2026 — population: 69,1 millions d’habitants','France métropolitaine au 1er janvier 2026 — population: 66,8 millions d’habitants'],
    'GEO-0303':['France — caractéristiques: dispose de la plus grande surface agricole utilisée de l’Union européenne','France — repère: premier producteur agricole européen en valeur'],
    'GEO-0345':['Toulouse — association: aéronautique et spatial','Marseille — association: grand port méditerranéen','Le Havre — association: grand port français de conteneurs'],
    'GEO-0352':['Loi NOTRe — date: 7 août 2015','Loi NOTRe — rôle: redéfinit la répartition des compétences entre collectivités']
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
      facts.forEach((text,j)=>kept.push({...x,id:facts.length>1?`${id}-v28-${j+1}`:id,text:clean(text),sourceText:clean(text)}));
    }
    return kept;
  };
})();