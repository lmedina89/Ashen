import * as THREE from 'three';
import {terrainHeight,seeded,pathX} from '../utils/math.js';

const rand=seeded(33309);
function block(parent,m,x,y,z,w,h,d, name='Stonework'){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
 mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;mesh.name=name;parent.add(mesh);return mesh;
}
function cylinder(parent,m,x,y,z,r,h,n=12){
 const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,n),m);
 o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
}
function tip(parent,m,x,y,z,r,h,n=8){
 const roof=new THREE.Mesh(new THREE.ConeGeometry(r,h,n,1),m);
 roof.position.set(x,y,z);roof.rotation.y=Math.PI/8;roof.castShadow=true;parent.add(roof);return roof;
}
function glowSprite(parent,texture,x,y,z,scale,opacity=.8){
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:0xffffff,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending}));
 sprite.position.set(x,y,z);sprite.scale.set(scale,scale,1);parent.add(sprite);return sprite;
}
function gothicWindow(parent,mats,x,y,z,face='front',scale=1,glow=true){
 const group=new THREE.Group();group.position.set(x,y,z);
 const w=.72*scale,h=1.7*scale,deep=.06;
 // gothic pointed window with stone mullion and lintel
 block(group,mats.black,0,0,0,w,h,deep,'Window recess');
 block(group,mats.iron,0,0,.043*scale,.045*scale,h,deep,'Window mullion');
 block(group,mats.trim,-w/2,0,0,.09*scale,h+.17*scale,.13*scale);
 block(group,mats.trim,w/2,0,0,.09*scale,h+.17*scale,.13*scale);
 const left=block(group,mats.trim,-w*.23,h*.51,0,.09*scale,w*.76,.13*scale);
 left.rotation.z=-Math.PI/4;
 const right=block(group,mats.trim,w*.23,h*.51,0,.09*scale,w*.76,.13*scale);
 right.rotation.z=Math.PI/4;
 if(glow){
  block(group,mats.turquoise,-w*.23,0,.045*scale,.11*scale,h*.82,.02*scale,'Lit stained glass');
  block(group,mats.violet,w*.24,0,.045*scale,.11*scale,h*.82,.02*scale);
  glowSprite(group,mats.glowTeal,0,0,.12*scale,2.2*scale,.27);
 }
 if(face==='back')group.rotation.y=Math.PI;
 if(face==='right')group.rotation.y=Math.PI/2;
 if(face==='left')group.rotation.y=-Math.PI/2;
 parent.add(group);return group;
}
function tower(parent,mats,x,z,r=2.8,h=17,spire=true){
 const base=terrainHeight(x,z);
 const group=new THREE.Group();group.position.set(x,base,z);parent.add(group);
 cylinder(group,mats.stone,0,h/2,0,r,h,16);
 cylinder(group,mats.trim,0,2.5,0,r*1.07,.3,16);
 cylinder(group,mats.trim,0,h-2,0,r*1.11,.37,16);
 cylinder(group,mats.stone,0,h-.5,0,r*1.1,1.5,16);
 for(let i=0;i<16;i++){
  let angle=2*Math.PI*i/16;
  const b=block(group,mats.trim,Math.sin(angle)*r*1.07,h+.65,Math.cos(angle)*r*1.07,.85,1.25,.68,'Merlon');
  b.rotation.y=angle;
 }
 if(spire){
  cylinder(group,mats.roof,0,h+1.25,0,r*1.04,.6,16);
  tip(group,mats.roof,0,h+5,0,r*1.18,7.2,12);
  const finial=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),mats.gold);finial.position.y=h+8.7;group.add(finial);
  block(group,mats.gold,0,h+9.4,0,.11,1.4,.12);
 }
 for(let i=0;i<3;i++){
  const yy=5+i*4;
  for(let a of [0,Math.PI/2,Math.PI,3*Math.PI/2]){
   const wx=Math.sin(a)*r,wz=Math.cos(a)*r;
   // narrow dark recesses follow the tower surface as readable medieval arrow slits
   const slit=new THREE.Mesh(new THREE.BoxGeometry(.18,1.6,.09),mats.black);
   slit.position.set(wx,yy,wz);slit.rotation.y=a;group.add(slit);
   const lit=new THREE.Mesh(new THREE.BoxGeometry(.09,1.05,.1),i===1?mats.turquoise:mats.violet);
   lit.position.set(wx,yy,wz);lit.rotation.y=a;group.add(lit);
  }
 }
 return group;
}
function crenels(parent,mats,x1,x2,z,y,interval=1.7){
 for(let x=x1;x<x2;x+=interval)block(parent,mats.trim,x,y+.51,z,.95,1.1,1.2,'Battlement merlon');
}
function torch(parent,mats,x,z,height=2.75,purple=false){
 let h=terrainHeight(x,z),y=h+height;
 block(parent,mats.iron,x,h+height/2,z,.09,height,.09,'Iron torch stand');
 cylinder(parent,mats.iron,x,y-.18,z,.19,.19,8);
 const m=purple?mats.violet:mats.flame;
 const flame=new THREE.Mesh(new THREE.ConeGeometry(.16,.44,7),m);
 flame.position.set(x,y+.16,z);parent.add(flame);
 const light=new THREE.PointLight(purple?0xbd78ff:0xffaa58,purple?3:4,9,2);
 light.position.set(x,y+.3,z);parent.add(light);
 const sprite=glowSprite(parent,purple?mats.glowViolet:mats.glowGold,x,y+.2,z,purple?4.3:3.5,.72);
 return {light,flame,sprite};
}
function detailBanner(parent,mats,x,y,z){
 block(parent,mats.iron,x,y+.64,z,.08,.12,1.3);
 const pennant=new THREE.Mesh(new THREE.PlaneGeometry(.72,2.25),new THREE.MeshStandardMaterial({color:0x34233f,roughness:1,side:THREE.DoubleSide}));
 pennant.position.set(x,y-.55,z+.1);parent.add(pennant);
 const band=block(parent,mats.gold,x,y-.9,z+.115,.052,.8,.02);band.rotation.z=.0;
}
function archGate(parent,mats,base,z){
 // real pass-through: separate left/right masonry and freestanding lintel
 block(parent,mats.stone,-1.8,base+5.7,z,2.0,11.4,3);
 block(parent,mats.stone,1.8,base+5.7,z,2.0,11.4,3);
 // gate opening is 3.5m from -1.7 .. +1.7; no wall occupies it
 block(parent,mats.stone,0,base+9.7,z,6.2,3.6,3);
 for(let side of [-1,1]){
  const pier=block(parent,mats.trim,side*1.83,base+3.0,z+1.75,.5,6.0,.32,'Gateway column');
  const arch=block(parent,mats.trim,side*.91,base+6.65,z+1.72,2.2,.45,.40,'Pointed gateway arch');
  arch.rotation.z=side*.64;
  block(parent,mats.iron,side*1.55,base+1.2,z+1.88,.10,2.2,.12);
 }
 block(parent,mats.trim,0,base+8.0,z+1.74,.7,.8,.5,'Keystone');
 const boss=new THREE.Mesh(new THREE.OctahedronGeometry(.58),mats.violet);
 boss.position.set(0,base+9.65,z+1.8);parent.add(boss);
 glowSprite(parent,mats.glowViolet,0,base+9.65,z+1.86,4.8,.64);
}
export function buildArchitecture(scene,mats){
 const group=new THREE.Group();group.name='The Astral Keep / Gothic Stonework';scene.add(group);
 const z=-34,base=terrainHeight(0,z);
 // side curtain walls leave the gate open
 for(let side of [-1,1]){
  let center=side*14.5;
  block(group,mats.stone,center,base+5.4,z,23,10.8,3.25,'Outer curtain wall');
  block(group,mats.trim,center,base+11.0,z,23,.35,3.65,'Walkway parapet');
  crenels(group,mats,center-11,center+11,z,base+11.3);
  for(let i=0;i<5;i++){
   let wx=center-8.5+i*4;
   gothicWindow(group,mats,wx,base+5.5,z+1.7,'front',.8,i%2===0);
  }
 }
 archGate(group,mats,base,z);
 for(let x of [-26,-12,12,26])tower(group,mats,x,z,x===-26||x===26?3.05:2.45,x===-26||x===26?17.5:14.5,true);
 // central keep seen through outer arch: tall donjon, towers, roof pitches
 const bz=-64,bbase=terrainHeight(0,bz);
 block(group,mats.stone,0,bbase+11,bz,24,22,13,'High Keep');
 block(group,mats.trim,0,bbase+21.8,bz+6.7,25,.55,.8,'Roof edge');
 const roof=tip(group,mats.roof,0,bbase+29,bz,13.6,15,4);roof.rotation.y=Math.PI/4;
 for(let x of [-13.5,13.5])tower(group,mats,x,bz+5,3.2,26,true);
 for(let x of [-8,-4,0,4,8]){
  gothicWindow(group,mats,x,bbase+12,bz+6.55,'front',1.12,true);
  gothicWindow(group,mats,x,bbase+18,bz+6.55,'front',.8,x%2===0);
 }
 // central tall clock spire (reference), with circular clock face
 const cz=bz+7;
 block(group,mats.stone,0,bbase+27,cz,8.2,18,8,'Astral clock tower');
 tip(group,mats.roof,0,bbase+42,cz,6.7,13,4).rotation.y=Math.PI/4;
 const clockRing=new THREE.Mesh(new THREE.TorusGeometry(2.1,.23,9,64),mats.gold);
 clockRing.position.set(0,bbase+30.8,cz+4.18);group.add(clockRing);
 const clockFace=new THREE.Mesh(new THREE.CircleGeometry(1.88,48),new THREE.MeshBasicMaterial({color:0xd4e7bd}));
 clockFace.position.set(0,bbase+30.8,cz+4.2);group.add(clockFace);
 const hand1=block(group,mats.iron,0,bbase+31.45,cz+4.24,.12,1.45,.04,'Clock hand');
 const hand2=block(group,mats.iron,.44,bbase+30.8,cz+4.24,.9,.12,.04);
 hand2.rotation.z=-.3;
 // courtyard side chapel and graveyard structures
 let lz=-50,by=terrainHeight(-18,lz);
 block(group,mats.stone,-18,by+5.6,lz,9,11.2,12,'Chapel');
 const chapelRoof=tip(group,mats.roof,-18,by+16.1,lz,7.4,10,4);chapelRoof.rotation.y=Math.PI/4;
 gothicWindow(group,mats,-18,by+7,lz+6.12,'front',1.5,true);
 // castle courtyard lamp line; also makes the gate visibly lead into a playable scene
 const flickers=[];
 for(const [x,zz,pur] of [[-5,-27,false],[5,-27,false],[-5,-41,true],[5,-41,true],[-6,-52,false],[6,-52,false]])flickers.push(torch(group,mats,x,zz,3,pur));
 // temple arch and altar as quest end location
 const altarZ=-49.2,altarY=terrainHeight(0,altarZ);
 cylinder(group,mats.stone,0,altarY+.32,altarZ,2.45,.64,10);
 cylinder(group,mats.trim,0,altarY+.71,altarZ,1.8,.21,10);
 const altar=new THREE.Mesh(new THREE.DodecahedronGeometry(.8,1),mats.turquoise);altar.position.set(0,altarY+1.75,altarZ);group.add(altar);
 glowSprite(group,mats.glowTeal,0,altarY+1.8,altarZ,7,.45);
 const altarLight=new THREE.PointLight(0x38efd8,5.2,12,2);altarLight.position.set(0,altarY+2.1,altarZ);group.add(altarLight);
 for(let i=0;i<8;i++){
  let a=i*Math.PI/4;
  const stone=new THREE.Mesh(new THREE.OctahedronGeometry(.28,0),mats.violet);
  stone.position.set(Math.cos(a)*1.55,altarY+1,altarZ+Math.sin(a)*1.55);group.add(stone);
 }
 // long stone bridge-ish procession, columns and ruined stone fragments
 for(let z0 of [-6,-12,-18,-24])for(let side of [-1,1]){
  const x=pathX(z0)+side*6.7,y=terrainHeight(x,z0);
  cylinder(group,mats.stone,x,y+2.3,z0,.56,4.6,10);
  cylinder(group,mats.trim,x,y+4.7,z0,.83,.35,10);
  cylinder(group,mats.trim,x,y+.35,z0,.87,.55,10);
  if(z0===-12||z0===-24){
    const beam=block(group,mats.trim,x,y+5,z0,1.8,.42,1.4,'Ruined capital');beam.rotation.z=(rand()-.5)*.22;
  }
 }
 for(let z0 of [9,18,30,41,51])for(let side of [-1,1]){
  const x=pathX(z0)+side*3.45;
  flickers.push(torch(group,mats,x,z0,2.6,z0===18));
 }
 // Hanging black banners
 detailBanner(group,mats,-7,base+10,z+1.95);detailBanner(group,mats,7,base+10,z+1.95);
 return {group,altar,altarZ,flickers};
}
