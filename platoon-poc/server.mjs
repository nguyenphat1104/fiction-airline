import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {createAirline} from './domain.mjs';
const root=dirname(fileURLToPath(import.meta.url));
export function createApp(airline=createAirline()) {
 return createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try {
   if(req.method==='GET'&&url.pathname==='/api/flights') return send(200,{flights:airline.search(Object.fromEntries(url.searchParams))});
   if(req.method==='GET'&&/^\/api\/bookings\/[^/]+$/.test(url.pathname)){const x=airline.getBooking(url.pathname.split('/')[3]);return send(x.status,x.error?{error:x.error}:x.booking);}
   if(req.method==='POST'&&(url.pathname==='/api/bookings'||/^\/api\/bookings\/[^/]+\/payments$/.test(url.pathname))){
    let body='';for await(const chunk of req){body+=chunk;if(body.length>16000)return send(413,{error:'Request too large'});}
    let data;try{data=JSON.parse(body)}catch{return send(400,{error:'Invalid JSON'});}
    const x=url.pathname==='/api/bookings'?airline.reserve(data):airline.pay(url.pathname.split('/')[3],data);
    return send(x.status,x.error?{error:x.error}:x.booking);
   }
   if(req.method==='GET'&&(url.pathname==='/'||url.pathname==='/index.html')){const html=await readFile(join(root,'public/index.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html);}
   send(404,{error:'Not found'});
  }catch(e){console.error(e);send(500,{error:'Internal error'});}
 });
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const port=Number(process.env.PORT||3100);createApp().listen(port,()=>console.log(`Fiction Airline POC: http://localhost:${port}`));
}