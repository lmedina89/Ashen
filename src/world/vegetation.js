import * as THREE from 'three';
import {terrainHeight,pathX,nearPath,seeded} from '../utils/math.js';

export function buildVegetation(scene,mats,{mobile=false}={}){
 const rand=seeded(97023),dummy=new THREE.Object3D();
 const count=mobile?310:500;
 const trunkGeo=new THREE.CylinderGeometry(.18,.26,4.2,6);
 const boughGeo=new THREE.ConeGeometry(2.35,5.0,7,2);
 // simple static batch of five layers per tree, but with different scales
 const trunks=new THREE.InstancedMesh(trunkGeo,mats.bark,count);
 const canopy=[];
 for(let i=0;i<4;i++)canopy.push(new THREE.InstancedMesh(boughGeo,i===3?mats.pineHighlight:mats.pine,count));
 const trees=[];
 for(let trial=0;trial<count*8&&trees.length<count;trial++){
  const z=-84+rand()*164,x=(rand()<.5?-1:1)*(5.4+rand()*68);
  if(nearPath(x,z,5.6))continue;
  if(z<-27&&Math.abs(x)<32)continue;
  if(z>-4&&z<54&&Math.abs(x+13)<9&&Math.abs(z-27)<7)continue;
  const h=terrainHeight(x,z),s=.65+rand()*.7;
  const tree={x,z,h,s,rot:rand()*Math.PI*2};trees.push(tree);
 }
 for(let i=0;i<trees.length;i++){
  const {x,z,h,s,rot}=trees[i];
  dummy.position.set(x,h+2*s,z);dummy.rotation.set(.04*Math.sin(i),rot,0);dummy.scale.set(s,s,s);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);
  for(let j=0;j<4;j++){
   dummy.position.set(x,h+(3.5+j*1.05)*s,z);
   dummy.rotation.set(.03*Math.sin(i+j),rot+j*.23,.04*Math.cos(i+j));
   dummy.scale.set(s*(1-j*.17),s*(1-j*.10),s*(1-j*.17));dummy.updateMatrix();
   canopy[j].setMatrixAt(i,dummy.matrix);
   let clr=new THREE.Color().setHSL(.45+rand()*.04,.17+rand()*.1,.18+rand()*.15);canopy[j].setColorAt(i,clr);
  }
 }
 trunks.count=trees.length;trunks.instanceMatrix.needsUpdate=true;trunks.castShadow=true;
 scene.add(trunks);
 for(let group of canopy){group.count=trees.length;group.instanceMatrix.needsUpdate=true;if(group.instanceColor)group.instanceColor.needsUpdate=true;group.castShadow=true;scene.add(group)}
 // twisted black bare trees on the margins; real geometry assembled once then instanced
 const deadTrunkGeo=new THREE.CylinderGeometry(.11,.25,4.7,5);
 const dead=new THREE.InstancedMesh(deadTrunkGeo,mats.bark,70);
 for(let i=0;i<70;i++){
  const x=(rand()<.5?-1:1)*(7+rand()*44),z=-69+rand()*132,h=terrainHeight(x,z);
  dummy.position.set(x,h+2.3,z);dummy.rotation.set((rand()-.5)*.38,rand()*6,(rand()-.5)*.25);dummy.scale.set(.55+rand()*.5,1,.7);dummy.updateMatrix();dead.setMatrixAt(i,dummy.matrix);
  // small gnarly limbs, not one draw call each at large scale (below ~200 draw calls)
  if(i<30){
   const limb=new THREE.Mesh(new THREE.CylinderGeometry(.018,.10,2.2,4),mats.bark);
   limb.position.set(x+.5,h+3.5,z);limb.rotation.z=.95;scene.add(limb);
  }
 }
 dead.castShadow=true;scene.add(dead);
 // ground tufts with batched geometry
 const tuftGeo=new THREE.ConeGeometry(.15,.53,3,1);
 const tufts=new THREE.InstancedMesh(tuftGeo,new THREE.MeshStandardMaterial({color:0x29403a,side:THREE.DoubleSide,roughness:1,flatShading:true}),mobile?1300:2400);
 for(let i=0;i<tufts.count;i++){
  const z=-80+rand()*160,x=(rand()<.5?-1:1)*(2.7+rand()*54),h=terrainHeight(x,z),scale=.6+rand()*1.15;
  dummy.position.set(x,h+.24*scale,z);dummy.rotation.set(0,rand()*6,0);dummy.scale.set(scale,scale,scale);dummy.updateMatrix();tufts.setMatrixAt(i,dummy.matrix);
  tufts.setColorAt(i,new THREE.Color().setHSL(.32+rand()*.13,.14+rand()*.21,.17+rand()*.10));
 }
 tufts.instanceMatrix.needsUpdate=true;tufts.instanceColor.needsUpdate=true;scene.add(tufts);
 // glowing mushroom colonies on both forest margins
 const mushrooms=[];
 const shroomGeo=new THREE.ConeGeometry(.17,.22,7);
 const stems=new THREE.InstancedMesh(shroomGeo,mats.turquoise,130);
 for(let i=0;i<130;i++){
  const z=-65+rand()*131,x=(rand()<.5?-1:1)*(4+rand()*18),h=terrainHeight(x,z);
  const s=.45+rand()*.9;
  dummy.position.set(x,h+.18*s,z);dummy.rotation.set(Math.PI,rand()*6,0);dummy.scale.set(s,s,s);dummy.updateMatrix();stems.setMatrixAt(i,dummy.matrix);
  if(i%7===0)mushrooms.push({x,y:h+.2,z});
 }
 stems.instanceMatrix.needsUpdate=true;scene.add(stems);
 return {trees,mushrooms};
}
