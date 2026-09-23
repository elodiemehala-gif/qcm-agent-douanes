(()=>{
  const PLAN_KEY='qcm-contest-plan-v1';
  const SESSION_KEY='qcm-contest-sessions-v1';
  const EXAM_DATE='2026-09-29';
  const DAYS=[
    {date:'2026-09-24',label:'Jeudi 24',title:'Diagnostic et acquisition',quota:200,tasks:[
      {id:'thu-mock',time:'09:00',label:'QCM blanc de 50 questions en 1 h 30',cat:'__quiz__'},
      {id:'thu-correct',time:'10:30',label:'Corriger le QCM et classer les matières : vert, orange ou rouge'},
      {id:'thu-math',time:'11:30',label:'Mathématiques : pourcentages, proportions, moyennes, heures et vitesses',cat:'Mathématiques'},
      {id:'thu-logic',time:'14:00',label:'Raisonnement logique : suites, tableaux, placements et déductions',cat:'Raisonnement logique'},
      {id:'thu-org',time:'15:30',label:'Organisation et missions : Bercy, directions, impôts, TVA et recouvrement',cat:'Organisation et missions'},
      {id:'thu-emc-info',time:'17:00',label:'EMC puis culture numérique',cat:'Enseignement moral et civique'},
      {id:'thu-visuals',time:'18:15',label:'Frises d’histoire et cartes de géographie',cat:'Histoire'},
      {id:'thu-errors',time:'19:00',label:'Terminer par le mode « Mes erreurs »',cat:'__quiz__'}
    ]},
    {date:'2026-09-25',label:'Vendredi 25',title:'Consolidation ciblée · 3 heures',quota:80,tasks:[
      {id:'fri-math-logic',time:'09:00',label:'30 min de mathématiques + 30 min de logique',cat:'Mathématiques'},
      {id:'fri-core',time:'10:00',label:'Organisation, EMC et numérique : séries courtes',cat:'Organisation et missions'},
      {id:'fri-news',time:'11:00',label:'Actualité : dates, dirigeants, conflits, économie et organisations',cat:'Actualité'},
      {id:'fri-errors',time:'11:45',label:'Relire et retester les erreurs de jeudi',cat:'__quiz__'}
    ]},
    {date:'2026-09-26',label:'Samedi 26',title:'Récupération',quota:0,rest:true,tasks:[
      {id:'sat-rest',time:'Toute la journée',label:'Repos complet après le travail'},
      {id:'sat-visuals',time:'Optionnel',label:'20 minutes de frises seulement si tu en as l’énergie',cat:'Histoire'}
    ]},
    {date:'2026-09-27',label:'Dimanche 27',title:'Grande journée d’entraînement',quota:200,tasks:[
      {id:'sun-mock',time:'09:00',label:'Deuxième QCM blanc de 50 questions',cat:'__quiz__'},
      {id:'sun-correct',time:'10:30',label:'Correction et comparaison avec jeudi'},
      {id:'sun-red1',time:'11:30',label:'Travailler la matière rouge n° 1',cat:'__quiz__'},
      {id:'sun-red2',time:'14:00',label:'Travailler la matière rouge n° 2',cat:'__quiz__'},
      {id:'sun-math',time:'15:30',label:'Mathématiques chronométrées',cat:'Mathématiques'},
      {id:'sun-logic',time:'16:45',label:'Logique chronométrée',cat:'Raisonnement logique'},
      {id:'sun-visuals',time:'18:00',label:'Histoire et géographie avec les supports visuels',cat:'Géographie'},
      {id:'sun-news',time:'18:45',label:'Actualité puis dernier passage dans « Mes erreurs »',cat:'Actualité'}
    ]},
    {date:'2026-09-28',label:'Lundi 28',title:'Stabilisation',quota:120,tasks:[
      {id:'mon-mock',time:'09:00',label:'Dernier QCM blanc de 50 questions',cat:'__quiz__'},
      {id:'mon-correct',time:'10:30',label:'Correction complète du sujet blanc'},
      {id:'mon-weak',time:'11:45',label:'Dernière matière encore rouge ou orange',cat:'__quiz__'},
      {id:'mon-core',time:'14:00',label:'Organisation, EMC et numérique : définitions et distinctions',cat:'Organisation et missions'},
      {id:'mon-visuals',time:'15:15',label:'Frises d’histoire, cartes de géographie et actualité',cat:'Histoire'},
      {id:'mon-formulas',time:'16:30',label:'Formules de mathématiques + 10 exercices de logique',cat:'Mathématiques'},
      {id:'mon-stop',time:'18:00',label:'Arrêter les révisions, préparer les affaires et se reposer'}
    ]},
    {date:'2026-09-29',label:'Mardi 29',title:'Jour du concours',quota:0,exam:true,tasks:[
      {id:'exam-review',time:'Matin',label:'20 minutes maximum : formules, frises et erreurs récurrentes'},
      {id:'exam-kit',time:'Avant de partir',label:'Convocation, pièce d’identité et stylo bille noir'},
      {id:'exam-strategy',time:'Épreuve',label:'Réponses certaines → questions difficiles → 5 minutes de vérification'}
    ]}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const state=()=>read(PLAN_KEY,{done:{}});
  const sessions=()=>read(SESSION_KEY,[]);
  const saveState=s=>localStorage.setItem(PLAN_KEY,JSON.stringify(s));
  const saveSessions=s=>localStorage.setItem(SESSION_KEY,JSON.stringify(s.slice(-250)));
  const totalQuota=DAYS.reduce((n,d)=>n+d.quota,0);
  const questionsFor=date=>sessions().filter(s=>s.date===date).reduce((n,s)=>n+(Number(s.count)||0),0);
  const questionsTotal=()=>DAYS.reduce((n,d)=>n+questionsFor(d.date),0);
  const taskDone=id=>!!state().done?.[id];
  const doneCount=day=>day.tasks.filter(t=>taskDone(t.id)).length;
  const dayForToday=()=>{
    const today=localDate(),exact=DAYS.find(d=>d.date===today);
    if(exact)return exact;
    if(today<DAYS[0].date)return DAYS[0];
    return DAYS.find(d=>d.date>today)||DAYS[DAYS.length-1];
  };
  const expectedNow=()=>{
    const now=new Date(),today=localDate(now),hour=now.getHours()+now.getMinutes()/60;
    let expected=0;
    for(const day of DAYS){
      if(day.date<today)expected+=day.quota;
      else if(day.date===today){
        const share=hour<12?0:hour<16?0.35:hour<20?0.75:1;
        expected+=Math.round(day.quota*share);
      }
    }
    return expected;
  };
  const pace=()=>{
    const today=localDate(),done=questionsTotal();
    if(today<DAYS[0].date)return{kind:'ready',label:'Départ demain',detail:'Le programme commence jeudi à 9 h.'};
    if(today>EXAM_DATE)return{kind:'done',label:'Programme terminé',detail:`${done} questions enregistrées.`};
    const expected=expectedNow(),delta=done-expected;
    if(delta>=20)return{kind:'ahead',label:'En avance',detail:`${delta} question${delta>1?'s':''} d’avance sur le rythme prévu.`};
    if(delta<=-20)return{kind:'late',label:'À rattraper',detail:`${Math.abs(delta)} question${Math.abs(delta)>1?'s':''} de retard sur le rythme prévu.`};
    return{kind:'steady',label:'Dans le rythme',detail:'Ton avancement correspond au programme prévu.'};
  };
  const reminder=()=>{
    const today=localDate(),now=new Date(),day=DAYS.find(d=>d.date===today);
    if(today<DAYS[0].date)return'Demain à 9 h : commence par le QCM blanc de 50 questions. Ce soir, prépare simplement ton espace et repose-toi.';
    if(today>EXAM_DATE)return'Le concours est passé : le programme intensif est terminé.';
    if(!day)return'Journée sans quota : récupère et conserve seulement une courte révision visuelle si nécessaire.';
    if(day.rest)return'Repos aujourd’hui. Les 20 minutes de frises sont entièrement facultatives.';
    if(day.exam)return'Aujourd’hui : 20 minutes de relecture maximum, puis aucune nouvelle notion.';
    const open=day.tasks.filter(t=>!taskDone(t.id));
    if(!open.length&&questionsFor(today)>=day.quota)return'Journée validée. Arrête-toi ici : le repos fait maintenant partie de la préparation.';
    const timed=open.filter(t=>/^\d{2}:\d{2}$/.test(t.time));
    const mins=now.getHours()*60+now.getMinutes();
    const due=[...timed].reverse().find(t=>{const [h,m]=t.time.split(':').map(Number);return h*60+m<=mins});
    const next=due||open[0];
    return next?`À faire maintenant : ${next.label}`:`Il reste ${Math.max(0,day.quota-questionsFor(today))} questions pour valider le quota du jour.`;
  };
  const taskHTML=t=>`<div class="contest-task ${taskDone(t.id)?'done':''}"><label><input type="checkbox" data-plan-task="${esc(t.id)}" ${taskDone(t.id)?'checked':''}><span class="contest-check" aria-hidden="true">✓</span><span><small>${esc(t.time)}</small><b>${esc(t.label)}</b></span></label>${t.cat?`<button type="button" class="contest-task-go" data-plan-cat="${esc(t.cat)}">Ouvrir</button>`:''}</div>`;
  const innerHTML=()=>{
    const today=localDate(),focus=dayForToday(),displayDone=questionsFor(focus.date),p=pace(),total=questionsTotal(),active=DAYS.find(d=>d.date===today),canAdd=!!active?.quota,daysLeft=Math.max(0,Math.ceil((new Date(`${EXAM_DATE}T00:00:00`)-new Date(`${today}T00:00:00`))/86400000));
    return`<div class="card contest-plan ${p.kind}">
      <div class="contest-head"><div><span class="contest-kicker">OBJECTIF CONCOURS · 29 SEPTEMBRE</span><h2>${today===EXAM_DATE?'C’est le jour J':daysLeft?`J-${daysLeft} avant l’épreuve`:'Programme intensif'}</h2></div><span class="contest-pace">${esc(p.label)}</span></div>
      <div class="contest-reminder"><span aria-hidden="true">●</span><div><b>Rappel du moment</b><p>${esc(reminder())}</p></div></div>
      <div class="contest-stats">
        <div><strong>${displayDone}<small> / ${focus.quota||'—'}</small></strong><span>${focus.date===today?'questions aujourd’hui':`objectif ${focus.label.toLowerCase()}`}</span></div>
        <div><strong>${total}<small> / ${totalQuota}</small></strong><span>questions du programme</span></div>
        <div><strong>${doneCount(focus)}<small> / ${focus.tasks.length}</small></strong><span>tâches cochées</span></div>
      </div>
      ${focus.quota?`<div class="contest-progress"><i style="width:${Math.min(100,Math.round(displayDone/focus.quota*100))}%"></i></div>`:''}
      <p class="contest-pace-detail">${esc(p.detail)}</p>
      <div class="contest-actions"><button type="button" class="btn" data-plan-toggle>${focus.date===today?'Voir le programme du jour':'Voir le programme'}</button>${canAdd?'<button type="button" class="btn alt" data-plan-add="10">+10 faites ailleurs</button><button type="button" class="btn alt" data-plan-add="50">+50 sujet blanc</button>':''}</div>
      <div class="contest-days" data-plan-days hidden>${DAYS.map(day=>`<details ${day.date===focus.date?'open':''}><summary><span><b>${esc(day.label)}</b><small>${esc(day.title)}</small></span><span>${questionsFor(day.date)}${day.quota?' / '+day.quota:''}</span></summary><div class="contest-day-body">${day.tasks.map(taskHTML).join('')}</div></details>`).join('')}</div>
      <p class="contest-footnote">Les sessions terminées dans l’application sont comptées automatiquement.${canAdd?' Utilise les boutons +10 ou +50 pour un entraînement fait sur papier ou ailleurs.':' Le compteur quotidien s’active jeudi 24.'}</p>
    </div>`;
  };
  let expanded=false;
  const homeHTML=()=>`<section id="contestPlanMount">${innerHTML()}</section>`;
  let lastOptions={};
  const bind=(options={})=>{
    lastOptions=options;const mount=document.getElementById('contestPlanMount');if(!mount)return;
    const rebind=()=>{mount.innerHTML=innerHTML();bind(lastOptions)};
    const days=mount.querySelector('[data-plan-days]');if(days)days.hidden=!expanded;
    const toggle=mount.querySelector('[data-plan-toggle]');if(toggle){toggle.textContent=expanded?'Masquer le programme':(dayForToday().date===localDate()?'Voir le programme du jour':'Voir le programme');toggle.addEventListener('click',()=>{expanded=!expanded;days.hidden=!expanded;toggle.textContent=expanded?'Masquer le programme':(dayForToday().date===localDate()?'Voir le programme du jour':'Voir le programme')})}
    mount.querySelectorAll('[data-plan-task]').forEach(input=>input.addEventListener('change',()=>{const s=state();s.done=s.done||{};s.done[input.dataset.planTask]=input.checked;saveState(s);rebind()}));
    mount.querySelectorAll('[data-plan-add]').forEach(button=>button.addEventListener('click',()=>{recordSession({id:`external-${Date.now()}`,cat:'Entraînement extérieur',count:Number(button.dataset.planAdd),correct:null,external:true});rebind()}));
    mount.querySelectorAll('[data-plan-cat]').forEach(button=>button.addEventListener('click',()=>options.openCategory?.(button.dataset.planCat)));
  };
  function recordSession(entry={}){
    const list=sessions(),id=entry.id||`session-${Date.now()}`;
    if(list.some(s=>s.id===id))return;
    list.push({id,date:entry.date||localDate(),at:new Date().toISOString(),cat:entry.cat||'QCM',count:Number(entry.count)||0,correct:Number.isFinite(entry.correct)?entry.correct:null,external:!!entry.external});
    saveSessions(list);
  }
  window.QCONTEST_PLAN={DAYS,homeHTML,bind,recordSession,questionsFor,questionsTotal,localDate};
})();
