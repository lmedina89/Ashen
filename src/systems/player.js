import * as THREE from 'three';
import {clamp,terrainHeight,pathX} from '../utils/math.js';

const INITIAL_Z=55;
export function createPlayer(camera,dom,ui){
 const pos=new THREE.Vector3(pathX(INITIAL_Z),terrainHeight(pathX(INITIAL_Z),INITIAL_Z)+1.7,INITIAL_Z);
 let yaw=0,pitch=-.055,lantern=true,sprint=false;
 const pressed=new Set();
 const joy={x:0,y:0,id:null};let lookId=null,px=0,py=0;
 const collision=[];
 function obstructed(x,z){
  const r=.42;
  if(Math.abs(x)>86||z>82||z< -85)return true;
  // outer curtain wall with central pass-through
  if(z< -31.6&&z> -36.7&&Math.abs(x)>1.65&&Math.abs(x)<29.4)return true;
  if(z< -57.3&&z>-71&&Math.abs(x)<13.8)return true;
  if(z<-41&&z>-56&&x< -13&&x> -23)return true;
  return collision.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+r);
 }
 function update(dt,time){
   if(!ui.isPlaying())return;
   if(pressed.has('arrowleft'))yaw+=dt*1.5;
   if(pressed.has('arrowright'))yaw-=dt*1.5;
   let f=(pressed.has('w')||pressed.has('arrowup')?1:0)-(pressed.has('s')||pressed.has('arrowdown')?1:0)-joy.y;
   let strafe=(pressed.has('d')?1:0)-(pressed.has('a')?1:0)+joy.x;
   const len=Math.hypot(f,strafe);
   let walking=len>.1;
   if(walking){f/=Math.max(1,len);strafe/=Math.max(1,len);let speed=(sprint||pressed.has('shift')?7.3:4.05)*dt;
    const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*strafe)*speed;
    const dz=(-Math.cos(yaw)*f-Math.sin(yaw)*strafe)*speed;
    if(!obstructed(pos.x+dx,pos.z))pos.x+=dx;
    if(!obstructed(pos.x,pos.z+dz))pos.z+=dz;
   }
   const ground=terrainHeight(pos.x,pos.z)+1.72;
   pos.y+=(ground+(walking?Math.sin(time*(sprint?16:10))*.035:0)-pos.y)*Math.min(1,dt*9);
   camera.position.copy(pos);
   camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
   if(pos.z<30&&ui.getArea()==='THE VIOLET WILDS')ui.area('THE RUINED PROCESSIONAL');
   if(pos.z<-30&&ui.getArea()!=='THE ASTRAL KEEP')ui.area('THE ASTRAL KEEP');
 }
 function keyDown(e){
  const k=e.key.toLowerCase();
  if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k)&&ui.isPlaying())e.preventDefault();
  pressed.add(k);
  if(k==='l'&&!e.repeat)toggleLamp();
  if(k==='e'&&!e.repeat)dom.dispatchEvent(new CustomEvent('action'));
  if(k==='escape')ui.toggleSettings();
 }
 function keyUp(e){pressed.delete(e.key.toLowerCase());}
 window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
 window.addEventListener('blur',()=>pressed.clear());
 const canvas=document.querySelector('#game');
 canvas.addEventListener('pointerdown',e=>{
  if(!ui.isPlaying())return;
  if(e.pointerType==='touch'&&e.clientX<innerWidth*.30)return;
  lookId=e.pointerId;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  if(e.pointerId!==lookId||!ui.isPlaying())return;
  const dx=e.clientX-px,dy=e.clientY-py;px=e.clientX;py=e.clientY;
  yaw-=dx/Math.max(300,innerWidth)*2.5;
  pitch=clamp(pitch-dy/Math.max(320,innerHeight)*2.0,-1.13,1.1);
 });
 canvas.addEventListener('pointerup',e=>{if(e.pointerId===lookId)lookId=null});
 canvas.addEventListener('pointercancel',()=>lookId=null);
 const pad=document.querySelector('#move-base'),knob=document.querySelector('#move-knob');
 function dragJoy(e){const r=pad.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/(r.width*.38),y=(e.clientY-r.top-r.height/2)/(r.height*.38);const len=Math.max(1,Math.hypot(x,y));joy.x=x/len;joy.y=y/len;knob.style.transform=`translate(${joy.x*30}px,${joy.y*30}px)`;}
 pad.addEventListener('pointerdown',e=>{e.preventDefault();joy.id=e.pointerId;pad.setPointerCapture(joy.id);dragJoy(e)});
 pad.addEventListener('pointermove',e=>{if(e.pointerId===joy.id)dragJoy(e)});
 function joyEnd(e){if(e.pointerId!==joy.id)return;joy.x=joy.y=0;joy.id=null;knob.style.transform='';}
 pad.addEventListener('pointerup',joyEnd);pad.addEventListener('pointercancel',joyEnd);
 const sprintBtn=document.querySelector('#sprint-btn');sprintBtn.addEventListener('pointerdown',e=>{e.preventDefault();sprint=true});
 for(const type of ['pointerup','pointercancel','pointerleave'])sprintBtn.addEventListener(type,()=>sprint=false);
 document.querySelector('#lantern-btn').addEventListener('click',toggleLamp);
 function toggleLamp(){lantern=!lantern;ui.lamp(lantern)}
 function reset(){pos.set(pathX(INITIAL_Z),terrainHeight(pathX(INITIAL_Z),INITIAL_Z)+1.7,INITIAL_Z);yaw=0;pitch=-.055;lantern=true;ui.lamp(true);pressed.clear();joy.x=joy.y=0;knob.style.transform='';}
 return {update,pos,reset,get lantern(){return lantern},addCollision(o){collision.push(o)}};
}
