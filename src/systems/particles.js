import * as THREE from 'three';
import {seeded,terrainHeight,pathX} from '../utils/math.js';

export function buildParticles(scene,mats,{mobile=false}={}){
 const rand=seeded(3802);
 const groups=[];
 function create(kind,n,color,texture,size){
  const pos=new Float32Array(n*3),phase=new Float32Array(n),seedPositions=[];
  for(let i=0;i<n;i++){
   const z=-68+rand()*132,x=pathX(z)+(rand()<.5?-1:1)*(1+rand()*24),y=terrainHeight(x,z)+.5+rand()*5;
   pos.set([x,y,z],i*3);phase[i]=rand()*Math.PI*2;seedPositions.push([x,y,z]);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({map:texture,color,transparent:true,opacity:kind==='mote'?.7:.98,blending:THREE.AdditiveBlending,depthWrite:false,size,sizeAttenuation:true,fog:true});
  const points=new THREE.Points(geo,mat);points.frustumCulled=false;scene.add(points);groups.push({kind,pos,phase,seedPositions,points});
 }
 create('mote',mobile?185:290,0xa7c9f2,mats.glowTeal,.34);
 create('ember',mobile?100:180,0xffa869,mats.glowGold,.38);
 create('violet',mobile?70:110,0xc780ff,mats.glowViolet,.34);
 function update(t,dt,camera){
   for(const group of groups){
    const pos=group.pos,ph=group.phase,kind=group.kind;
    for(let i=0;i<ph.length;i++){
     const j=i*3,origin=group.seedPositions[i];
     pos[j]=origin[0]+Math.sin(t*.32+ph[i]+i)*(.48+(i%3)*.24);
     pos[j+1]=origin[1]+(t*(kind==='ember'?.45:.11)+ph[i]*2)%4;
     pos[j+2]=origin[2]+Math.cos(t*.31+ph[i])*0.55;
    }
    group.points.geometry.attributes.position.needsUpdate=true;
   }
 }
 return {update};
}
