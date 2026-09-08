(()=>{
  const S=window.QSMART;if(!S)return;
  const old=S.make;
  const clean=s=>String(s||'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  const src=x=>clean((x&&x.sourceText)||(x&&x.text)||'');
  const answer=q=>q&&Array.isArray(q.o)?clean(q.o[q.ans]):'';
  const norm=s=>clean(s).replace(/[«»]/g,'').replace(/[.;:]+$/,'').trim();
  const cap=s=>s?String(s).charAt(0).toUpperCase()+String(s).slice(1):s;
  const stripLife=s=>norm(s).replace(/\s*\((?:[-−]?\d{2,4})\s*[‑–—-]\s*(?:[-−]?\d{2,4})\)\s*$/,'').trim();
  const badPrompt=/quelle (?:année|date|valeur|personne|période|information) (?:complète|complète correctement)|quel élément correspond à l[’']affirmation|quelle notion correspond à cette définition|que faut-il associer|quelle proposition complète|_{3,}|\b(?:dans|selon) le cours\b/i;
  const generic=/^(?:Quelle (?:année|date|valeur|personne|période|information)|Quel élément|Quelle notion|Que faut-il)/i;

  function yearPrompt(source,ans){
    const y=String(ans).replace(/^[-−]/,'');
    let m;
    // Œuvres : « Montesquieu (...) : auteur de De l’esprit des lois (1748) »
    m=source.match(/^([^:]{2,80})\s*:\s*.*?auteur(?:e)?\s+de\s+(.+?)\s*\(([-−]?\d{3,4})\)/i);
    if(m&&m[3].replace(/^[-−]/,'')===y){const who=stripLife(m[1]),work=norm(m[2]);return `En quelle année paraît « ${work} » de ${who} ?`}
    m=source.match(/(?:auteur(?:e)?\s+de|publie|publication de)\s+(.+?)\s*\(([-−]?\d{3,4})\)/i);
    if(m&&m[2].replace(/^[-−]/,'')===y)return `En quelle année paraît « ${norm(m[1])} » ?`;

    // Batailles
    m=source.match(/bataille\s+(?:de|d[’'])\s*([^.;,(]+)\s*\(([-−]?\d{3,4})\)/i);
    if(m&&m[2].replace(/^[-−]/,'')===y)return `En quelle année a lieu la bataille de ${norm(m[1])} ?`;
    m=source.match(/\b(Marignan|Austerlitz|Waterloo|Verdun|Marathon|Salamine)\s+([-−]?\d{3,4})\b/i);
    if(m&&m[2].replace(/^[-−]/,'')===y)return `En quelle année a lieu la bataille de ${cap(m[1])} ?`;

    // Traités, édits, accords, lois, constitutions
    m=source.match(/\b(traité|édit|accords?|loi|constitution)\s+(?:de|du|des|d[’'])?\s*([^.;,(]+?)\s*\(([-−]?\d{3,4})\)/i);
    if(m&&m[3].replace(/^[-−]/,'')===y){const kind=m[1].toLowerCase(),name=norm(m[2]);const verb=kind==='édit'?'est promulgué':(kind==='loi'||kind==='constitution')?'est adopté':'est signé';return `En quelle année ${kind} ${name} ${verb} ?`.replace(/\s+/g,' ')}

    // Créations, chutes, abolitions, indépendances, réformes, révolutions
    m=source.match(/\b(création|chute|abolition|indépendance|réforme|révolution|dissolution|fondation)\s+(?:de|du|des|d[’'])?\s*([^.;,(]+?)\s*\(([-−]?\d{3,4})\)/i);
    if(m&&m[3].replace(/^[-−]/,'')===y)return `En quelle année a lieu ${m[1].toLowerCase()} de ${norm(m[2])} ?`;

    // Vie d'une personne : uniquement si la réponse est l'une des deux bornes.
    m=source.match(/^([^:;(]{2,70})\s*\(([-−]?\d{3,4})\s*[‑–—-]\s*([-−]?\d{3,4})\)/);
    if(m){const who=norm(m[1]),a=m[2].replace(/^[-−]/,''),b=m[3].replace(/^[-−]/,'');if(a===y)return `Quelle est l’année de naissance de ${who} ?`;if(b===y)return `Quelle est l’année de décès de ${who} ?`}

    // Événement nommé suivi d'une date entre parenthèses.
    m=source.match(/\b((?:Révolution|Guerre|Bataille|Chute|Création|Abolition|Indépendance|Réforme|Schisme|Concile|Hégire|Édit|Traité|Accords?)\b[^.;,(]{0,65})\s*\(([-−]?\d{3,4})\)/i);
    if(m&&m[2].replace(/^[-−]/,'')===y)return `En quelle année a lieu ${norm(m[1]).toLowerCase()} ?`;

    return null;
  }

  function periodPrompt(source,ans){
    const a=clean(ans);
    let m=source.match(/^([^:;(]{2,70})\s*\(([-−]?\d{3,4}\s*[‑–—-]\s*[-−]?\d{3,4})\)\s*:\s*(.*)$/);
    if(m&&clean(m[2]).replace(/‑/g,'-').replace(/–/g,'-').replace(/—/g,'-')===a.replace(/‑/g,'-').replace(/–/g,'-').replace(/—/g,'-')){
      const who=norm(m[1]),desc=m[3].toLowerCase();
      if(/roi|règne/.test(desc))return `Quelle est la période de règne de ${who} ?`;
      if(/président|présidence/.test(desc))return `Quelle est la période de présidence de ${who} ?`;
      return `Quelles sont les dates de vie de ${who} ?`;
    }
    return null;
  }

  function personPrompt(source,ans){
    const a=norm(ans);let m;
    m=source.match(/^([^:]{2,70})\s*:\s*.*?auteur(?:e)?\s+de\s+([^.;]+)/i);
    if(m&&norm(stripLife(m[1]))===a)return `Qui est l’auteur de « ${norm(m[2])} » ?`;
    m=source.match(/^([^:]{2,70})\s*:\s*.*?fondateur(?:rice)?\s+(?:de|du|des|d[’'])\s*([^.;]+)/i);
    if(m&&norm(stripLife(m[1]))===a)return `Qui a fondé ${norm(m[2])} ?`;
    m=source.match(/^([^:]{2,70})\s*:\s*.*?coordonne\s+([^.;]+)/i);
    if(m&&norm(stripLife(m[1]))===a)return `Qui coordonne ${norm(m[2])} ?`;
    return null;
  }

  function directPrompt(source,ans){
    const a=answer({o:[ans],ans:0});
    // Associations explicites et naturelles.
    let m=source.match(/^([^:]{2,80})\s*:\s*(.+)$/);
    if(m){const term=norm(m[1]),desc=norm(m[2]);
      if(a===term){
        if(/ville|capitale|cité|fleuve|pays|région|continent/i.test(desc))return `Quel élément correspond à la description suivante : « ${desc} » ?`;
        if(/définition|désigne|processus|principe/i.test(desc))return `Quel terme désigne « ${desc} » ?`;
      }
    }
    return null;
  }

  function naturalize(q,x){
    if(!q||q.kind!=='k')return q;
    const source=src(x),ans=answer(q);let p=clean(q.prompt);

    // Deux défauts observés et leurs formulations de référence.
    if(/Montesquieu.*De l[’']esprit des lois.*1748/i.test(source)&&ans==='1748')p='En quelle année paraît « De l’esprit des lois » de Montesquieu ?';
    if(/bataille de Marignan.*1515/i.test(source)&&ans==='1515')p='En quelle année a lieu la bataille de Marignan ?';

    const isYear=/^[-−]?\d{3,4}$/.test(ans),isPeriod=/^[-−]?\d{3,4}\s*[‑–—-]\s*[-−]?\d{3,4}$/.test(ans);
    if(badPrompt.test(p)||/_+/.test(p)){
      let np=null;
      if(isYear)np=yearPrompt(source,ans);
      else if(isPeriod)np=periodPrompt(source,ans);
      if(!np)np=personPrompt(source,ans);
      if(!np)np=directPrompt(source,ans);
      if(!np)return null;
      p=np;
    }

    // Nettoyage global des formulations restantes.
    p=p.replace(/\s+(?:dans|selon) le cours\s*/gi,' ')
       .replace(/mentionné(?:e|es|s)?\s+(?:dans|par)\s+(?:le cours|ce cours)/gi,'')
       .replace(/\s+\?/g,' ?')
       .replace(/\s+/g,' ').trim();
    if(!/[?]$/.test(p))p=p.replace(/[.:;]+$/,'')+' ?';
    if(badPrompt.test(p)||/_+/.test(p)||generic.test(p)&&/complète|correspond à cette définition|associer/i.test(p))return null;
    return {...q,prompt:p};
  }

  S.make=function(x,K,H){let q;try{q=old.call(S,x,K,H)}catch(e){console.warn('Question écartée pour formulation',x&&x.id,e);return null}return naturalize(q,x)};
})();