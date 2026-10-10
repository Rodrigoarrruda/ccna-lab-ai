import {db} from '@/lib/db';
import {topics} from '@/lib/training';
export async function GET(){try{return Response.json(await db().prepare('SELECT topic,studied FROM study').all());}catch{return Response.json({error:'Não foi possível carregar a trilha.'},{status:503});}}
export async function POST(req:Request){try{const d=await req.json() as {topic:string,studied:boolean};if(!topics.some(t=>t.id===d.topic)||typeof d.studied!=='boolean')return Response.json({error:'Tema inválido.'},{status:400});await db().prepare('INSERT INTO study(topic,studied) VALUES (?,?) ON DUPLICATE KEY UPDATE studied=VALUES(studied)').bind(d.topic,d.studied?1:0).run();return Response.json({ok:true});}catch{return Response.json({error:'Não foi possível salvar o tema.'},{status:503});}}
