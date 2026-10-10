import {db} from '@/lib/db';
import {logMysqlFailure} from '@/lib/db-errors';
import {grade,labs,initial,run} from '@/lib/labs';

export async function GET(){
 const requestId=crypto.randomUUID();
 try{
  return Response.json(await db().prepare('SELECT id,lab,score,total,created,assisted FROM attempts ORDER BY created DESC LIMIT 50').all());
 }catch(error){
  logMysqlFailure('/api/progress','read_history',requestId,error);
  return Response.json({error:'Não foi possível carregar o histórico.',requestId},{status:503});
 }
}

export async function POST(req:Request){
 let data:{lab:string,commands:{device:string,command:string}[],assisted?:boolean};
 try{
  if(Number(req.headers.get('content-length'))>60000)return Response.json({error:'Tentativa muito longa.'},{status:413});
  const raw=await req.json() as unknown;
  if(!raw||typeof raw!=='object')return Response.json({error:'Tentativa inválida.'},{status:400});
  data=raw as {lab:string,commands:{device:string,command:string}[],assisted?:boolean};
 }catch{
  return Response.json({error:'Tentativa inválida.'},{status:400});
 }
 if(!data.lab||!Array.isArray(data.commands)||data.commands.length>500||!labs.some(l=>l.id===data.lab))return Response.json({error:'Tentativa inválida.'},{status:400});
 let state=initial(data.lab);
 for(const item of data.commands){
  if(!item||!['SW1','SW2'].includes(item.device)||typeof item.command!=='string'||item.command.length>200)return Response.json({error:'Comando inválido.'},{status:400});
  if(state.device!==item.device){state.mode="user";state.target="";}
  state.device=item.device;
  state=run(state,item.command).state;
 }
 const checks=grade(data.lab,state);
 const score=checks.filter(x=>x.ok).length;
 const requestId=crypto.randomUUID();
 try{
  await db().prepare('INSERT INTO attempts (id,lab,score,total,created,state,assisted) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),data.lab,score,checks.length,new Date().toISOString(),JSON.stringify(state),data.assisted===false?0:1).run();
 }catch(error){
  logMysqlFailure('/api/progress','save_attempt',requestId,error);
  return Response.json({error:'Não foi possível salvar. Seus comandos continuam disponíveis; tente novamente.',requestId},{status:503});
 }
 return Response.json({checks,score,total:checks.length});
}
