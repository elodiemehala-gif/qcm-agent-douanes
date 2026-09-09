(()=>{
  const openCourse=c=>{location.href='cours.html?matiere='+encodeURIComponent(c)+'&rev=23'};
  function addPill(card,c,compact=false){
    if(!card||!c||card.querySelector('.course-pill'))return;
    const b=document.createElement('button');
    b.type='button';
    b.className='course-pill'+(compact?' compact':'');
    b.innerHTML='📖 <span>Cours</span>';
    b.title='Ouvrir le cours transcrit et voir ta progression';
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openCourse(c)});
    card.appendChild(b);
  }
  function decorate(){
    document.querySelectorAll('.cat[data-cat]').forEach(card=>addPill(card,card.dataset.cat));
    document.querySelectorAll('.card.scope').forEach(scope=>{
      const title=scope.querySelector('.step b');
      if(!title||title.textContent.trim()!=='Matière')return;
      const active=scope.querySelector('[data-c].on');
      if(!active)return;
      const step=scope.querySelector('.step');
      if(step&&!step.querySelector('.course-pill'))addPill(step,active.dataset.c,true);
    });
  }
  const app=document.querySelector('#app');
  if(app)new MutationObserver(decorate).observe(app,{childList:true,subtree:true});
  decorate();
})();