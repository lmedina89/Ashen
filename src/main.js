import * as THREE from 'three';
import './style.css';
import {createRenderer} from './graphics/renderer.js';
import {createMaterials} from './world/materials.js';
import {buildTerrain} from './world/terrain.js';
import {buildArchitecture} from './world/architecture.js';
import {buildVegetation} from './world/vegetation.js';
import {buildSky} from './world/sky.js';
import {buildParticles} from './systems/particles.js';
import {createPlayer} from './systems/player.js';
import {createInteractions} from './systems/interactions.js';
import {createUI} from './systems/ui.js';
import {createAudio} from './systems/audio.js';

const canvas=document.getElementById('game');
const mobile=window.matchMedia('(pointer:coarse)').matches;
const ui=createUI();
const scene=new THREE.Scene();
scene.background=new THREE.Color('#160b2e');
scene.fog=new THREE.FogExp2(0x39274d,.0135);
const camera=new THREE.PerspectiveCamera(74,1,.08,560);
camera.rotation.order='YXZ';
const renderer=createRenderer(canvas,scene,camera);
const materials=createMaterials();
scene.add(new THREE.HemisphereLight(0xbac1ff,0x13241a,2.0));
const moonlight=new THREE.DirectionalLight(0x80b7d8,2.5);
moonlight.position.set(-40,65,-85);scene.add(moonlight);
const magenta=new THREE.DirectionalLight(0x9320e0,.7);
magenta.position.set(15,35,8);scene.add(magenta);

const sky=buildSky(scene,materials,camera);
buildTerrain(scene,materials);
const architecture=buildArchitecture(scene,materials);
const vegetation=buildVegetation(scene,materials,{mobile});
const particles=buildParticles(scene,materials,{mobile});
const player=createPlayer(camera,canvas,ui);
const interact=createInteractions(scene,materials,architecture.altarZ,ui);
const audio=createAudio();
window.__AK_LOADED__=true;
document.getElementById('load-error')?.classList.remove('show');

const lampLight=new THREE.PointLight(0xffac71,2.4,8,2);
scene.add(lampLight);
const cameraLamp=new THREE.Sprite(new THREE.SpriteMaterial({map:materials.glowGold,color:0xffbc70,transparent:true,opacity:.19,depthWrite:false,blending:THREE.AdditiveBlending}));
cameraLamp.scale.set(1.5,1.5,1);scene.add(cameraLamp);

// Discoverable landmarks and mist gates, no enemies in this environment-first milestone.
ui.onStart(()=>ui.toast('THE VIOLET WILDS\nFollow the turquoise and amber lights.',3.8));
function reset(){player.reset();interact.reset();ui.area('THE VIOLET WILDS');}
ui.onReset(reset);
document.getElementById('sound').addEventListener('click',()=>{audio.toggle()});
document.getElementById('touch-interact').addEventListener('click',()=>interact.interact(player.pos));
canvas.addEventListener('action',()=>interact.interact(player.pos));

let old=performance.now(),time=0,frame=0,fpsTime=0,fpsSmooth=60,currentSettings='';
function tick(now){
 const dt=Math.min(.05,(now-old)/1000);old=now;time+=dt;frame++;
 const settings=ui.settings();
 const key=JSON.stringify({pixel:settings.pixel,quality:settings.quality});
 if(key!==currentSettings){renderer.settings(settings);currentSettings=key;}
 player.update(dt,time);
 sky.update(time);
 particles.update(time,dt,camera);
 interact.update(time);
 for(let i=0;i<architecture.flickers.length;i++){
  const flame=architecture.flickers[i];flame.light.intensity=(i%2?3.6:4.2)+Math.sin(time*11+i*2.19)*.3;
  flame.flame.scale.y=1+Math.sin(time*7.3+i)*.15;
 }
 architecture.altar.rotation.y=time*.14;
 lampLight.visible=player.lantern;
 cameraLamp.visible=player.lantern;
 if(player.lantern){
  const forward=new THREE.Vector3(0,-.12,-.9).applyQuaternion(camera.quaternion);
  lampLight.position.copy(camera.position).add(forward);
  cameraLamp.position.copy(lampLight.position);
  lampLight.intensity=2.1+Math.sin(time*8)*.18;
 }
 const near=interact.nearest(player.pos);ui.prompt(ui.isPlaying()&&near?near.text:null);
 renderer.render();
 fpsTime+=dt;
 if(fpsTime>.5){fpsSmooth=Math.round(frame/fpsTime);frame=0;fpsTime=0;}
 const fps=document.getElementById('fps');fps.hidden=!settings.showFPS;fps.textContent=`${fpsSmooth} FPS`;
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
