'use client';

import type {State} from '@/lib/labs';
import {hostAddress,ping} from '@/lib/connectivity';

type DeviceName='SW1'|'SW2';
type HostName='PC1'|'PC2';

function DeviceIcon({host=false}:{host?:boolean}){
 return <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8" fill="none">
  {host
   ? <><rect x="5" y="6" width="22" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M12 26h8m-4-5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></>
   : <><rect x="4" y="8" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.7"/><path d="M8 13h2m4 0h2m4 0h2m-12 6h2m4 0h2m4 0h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>}
 </svg>;
}

function Link({active,label}:{active:boolean,label:string}){
 return <div className="flex min-w-14 flex-1 flex-col items-center justify-center gap-2 px-1">
  <span className="rounded bg-gray-900 px-2 py-1 text-center font-mono text-[10px] text-slate-400">{label}</span>
  <span className={`h-0.5 w-full rounded-full ${active?'bg-emerald-400':'bg-slate-700'}`} aria-hidden="true"/>
  <span className={`h-1.5 w-1.5 rounded-full ${active?'bg-emerald-300':'bg-slate-600'}`} aria-hidden="true"/>
 </div>;
}

export default function NetworkTopology({
 state,
 labId,
 onSelect,
 onHostSelect,
 selectedHost,
}:{
 state:State;
 labId:string;
 onSelect:(device:string)=>void;
 onHostSelect:(host:HostName)=>void;
 selectedHost:HostName|null;
}){
 const l2=!labId.startsWith('routing');
 const sw1=state.devices.SW1;
 const sw2=state.devices.SW2;
 const interSwitchPorts=labId.startsWith('ether')?['gi0/23','gi0/24']:['gi0/24'];
 const switchLinkUp=interSwitchPorts.every(port=>sw1.ports[port]?.up&&sw2.ports[port]?.up);
 const switchTrunk=interSwitchPorts.every(port=>sw1.ports[port]?.mode==='trunk'&&sw2.ports[port]?.mode==='trunk');
 const pc1Port=sw1.ports['gi0/1'];
 const pc2Port=sw2.ports['gi0/1'];
 const pc1Ready=pc1Port.up&&pc1Port.mode==='access'&&!!sw1.vlans[pc1Port.vlan];
 const pc2Ready=pc2Port.up&&pc2Port.mode==='access'&&!!sw2.vlans[pc2Port.vlan];
 const connectivity=ping(state,'PC1','PC2');
 const devices=[{name:'SW1',device:sw1},...(l2?[{name:'SW2',device:sw2}]:[])];
 const nodes='flex min-w-[640px] items-center justify-between gap-2 px-5 py-12 sm:px-8';
 const nodeBase='group flex w-28 shrink-0 flex-col items-center rounded-xl border px-3 py-4 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300';
 const selectedDevice=(device:DeviceName)=>state.device===device;

 return <section aria-label="Topologia interativa do laboratório" className="my-5 overflow-hidden rounded-xl border border-slate-800 bg-gray-950 text-slate-200 shadow-lg shadow-slate-950/20">
  <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-gray-900 px-5 py-4">
   <div>
    <h2 className="m-0 text-base font-semibold text-slate-200">Topologia de rede</h2>
    <p className="mt-1 text-xs text-slate-400">{l2?'4 dispositivos · 3 conexões':'Switch L3 · interfaces VLAN'}</p>
   </div>
   <div className="flex items-center gap-3 rounded-md bg-gray-950 px-3 py-2 text-xs">
    <span className={`font-medium ${l2&&connectivity.ok?'text-emerald-300':'text-slate-400'}`}>
     <span aria-hidden="true">●</span> {l2&&connectivity.ok?'Conectividade':'Simulação'}
    </span>
    <span className="text-slate-500">{l2?(connectivity.ok?'disponível':'indisponível'):'ao vivo'}</span>
   </div>
  </header>

  <div className="overflow-x-auto">
   <div className={nodes}>
    {l2&&<button type="button" aria-label={`Selecionar PC1, ${hostAddress(state,'PC1')}`} aria-pressed={selectedHost==='PC1'} onClick={()=>onHostSelect('PC1')} className={`${nodeBase} ${selectedHost==='PC1'?'border-emerald-300 bg-gray-800 text-emerald-200':'border-slate-700 bg-neutral-900 text-slate-300 hover:border-slate-500'}`}>
     <span className="mb-3 grid h-14 w-14 place-items-center rounded-xl border border-slate-700 bg-gray-800 text-slate-300"><DeviceIcon host/></span>
     <span className="text-xs font-semibold">PC1</span>
     <span className="mt-1 text-[10px] text-slate-400">{hostAddress(state,'PC1')}</span>
    </button>}

    {l2&&<Link active={pc1Ready} label={`Gi0/1 · VLAN ${pc1Port.vlan}`}/>}

    <button type="button" aria-label="Selecionar SW1" aria-pressed={selectedDevice('SW1')} onClick={()=>onSelect('SW1')} className={`${nodeBase} ${selectedDevice('SW1')?'border-emerald-300 bg-gray-800 text-emerald-200':'border-slate-700 bg-neutral-900 text-slate-300 hover:border-slate-500'}`}>
     <span className={`mb-3 grid h-14 w-14 place-items-center rounded-xl border ${selectedDevice('SW1')?'border-emerald-300 text-emerald-200':'border-slate-700 text-slate-400'} bg-gray-800`}><DeviceIcon/></span>
     <span className="text-xs font-semibold">SW1</span>
     <span className="mt-1 text-[10px] text-slate-400">{Object.keys(sw1.vlans).length-1} VLANs</span>
    </button>

    <Link active={switchLinkUp&&switchTrunk} label={l2?interSwitchPorts.map(port=>port.replace('gi','Gi')).join(' + '):'SVI / VLANs'}/>

    {l2
     ? <button type="button" aria-label="Selecionar SW2" aria-pressed={selectedDevice('SW2')} onClick={()=>onSelect('SW2')} className={`${nodeBase} ${selectedDevice('SW2')?'border-emerald-300 bg-gray-800 text-emerald-200':'border-slate-700 bg-neutral-900 text-slate-300 hover:border-slate-500'}`}>
       <span className={`mb-3 grid h-14 w-14 place-items-center rounded-xl border ${selectedDevice('SW2')?'border-emerald-300 text-emerald-200':'border-slate-700 text-slate-400'} bg-gray-800`}><DeviceIcon/></span>
       <span className="text-xs font-semibold">SW2</span>
       <span className="mt-1 text-[10px] text-slate-400">{Object.keys(sw2.vlans).length-1} VLANs</span>
      </button>
     : <div className={`${nodeBase} border-indigo-400/40 bg-gray-900 text-indigo-200`}>
       <span className="mb-3 grid h-14 w-14 place-items-center rounded-xl border border-indigo-400/30 bg-gray-800 text-indigo-300"><span className="font-mono text-xs">L3</span></span>
       <span className="text-xs font-semibold">SVIs</span>
       <span className="mt-1 text-[10px] text-slate-400">{Object.keys(sw1.ports).filter(port=>port.startsWith('vlan')).length} interfaces</span>
      </div>}

    {l2&&<Link active={pc2Ready} label={`Gi0/1 · VLAN ${pc2Port.vlan}`}/>}

    {l2&&<button type="button" aria-label={`Selecionar PC2, ${hostAddress(state,'PC2')}`} aria-pressed={selectedHost==='PC2'} onClick={()=>onHostSelect('PC2')} className={`${nodeBase} ${selectedHost==='PC2'?'border-emerald-300 bg-gray-800 text-emerald-200':'border-slate-700 bg-neutral-900 text-slate-300 hover:border-slate-500'}`}>
     <span className="mb-3 grid h-14 w-14 place-items-center rounded-xl border border-slate-700 bg-gray-800 text-slate-300"><DeviceIcon host/></span>
     <span className="text-xs font-semibold">PC2</span>
     <span className="mt-1 text-[10px] text-slate-400">{hostAddress(state,'PC2')}</span>
    </button>}
   </div>
  </div>

  <div className="grid gap-3 border-t border-slate-800 bg-gray-900/70 p-4 sm:grid-cols-2">
   {devices.map(({name,device})=><div key={name} className="rounded-lg border border-slate-800 bg-gray-950 p-3">
    <div className="mb-2 flex items-center justify-between"><strong className="text-xs font-semibold text-slate-200">{name}</strong><span className="text-[10px] text-slate-500">{Object.keys(device.vlans).length-1} VLANs</span></div>
    <p className="m-0 text-[11px] leading-5 text-slate-400">VLANs: {Object.keys(device.vlans).join(', ')}</p>
    <p className="m-0 text-[11px] leading-5 text-slate-400">Gi0/24: {device.ports['gi0/24'].mode} · {device.ports['gi0/24'].up?'administrativamente up':'shutdown'}</p>
    <p className="m-0 text-[11px] leading-5 text-slate-400">Permitidas: {device.ports['gi0/24'].allowed.join(', ')||'todas (padrão)'}</p>
    {labId.startsWith('ether')&&<p className="m-0 text-[11px] leading-5 text-slate-400">LACP: {['gi0/23','gi0/24'].filter(port=>device.ports[port].group===1).join(', ')||'nenhum'}</p>}
   </div>)}
  </div>

  <p className="m-0 border-t border-slate-800 px-5 py-3 text-[11px] leading-relaxed text-slate-500">
   {l2?'Selecione um PC para abrir seu terminal ou um switch para configurar. Verde indica estado administrativo/configurado; conectividade e ping são simulados.':'Topologia lógica das interfaces VLAN do switch L3; roteamento e tráfego são simulados.'}
  </p>
 </section>;
}
