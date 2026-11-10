import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {z} from 'zod';
import {randomUUID} from 'node:crypto';
import {spawn} from 'node:child_process';
import {mkdir, stat, unlink} from 'node:fs/promises';
import path from 'node:path';
import dns from 'node:dns/promises';
import net from 'node:net';

type Status='queued'|'processing'|'completed'|'failed';
type Task={id:string;url:string;title:string;format:string;status:Status;progress:number;createdAt:string;source:string;error?:string;fileName?:string;size?:string};
const tasks=new Map<string,Task>();
const app=express(); const port=Number(process.env.PORT||8787);
const webOrigin=process.env.WEB_ORIGIN||'http://localhost:5173';
app.use(helmet()); app.use(cors({origin:webOrigin.split(',').map(x=>x.trim()),methods:['GET','POST','DELETE'],allowedHeaders:['Content-Type']}));
app.use(express.json({limit:'20kb'})); app.use(rateLimit({windowMs:60_000,limit:30,standardHeaders:true,legacyHeaders:false}));
const schema=z.object({url:z.string().url().max(2048),format:z.enum(['best','mp4','webm']).default('best')});
const privateIp=(ip:string)=>{if(net.isIPv4(ip)){const [a,b]=ip.split('.').map(Number);return a===10||a===127||a===0||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&b===168||a>=224}return ip==='::1'||ip.startsWith('fc')||ip.startsWith('fd')||ip.startsWith('fe80:')||ip.startsWith('::ffff:127.')};
async function validateMediaUrl(raw:string){const u=new URL(raw);if(!['http:','https:'].includes(u.protocol))throw Error('Only HTTP(S) media URLs are accepted');if(u.username||u.password)throw Error('Credentials in URLs are not accepted');const host=u.hostname.toLowerCase();if(['localhost','metadata.google.internal'].includes(host)||host.endsWith('.local'))throw Error('Local and metadata hosts are blocked');const allow=(process.env.ALLOWED_MEDIA_HOSTS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);if(allow.length&&!allow.some(x=>host===x||host.endsWith('.'+x)))throw Error('This media host is not on the server allowlist');const records=await dns.lookup(host,{all:true}).catch(()=>[]);if(!records.length)throw Error('Host could not be resolved');if(records.some(r=>privateIp(r.address)))throw Error('Private or local network destinations are blocked');return u}
app.get('/health',(_req,res)=>res.json({ok:true,service:'axium-media-api',version:'0.1.0'}));
app.get('/api/tasks',(_req,res)=>res.json({tasks:[...tasks.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}));
app.post('/api/tasks',async(req,res)=>{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Provide a valid HTTP(S) media URL and supported format'});try{const u=await validateMediaUrl(parsed.data.url);const id='AX-'+randomUUID().slice(0,8).toUpperCase();const task:Task={id,url:u.toString(),title:decodeURIComponent(u.pathname.split('/').pop()||'Media download'),format:parsed.data.format.toUpperCase(),status:'queued',progress:0,createdAt:new Date().toISOString(),source:u.hostname};tasks.set(id,task);res.status(202).json({task});}catch(e){res.status(400).json({error:e instanceof Error?e.message:'Invalid media URL'})}});
app.delete('/api/tasks/:id',(_req,res)=>{const id=_req.params.id;if(!tasks.has(id))return res.status(404).json({error:'Task not found'});tasks.delete(id);res.status(204).end()});
// Explicit worker endpoint is intentionally disabled until authentication and isolated worker deployment are configured.
app.post('/api/tasks/:id/start',(_req,res)=>res.status(501).json({error:'Worker execution is not enabled in this starter. Configure the isolated FFmpeg worker before exposing downloads.'}));
app.listen(port,()=>console.log(`Axium API listening on :${port}`));
