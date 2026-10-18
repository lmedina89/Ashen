// Optional generated ambience: browser WebAudio only. No external audio files.
export function createAudio(){
 let ctx=null,master=null,windSrc=null,enabled=false,mod=null;
 function start(){
   try{
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain();master.gain.value=.085;master.connect(ctx.destination);
    const length=ctx.sampleRate*3,buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);
    let smoothed=0;
    for(let i=0;i<length;i++){smoothed=(smoothed*.989)+(Math.random()*2-1)*.011;data[i]=smoothed;}
    windSrc=ctx.createBufferSource();windSrc.buffer=buffer;windSrc.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=450;
    windSrc.connect(filter).connect(master);windSrc.start();
    // sub-bass mysterious low drone, quiet enough not to interfere with music
    const tone=ctx.createOscillator();tone.type='sine';tone.frequency.value=58;
    const tg=ctx.createGain();tg.gain.value=.16;tone.connect(tg).connect(master);tone.start();
    mod=ctx.createOscillator();mod.frequency.value=.13;
    const mg=ctx.createGain();mg.gain.value=.10;mod.connect(mg).connect(tg.gain);mod.start();
   }catch(e){console.warn('Ambient audio unavailable',e)}
 }
 function toggle(){
  if(!ctx)start();
  enabled=!enabled;
  if(ctx){if(enabled)ctx.resume();else ctx.suspend();}
  document.querySelector('#sound').classList.toggle('active',enabled);
  return enabled;
 }
 return {toggle};
}
