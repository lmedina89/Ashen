import * as THREE from 'three';

export function buildSky(scene,mats,camera){
 const sky=new THREE.Group();sky.name='Violet Starfield';scene.add(sky);
 const globe=new THREE.Mesh(new THREE.SphereGeometry(420,64,40),new THREE.MeshBasicMaterial({map:mats.sky,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false}));
 globe.rotation.y=1.7;sky.add(globe);
 // hand-painted cratered crescent moon texture generated in browser
 const can=document.createElement('canvas');can.width=256;can.height=256;const g=can.getContext('2d');
 const glow=g.createRadialGradient(128,128,21,128,128,124);
 glow.addColorStop(0,'rgba(255,242,208,1)');glow.addColorStop(.38,'rgba(255,220,183,.95)');glow.addColorStop(.63,'rgba(226,184,220,.38)');glow.addColorStop(1,'rgba(183,86,231,0)');
 g.fillStyle=glow;g.fillRect(0,0,256,256);
 g.save();g.beginPath();g.arc(128,128,64,0,Math.PI*2);g.clip();
 g.fillStyle='#f1ead0';g.fillRect(57,57,142,142);
 let seed=35;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<100;i++){
   const a=rand()*Math.PI*2,r=Math.sqrt(rand())*61,rad=1+rand()*11;
   g.beginPath();g.arc(128+Math.cos(a)*r,128+Math.sin(a)*r,rad,0,Math.PI*2);
   g.fillStyle=`rgba(101,117,131,${.05+rand()*.18})`;g.fill();
 }
 g.restore();
 const moonTexture=new THREE.CanvasTexture(can);moonTexture.colorSpace=THREE.SRGBColorSpace;
 const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:moonTexture,transparent:true,depthWrite:false,fog:false,toneMapped:false}));
 moon.position.set(-102,62,-250);moon.scale.set(74,74,1);sky.add(moon);
 const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:mats.glowViolet,color:0xce91ff,transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
 halo.position.copy(moon.position);halo.scale.set(137,137,1);sky.add(halo);
 function update(time){sky.position.copy(camera.position);globe.rotation.y=1.7+Math.sin(time*.015)*.009;halo.material.opacity=.17+Math.sin(time*.6)*.035;}
 return {update,moon};
}
