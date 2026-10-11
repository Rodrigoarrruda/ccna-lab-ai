import {initial,run,expandCisco,type State} from './labs.ts';
export const switchPorts=['gi0/1','gi0/2','gi0/23','gi0/24'];
export type NetworkNode={id:string,kind:'switch'|'pc',x:number,y:number,ip:string};
export type Endpoint={node:string,port:string};
export type Cable={id:string,a:Endpoint,b:Endpoint};
export type FreeNetwork={version:1,nodes:NetworkNode[],cables:Cable[],config:State,serial:number};
export const emptyNetwork=():FreeNetwork=>({version:1,nodes:[],cables:[],config:{devices:{},device:'',mode:'user',target:''},serial:0});
export function ports(node:NetworkNode){return node.kind==='pc'?['eth0']:switchPorts;}
export function addNode(network:FreeNetwork,kind:NetworkNode['kind'],x=100,y=100):FreeNetwork{
 if(network.nodes.length>=8)throw Error('Limite desta versão: 8 equipamentos.');
 const next=structuredClone(network);next.serial++;
 const id=(kind==='pc'?'PC':'SW')+next.serial;
 next.nodes.push({id,kind,x:Math.max(0,Math.min(780,x)),y:Math.max(0,Math.min(440,y)),ip:kind==='pc'?`192.168.10.${Array.from({length:244},(_,i)=>i+11).find(host=>!next.nodes.some(n=>n.ip===`192.168.10.${host}`))}`:''});
 if(kind==='switch'){next.config.devices[id]=structuredClone(initial().devices.SW1);if(!next.config.device)next.config.device=id;}
 return next;
}
export function removeNode(network:FreeNetwork,id:string):FreeNetwork{
 const next=structuredClone(network);next.nodes=next.nodes.filter(n=>n.id!==id);next.cables=next.cables.filter(c=>c.a.node!==id&&c.b.node!==id);delete next.config.devices[id];
 if(next.config.device===id){next.config.device=next.nodes.find(n=>n.kind==='switch')?.id??'';next.config.mode='user';next.config.target='';}return next;
}
export function connect(network:FreeNetwork,a:Endpoint,b:Endpoint):FreeNetwork{
 const left=network.nodes.find(n=>n.id===a.node),right=network.nodes.find(n=>n.id===b.node);
 if(!left||!right||!ports(left).includes(a.port)||!ports(right).includes(b.port))throw Error('Equipamento ou porta inválida.');
 if(a.node===b.node)throw Error('Escolha dois equipamentos diferentes.');
 if(left.kind==='pc'&&right.kind==='pc')throw Error('Nesta versão, conecte cada PC a um switch.');
 if(network.cables.some(c=>[c.a,c.b].some(e=>(e.node===a.node&&e.port===a.port)||(e.node===b.node&&e.port===b.port))))throw Error('Uma das portas já está ocupada.');
 const seen=new Set([a.node]),queue=[a.node];
 while(queue.length){const id=queue.shift()!;for(const c of network.cables){const other=c.a.node===id?c.b.node:c.b.node===id?c.a.node:undefined;if(other&&!seen.has(other)){seen.add(other);queue.push(other);}}}
 if(seen.has(b.node))throw Error('Esse enlace cria um loop. STP não está disponível nesta versão.');
 const next=structuredClone(network);next.serial++;next.cables.push({id:'cable'+next.serial,a:{...a},b:{...b}});return next;
}
export function validHost(ip:string){const values=ip.split('.');return values.length===4&&values.every(v=>/^(0|[1-9]\d{0,2})$/.test(v)&&+v<=255)&&+values[0]>=1&&+values[0]<224&&+values[0]!==127&&+values[3]>0&&+values[3]<255;}
export function configurePC(network:FreeNetwork,id:string,ip:string){if(!validHost(ip))throw Error('Informe um IPv4 unicast válido; nesta versão a máscara é /24 e .0/.255 são reservados.');if(network.nodes.some(n=>n.kind==='pc'&&n.id!==id&&n.ip===ip))throw Error('Esse endereço já pertence a outro PC.');const next=structuredClone(network);const pc=next.nodes.find(n=>n.id===id&&n.kind==='pc');if(!pc)throw Error('PC não encontrado.');pc.ip=ip;return next;}
export function executeSwitch(network:FreeNetwork,id:string,command:string){
 if(!network.config.devices[id])return {network,output:'% Selecione um switch.'};
 const state=structuredClone(network.config);if(state.device!==id){state.device=id;state.mode='user';state.target='';}
 const canonical=expandCisco(command).replace(/^do /,'');
 if(/^(?:interface (?:vlan|port-channel)|channel-group|ip |no ip|show etherchannel)/.test(canonical))return {network:{...network,config:state},output:'% Laboratório livre: somente switching VLAN/access/trunk; roteamento e EtherChannel não disponíveis.'};
 if(canonical.startsWith('name ')&&command.trim().slice(5).length>32)return {network:{...network,config:state},output:'% Nome de VLAN deve ter até 32 caracteres.'};
 if(canonical==='?')return {network:{...network,config:state},output:'enable | configure terminal | vlan N | name NOME | interface gi0/1 (ou /2, /23, /24)\n switchport mode access/trunk | switchport access vlan N | switchport trunk allowed vlan 10,20\n shutdown | no shutdown | exit | end | show vlan brief | show interfaces trunk | show ip interface brief | show running-config'};
 const result=run(state,command);return {network:{...network,config:result.state},output:result.output};
}
export function testPing(network:FreeNetwork,source:string,target:string):{ok:boolean,reason:string,path:string[]}{
 const a=network.nodes.find(n=>n.id===source&&n.kind==='pc'),b=network.nodes.find(n=>(n.id===target||n.ip===target)&&n.kind==='pc');
 const fail=(reason:string)=>({ok:false,reason,path:[]});
 if(!a||!b)return fail('Selecione dois PCs existentes.');
 if(a.id===b.id)return {ok:true,reason:'Resposta do próprio PC.',path:[a.id]};
 if(a.ip===b.ip)return fail('Endereços IPv4 duplicados.');
 if(a.ip.split('.').slice(0,3).join('.')!==b.ip.split('.').slice(0,3).join('.'))return fail('Os PCs estão em redes /24 diferentes. Roteamento não está disponível.');
 const attachment=(id:string)=>{const cable=network.cables.find(c=>c.a.node===id||c.b.node===id);if(!cable)return;return cable.a.node===id?cable.b:cable.a;};
 const ae=attachment(a.id),be=attachment(b.id);if(!ae||!be)return fail('Um dos PCs está sem cabo.');
 const ap=network.config.devices[ae.node]?.ports[ae.port],bp=network.config.devices[be.node]?.ports[be.port];
 if(!ap||!bp)return fail('O PC precisa de um enlace para switch.');
 if(!ap.up||!bp.up)return fail('Porta de acesso administrativamente desligada.');
 if(ap.mode!=='access'||bp.mode!=='access')return fail('As portas ligadas aos PCs precisam estar em access.');
 if(ap.vlan!==bp.vlan)return fail('Os PCs estão em VLANs diferentes.');
 const vlan=ap.vlan;const exists=(id:string)=>!!network.config.devices[id]?.vlans[vlan];
 if(!exists(ae.node)||!exists(be.node))return fail(`VLAN ${vlan} ausente em um switch de acesso.`);
 const queue=[{id:ae.node,path:[a.id,ae.node]}],seen=new Set([ae.node]);
 while(queue.length){const current=queue.shift()!;if(current.id===be.node)return {ok:true,reason:`Resposta de ${b.ip}: VLAN ${vlan}, enlace L2 válido (simulado).`,path:[...current.path,b.id]};
  for(const c of network.cables){const local=c.a.node===current.id?c.a:c.b.node===current.id?c.b:undefined;if(!local)continue;const remote=local===c.a?c.b:c.a;if(seen.has(remote.node)||!exists(remote.node))continue;
   const lp=network.config.devices[current.id]?.ports[local.port],rp=network.config.devices[remote.node]?.ports[remote.port];
   if(!lp||!rp||![lp,rp].every(p=>p.up&&p.mode==='trunk'&&(p.allowed.length===0||p.allowed.includes(vlan))))continue;
   seen.add(remote.node);queue.push({id:remote.node,path:[...current.path,remote.node]});
  }
 }
 return fail(`Sem caminho para VLAN ${vlan}: confira cabos, VLANs existentes, trunk, allowed list e shutdown nas duas pontas.`);
}
export function localCoach(network:FreeNetwork,source:string,target:string){const result=testPing(network,source,target);return result.ok?{title:'Conectividade confirmada',evidence:result.reason,next:'Agora desligue uma porta ou remova uma VLAN da lista permitida. Antes de testar, preveja o resultado.'}:{title:'Investigue a causa',evidence:result.reason,next:result.reason.includes('cabo')?'Confira as portas no desenho antes de alterar a CLI.':result.reason.includes('/24')?'Compare os endereços e a máscara dos dois PCs.':result.reason.includes('VLANs diferentes')?'Compare a access VLAN das duas portas dos PCs.':result.reason.includes('desligada')?'Use show ip interface brief para identificar a porta administrativamente down.':'Use show vlan brief e show interfaces trunk. Qual evidência confirma onde o caminho deixa de transportar a VLAN?'};}
export function restoreNetwork(raw:string):FreeNetwork{
 const value=JSON.parse(raw) as FreeNetwork;
 if(value.version!==1||!Array.isArray(value.nodes)||!Array.isArray(value.cables)||value.nodes.length>8||!Number.isSafeInteger(value.serial)||value.serial<0||value.serial>1000000)throw Error('Topologia salva inválida.');
 const ids=new Set<string>(),ips=new Set<string>();const rebuilt=emptyNetwork();
 for(const n of value.nodes){if(!n||!['pc','switch'].includes(n.kind)||!new RegExp(n.kind==='pc'?'^PC[1-9][0-9]*$':'^SW[1-9][0-9]*$').test(n.id)||ids.has(n.id)||+n.id.slice(2)>value.serial||!Number.isFinite(n.x)||!Number.isFinite(n.y)||n.x<0||n.x>780||n.y<0||n.y>440||typeof n.ip!=='string')throw Error('Equipamento salvo inválido.');ids.add(n.id);if(n.kind==='pc'){if(!validHost(n.ip)||ips.has(n.ip))throw Error('IPv4 salvo inválido.');ips.add(n.ip);}rebuilt.nodes.push({...n});}
 const cableIds=new Set<string>();for(const c of value.cables){if(!c||!/^cable[1-9][0-9]*$/.test(c.id)||+c.id.slice(5)>value.serial||cableIds.has(c.id))throw Error('Cabo salvo inválido.');cableIds.add(c.id);const checked=connect(rebuilt,c.a,c.b);rebuilt.cables=checked.cables;rebuilt.cables[rebuilt.cables.length-1].id=c.id;}
 if(!value.config?.devices||Object.keys(value.config.devices).length!==value.nodes.filter(n=>n.kind==='switch').length)throw Error('Configuração salva inválida.');
 for(const n of value.nodes.filter(n=>n.kind==='switch')){const d=value.config.devices[n.id];if(!d||!d.vlans||!d.ports||d.routing!==false||Object.keys(d.ports).length!==4||Object.keys(d.vlans).some(v=>!/^\d+$/.test(v)||+v<1||+v>4094||typeof d.vlans[v]!=='string'||d.vlans[v].length>32))throw Error('Switch salvo inválido.');for(const id of switchPorts){const p=d.ports[id];if(!p||!['access','trunk'].includes(p.mode)||!Number.isInteger(p.vlan)||p.vlan<1||p.vlan>4094||typeof p.up!=='boolean'||!Array.isArray(p.allowed)||p.allowed.some(v=>!Number.isInteger(v)||v<1||v>4094)||p.group!==0||p.ip!=='')throw Error('Porta salva inválida.');}rebuilt.config.devices[n.id]=structuredClone(d);}
 rebuilt.serial=value.serial;rebuilt.config.device=rebuilt.nodes.find(n=>n.kind==='switch')?.id??'';return rebuilt;
}
