import * as THREE from 'three';

export function createMaterials(){
 const loader = new THREE.TextureLoader();
 const load=(name,repx=1,repy=1)=>{
  const t=loader.load(`${import.meta.env.BASE_URL}textures/${name}.png`);
  t.colorSpace=THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(repx,repy);
  t.anisotropy=4;
  return t;
 };
 const base=(name,opts={})=>new THREE.MeshStandardMaterial({map:load(name),roughness:1,metalness:0,...opts});
 return {
  grass:base('forest_floor'),
  stone:base('weathered_stone',{roughness:.91,metalness:.02,color:0xc0a7c8}),
  cobble:base('cobbles',{roughness:.97,color:0xc9b9cb}),
  cliff:base('cliff_shale',{color:0x9fa2bb}),
  roof:base('violet_slate',{roughness:.9,color:0xb4a3d5}),
  wood:base('old_wood',{color:0x9b8176}),
  bark:new THREE.MeshStandardMaterial({color:0x30282e,roughness:1,flatShading:true}),
  pine:new THREE.MeshStandardMaterial({color:0x293d41,roughness:1,flatShading:true,side:THREE.DoubleSide}),
  pineHighlight:new THREE.MeshStandardMaterial({color:0x3d6457,roughness:1,flatShading:true,side:THREE.DoubleSide}),
  gravel:new THREE.MeshStandardMaterial({color:0x594b5b,roughness:1,flatShading:true}),
  iron:new THREE.MeshStandardMaterial({color:0x262b34,roughness:.66,metalness:.68}),
  trim:new THREE.MeshStandardMaterial({color:0x766b85,roughness:.85,metalness:.14}),
  gold:new THREE.MeshStandardMaterial({color:0xbca06a,metalness:.6,roughness:.35}),
  turquoise:new THREE.MeshStandardMaterial({color:0x40c9b9,emissive:0x24eee0,emissiveIntensity:2.1,roughness:.25}),
  flame:new THREE.MeshBasicMaterial({color:0xffba5a,toneMapped:false}),
  violet:new THREE.MeshStandardMaterial({color:0xaa59ff,emissive:0x8d2eff,emissiveIntensity:2.7}),
  black:new THREE.MeshStandardMaterial({color:0x0e1019,roughness:1}),
  glowTeal:load('aqua_glow'),glowGold:load('gold_glow'),glowViolet:load('violet_glow'),sky:load('violet_cosmos')
 };
}
