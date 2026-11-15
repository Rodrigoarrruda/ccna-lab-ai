'use client';

import type {State} from '@/lib/labs';
import {hostAddress,ping} from '@/lib/connectivity';
import {useState} from 'react';

type DeviceName='SW1'|'SW2';
type HostName='PC1'|'PC2';

function DeviceIcon({host=false,layer3=false}:{host?:boolean,layer3?:boolean}){
 return <svg aria-hidden="true" viewBox="0 0 40 40" className="topology-device-icon" fill="none">
  {host
   ? <><rect x="6" y="7" width="28" height="19" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M15 33h10m-5-7v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M10 22h20" stroke="currentColor" strokeWidth="1.2" opacity=".55"/></>
   : <><rect x="4" y="10" width="32" height="20" rx="4" stroke="currentColor" strokeWidth="1.8"/><path d="M8 16h2m4 0h2m4 0h2m4 0h2m4 0h2M8 23h2m4 0h2m4 0h2m4 0h2m4 0h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>{layer3&&<path d="M12 34h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>}</>}
 </svg>;
}

function Link({active,label}:{active:boolean,label:string}){
 return <div className="topology-link">
  <span className="topology-link-label">{label}</span>
  <span className={`topology-link-line${active?' is-active':''}`} aria-hidden="true"/>
  <span className={`topology-link-dot${active?' is-active':''}`} aria-hidden="true"/>
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
 const [zoom,setZoom]=useState(100);
 const nodeBase='topology-node';
 const selectedDevice=(device:DeviceName)=>state.device===device;

 return <section aria-label="Topologia interativa do laboratório" className="network-visual">
  <header className="topology-header">
   <div>
    <h2>Topologia de rede</h2>
    <p>{l2?'4 dispositivos · 3 conexões':'SW1 L3 · interfaces VLAN'}</p>
   </div>
   <div className="topology-header-tools">
    <span className={`topology-live${l2&&connectivity.ok?' is-up':''}`}>
     <span aria-hidden="true">●</span> {l2&&connectivity.ok?'Conectividade ativa':'Simulação'}
    </span>
    <div className="topology-zoom" role="group" aria-label="Zoom da topologia">
     <button type="button" aria-label="Diminuir zoom" disabled={zoom<=75} onClick={()=>setZoom(value=>Math.max(75,value-25))}>−</button>
     <output aria-label="Zoom atual">{zoom}%</output>
     <button type="button" aria-label="Aumentar zoom" disabled={zoom>=150} onClick={()=>setZoom(value=>Math.min(150,value+25))}>+</button>
     <button type="button" aria-label="Restaurar zoom" onClick={()=>setZoom(100)}>100%</button>
    </div>
   </div>
  </header>

  <div className="topology-viewport">
   <div className="topology-zoom-content" style={{zoom:zoom/100}}>
    <div className="topology-nodes">
    {l2&&<button type="button" aria-label={`Selecionar PC1, ${hostAddress(state,'PC1')}`} aria-pressed={selectedHost==='PC1'} onClick={()=>onHostSelect('PC1')} className={`${nodeBase} ${selectedHost==='PC1'?'is-selected':''}`}>
     <span className="topology-node-icon"><DeviceIcon host/></span>
     <span className="topology-node-name">PC1</span>
     <span className="topology-node-meta">{hostAddress(state,'PC1')}</span>
    </button>}

    {l2&&<Link active={pc1Ready} label={`Gi0/1 · VLAN ${pc1Port.vlan}`}/>}

    <button type="button" aria-label="Selecionar SW1" aria-pressed={selectedDevice('SW1')} onClick={()=>onSelect('SW1')} className={`${nodeBase} ${selectedDevice('SW1')?'is-selected':''}`}>
     <span className="topology-node-icon"><DeviceIcon layer3={!l2}/></span>
     <span className="topology-node-name">SW1</span>
     <span className="topology-node-meta">{Object.keys(sw1.vlans).length-1} VLANs</span>
    </button>

    <Link active={switchLinkUp&&switchTrunk} label={l2?interSwitchPorts.map(port=>port.replace('gi','Gi')).join(' + '):'SVI / VLANs'}/>

    {l2
     ? <button type="button" aria-label="Selecionar SW2" aria-pressed={selectedDevice('SW2')} onClick={()=>onSelect('SW2')} className={`${nodeBase} ${selectedDevice('SW2')?'is-selected':''}`}>
       <span className="topology-node-icon"><DeviceIcon/></span>
       <span className="topology-node-name">SW2</span>
       <span className="topology-node-meta">{Object.keys(sw2.vlans).length-1} VLANs</span>
      </button>
     : <div className="topology-node topology-node-svi">
       <span className="topology-node-icon"><DeviceIcon layer3/></span>
       <span className="topology-node-name">SVIs</span>
       <span className="topology-node-meta">{Object.keys(sw1.ports).filter(port=>port.startsWith('vlan')).length} interfaces VLAN</span>
      </div>}

    {l2&&<Link active={pc2Ready} label={`Gi0/1 · VLAN ${pc2Port.vlan}`}/>}

    {l2&&<button type="button" aria-label={`Selecionar PC2, ${hostAddress(state,'PC2')}`} aria-pressed={selectedHost==='PC2'} onClick={()=>onHostSelect('PC2')} className={`${nodeBase} ${selectedHost==='PC2'?'is-selected':''}`}>
     <span className="topology-node-icon"><DeviceIcon host/></span>
     <span className="topology-node-name">PC2</span>
     <span className="topology-node-meta">{hostAddress(state,'PC2')}</span>
    </button>}
    </div>
   </div>
  </div>

  <div className="topology-state">
   {devices.map(({name,device})=><div key={name} className="rounded-lg border border-slate-800 bg-gray-950 p-3">
    <div className="topology-state-heading"><strong>{name}</strong><span>{Object.keys(device.vlans).length-1} VLANs</span></div>
    <p>VLANs: {Object.keys(device.vlans).join(', ')}</p>
    <p>Gi0/24: {device.ports['gi0/24'].mode} · {device.ports['gi0/24'].up?'administrativamente up':'shutdown'}</p>
    <p>Permitidas: {device.ports['gi0/24'].allowed.join(', ')||'todas (padrão)'}</p>
    {labId.startsWith('ether')&&<p>LACP: {['gi0/23','gi0/24'].filter(port=>device.ports[port].group===1).join(', ')||'nenhum'}</p>}
   </div>)}
  </div>

  <p className="topology-notice">
   {l2?'Selecione um PC para abrir seu terminal ou um switch para configurar. Verde indica estado administrativo/configurado; conectividade e ping são simulados.':'Topologia lógica das interfaces VLAN do switch L3; roteamento e tráfego são simulados.'}
  </p>
 </section>;
}
