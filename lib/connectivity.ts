import type {State,Port} from './labs';
export type Host='PC1'|'PC2';
export type PingResult={ok:boolean,reason:string,path:string[]};
const endpoint:Record<Host,{device:string,port:string,ip:string}>={PC1:{device:'SW1',port:'gi0/1',ip:'192.168.10.11'},PC2:{device:'SW2',port:'gi0/1',ip:'192.168.10.12'}};
function carries(p:Port,v:number){return p.up&&p.mode==='trunk'&&(p.allowed.length===0||p.allowed.includes(v));}
export function ping(s:State,source:Host,target:Host):PingResult{
 const a=endpoint[source],b=endpoint[target];const path=[source,a.device,b.device,target];
 if(source===target)return {ok:true,reason:'Resposta do próprio host.',path:[source]};
 const ap=s.devices[a.device].ports[a.port],bp=s.devices[b.device].ports[b.port];
 if(!ap.up||!bp.up)return {ok:false,reason:'Porta de acesso administrativamente desligada.',path};
 if(ap.mode!=='access'||bp.mode!=='access')return {ok:false,reason:'Os PCs precisam estar em portas access.',path};
 if(ap.vlan!==bp.vlan)return {ok:false,reason:'Os PCs pertencem a VLANs diferentes; roteamento L3 não está implementado.',path};
 const vlan=ap.vlan;
 if(!s.devices[a.device].vlans[vlan]||!s.devices[b.device].vlans[vlan])return {ok:false,reason:`VLAN ${vlan} não existe em ambos os switches.`,path};
 if(a.device!==b.device){const left=s.devices.SW1.ports['gi0/24'],right=s.devices.SW2.ports['gi0/24'];
 if(!carries(left,vlan)||!carries(right,vlan))return {ok:false,reason:`O enlace Gi0/24 não transporta a VLAN ${vlan} nas duas pontas.`,path};}
 return {ok:true,reason:`Resposta de ${b.ip}: bytes=32 tempo<1ms TTL=64 (simulado).`,path};
}
export function macTable(s:State,device:string){return (Object.entries(endpoint) as [Host,typeof endpoint.PC1][]).flatMap(([host,e])=>{const vlan=s.devices[e.device].ports[e.port].vlan;const local=e.device===device;const reachable=local||ping(s,device==='SW1'?'PC1':'PC2',host).ok;return reachable?[{vlan,mac:host==='PC1'?'0200.0000.0011':'0200.0000.0012',port:local?e.port:'gi0/24',host}]:[];});}
