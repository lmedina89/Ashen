export function createUI(){
 const $=id=>document.getElementById(id);
 let state='intro',area='THE VIOLET WILDS',toastTimer=null,onReset=()=>{},onStart=()=>{};
 const settings=$('settings-panel'),intro=$('intro'),ending=$('end');
 function play(){intro.classList.remove('show');settings.classList.remove('show');ending.classList.remove('show');state='playing';onStart();}
 $('play').addEventListener('click',play);
 function toast(message,duration=3){
  const t=$('toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('visible'),duration*1000);
 }
 function areaSet(name){area=name;$('area').textContent=name;toast(name,3);}
 function openSettings(){state='settings';settings.classList.add('show');settings.setAttribute('aria-hidden','false');}
 function closeSettings(){state='playing';settings.classList.remove('show');settings.setAttribute('aria-hidden','true');}
 function toggleSettings(){if(state==='playing')openSettings();else if(state==='settings')closeSettings();}
 $('settings').addEventListener('click',toggleSettings);$('close-settings').addEventListener('click',closeSettings);
 function finish(){state='end';ending.classList.add('show')}
 $('continue').addEventListener('click',()=>{ending.classList.remove('show');state='playing'});
 $('restart').addEventListener('click',()=>{onReset();ending.classList.remove('show');state='playing'});
 function setObjective(text){$('objective').textContent=text;}
 function setRunes(n){$('collectibles').textContent=`✦ ${n} / 4 RUNES`;}
 function lamp(on){$('lantern-btn').classList.toggle('active',on);$('lantern-btn').textContent=on?'✦ LAMP':'◇ LAMP';}
 function prompt(text){const el=$('prompt');el.hidden=!text;if(text)$('prompt-text').textContent=text;}
 return {toast,area:areaSet,getArea:()=>area,setObjective,setRunes,lamp,prompt,finish,toggleSettings,isPlaying:()=>state==='playing',onReset(fn){onReset=fn},onStart(fn){onStart=fn},settings:()=>({pixel:$('render-style').value==='pixel',quality:$('quality').value,showFPS:$('fps-toggle').checked})};
}
