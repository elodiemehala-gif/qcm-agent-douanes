(async()=>{
  const A=document.querySelector('#courseApp'), INDEX=window.QCOURSE_INDEX||{};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const params=new URLSearchParams(location.search), wanted=params.get('matiere')||'';
  const PREF={'Histoire':'HIS','Géographie':'GEO','Enseignement moral et civique':'EMC','Actualité':'ACT','Organisation et missions des ministères économiques et financiers':'ORG','Mathématiques':'MAT','Raisonnement logique':'LOG','Culture générale':'CG'};
  let progressCache=null;

  const dataFiles={
    'histoire':'course-histoire.dat',
    'geographie':'course-geographie.dat',
    'emc':'course-emc.dat',
    'actualite':'clean-actualite.dat',
    'organisation':'clean-organisation.dat',
    'mathematiques':'clean-mathematiques.dat',
    'logique':'clean-logique.dat',
    'culture-generale':'clean-culture-generale.dat'
  };

  function installPayload(payload,name){
    if(!payload||typeof payload!=='object')return false;
    window.QCOURSE_TRANSCRIPTS=window.QCOURSE_TRANSCRIPTS||{};
    if(payload.QCOURSE_TRANSCRIPTS&&payload.QCOURSE_TRANSCRIPTS[name]){
      window.QCOURSE_TRANSCRIPTS[name]=payload.QCOURSE_TRANSCRIPTS[name];return true;
    }
    if(payload[name]&&payload[name].chapters){
      window.QCOURSE_TRANSCRIPTS[name]=payload[name];return true;
    }
    if(payload.title&&Array.isArray(payload.chapters)){
      window.QCOURSE_TRANSCRIPTS[name]=payload;return true;
    }
    const values=Object.values(payload);
    const one=values.find(v=>v&&typeof v==='object'&&Array.isArray(v.chapters));
    if(one){window.QCOURSE_TRANSCRIPTS[name]=one;return true}
    return false;
  }

  function decodeCoursePayload(code,name){
    const text=String(code||'').replace(/^\uFEFF/,'').trim();
    if(!text)throw Error('Le fichier du cours est vide');

    const jsonAttempts=[text,`{${text}}`];
    for(const candidate of jsonAttempts){
      try{if(installPayload(JSON.parse(candidate),name))return}catch{}
    }

    try{
      Function(text)();
      if(window.QCOURSE_TRANSCRIPTS?.[name])return;
    }catch(firstScriptError){
      try{
        const value=Function(`"use strict";return (${text});`)();
        if(installPayload(value,name))return;
      }catch{}
      try{
        const value=Function(`"use strict";return ({${text}});`)();
        if(installPayload(value,name))return;
      }catch{}
      throw new Error(`Format du cours non reconnu (${firstScriptError.message})`);
    }
    throw Error('Le cours a été chargé mais son contenu est introuvable');
  }

  async function loadCourseData(meta,name){
    if(window.QCOURSE_TRANSCRIPTS?.[name])return;
    const file=dataFiles[meta.slug]||`clean-${meta.slug}.dat`;
    const r=await fetch(`${file}?v=24`,{cache:'no-store'});
    if(!r.ok)throw Error(`Impossible de charger le fichier ${file}`);
    const s=(await r.text()).replace(/\s+/g,'');
    let bin;
    try{bin=atob(s)}catch{throw Error('Le fichier du cours est illisible')}
    const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    let code;
    try{
      const ds=new DecompressionStream('gzip');
      code=await new Response(new Blob([u]).stream().pipeThrough(ds)).text();
    }catch{throw Error('Impossible de décompresser le cours')}
    decodeCoursePayload(code,name);
  }

  async function loadProgress(){
    if(progressCache)return progressCache;
    try{
      const chunks=[];
      for(let i=1;i<=12;i++){
        const r=await fetch(`bank-${String(i).padStart(2,'0')}.txt`,{cache:'no-store'});
        if(!r.ok)throw Error('banque');
        chunks.push((await r.text()).trim());
      }
      const bin=atob(chunks.join('')),u=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
      const ds=new DecompressionStream('gzip');
      const p=JSON.parse(await new Response(new Blob([u]).stream().pipeThrough(ds)).text());
      const cats=p.c,n=Array(cats.length).fill(0),rows=p.k.map(([ci])=>({cat:cats[ci],id:`${PREF[cats[ci]]||'X'}-${String(++n[ci]).padStart(4,'0')}`}));
      const P=JSON.parse(localStorage.getItem('qcm-v10')||'{}'),E=JSON.parse(localStorage.getItem('qcm-ex-v4')||'{}'),out={};
      cats.forEach(cat=>{
        if(cat==='Mathématiques'){
          const e=E['Mathématiques']||{a:0,c:0};
          out[cat]={seen:e.a||0,total:e.a||0,mastered:e.c||0,errors:Math.max(0,(e.a||0)-(e.c||0)),rate:e.a?Math.round(100*e.c/e.a):0,exercise:true};return;
        }
        const rr=rows.filter(x=>x.cat===cat);let seen=0,mastered=0,errors=0;
        rr.forEach(x=>{const r=P[x.id];if(r?.a)seen++;if(r?.s>=2&&r?.c>=2)mastered++;if(r?.w&&r?.s===0)errors++});
        out[cat]={seen,total:rr.length,mastered,errors,rate:rr.length?Math.round(100*seen/rr.length):0};
      });
      progressCache=out;return out;
    }catch{progressCache={};return progressCache}
  }

  function subjectList(){
    const cards=Object.entries(INDEX).map(([name,m])=>`<a class="course-subject-card" href="cours.html?matiere=${encodeURIComponent(name)}&rev=24"><div class="card"><div class="course-subject-top"><div><b>${esc(m.title)}</b><span>${m.chapters} chapitre${m.chapters>1?'s':''}</span></div><span class="course-open">→</span></div><p>Lire le cours transcrit et structuré</p></div></a>`).join('');
    A.innerHTML=`<div class="hero card transcript-hero"><span class="tag">Bibliothèque de cours</span><h1 class="course-title">Cours complets</h1><p class="course-sub">Les cours sont indépendants des QCM : lecture rapide, recherche par mot-clé et navigation par chapitre.</p></div><div class="course-library">${cards}<a class="course-subject-card info-special" href="informatique.html?rev=24"><div class="card"><div class="course-subject-top"><div><b>Informatique / Culture numérique</b><span>10 chapitres</span></div><span class="course-open">→</span></div><p>Ouvrir le cours de culture numérique</p></div></a></div>`;
  }

  const allText=sec=>[sec.title,...(sec.body||[]),...(sec.key||[])].join(' ');
  const matchSection=(sec,q)=>!q||norm(allText(sec)).includes(norm(q));
  const matchChapter=(ch,q)=>!q||norm(ch.title).includes(norm(q))||(ch.sections||[]).some(sec=>matchSection(sec,q));
  const hilite=(text,q)=>{const safe=esc(text);if(!q)return safe;const needle=esc(q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');try{return safe.replace(new RegExp(`(${needle})`,'ig'),'<mark>$1</mark>')}catch{return safe}};

  function sectionHTML(sec,q){
    if(q&&!matchSection(sec,q)&&!norm(sec.title).includes(norm(q)))return'';
    const body=(sec.body||[]).map(t=>`<p>${hilite(t,q)}</p>`).join('');
    const key=sec.key?.length?`<div class="remember-box"><b>À retenir</b><ul>${sec.key.map(k=>`<li>${hilite(k,q)}</li>`).join('')}</ul></div>`:'';
    return `<section class="lesson-section"><div class="lesson-title-row"><h3>${hilite(sec.title,q)}</h3>${sec.source?`<span>${esc(sec.source)}</span>`:''}</div>${body}${key}</section>`;
  }

  async function renderSubject(name){
    const meta=INDEX[name];if(!meta){subjectList();return}
    await loadCourseData(meta,name);
    const C=window.QCOURSE_TRANSCRIPTS?.[name];if(!C)throw Error('Cours introuvable');
    let focus=params.get('chapitre')||'',query='';
    const progress=await loadProgress(),pr=progress[name]||null;
    const render=()=>{
      const chapters=(C.chapters||[]).filter(ch=>(!focus||ch.id===focus)&&matchChapter(ch,query));
      const stat=pr?(pr.exercise?`<div class="course-summary compact"><div class="card"><div class="course-kpi">${pr.rate}%</div><span class="muted small">réussite aux exercices</span></div><div class="card"><div class="course-kpi">${pr.seen}</div><span class="muted small">exercices tentés</span></div><div class="card"><div class="course-kpi">${pr.errors}</div><span class="muted small">erreurs enregistrées</span></div></div>`:`<div class="course-summary compact"><div class="card"><div class="course-kpi">${pr.rate}%</div><span class="muted small">du QCM rencontré</span></div><div class="card"><div class="course-kpi">${pr.mastered}</div><span class="muted small">points maîtrisés</span></div><div class="card"><div class="course-kpi">${pr.errors}</div><span class="muted small">points à revoir</span></div></div>`):'';
      A.innerHTML=`<div class="hero card transcript-hero"><div class="transcript-title-row"><div><span class="tag">Cours indépendant des QCM</span><h1 class="course-title">${esc(C.title||meta.title)}</h1><p class="course-sub">Transcription propre et structurée du cours pour une consultation rapide.</p></div><a class="btn alt transcript-qcm-link" href="v2.html?rev=24">Retour aux QCM</a></div><label class="course-search"><span>⌕</span><input id="courseSearch" value="${esc(query)}" placeholder="Rechercher une notion, une date, un nom…"></label><div class="course-jump"><button class="chip ${!focus?'on':''}" data-ch="">Tout le cours</button>${(C.chapters||[]).map(ch=>`<button class="chip ${focus===ch.id?'on':''}" data-ch="${esc(ch.id)}">${esc(ch.title.replace(/^(?:[IVX]+\.|[A-M]\.|[A-F]\s*[-–]|[0-9]+\.)\s*/,''))}</button>`).join('')}</div></div>${stat}<div id="courseResults">${chapters.length?chapters.map(ch=>{const sections=(ch.sections||[]).map(sec=>sectionHTML(sec,query)).join('');return `<article class="card real-course-chapter" id="${esc(ch.id)}"><div class="course-chapter-head"><div><span class="course-kicker">Chapitre</span><h2>${hilite(ch.title,query)}</h2></div></div>${sections}</article>`}).join(''):`<div class="card course-empty"><h2>Aucun résultat</h2><p>Essaie un autre mot-clé.</p></div>`}</div><div class="card source-card"><h2>Source du cours</h2><p class="muted">${esc(C.source||meta.source||'')}</p><small>Le contenu est remis en forme pour la lecture. Les QCM restent séparés du cours.</small></div>`;
      document.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{focus=b.dataset.ch||'';query='';render();scrollTo({top:0,behavior:'smooth'})});
      const input=document.getElementById('courseSearch');let timer;input.oninput=e=>{query=e.target.value.trim();clearTimeout(timer);timer=setTimeout(render,160)};
    };
    render();
  }

  try{if(!wanted||!INDEX[wanted])subjectList();else await renderSubject(wanted)}
  catch(e){A.innerHTML=`<div class="card"><h2>Impossible de charger le cours</h2><p>${esc(e.message||e)}</p><div class="actions"><a class="btn alt" href="cours.html?rev=24">Retour à la bibliothèque</a><a class="btn" href="v2.html?rev=24">Retour aux QCM</a></div></div>`;console.error(e)}
})();