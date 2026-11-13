import type {State,Port} from './labs';

export type Host='PC1'|'PC2';
export type PingResult={ok:boolean,reason:string,path:string[]};
type HostEndpoint={device:string,port:string};

const endpoints:Record<Host,HostEndpoint>={
 PC1:{device:'SW1',port:'gi0/1'},
 PC2:{device:'SW2',port:'gi0/1'},
};

const subnetByLab:Record<string,number>={
 vlan:10,
 'vlan-branch':30,
 'vlan-guest':50,
 ether:1,
 routing:10,
};

export function hostAddress(state:State,host:Host):string{
 const subnet=subnetByLab[state.labId]??10;
 return `192.168.${subnet}.${host==='PC1'?11:12}`;
}

export function hostFromAddress(state:State,address:string):Host|null{
 return (Object.keys(endpoints) as Host[]).find(host=>hostAddress(state,host)===address)??null;
}

export function resolveHostTarget(state:State,target:string):Host|null{
 const host=target.toUpperCase();
 if(host==='PC1'||host==='PC2')return host;
 return hostFromAddress(state,target);
}

function carries(port:Port,vlan:number){
 return port.up&&port.mode==='trunk'&&(port.allowed.length===0||port.allowed.includes(vlan));
}

function carriesAcrossSwitches(state:State,vlan:number){
 if(state.labId==='ether'){
  const members=['gi0/23','gi0/24'];
  return ['SW1','SW2'].every(device=>{
   const ports=state.devices[device].ports;
   const bundle=ports['port-channel1'];
   return !!bundle&&carries(bundle,vlan)&&members.every(name=>{
    const member=ports[name];
    return member.up&&member.mode==='trunk'&&member.group===1;
   });
  });
 }

 return carries(state.devices.SW1.ports['gi0/24'],vlan)&&
  carries(state.devices.SW2.ports['gi0/24'],vlan);
}

export function ping(state:State,source:Host,target:Host):PingResult{
 const sourceEndpoint=endpoints[source];
 const targetEndpoint=endpoints[target];
 const path=[source,sourceEndpoint.device,targetEndpoint.device,target];
 if(source===target)return {ok:true,reason:'Resposta do próprio host.',path:[source]};

 const sourcePort=state.devices[sourceEndpoint.device].ports[sourceEndpoint.port];
 const targetPort=state.devices[targetEndpoint.device].ports[targetEndpoint.port];
 if(!sourcePort.up||!targetPort.up){
  return {ok:false,reason:'Porta de acesso administrativamente desligada.',path};
 }
 if(sourcePort.mode!=='access'||targetPort.mode!=='access'){
  return {ok:false,reason:'Os PCs precisam estar em portas access.',path};
 }
 if(sourcePort.vlan!==targetPort.vlan){
  return {ok:false,reason:'Os PCs pertencem a VLANs diferentes; roteamento L3 não está implementado.',path};
 }

 const vlan=sourcePort.vlan;
 if(!state.devices[sourceEndpoint.device].vlans[vlan]||
  !state.devices[targetEndpoint.device].vlans[vlan]){
  return {ok:false,reason:`VLAN ${vlan} não existe em ambos os switches.`,path};
 }
 if(!carriesAcrossSwitches(state,vlan)){
  return {ok:false,reason:`O enlace entre SW1 e SW2 não transporta a VLAN ${vlan}.`,path};
 }

 return {
  ok:true,
  reason:`Resposta de ${hostAddress(state,target)}: bytes=32 tempo<1ms TTL=64 (simulado).`,
  path,
 };
}

export function macTable(state:State,device:string){
 if(!state.devices[device])return [];

 return (Object.entries(endpoints) as [Host,HostEndpoint][]).flatMap(([host,endpoint])=>{
  const endpointPort=state.devices[endpoint.device].ports[endpoint.port];
  const local=endpoint.device===device;
  const visible=endpointPort.up&&endpointPort.mode==='access'&&
   !!state.devices[endpoint.device].vlans[endpointPort.vlan];
  const reachable=local?visible:ping(state,device==='SW1'?'PC1':'PC2',host).ok;
  return reachable?[{
   vlan:endpointPort.vlan,
   mac:host==='PC1'?'0200.0000.0011':'0200.0000.0012',
   port:local?endpoint.port:state.labId==='ether'?'port-channel1':'gi0/24',
   host,
  }]:[];
 });
}
