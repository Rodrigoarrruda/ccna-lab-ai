import {db} from '@/lib/db';
import {grade,labs,initial,run} from '@/lib/labs';
import {readRequestBody,RequestBodyTooLargeError} from '@/lib/request-body';

type ProgressCommand={device:'SW1'|'SW2',command:string};
type ProgressRequest={lab:string,commands:ProgressCommand[],assisted?:boolean};

function isProgressRequest(value:unknown):value is ProgressRequest{
 if(!value||typeof value!=='object')return false;
 const data=value as Record<string,unknown>;
 return typeof data.lab==='string'&&labs.some(l=>l.id===data.lab)&&
  Array.isArray(data.commands)&&data.commands.length<=500&&
  data.commands.every((item):item is ProgressCommand=>!!item&&typeof item==='object'&&
   ((item as Record<string,unknown>).device==='SW1'||(item as Record<string,unknown>).device==='SW2')&&
   typeof (item as Record<string,unknown>).command==='string'&&
   ((item as Record<string,unknown>).command as string).length<=200)&&
  (data.assisted===undefined||typeof data.assisted==='boolean');
}

export async function GET(){try{return Response.json(await db().prepare('SELECT id,lab,score,total,created,assisted FROM attempts ORDER BY created DESC LIMIT 50').all());}catch{return Response.json({error:'Não foi possível carregar o histórico.'},{status:503});}}
export async function POST(req:Request){
 let data:unknown;
 try{data=JSON.parse(await readRequestBody(req,60000));}
 catch(error){
  if(error instanceof RequestBodyTooLargeError)return Response.json({error:'Tentativa muito longa.'},{status:413});
  return Response.json({error:'Tentativa inválida.'},{status:400});
 }
 if(!isProgressRequest(data))return Response.json({error:'Tentativa inválida.'},{status:400});
 let state=initial(data.lab);
 for(const item of data.commands){
  if(state.device!==item.device){state.mode='user';state.target='';}
  state.device=item.device;
  state=run(state,item.command).state;
 }
 const checks=grade(data.lab,state);
 const score=checks.filter(x=>x.ok).length;
 try{
  await db().prepare('INSERT INTO attempts (id,lab,score,total,created,state,assisted) VALUES (?,?,?,?,?,?,?)')
   .bind(crypto.randomUUID(),data.lab,score,checks.length,new Date().toISOString(),JSON.stringify(state),data.assisted===false?0:1).run();
 }catch{
  return Response.json({error:'Não foi possível salvar. Seus comandos continuam disponíveis; tente novamente.'},{status:503});
 }
 return Response.json({checks,score,total:checks.length});
}
