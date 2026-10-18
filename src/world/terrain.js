import * as THREE from 'three';
import {terrainHeight,pathX,seeded,nearPath} from '../utils/math.js';

export function buildTerrain(scene,mats){
 const sizeX=180,sizeZ=190,segX=180,segZ=190;
 const geo=new THREE.PlaneGeometry(sizeX,sizeZ,segX,segZ);
 geo.rotateX(-Math.PI/2);
 const pos=geo.attributes.position,uv=geo.attributes.uv;
 const colors=[];
 for(let i=0;i<pos.count;i++){
  const x=pos.getX(i),z=pos.getZ(i);
  pos.setY(i,terrainHeight(x,z));
  uv.setXY(i,x/7,z/7);
  const d=Math.abs(x-pathX(z)),ridge=Math.min(1,Math.max(0,(d-8)/28));
  const dark=1-Math.min(.32,ridge*.28);
  colors.push(.72*dark,.8*dark,.79*dark);
 }
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 geo.computeVertexNormals();
 const material=mats.grass.clone();material.vertexColors=true;
 const mesh=new THREE.Mesh(geo,material);mesh.receiveShadow=true;mesh.name='Mountainous Forest Terrain';scene.add(mesh);
 // Curving road built from a conforming ribbon, with tiling actual stone textures.
 const pts=[],uvs=[],idx=[],rand=seeded(82);
 let length=0,prev=null;
 for(let i=0;i<=280;i++){
   const z=65-i*.47,x=pathX(z),half=2.2+Math.sin(z*.27)*.17;
   if(prev)length+=Math.hypot(x-prev.x,z-prev.z);prev={x,z};
   const heading=(pathX(z+.3)-pathX(z-.3))/.6;
   const normal=Math.hypot(1,heading),nx=1/normal,nz=-heading/normal;
   for(let side of [-1,1]){
     const xx=x+side*half*nx,zz=z+side*half*nz;
     pts.push(xx,terrainHeight(xx,zz)+.036,zz);
     uvs.push(side===-1?0:1,length/2.4);
   }
   if(i>0){let a=2*(i-1),b=2*i;idx.push(a,b,a+1,b,b+1,a+1)}
 }
 const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));rg.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));rg.setIndex(idx);rg.computeVertexNormals();
 const rm=mats.cobble.clone();rm.side=THREE.DoubleSide;
 const road=new THREE.Mesh(rg,rm);road.receiveShadow=true;road.name='Winding Cobblestone Road';scene.add(road);
 // loose uneven edging rocks follow road.
 const pebbleGeo=new THREE.DodecahedronGeometry(1,0),pebble=new THREE.InstancedMesh(pebbleGeo,mats.gravel,260),dummy=new THREE.Object3D();
 let count=0;
 for(let i=0;i<130;i++){
  let z=64-i*.97,x=pathX(z);
  for(let side of [-1,1]){
   const xx=x+side*(2.25+rand()*.44),zz=z+(rand()-.5)*.8;
   dummy.position.set(xx,terrainHeight(xx,zz)+.015,zz);
   dummy.rotation.set(rand()*3,rand()*6,rand()*3);
   dummy.scale.set(.12+rand()*.21,.11+rand()*.17,.12+rand()*.25);dummy.updateMatrix();
   pebble.setMatrixAt(count++,dummy.matrix);
  }
 }
 pebble.count=count;pebble.instanceMatrix.needsUpdate=true;scene.add(pebble);
 // Cliff rock formations, clustered on steep slopes.
 const rockGeo=new THREE.DodecahedronGeometry(1,1);
 const rocks=new THREE.InstancedMesh(rockGeo,mats.cliff,230),r=seeded(449);count=0;
 for(let i=0;i<300&&count<230;i++){
  const z=-80+r()*145,x=(r()<.5?-1:1)*(9+r()*48);
  if(nearPath(x,z,8)|| (z<-27&&Math.abs(x)<29))continue;
  const h=terrainHeight(x,z),scale=.7+r()*2.3;
  dummy.position.set(x,h+.1,z);dummy.rotation.set(r()*.5,r()*7,r()*.4);dummy.scale.set(scale,scale*(.65+r()*1.6),scale*(.65+r()*.7));dummy.updateMatrix();rocks.setMatrixAt(count++,dummy.matrix);
 }
 rocks.count=count;rocks.instanceMatrix.needsUpdate=true;rocks.castShadow=true;rocks.receiveShadow=true;scene.add(rocks);
 // A still shadow pool off the southern road, left intact as a mood accent.
 const pond=new THREE.Mesh(new THREE.CircleGeometry(7,48),new THREE.MeshPhysicalMaterial({color:0x153b49,metalness:.2,roughness:.19,transparent:true,opacity:.78,clearcoat:1,clearcoatRoughness:.1}));
 pond.rotation.x=-Math.PI/2;pond.position.set(-13,terrainHeight(-13,27)+.075,27);pond.scale.set(1.6,.9,1);scene.add(pond);
 return {road};
}
