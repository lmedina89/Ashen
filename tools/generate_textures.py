"""Deterministic original texture generation; run with Pillow + NumPy installed.
Generated PNGs are committed to repo, so this is optional for players.
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np, random, math
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent/'public'/'textures'
ROOT.mkdir(parents=True,exist_ok=True)
rng=np.random.default_rng(13471)

def fbm(h,w,octaves=(8,24,64,128,256),coeffs=(.38,.26,.18,.11,.07)):
    a=np.zeros((h,w),dtype=np.float32)
    for n,c in zip(octaves,coeffs):
        noise=rng.random((max(2,round(n*h/w)),n)).astype('float32')
        img=Image.fromarray(np.uint8(noise*255),'L').resize((w,h),Image.Resampling.BICUBIC)
        a+=np.asarray(img,dtype='float32')/255*c
    return a

def save(a,name):
    Image.fromarray(np.uint8(np.clip(a,0,255)),'RGB').save(ROOT/name,optimize=True)

s=512
y,x=np.mgrid[0:s,0:s]
noise=fbm(s,s)
# stone block wall, rich weathered slate brown/purple with worn chisel marks
mortar=np.full((s,s),False)
tones=np.zeros((s,s))
for row in range(16):
    y0=row*32; offset=(row%2)*31
    mortar[y0:y0+3,:]=True
    for col in range(-1,10):
        x0=col*62+offset
        if 0<=x0<s:mortar[y0:y0+32,x0:x0+3]=True
        cv=random.Random((row+31)*139+(col+12)*71).uniform(-.22,.23)
        yy0=y0+3; yy1=min(s,y0+32)
        xx0=max(0,x0+4); xx1=min(s,x0+62)
        if xx1>xx0: tones[yy0:yy1,xx0:xx1]=cv
v=38+noise*95+tones*36+4*np.sin(x*.12)
v=np.where(mortar,v*.43,v)
arr=np.stack([v*1.03,v*.95,v*1.09],-1)
arr[...,0]+=np.where((y%32)<5,11,0)
save(arr,'weathered_stone.png')
# river rock cobbles, visually stronger than noise-only
im=Image.new('RGB',(512,512),(38,33,41));d=ImageDraw.Draw(im)
for row in range(16):
    off=0 if row%2==0 else 23
    for col in range(-2,14):
        x0=col*46+off+2; y0=row*32+2
        r=random.Random(row*347+col*231+77)
        c=r.randrange(65,110)
        pts=[(x0+3,y0+7),(x0+12,y0+2),(x0+36,y0+1),(x0+43,y0+9),(x0+39,y0+24),(x0+27,y0+29),(x0+6,y0+27),(x0+1,y0+18)]
        colr=(int(c*1.0),int(c*.86),int(c*.90))
        d.polygon(pts,fill=colr)
        d.line([pts[0],pts[1],pts[2]],fill=(min(255,c+23),min(255,c+16),min(255,c+19)),width=2)
        d.line([pts[4],pts[5],pts[6]],fill=(max(0,c-24),max(0,c-24),max(0,c-24)),width=2)
a=np.array(im,dtype=np.float32)
n=fbm(512,512)
a+=(n[...,None]-.5)*51
save(a,'cobbles.png')
# grass/forest floor with patches and details
n=fbm(512,512)
g=np.stack([25+n*45,37+n*69,27+n*40],-1)
g+=(rng.random((512,512,1))-.5)*29
for _ in range(7000):
    px,py=int(rng.integers(0,512)),int(rng.integers(0,512)); g[py,px,:]+=[20,24,-5] if rng.random()>.6 else [-8,-9,-4]
save(g,'forest_floor.png')
# dark shale cliff
n=fbm(512,512);strata=np.sin(y*.18+x*.09)+np.sin(y*.064-x*.14)
v=30+n*65+strata*11
a=np.stack([v*.96,v*.98,v*1.18],-1);save(a,'cliff_shale.png')
# slate shingles for steep blue gothic roofs
n=fbm(512,512);v=30+n*73+np.sin(x*.013+y*.09)*7
shingle=((x+((y//26)%2)*22)%48<3)|((y%26)<3)
v=np.where(shingle,v*.45,v)
a=np.stack([v*.70,v*.80,v*1.16],-1)
save(a,'violet_slate.png')
# wood panels
n=fbm(512,512);v=45+n*50+np.sin(x*.13+np.sin(y*.04))*12
a=np.stack([v*1.1,v*.82,v*.7],-1);save(a,'old_wood.png')
# cosmos panorama: high-saturation purple, midnight blue and nebular pink with stars
W,H=2048,1024
y,x=np.mgrid[0:H,0:W]
t=y/H;u=x/W
n=fbm(H,W,octaves=(8,20,48,100,250),coeffs=(.38,.26,.18,.11,.07))
n2=fbm(H,W,octaves=(5,13,33,70,160),coeffs=(.4,.27,.17,.1,.06))
ridge=np.sin(u*17+t*13+2.1*np.sin(u*12))*np.cos(u*21-t*15)
neb=np.clip((n-.39)*3.1+.28*ridge + .19*np.sin(u*37+t*11),0,1)
neb2=np.clip((n2-.34)*2.2+ .14*np.sin(u*20-t*29),0,1)
horizon=np.clip((t-.55)*1.6,0,.7)
R=7+neb*97+neb2*92+horizon*32
G=8+neb*14+neb2*29+horizon*10
B=30+neb*153+neb2*106+horizon*40
# brightest nebula swirls
ribbon=np.exp(-((t-.34-.07*np.sin(u*18))/.11)**2)*np.maximum(0,np.sin(u*28+2*n2))
R+=ribbon*67;B+=ribbon*42
sky=np.stack([R,G,B],-1)
# stars sharp white/blue/gold in all directions
for _ in range(5400):
    xx=int(rng.integers(0,W));yy=int(rng.integers(0,H));bright=rng.uniform(.45,1)
    sky[yy,xx,:]=[180+75*bright,185+70*bright,205+50*bright]
    if bright>.985 and 2<xx<W-3 and 2<yy<H-3:
        for dx,dy,alpha in [(1,0,.25),(-1,0,.25),(0,1,.25),(0,-1,.25)]:
            sky[yy+dy,xx+dx]=np.maximum(sky[yy+dy,xx+dx],np.array([140,100,190])*alpha)
save(sky,'violet_cosmos.png')
# radial sprites: transparent glows for particle halos
for name,rgba in [('aqua_glow',(85,255,227)),('gold_glow',(255,152,49)),('violet_glow',(197,100,255))]:
    sz=128
    yy,xx=np.mgrid[0:sz,0:sz];r=np.sqrt((xx-63.5)**2+(yy-63.5)**2)/64
    alpha=np.uint8(np.clip((1-r)**2*190,0,255))
    arr=np.zeros((sz,sz,4),dtype=np.uint8);arr[...,:3]=rgba;arr[...,3]=alpha
    Image.fromarray(arr,'RGBA').save(ROOT/(name+'.png'))
print('Generated textures:',*[p.name for p in ROOT.iterdir()])
