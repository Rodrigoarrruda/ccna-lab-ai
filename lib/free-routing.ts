import {expandCisco} from './labs.ts';
import {validHost,type FreeNetwork,type Endpoint,type NetworkNode} from './free-network.ts';
export const routerPorts=['gi0/0','gi0/1','gi0/2'];
export type Router={interfaces:Record<string,{ip:string,up:boolean}>,routes:{network:string,mask:string,nextHop:string}[]};
export const newRouter=():Router=>({interfaces:Object.fromEntries(routerPorts.map(p=>[p,{ip:'',up:false}])),routes:[]});
export const subnet=(ip:string)=>ip.split('.').slice(0,3).join('.')+'.0';
export function addressInUse(n:FreeNetwork,ip:string,except:string){return n.nodes.some(p=>p.kind==='pc'&&p.id!==except&&p.ip===ip)||Object.entries(n.routers??{}).some(([id,r])=>Object.entries(r.interfaces).some(([port,i])=>id+':'+port!==except&&i.ip===ip));}
function linkUp(n:FreeNetwork,id:string,port:string){const i=n.routers?.[id]?.interfaces[port];if(!i?.up)return false;const c=n.cables.find(c=>[c.a,c.b].some(e=>e.node===id&&e.port===port));if(!c)return false;const e=c.a.node===id&&c.a.port===port?c.b:c.a;const peer=n.nodes.find(p=>p.id===e.node);return peer?.kind==='pc'||(peer?.kind==='switch'?!!n.config.devices[e.node]?.ports[e.port]?.up:!!n.routers?.[e.node]?.interfaces[e.port]?.up);}
export function operational(n:FreeNetwork,id:string,port:string){return !!n.routers?.[id]?.interfaces[port]?.ip&&linkUp(n,id,port);}
export function executeRouter(network:FreeNetwork,id:string,input:string){
 const next=structuredClone(network),s=next.config,r=next.routers?.[id];if(!r)return {network,output:'% Roteador inexistente.'};
 if(s.device!==id){s.device=id;s.mode='user';s.target='';}
 let c=expandCisco(input);if(c==='sh ip route')c='show ip route';const doShow=c.startsWith('do show ');if(doShow)c=c.slice(3);
 const ok=(output='')=>({network:next,output}),fail=(reason:string)=>ok('% '+reason);
 if(c==='?')return ok('enable | configure terminal | interface gi0/0 (ou /1, /2) | ip address IP 255.255.255.0 | no ip address | shutdown | no shutdown | ip route REDE MASCARA PROXIMO_SALTO | no ip route REDE MASCARA PROXIMO_SALTO | exit | end | show ip interface brief | show ip route | show running-config\nEscopo: interfaces /24, rotas /24 e rota padrão; sem OSPF, NAT ou subinterfaces.');
 if(c.startsWith('show ')){
  if(doShow?!['config','interface'].includes(s.mode):s.mode!=='exec')return fail('Use enable; em configuração, use do show.');
  if(c==='show ip interface brief')return ok('Interface  IP-Address  Status  Protocol\n'+routerPorts.map(p=>{const i=r.interfaces[p];return `${p}  ${i.ip||'unassigned'}  ${!i.up?'administratively down':linkUp(next,id,p)?'up':'down'}  ${linkUp(next,id,p)?'up':'down'}`;}).join('\n'));
  if(c==='show ip route')return ok('C = connected, S = static (configurada; próximo salto precisa estar acessível)\n'+routerPorts.filter(p=>operational(next,id,p)).map(p=>`C ${subnet(r.interfaces[p].ip)}/24 is directly connected, ${p}`).concat(r.routes.map(t=>`S${t.mask==='0.0.0.0'?'*':''} ${t.network}/${t.mask==='0.0.0.0'?'0':'24'} via ${t.nextHop}`)).join('\n'));
  if(c==='show running-config')return ok(routerPorts.map(p=>`interface ${p}\n${r.interfaces[p].ip?' ip address '+r.interfaces[p].ip+' 255.255.255.0':' no ip address'}\n ${r.interfaces[p].up?'no shutdown':'shutdown'}`).concat(r.routes.map(t=>`ip route ${t.network} ${t.mask} ${t.nextHop}`)).join('\n'));
  return fail('Comando show não suportado.');
 }
 if(c==='enable'){if(s.mode!=='user')return fail('enable disponível no modo usuário.');s.mode='exec';return ok();}
 if(c==='configure terminal'){if(s.mode!=='exec')return fail('Entre em enable primeiro.');s.mode='config';return ok();}
 if(c==='end'){if(!['config','interface'].includes(s.mode))return fail('end disponível em configuração.');s.mode='exec';s.target='';return ok();}
 if(c==='exit'){s.mode=s.mode==='interface'?'config':s.mode==='config'?'exec':'user';s.target='';return ok();}
 const iface=c.match(/^interface (gi0\/[012])$/);if(iface){if(!['config','interface'].includes(s.mode))return fail('Entre em configure terminal.');s.mode='interface';s.target=iface[1];return ok();}
 const route=c.match(/^(no )?ip route (\S+) (\S+) (\S+)$/);if(route){if(s.mode!=='config')return fail('ip route exige modo de configuração global.');const [,remove,dest,mask,hop]=route;
  if(!((mask==='255.255.255.0'&&validHost(dest.replace(/\.0$/,'.1'))&&dest===subnet(dest))||(dest==='0.0.0.0'&&mask==='0.0.0.0'))||!validHost(hop))return fail('Use rede /24 canônica ou 0.0.0.0 0.0.0.0, com próximo salto unicast válido.');
  if(Object.values(r.interfaces).some(i=>i.ip===hop))return fail('Próximo salto não pode ser o próprio roteador.');
  const same=(t:Router['routes'][number])=>t.network===dest&&t.mask===mask&&t.nextHop===hop;
  if(remove)r.routes=r.routes.filter(t=>!same(t));else{if(r.routes.some(t=>t.network===dest&&t.mask===mask&&!same(t)))return fail('Uma rota por prefixo nesta versão; remova a anterior.');if(!r.routes.some(same)){if(r.routes.length>=32)return fail('Limite: 32 rotas estáticas.');r.routes.push({network:dest,mask,nextHop:hop});}}return ok();
 }
 if(s.mode==='interface'){
  const i=r.interfaces[s.target];if(!i)return fail('Selecione uma interface física.');
  if(c==='shutdown'||c==='no shutdown'){i.up=c==='no shutdown';return ok();}
  if(c==='no ip address'){i.ip='';return ok();}
  const ip=c.match(/^ip address (\S+) (\S+)$/);if(ip){if(ip[2]!=='255.255.255.0'||!validHost(ip[1]))return fail('Nesta versão, configure IPv4 unicast com máscara 255.255.255.0.');if(r.routes.some(t=>t.nextHop===ip[1]))return fail('IP coincide com próximo salto de uma rota existente.');if(addressInUse(next,ip[1],id+':'+s.target))return fail('Endereço IPv4 duplicado.');if(Object.entries(r.interfaces).some(([p,i])=>p!==s.target&&i.ip&&subnet(i.ip)===subnet(ip[1])))return fail('Redes sobrepostas nas interfaces do roteador.');i.ip=ip[1];return ok();}
 }
 return fail('Comando não suportado ou modo inválido. Use ? para ajuda.');
}
// Caminho Ethernet não marcado: portas access nas bordas, trunks entre switches.
export function segment(n:FreeNetwork,a:Endpoint,b:Endpoint):string[]|null{
 const cable=n.cables.find(c=>[c.a,c.b].some(e=>e.node===a.node&&e.port===a.port));if(!cable)return null;const start=cable.a.node===a.node&&cable.a.port===a.port?cable.b:cable.a;
 if(start.node===b.node&&start.port===b.port)return [a.node,b.node];
 const ap=n.config.devices[start.node]?.ports[start.port];if(!ap?.up||ap.mode!=='access'||!n.config.devices[start.node].vlans[ap.vlan])return null;
 const vlan=ap.vlan,queue=[{id:start.node,path:[a.node,start.node]}],seen=new Set([start.node]);
 while(queue.length){const curr=queue.shift()!;for(const c of n.cables){const local=c.a.node===curr.id?c.a:c.b.node===curr.id?c.b:null;if(!local)continue;const remote=local===c.a?c.b:c.a,lp=n.config.devices[curr.id]?.ports[local.port];if(!lp?.up)continue;
  if(remote.node===b.node&&remote.port===b.port&&lp.mode==='access'&&lp.vlan===vlan)return [...curr.path,b.node];
  const rp=n.config.devices[remote.node]?.ports[remote.port];if(!seen.has(remote.node)&&rp&&n.config.devices[remote.node].vlans[vlan]&&[lp,rp].every(p=>p.up&&p.mode==='trunk'&&(!p.allowed.length||p.allowed.includes(vlan)))){seen.add(remote.node);queue.push({id:remote.node,path:[...curr.path,remote.node]});}
 }}return null;
}
function direction(n:FreeNetwork,a:NetworkNode,b:NetworkNode):{ok:boolean,reason:string,path:string[]}{
 const fail=(reason:string)=>({ok:false,reason,path:[] as string[]});
 if(!a.gateway)return fail(`${a.id}: redes /24 diferentes; gateway padrão ausente.`);
 const gateway=Object.entries(n.routers??{}).flatMap(([id,r])=>Object.entries(r.interfaces).map(([port,i])=>({id,port,...i}))).find(i=>i.ip===a.gateway);
 if(!gateway)return fail(`${a.id}: gateway ${a.gateway} não corresponde a uma interface de roteador.`);
 if(!operational(n,gateway.id,gateway.port))return fail(`Gateway ${gateway.id} ${gateway.port}: interface desligada ou sem enlace operacional.`);
 const first=segment(n,{node:a.id,port:'eth0'},{node:gateway.id,port:gateway.port});if(!first)return fail(`${a.id}: sem caminho L2 até o gateway; confira cabo, access VLAN e trunk.`);
 let id=gateway.id,path=first;const seen=new Set<string>();
 while(!seen.has(id)){seen.add(id);const r=n.routers![id];
  const connected=routerPorts.find(p=>operational(n,id,p)&&subnet(r.interfaces[p].ip)===subnet(b.ip));
  if(connected){const last=segment(n,{node:id,port:connected},{node:b.id,port:'eth0'});return last?{ok:true,reason:'Rota de ida válida.',path:[...path,...last.slice(1)]}:fail(`${id}: rede conectada do destino sem caminho L2; confira portas e VLANs.`);}
  const route=r.routes.find(t=>t.network===subnet(b.ip))??r.routes.find(t=>t.mask==='0.0.0.0');if(!route)return fail(`${id}: sem rota para ${subnet(b.ip)}/24. Use show ip route.`);
  const out=routerPorts.find(p=>operational(n,id,p)&&subnet(r.interfaces[p].ip)===subnet(route.nextHop));if(!out)return fail(`${id}: próximo salto ${route.nextHop} sem interface de saída operacional na mesma /24.`);
  const hop=Object.entries(n.routers??{}).flatMap(([rid,rr])=>Object.entries(rr.interfaces).map(([port,i])=>({id:rid,port,...i}))).find(i=>i.id!==id&&i.ip===route.nextHop&&operational(n,i.id,i.port));if(!hop)return fail(`${id}: próximo salto ${route.nextHop} não está acessível em outro roteador.`);
  const link=segment(n,{node:id,port:out},{node:hop.id,port:hop.port});if(!link)return fail(`${id}: próximo salto ${route.nextHop} sem caminho L2.`);path=[...path,...link.slice(1)];id=hop.id;
 }return fail('Loop de roteamento detectado nas rotas estáticas.');
}
export function routedPing(n:FreeNetwork,a:NetworkNode,b:NetworkNode){const forward=direction(n,a,b);if(!forward.ok)return forward;const back=direction(n,b,a);if(!back.ok)return {ok:false,reason:'Falha no retorno: '+back.reason,path:[]};return {ok:true,reason:`Resposta de ${b.ip}: roteamento IPv4 de ida e volta válido (simulado).`,path:forward.path};}
