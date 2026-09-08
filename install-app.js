(()=>{
  const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  let deferred=null;
  const btn=document.getElementById('installApp');
  const note=document.getElementById('installNote');
  if(!btn)return;

  const hide=()=>{btn.hidden=true;if(note)note.hidden=true};
  const show=(label='Installer l’application')=>{btn.hidden=false;btn.textContent=label};

  if(standalone()){hide();return}

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferred=e;
    show('Installer l’application');
    if(note){note.hidden=false;note.textContent='Installation sur ce téléphone · fonctionne ensuite hors connexion';}
  });

  btn.addEventListener('click',async()=>{
    if(deferred){
      deferred.prompt();
      try{await deferred.userChoice}catch{}
      deferred=null;
      if(standalone())hide();
      return;
    }
    const isAndroid=/Android/i.test(navigator.userAgent);
    if(isAndroid){
      alert('Dans Chrome : appuie sur ⋮ en haut à droite, puis sur « Installer l’application » ou « Ajouter à l’écran d’accueil ».');
    }else{
      alert('Ouvre le menu de ton navigateur puis choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».');
    }
  });

  window.addEventListener('appinstalled',()=>hide());
  setTimeout(()=>{if(!standalone()&&!deferred){show('Installer sur le téléphone');if(note){note.hidden=false;note.textContent='Appuie ici pour l’ajouter comme une vraie application';}}},1200);
})();