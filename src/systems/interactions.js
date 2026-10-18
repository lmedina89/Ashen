import * as THREE from 'three';
import {terrainHeight,pathX} from '../utils/math.js';

export function createInteractions(scene,mats,altarZ,ui){
 const spots=[
  {z:36,x:pathX(36)+1.1,name:'THE WEEPING STONE',detail:'A memory of the old road.'},
  {z:12,x:pathX(12)-1.5,name:'THE LANTERN VOW',detail:'A promise survives the darkness.'},
  {z:-15,x:pathX(-15)+1.4,name:'THE HOLLOW OATH',detail:'The royal guard stood their ground.'},
  {z:-43,x:pathX(-43)-1.3,name:'THE ASTRAL SEAL',detail:'The last sigil is yours.'}
 ];
 let collected=new Set(),endTriggered=false;
 const objects=[];
 function makeRune(spot,id){
  const y=terrainHeight(spot.x,spot.z)+1.25;
  const group=new THREE.Group();group.position.set(spot.x,y,spot.z);scene.add(group);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.51,.055,8,6),mats.gold);group.add(ring);
  const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.35,0),id%2?mats.violet:mats.turquoise);group.add(gem);
  const light=new THREE.PointLight(id%2?0xc580ff:0x47f4d6,2.2,5,2);group.add(light);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:id%2?mats.glowViolet:mats.glowTeal,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.62}));halo.scale.set(3.1,3.1,1);group.add(halo);
  objects.push({id,group,ring,gem,spot,phase:id*1.3});
 }
 spots.forEach(makeRune);
 function nearest(position){
  for(const o of objects){
   if(collected.has(o.id))continue;
   if(Math.hypot(o.spot.x-position.x,o.spot.z-position.z)<3.0)return {type:'rune',o,text:`RECLAIM ${o.spot.name}`};
  }
  if(Math.hypot(position.x,position.z-altarZ)<3.8)return {type:'altar',text:collected.size===4?'AWAKEN THE ASTRAL ALTAR':'THE ALTAR NEEDS FOUR RUNES'};
  return null;
 }
 function interact(position){
  const target=nearest(position);
  if(!target)return;
  if(target.type==='rune'){
   collected.add(target.o.id);target.o.group.visible=false;
   ui.setRunes(collected.size);
   ui.toast(`${target.o.spot.name}\n${target.o.spot.detail}`,4);
   if(collected.size===4)ui.setObjective('Return to the astral altar beyond the gate');
  }else if(collected.size===4&&!endTriggered){endTriggered=true;ui.finish();}
  else ui.toast('FOUR RUNES ARE REQUIRED\nFollow their turquoise and violet glow.',3);
 }
 function update(time){
  for(const o of objects){
   o.group.position.y=terrainHeight(o.spot.x,o.spot.z)+1.25+Math.sin(time*1.35+o.phase)*.13;
   o.ring.rotation.y=time*.82;o.gem.rotation.y=-time*.55;o.gem.rotation.z=Math.sin(time*.5+o.phase)*.24;
  }
 }
 function reset(){collected=new Set();endTriggered=false;for(const o of objects)o.group.visible=true;ui.setRunes(0);ui.setObjective('Follow the lanterns to the keep');}
 return {nearest,interact,update,reset,get count(){return collected.size;}};
}
