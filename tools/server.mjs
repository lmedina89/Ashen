import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const types={'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const root=process.cwd();
const port=Number(process.env.PORT||5173);
const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
  const target=resolve(root,relative);
  if(target!==root&&!target.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return;}
  try{if(!(await stat(target)).isFile())throw Error();let content=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(content);}
  catch{res.writeHead(404);res.end('Not found')}
});
server.listen(port,'0.0.0.0',()=>console.log('Ashen Kingdom: http://localhost:'+port));
