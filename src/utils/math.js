export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const lerp = (a,b,t) => a+(b-a)*t;
export function seeded(seed=1){
  let state=seed>>>0;
  return ()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}
export const pathX = z => 1.85*Math.sin(z*.088)+1.15*Math.sin(z*.175);
export function terrainHeight(x,z){
  const roadDistance=Math.abs(x-pathX(z));
  const rise=(48-z)*.018;
  const shoulder=Math.max(0,(roadDistance-6)/20);
  const ridge=(shoulder*shoulder)*(2.7+.65*Math.sin(z*.17+x*.14));
  const ripples=(.16*Math.sin(x*.33+z*.13)+.1*Math.sin(z*.45-x*.2))*(1-Math.exp(-shoulder*2));
  const terrace=Math.max(0,Math.min(1,(-z-23)/13));
  const flatten=Math.max(0,1-Math.abs(x)/28)*terrace;
  return rise + ridge*(1-flatten*.85)+ripples*(1-flatten);
}
export function distance2(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
export function nearPath(x,z,width=6){return Math.abs(x-pathX(z))<width;}
