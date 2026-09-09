(()=>{
const APP=document.getElementById('infoApp'),C=window.QINFO_COURSE,B=window.QINFO_BANK;
if(!APP||!C)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pct=(a,b)=>b?Math.round(100*a/b):0;
function progressFor(id){
  const P=JSON.parse(localStorage.getItem('qcm-info-v1')||'{}');
  const qs=(B?.questions||[]).filter(q=>q.c===id);let seen=0,mastered=0;
  qs.forEach(q=>{const globalIndex=(B.questions||[]).indexOf(q),r=P[`INF-${String(globalIndex+1).padStart(3,'0')}`];if(r?.a)seen++;if(r?.s>=2&&r?.c>=2)mastered++});
  return{seen,mastered,total:qs.length};
}
function setNav(){document.querySelectorAll('.info-nav button[data-r]').forEach(b=>b.classList.toggle('on',b.dataset.r==='course'))}
function matches(sec,q){if(!q)return true;const hay=[sec.title,...(sec.body||[]),...(sec.key||[])].join(' ').toLowerCase();return hay.includes(q.toLowerCase())}
function renderCourse(focus=null,query=''){
  setNav();
  const groups=[...new Set(C.chapters.map(x=>x.group))];
  const normalized=query.trim();
  APP.innerHTML=`<div class="card hero real-course-hero"><span class="tag">Transcription propre</span><h1>${esc(C.intro.title)}</h1><p class="muted">Les trois fascicules ont été retranscrits et remis en forme pour une consultation rapide, indépendamment des QCM. Les encadrés « À retenir » servent seulement de repères de lecture.</p><div class="course-search-wrap"><span>⌕</span><input id="courseSearch" class="course-search" type="search" placeholder="Rechercher une notion : RGPD, phishing, cloud…" value="${esc(normalized)}"></div><div class="course-jump"><button class="chip ${focus===null?'on':''}" data-jump="">Tout le cours</button>${C.chapters.map(ch=>`<button class="chip ${focus===ch.id?'on':''}" data-jump="${ch.id}">${esc(ch.title.replace(/^\d+\.\s*/,''))}</button>`).join('')}</div></div>${groups.map(g=>{const chapters=C.chapters.filter(x=>x.group===g&&(!focus||x.id===focus)).map(ch=>({...ch,sections:ch.sections.filter(sec=>matches(sec,normalized))})).filter(ch=>!normalized||ch.sections.length);if(!chapters.length)return'';return`<div class="info-group course-group">${esc(g)}</div>${chapters.map(ch=>{const p=progressFor(ch.id);return`<article class="card real-course-chapter" id="course-${ch.id}"><div class="course-chapter-head"><div><span class="course-kicker">Chapitre</span><h2>${esc(ch.title)}</h2></div><div class="course-progress"><b>${pct(p.seen,p.total)}%</b><span>${p.seen}/${p.total} QCM vus</span></div></div><div class="bar"><i style="width:${pct(p.seen,p.total)}%"></i></div>${ch.sections.map(sec=>`<section class="lesson-section"><h3>${esc(sec.title)}</h3>${sec.body.map(t=>`<p>${esc(t)}</p>`).join('')}${sec.key?.length?`<div class="remember-box"><b>À retenir</b><ul>${sec.key.map(k=>`<li>${esc(k)}</li>`).join('')}</ul></div>`:''}<div class="lesson-source">Source : ${esc(sec.source)}</div></section>`).join('')}<div class="course-end-actions"><a class="btn alt" href="informatique.html?rev=22">Faire des QCM sur ce chapitre</a></div></article>`}).join('')}`}).join('')}${normalized&&!C.chapters.some(ch=>(!focus||ch.id===focus)&&ch.sections.some(sec=>matches(sec,normalized)))?`<div class="card"><h2>Aucun résultat</h2><p class="muted">Essaie un mot plus court ou une autre notion.</p></div>`:''}<div class="card source-card"><h2>À propos de ce cours</h2><p class="muted">Cette page est la transcription mise au propre des trois fascicules « Culture numérique 1, 2 et 3 ». Elle est conçue comme un cours autonome à consulter rapidement ; les PDF originaux ne sont pas nécessaires pour l’utiliser.</p></div>`;
  document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>renderCourse(b.dataset.jump||null,normalized));
  const s=document.getElementById('courseSearch');if(s){let timer;s.oninput=e=>{clearTimeout(timer);timer=setTimeout(()=>renderCourse(focus,e.target.value),180)}}
  if(!normalized)scrollTo({top:0,behavior:'smooth'});
}
const courseBtn=document.querySelector('.info-nav button[data-r="course"]');if(courseBtn)courseBtn.onclick=()=>renderCourse(null,'');
document.addEventListener('click',e=>{const x=e.target.closest('#courseNow');if(!x)return;e.preventDefault();e.stopImmediatePropagation();renderCourse(null,'')},true);
window.renderInfoCourse=renderCourse;
})();