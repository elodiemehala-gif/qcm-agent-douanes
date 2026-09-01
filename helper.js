window.QHELP=(()=>{const r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[r(0,a.length-1)],sh=a=>{a=[...a];for(let i=a.length-1;i;i--){let j=r(0,i);[a[i],a[j]]=[a[j],a[i]]}return a},gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return Math.abs(a)},fmt=n=>String(Math.round(n*100)/100).replace('.',',');function q(cat,topic,args){let[prompt,c,d,why,html='']=args,o=[String(c),...d.map(String)];o=[...new Set(o)].slice(0,4);while(o.length<4)o.push(String(r(2,99)));o=sh(o);o.push('T : toutes les réponses sont correctes','A : aucune des réponses n’est correcte');return{kind:'ex',cat,topic,prompt,html,o,ans:o.indexOf(String(c)),why}}return{r,pick,sh,gcd,fmt,q}})();

(()=>{
  const manifest=document.createElement('link');
  manifest.rel='manifest';
  manifest.href='manifest.webmanifest';
  document.head.appendChild(manifest);
  const apple=document.createElement('meta');
  apple.name='mobile-web-app-capable';
  apple.content='yes';
  document.head.appendChild(apple);
  const apple2=document.createElement('meta');
  apple2.name='apple-mobile-web-app-capable';
  apple2.content='yes';
  document.head.appendChild(apple2);

  let deferredPrompt=null;
  const header=document.querySelector('.top');
  const theme=document.getElementById('themeToggle');
  let installBtn=null;
  if(header&&theme){
    const actions=document.createElement('div');
    actions.style.display='flex';actions.style.gap='8px';actions.style.alignItems='center';
    installBtn=document.createElement('button');
    installBtn.className='theme';installBtn.id='installApp';installBtn.hidden=true;
    installBtn.textContent='↓';installBtn.title='Installer l’application sur le téléphone';installBtn.setAttribute('aria-label','Installer l’application');
    header.appendChild(actions);actions.appendChild(installBtn);actions.appendChild(theme);
  }

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();deferredPrompt=e;
    if(installBtn)installBtn.hidden=false;
  });
  if(installBtn)installBtn.addEventListener('click',async()=>{
    if(!deferredPrompt)return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;installBtn.hidden=true;
  });
  window.addEventListener('appinstalled',()=>{if(installBtn)installBtn.hidden=true;});

  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('service-worker.js',{scope:'./'}).catch(err=>console.error('Service worker:',err));
    });
  }
})();