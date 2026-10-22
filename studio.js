(()=>{'use strict';
const $=id=>document.getElementById(id);
const jump=(tab)=>{const btn=document.querySelector(`.nav[data-screen="${tab}"]`);if(btn)btn.click();};
$('studioBuild')?.addEventListener('click',()=>jump('builder'));
$('studioStart')?.addEventListener('click',()=>{const w=$('weeks');w?.scrollIntoView({behavior:'smooth',block:'start'});});
let total=90,remaining=90,running=false,ends=0,ticker=null;
const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
function draw(){if($('studioRestTime'))$('studioRestTime').textContent=fmt(remaining);if($('studioRestStart'))$('studioRestStart').textContent=running?'Running…':'Start';}
function pause(){if(running)remaining=Math.max(0,Math.ceil((ends-Date.now())/1000));running=false;if(ticker){clearInterval(ticker);ticker=null;}draw();}
function tick(){remaining=Math.max(0,Math.ceil((ends-Date.now())/1000));if(!remaining){pause();if(navigator.vibrate)navigator.vibrate(80);}else draw();}
$('studioRestStart')?.addEventListener('click',()=>{if(running)return;if(!remaining)remaining=total;running=true;ends=Date.now()+remaining*1000;ticker=setInterval(tick,250);draw();});
$('studioRestPause')?.addEventListener('click',pause);
$('studioRestReset')?.addEventListener('click',()=>{pause();remaining=total;draw();});
$('studioRestPlus')?.addEventListener('click',()=>{remaining+=30;total+=30;if(running)ends+=30000;draw();});
function stats(){let data={};try{data=JSON.parse(localStorage.getItem('road225_workout_app_v2')||'{}')}catch(e){};if(!data||typeof data!=='object')data={};
 const histories=Object.values(data).filter(Array.isArray);const sessions=histories.reduce((n,items)=>n+items.length,0);const sets=histories.reduce((n,items)=>n+items.reduce((m,item)=>m+(Array.isArray(item.sets)?item.sets.filter(s=>s.done).length:0),0),0);
 // Prefer reading the active in-memory workout history if app uses a different storage key.
 try{if(typeof records!=='undefined'){const rs=Object.values(records).filter(Array.isArray);if(rs.length){$('studioSessions').textContent=rs.reduce((n,x)=>n+x.length,0);$('studioSets').textContent=rs.reduce((n,x)=>n+x.reduce((m,a)=>m+(a.sets||[]).filter(s=>s.done).length,0),0);$('studioExercises').textContent=rs.filter(x=>x.length).length;return}}}catch(e){}
 $('studioSessions').textContent=sessions;$('studioSets').textContent=sets;$('studioExercises').textContent=histories.filter(x=>x.length).length;
}
document.addEventListener('click',e=>{if(e.target.closest('[data-save],#import'))setTimeout(stats,400)});
window.addEventListener('storage',stats);setTimeout(stats,250);draw();
})();