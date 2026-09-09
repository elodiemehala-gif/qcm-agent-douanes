(async()=>{
  const A=document.querySelector('#courseApp');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const pct=(a,b)=>b?Math.round(100*a/b):0;
  const params=new URLSearchParams(location.search);
  const wanted=params.get('matiere')||'';
  let chunks=[];
  for(let i=1;i<=12;i++){
    const r=await fetch(`bank-${String(i).padStart(2,'0')}.txt`,{cache:'no-store'});
    if(!r.ok)throw Error('Banque de cours introuvable');
    chunks.push((await r.text()).trim());
  }
  const bin=atob(chunks.join('')),u=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  const ds=new DecompressionStream('gzip');
  const p=JSON.parse(await new Response(new Blob([u]).stream().pipeThrough(ds)).text());
  const cats=p.c,pref=['HIS','GEO','EMC','ACT','ORG','MAT','LOG','CG'],n=Array(8).fill(0);
  const raw=p.k.map(([ci,page,text])=>({ci,page,text:String(text||'').replace(/\s+/g,' ').trim(),cat:cats[ci],id:`${pref[ci]}-${String(++n[ci]).padStart(4,'0')}`}));
  const P=JSON.parse(localStorage.getItem('qcm-v10')||'{}');
  const E=JSON.parse(localStorage.getItem('qcm-ex-v4')||'{}');
  const state=id=>{const r=P[id];if(!r||!r.a)return'new';if(r.s>=2&&r.c>=2)return'mastered';if(r.w&&r.s===0)return'error';return'seen'};
  const labelState=s=>({new:'Pas encore vue',seen:'Vue',error:'À revoir',mastered:'Maîtrisée'}[s]||s);
  const chapterOf=x=>window.QCHAPTER?.chapter?window.QCHAPTER.chapter(x):'Cours';

  function subjectList(){
    A.innerHTML=`<div class="hero card"><h1 class="course-title">Choisis une matière</h1><p class="course-sub">Chaque cours est présenté par chapitres avec ta progression actuelle.</p></div><div class="course-list">${cats.map(c=>`<a href="cours.html?matiere=${encodeURIComponent(c)}"><div class="card"><b>${esc(c)}</b><p class="muted small">Ouvrir le cours →</p></div></a>`).join('')}</div>`;
  }

  function mathView(){
    const templates=Object.values(window.QMATH_BANK?.templates||{});
    const groups={};templates.forEach(t=>(groups[t.chapter]||(groups[t.chapter]=[])).push(t));
    const er=E['Mathématiques']||{a:0,c:0},acc=er.a?pct(er.c,er.a):0;
    A.innerHTML=`<div class="hero card"><h1 class="course-title">Mathématiques</h1><p class="course-sub">Retrouve le cours de référence et les familles d’exercices utilisées dans le QCM.</p><a class="btn course-math-link" href="cours-maths.html">📖 Ouvrir le cours complet de maths</a></div><div class="course-summary"><div class="card"><div class="course-kpi">${acc}%</div><span class="muted small">réussite aux exercices</span></div><div class="card"><div class="course-kpi">${er.a||0}</div><span class="muted small">exercices tentés</span></div><div class="card"><div class="course-kpi">${templates.length}</div><span class="muted small">familles d’exercices</span></div></div>${Object.entries(groups).map(([ch,arr])=>`<div class="card course-chapter"><details><summary><h3>${esc(ch)}</h3><div class="chapter-meta">${arr.length} type(s) d’exercice</div></summary><div class="course-points">${arr.map(t=>`<div class="course-point seen"><span class="course-dot"></span><div><p>${esc(t.title)}</p><small>Exercice renouvelable</small></div></div>`).join('')}</div></details></div>`).join('')}`;
  }

  function normalView(cat){
    const rows=raw.filter(x=>x.cat===cat);
    if(!rows.length){A.innerHTML='<div class="card course-empty">Aucun contenu trouvé pour cette matière.</div>';return}
    const groups={};rows.forEach(x=>{const ch=chapterOf(x)||'Cours';(groups[ch]||(groups[ch]=[])).push(x)});
    let seen=0,mastered=0,errors=0;rows.forEach(x=>{const s=state(x.id);if(s!=='new')seen++;if(s==='mastered')mastered++;if(s==='error')errors++});
    A.innerHTML=`<div class="hero card"><h1 class="course-title">${esc(cat)}</h1><p class="course-sub">Vue structurée des contenus utilisés par le QCM. Tu peux ouvrir chaque chapitre pour revoir les points du cours.</p></div><div class="course-summary"><div class="card"><div class="course-kpi">${pct(seen,rows.length)}%</div><span class="muted small">du cours rencontré</span></div><div class="card"><div class="course-kpi">${mastered}</div><span class="muted small">points maîtrisés</span></div><div class="card"><div class="course-kpi">${errors}</div><span class="muted small">points à revoir</span></div></div>${Object.entries(groups).map(([ch,arr])=>{let cs=0,cm=0,ce=0;arr.forEach(x=>{const s=state(x.id);if(s!=='new')cs++;if(s==='mastered')cm++;if(s==='error')ce++});return`<div class="card course-chapter"><details><summary><h3>${esc(ch)}</h3><div class="chapter-meta">${cs}/${arr.length} vus · ${cm} maîtrisés${ce?' · '+ce+' à revoir':''}</div><div class="bar"><i style="width:${pct(cs,arr.length)}%"></i></div></summary><div class="course-points">${arr.map(x=>{const s=state(x.id);return`<div class="course-point ${s}"><span class="course-dot"></span><div><p>${esc(x.text)}</p><small>Page ${x.page} · ${labelState(s)}</small></div></div>`}).join('')}</div></details></div>`}).join('')}`;
  }

  if(!wanted||!cats.includes(wanted))subjectList();
  else if(wanted==='Mathématiques')mathView();
  else normalView(wanted);
})().catch(e=>{document.querySelector('#courseApp').innerHTML=`<div class="card"><h2>Impossible de charger le cours</h2><p>${String(e.message||e)}</p></div>`;console.error(e)});