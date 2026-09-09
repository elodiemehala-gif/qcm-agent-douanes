(()=>{
const app=document.getElementById('app');
const bank=window.QINFO_BANK;
const infoStore=()=>JSON.parse(localStorage.getItem('qcm-info-v1')||'{}');
const infoStats=()=>{const P=infoStore(),n=bank?.questions?.length||0;let seen=0,mastered=0,errors=0;(bank?.questions||[]).forEach((_,i)=>{const r=P[`INF-${String(i+1).padStart(3,'0')}`];if(r?.a)seen++;if(r?.s>=2&&r?.c>=2)mastered++;if(r?.w&&r?.s===0)errors++});return{n,seen,mastered,errors,p:n?Math.round(seen*100/n):0}};
const infoUrl='informatique.html?rev=24';
function card(){const s=infoStats(),d=document.createElement('div');d.className='card cat info-main-card';d.innerHTML=`<b>Informatique / Culture numérique</b><span class="muted">10 chapitres · ${s.n} QCM pédagogiques · ${s.errors} à revoir</span><div class="bar"><i style="width:${s.p}%"></i></div><span class="tag practice">Nouvelle matière</span><button type="button" class="course-pill compact info-course-pill">📖 <span>Cours</span></button>`;d.addEventListener('click',()=>location.href=infoUrl);d.querySelector('.info-course-pill').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();location.href=infoUrl});return d}
function decorate(){
 const sub=document.querySelector('.brand small');if(sub&&/^8 matières/.test(sub.textContent))sub.textContent=sub.textContent.replace(/^8 matières/,'9 matières');
 const heads=[...app.querySelectorAll('h2')];const mh=heads.find(h=>h.textContent.trim()==='Matières');if(mh){let grid=mh.nextElementSibling;if(grid?.classList.contains('grid')&&!grid.querySelector('.info-main-card'))grid.appendChild(card())}
 const matterStep=[...app.querySelectorAll('.card.scope')].find(x=>x.querySelector('.step b')?.textContent.trim()==='Matière');if(matterStep){const chips=matterStep.querySelector('.chips');if(chips&&!chips.querySelector('[data-info-chip]')){const b=document.createElement('button');b.className='chip';b.dataset.infoChip='1';b.textContent='Informatique / Culture numérique';b.onclick=()=>location.href=infoUrl;chips.appendChild(b)}}
 const inv=heads.find(h=>h.textContent.startsWith('Inventaire'));if(inv&&!app.querySelector('.info-inventory-link')){const b=document.createElement('button');b.className='btn alt info-inventory-link';b.textContent='Voir les notions d’informatique';b.onclick=()=>location.href=infoUrl;inv.insertAdjacentElement('afterend',b)}
 const prog=heads.find(h=>h.textContent.trim()==='Progression');if(prog&&!app.querySelector('.info-stat-card')){const s=infoStats(),grid=prog.nextElementSibling;if(grid?.classList.contains('grid')){const d=document.createElement('div');d.className='card info-stat-card';d.innerHTML=`<b>Informatique</b><div class="stat">${s.p}%</div><span class="muted">${s.seen}/${s.n} vus · ${s.mastered} maîtrisés · ${s.errors} à revoir</span><div class="bar"><i style="width:${s.p}%"></i></div>`;d.onclick=()=>location.href=infoUrl;grid.appendChild(d)}}
}
if(app)new MutationObserver(decorate).observe(app,{childList:true,subtree:true});decorate();
})();