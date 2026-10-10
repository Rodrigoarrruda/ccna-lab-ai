export const runtime='nodejs';
export const dynamic='force-dynamic';

import {db} from '@/lib/db';
import {logMysqlFailure} from '@/lib/db-errors';
import {topics} from '@/lib/training';

export async function GET(){
 const requestId=crypto.randomUUID();
 try{
  return Response.json(await db().prepare('SELECT topic,studied FROM study').all());
 }catch(error){
  logMysqlFailure('/api/study','read_study',requestId,error);
  return Response.json({error:'Não foi possível carregar a trilha.',requestId},{status:503});
 }
}

export async function POST(req:Request){
 let d:{topic:string,studied:boolean};
 try{
  const raw=await req.json() as unknown;
  if(!raw||typeof raw!=='object')return Response.json({error:'Tema inválido.'},{status:400});
  d=raw as {topic:string,studied:boolean};
 }catch{
  return Response.json({error:'Tema inválido.'},{status:400});
 }
 if(!d.topic||!topics.some(t=>t.id===d.topic)||typeof d.studied!=='boolean')return Response.json({error:'Tema inválido.'},{status:400});
 const requestId=crypto.randomUUID();
 try{
  await db().prepare('INSERT INTO study(topic,studied) VALUES (?,?) ON DUPLICATE KEY UPDATE studied=VALUES(studied)').bind(d.topic,d.studied?1:0).run();
 }catch(error){
  logMysqlFailure('/api/study','save_study',requestId,error);
  return Response.json({error:'Não foi possível salvar o tema.',requestId},{status:503});
 }
 return Response.json({ok:true});
}
