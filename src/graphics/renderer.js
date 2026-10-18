import * as THREE from 'three';

export function createRenderer(canvas,scene,camera){
 const webgl=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance',alpha:false});
 webgl.setPixelRatio(1);
 webgl.outputColorSpace=THREE.SRGBColorSpace;
 webgl.toneMapping=THREE.ACESFilmicToneMapping;
 webgl.toneMappingExposure=1.38;
 webgl.shadowMap.enabled=false; // avoid heavy cascading shadows on iPhone
 let target=null,width=0,height=0,pixel=true,quality='auto';
 const overlayScene=new THREE.Scene(),overlayCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:null,depthTest:false,depthWrite:false,toneMapped:false}));
 overlayScene.add(quad);
 function resize(){
  width=Math.max(1,canvas.clientWidth);height=Math.max(1,canvas.clientHeight);
  webgl.setSize(width,height,false);
  camera.aspect=width/height;camera.updateProjectionMatrix();
  const auto=matchMedia('(pointer:coarse)').matches;
  const scale=!pixel?1:quality==='low'?3.3:quality==='high'?1.7:auto?2.25:1.9;
  const w=Math.max(200,Math.round(width/scale));
  const h=Math.max(120,Math.round(height/scale));
  if(target)target.dispose();
  target=new THREE.WebGLRenderTarget(w,h,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true,stencilBuffer:false});
  quad.material.map=target.texture;quad.material.needsUpdate=true;
 }
 function settings(next){const changed=next.pixel!==pixel||next.quality!==quality;pixel=next.pixel;quality=next.quality;if(changed)resize();}
 function render(){
  if(pixel){webgl.setRenderTarget(target);webgl.render(scene,camera);webgl.setRenderTarget(null);webgl.render(overlayScene,overlayCamera)}
  else webgl.render(scene,camera);
 }
 window.addEventListener('resize',resize,{passive:true});
 resize();
 return {webgl,render,settings,resize};
}
