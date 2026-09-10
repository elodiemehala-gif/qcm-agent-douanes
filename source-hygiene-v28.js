(()=>{
  const S=window.QSMART;if(!S||!S.enrich)return;
  const old=S.enrich;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];

  const NON_ATOMIC={
    'EMC-0087':'renvoi juridique tronqué; les notions complètes de présomption d’innocence et de procès équitable sont déjà conservées séparément',
    'HIS-0071':'récapitulatif éditorial de dates déjà portées par des faits autonomes'
  };

  const FIX={
    'HIS-0091':[
      'Évolution du pouvoir royal au Moyen Âge — caractéristiques: affirmation de l’autorité royale et affaiblissement de la féodalité',
      'Évolution du pouvoir royal au Moyen Âge — repère: naissance progressive de l’État moderne'
    ],
    'HIS-0015':[
      'Mésopotamie — localisation: entre le Tigre et l’Euphrate (actuel Irak)'
    ],
    'HIS-0042':[
      'Expansion romaine — caractéristiques: s’étend d’abord en Italie puis en Méditerranée',
      'Guerres puniques — association: Carthage',
      'Bataille de Zama — date: 202 av. J.-C.'
    ],
    'HIS-0058':[
      'Empire romain — caractéristiques: christianisation tardive'
    ],
    'HIS-0079':[
      'Charlemagne — caractéristiques: crée des comtés et des capitulaires',
      'Charlemagne — association: arts carolingiens'
    ],
    'HIS-0113':[
      'Louis XIV — association: « L’État, c’est moi »'
    ],
    'HIS-0115':[
      'Louis XIV — association: guerre de Hollande',
      'Louis XIV — association: guerre de Succession d’Espagne'
    ],
    'HIS-0117':[
      'Intendants — rôle: représentent l’État dans les provinces'
    ],
    'HIS-0120':[
      'Monarchie absolue — caractéristiques: le roi reste lié aux lois fondamentales du royaume'
    ],
    'HIS-0143':[
      'Déclaration des droits de l’homme et du citoyen — date: 26 août'
    ],
    'HIS-0165':[
      'Bataille de Waterloo — date: 18 juin 1815',
      'Napoléon — caractéristiques: abdique après sa défaite à Waterloo'
    ],
    'HIS-0169':[
      'Waterloo — repère: fin définitive de Napoléon',
      'Cent-Jours — date: mars à juin 1815'
    ],
    'HIS-0173':[
      'Ordonnances de juillet 1830 de Charles X — rôle: provoquent les Trois Glorieuses'
    ],
    'HIS-0186':[
      'IIIe République — caractéristiques: repose sur les lois constitutionnelles de 1875',
      'IIIe République — caractéristiques: régime parlementaire bicaméral',
      'IIIe République — composition: Chambre des députés et Sénat'
    ],
    'HIS-0202':[
      'Attentat de Sarajevo — date: 28 juin 1914',
      'Attentat de Sarajevo — rôle: déclenche la Première Guerre mondiale'
    ],
    'HIS-0220':[
      'Régimes totalitaires — caractéristiques: embrigadement idéologique et parti unique'
    ],
    'HIS-0229':[
      'Bombardement d’Hiroshima — date: 6 août 1945',
      'Bombardement de Nagasaki — date: 9 août 1945'
    ]
  };

  S.enrich=function(raw){
    const out=old.call(S,raw);
    const base=window.QSMART_SOURCE_BASE||[];
    const resolved=window.QSMART_SOURCE_RESOLVED||(window.QSMART_SOURCE_RESOLVED={});
    const targets=new Set([...Object.keys(FIX),...Object.keys(NON_ATOMIC)]);
    const kept=out.filter(x=>!targets.has(rootId(x.id)));

    for(const x of base){
      const id=rootId(x.id);
      if(NON_ATOMIC[id]){
        resolved[id]=NON_ATOMIC[id];
        continue;
      }
      const facts=FIX[id];
      if(!facts)continue;
      facts.forEach((text,j)=>kept.push({
        ...x,
        id:facts.length>1?`${id}-v28-${j+1}`:id,
        text:clean(text),
        sourceText:clean(text)
      }));
    }
    return kept;
  };
})();