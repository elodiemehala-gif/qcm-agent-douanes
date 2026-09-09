(()=>{
const APP=document.getElementById('programmeApp');
const STORE='programme-agent-sept-2026-v2';
let state=JSON.parse(localStorage.getItem(STORE)||'{}');
let view=localStorage.getItem('programme-agent-view')||'today';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const SUBJECTS=[
 ['Mathématiques','Maths'],['Raisonnement logique','Logique'],['Histoire','Histoire'],['Géographie','Géographie'],['EMC','EMC'],['Informatique / environnement numérique','Informatique'],['Organisation et missions des MEF','MEF'],['Actualité','Actualité'],['Culture générale','Culture générale'],['Simulations et banque d’erreurs','Simulations']
];
const weeks=[
{id:'s1',title:'Semaine 1 — 1er au 4 septembre',focus:'Diagnostic, bases maths/logique et premiers grands repères.',days:[
 {date:'2026-09-01',label:'Mardi 1er septembre',blocks:[['12:00–13:30','QCM Agent',[
  ['Diagnostic des matières',['Simulations']],['Calcul mental, fractions, pourcentages',['Maths']],['35–45 QCM maths/logique + création de la banque d’erreurs',['Maths','Logique','Simulations']]
 ]]]},
 {date:'2026-09-02',label:'Mercredi 2 septembre',blocks:[['12:00–13:00','QCM Agent',[
  ['Proportions, règle de trois, moyennes et unités',['Maths']],['QCM maths sans calculatrice + reprise des erreurs de mardi',['Maths','Simulations']]
 ]]]},
 {date:'2026-09-03',label:'Jeudi 3 septembre',blocks:[['09:00–11:00','QCM Agent',[
  ['Logique : suites, analogies, déductions',['Logique']],['QCM logique puis histoire-géographie : grands repères',['Logique','Histoire','Géographie']]
 ]]]},
 {date:'2026-09-04',label:'Vendredi 4 septembre',blocks:[['09:00–11:30','QCM Agent',[
  ['Rappel actif de la semaine',['Simulations']],['Mini-simulation mixte',['Simulations']],['Correction détaillée + banque d’erreurs : établir le score de référence',['Simulations']]
 ]]]}
]},
{id:'s2',title:'Semaine 2 — 7 au 11 septembre',focus:'Sécuriser histoire, géographie et EMC puis faire la simulation n°1.',days:[
 {date:'2026-09-07',label:'Lundi 7 septembre',blocks:[['12:00–13:30','QCM Agent',[
  ['Chronologie France/Europe',['Histoire']],['Institutions civiques et valeurs républicaines',['EMC']],['QCM histoire + EMC',['Histoire','EMC']]
 ]]]},
 {date:'2026-09-08',label:'Mardi 8 septembre',blocks:[['12:00–13:30','QCM Agent',[
  ['Géographie France / UE / monde : territoires et grands ensembles',['Géographie']],['QCM géographie + reprise des erreurs J+1',['Géographie','Simulations']]
 ]]]},
 {date:'2026-09-09',label:'Mercredi 9 septembre',blocks:[['12:00–13:00','QCM Agent',[
  ['Rappel maths/logique des erreurs de la semaine 1',['Maths','Logique','Simulations']],['QCM mixte maths / logique / histoire / géographie',['Maths','Logique','Histoire','Géographie']]
 ]]]},
 {date:'2026-09-10',label:'Jeudi 10 septembre',blocks:[['09:00–11:00','QCM Agent',[
  ['Consolidation histoire-géographie-EMC + rappels espacés',['Histoire','Géographie','EMC']],['Mini-test chronométré de 25–30 questions',['Simulations']]
 ]]]},
 {date:'2026-09-11',label:'Vendredi 11 septembre',blocks:[['09:00–11:30','QCM Agent',[
  ['Stratégie d’épreuve — 10 min',['Simulations']],['Simulation Agent complète n°1 — 1 h 30',['Simulations']],['Correction ciblée et classement des erreurs',['Simulations']]
 ]]]}
]},
{id:'s3',title:'Semaine 3 — 14 au 18 septembre',focus:'Sécuriser informatique, MEF et actualité puis faire la simulation n°2.',days:[
 {date:'2026-09-14',label:'Lundi 14 septembre',blocks:[['12:00–13:30','QCM Agent',[
  ['Bases numériques : données, internet et sécurité',['Informatique']],['QCM environnement numérique',['Informatique']]
 ]]]},
 {date:'2026-09-15',label:'Mardi 15 septembre',blocks:[['12:00–13:30','QCM Agent',[
  ['Organisation des ministères et missions DGFiP / DGDDI / DGCCRF / INSEE / Trésor',['MEF']],['QCM MEF + cartes d’erreurs',['MEF','Simulations']]
 ]]]},
 {date:'2026-09-16',label:'Mercredi 16 septembre',blocks:[['12:00–13:00','QCM Agent',[
  ['Actualité économique, sociale et internationale : fiches factuelles',['Actualité']],['QCM actualité + mix informatique / MEF',['Actualité','Informatique','MEF']]
 ]]]},
 {date:'2026-09-17',label:'Jeudi 17 septembre',blocks:[['09:00–11:00','QCM Agent',[
  ['Reprise des 20 erreurs les plus fréquentes depuis le 1er septembre',['Simulations']],['QCM mélangé toutes matières',['Simulations']]
 ]]]},
 {date:'2026-09-18',label:'Vendredi 18 septembre',blocks:[['09:00–11:30','QCM Agent',[
  ['Rappel actif rapide',['Simulations']],['Simulation Agent complète n°2 — 1 h 30',['Simulations']],['Score + erreurs prioritaires',['Simulations']]
 ]]]}
]},
{id:'s4',title:'Semaine 4 — 21 au 25 septembre',focus:'Passer en automatisation : cartes faibles, séries rapides et simulations n°3 et n°4.',days:[
 {date:'2026-09-21',label:'Lundi 21 septembre',blocks:[['12:00–13:30','QCM Agent',[
  ['Cartes faibles maths / logique',['Maths','Logique']],['Séries rapides, calcul mental et logique chronométrée',['Maths','Logique']]
 ]]]},
 {date:'2026-09-22',label:'Mardi 22 septembre',blocks:[['12:00–13:30','QCM Agent',[
  ['Cartes faibles histoire / géographie / EMC',['Histoire','Géographie','EMC']],['QCM culture générale officielle + actualité',['Culture générale','Actualité']]
 ]]]},
 {date:'2026-09-23',label:'Mercredi 23 septembre',blocks:[['12:00–13:00','QCM Agent',[
  ['Cartes faibles informatique / MEF',['Informatique','MEF']],['QCM informatique / MEF + questions mélangées',['Informatique','MEF','Simulations']]
 ]]]},
 {date:'2026-09-24',label:'Jeudi 24 septembre',blocks:[['09:00–11:00','QCM Agent',[
  ['Restitution sans support des grandes rubriques',['Simulations']],['Simulation Agent complète n°3',['Simulations']]
 ]]]},
 {date:'2026-09-25',label:'Vendredi 25 septembre',blocks:[['09:00–11:30','QCM Agent',[
  ['Correction stratégique',['Simulations']],['Simulation Agent complète n°4',['Simulations']],['Classement final des erreurs à reprendre lundi 28',['Simulations']]
 ]]]}
]},
{id:'s5',title:'Dernière ligne droite — 28 et 29 septembre',focus:'Révision légère le 28, concours Agent le 29.',days:[
 {date:'2026-09-28',label:'Lundi 28 septembre',blocks:[['09:00–10:15','QCM Agent',[
  ['Uniquement fiches d’erreurs et faits à forte probabilité d’oubli',['Simulations']],['25–30 QCM faciles / moyens puis arrêt',['Simulations']]
 ]]]},
 {date:'2026-09-29',label:'Mardi 29 septembre — CONCOURS AGENT',blocks:[['Épreuve','QCM Agent',[
  ['QCM officiel — 1 h 30',['Simulations']],['Lecture précise, gestion du temps et éviter la précipitation',['Simulations']]
 ]]]}
]}
];
const allDays=weeks.flatMap(w=>w.days.map(d=>({...d,week:w.id,weekTitle:w.title,focus:w.focus})));
const taskId=(d,bi,ti)=>`${d.date}-${bi}-${ti}`;
const allTasks=()=>allDays.flatMap(d=>d.blocks.flatMap((b,bi)=>b[2].map((t,ti)=>({id:taskId(d,bi,ti),date:d.date,text:t[0],tags:t[1]}))));
const done=id=>!!state[id];
const percent=tasks=>tasks.length?Math.round(tasks.filter(t=>done(t.id)).length/tasks.length*100):0;
const now=todayISO();
function subjectStats(){const tasks=allTasks(),out={};for(const [label,key] of SUBJECTS){const list=tasks.filter(t=>t.tags.includes(key));out[key]={label,total:list.length,done:list.filter(t=>done(t.id)).length,pct:percent(list)}}return out}
function dayTasks(d){return d.blocks.flatMap((b,bi)=>b[2].map((t,ti)=>({id:taskId(d,bi,ti),date:d.date,text:t[0],tags:t[1]})))}
function weekForDate(date){return weeks.find(w=>w.days.some(d=>d.date===date))||weeks[0]}
function filteredWeeks(){if(view==='all')return weeks;if(view==='today'){const d=allDays.find(x=>x.date===now);return d?[{id:'today',title:'Aujourd’hui',focus:'Programme QCM Agent du jour',days:[d]}]:[]}const w=weekForDate(now);return w?[w]:[]}
function render(){
 const tasks=allTasks(),totalPct=percent(tasks),today=allDays.find(d=>d.date===now),todayList=today?dayTasks(today):[],todayPct=percent(todayList),currentWeek=weekForDate(now),weekTasks=currentWeek?currentWeek.days.flatMap(dayTasks):[],weekPct=percent(weekTasks),subs=subjectStats();
 APP.innerHTML=`<section class="program-hero"><div class="card hero"><span class="tag">QCM Agent uniquement</span><h1>Programme QCM Agent — septembre 2026</h1><p class="muted">Suivi des matières à réviser jusqu’au concours du 29 septembre. Comptabilité, note de synthèse et Inspecteur ont été retirés de cette page.</p><div class="program-stats"><div class="mini-stat"><b>${todayPct}%</b><span>Aujourd’hui</span></div><div class="mini-stat"><b>${weekPct}%</b><span>Cette semaine</span></div><div class="mini-stat"><b>${totalPct}%</b><span>Septembre</span></div></div></div><div class="card program-ring"><div class="ring" style="--p:${totalPct}"><strong>${totalPct}%</strong><small>QCM Agent</small></div></div></section>
 <div class="card"><div class="week-head"><div><h2>Matières à sécuriser</h2><p class="muted small">La progression ci-dessous dépend des tâches cochées dans le programme.</p></div></div><div class="subject-grid">${SUBJECTS.map(([label,key])=>{const s=subs[key];return `<div class="subject-track"><div class="subject-track-head"><b>${esc(label)}</b><span>${s.done}/${s.total}</span></div><div class="bar"><i style="width:${s.pct}%"></i></div><small>${s.pct}% du programme prévu</small></div>`}).join('')}</div></div>
 <div class="view-tabs"><button class="chip ${view==='today'?'on':''}" data-view="today">Aujourd’hui</button><button class="chip ${view==='week'?'on':''}" data-view="week">Cette semaine</button><button class="chip ${view==='all'?'on':''}" data-view="all">Tout septembre</button></div>
 <div id="weeks">${renderWeeks(filteredWeeks())}</div>
 <div class="card"><h2>Objectif de fin septembre</h2><div class="month-goals"><div class="goal-card"><b>Programme officiel</b><span>Revu avant le concours</span></div><div class="goal-card"><b>Simulations</b><span>4 simulations complètes + mini-simulation</span></div><div class="goal-card"><b>Erreurs</b><span>Zones faibles identifiées et reprises</span></div><div class="goal-card"><b>29 septembre</b><span>Concours Agent — QCM officiel 1 h 30</span></div></div><button class="btn alt reset-program" id="resetProgram">Réinitialiser les coches</button></div>`;
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;localStorage.setItem('programme-agent-view',view);render()});
 document.querySelectorAll('.task input').forEach(i=>i.onchange=()=>{state[i.dataset.id]=i.checked;save();render()});
 document.getElementById('resetProgram').onclick=()=>{if(confirm('Réinitialiser uniquement le suivi QCM Agent ?')){state={};save();render()}};
}
function renderWeeks(list){if(!list.length)return `<div class="card empty-day"><div class="rest-icon">✓</div><b>Aucune séance QCM Agent prévue aujourd’hui</b><p class="muted">Passe sur « Cette semaine » ou « Tout septembre » pour voir la suite.</p></div>`;return list.map(w=>{const wt=w.days.flatMap(dayTasks),wp=percent(wt);return `<section><div class="week-head"><div><h2>${esc(w.title)}</h2><p class="muted">${esc(w.focus||'')}</p></div><div class="week-progress"><b>${wp}%</b><br>${wt.filter(t=>done(t.id)).length}/${wt.length} tâches</div></div>${w.days.map(renderDay).join('')}</section>`}).join('')}
function renderDay(d){const dt=dayTasks(d),dp=percent(dt),past=d.date<now,today=d.date===now;return `<article class="card day-card ${today?'today':''} ${past?'past':''}"><div class="day-head"><div><h3>${esc(d.label)}</h3><div class="date-sub">QCM Agent uniquement</div></div><div class="day-score">${dp}%</div></div><div class="day-progress"><i style="width:${dp}%"></i></div>${d.blocks.map((b,bi)=>`<div class="block"><div class="block-head"><span class="time-pill">${esc(b[0])}</span><span class="subject-pill">${esc(b[1])}</span></div><div class="task-list">${b[2].map((t,ti)=>{const id=taskId(d,bi,ti);return `<label class="task ${done(id)?'done':''}"><input type="checkbox" data-id="${id}" ${done(id)?'checked':''}><span>${esc(t[0])}<small class="task-tags">${t[1].map(x=>esc(x)).join(' · ')}</small></span></label>`}).join('')}</div></div>`).join('')}</article>`}
render();
})();