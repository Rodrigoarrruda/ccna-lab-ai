'use client';
import {lacpCompatible} from '@/lib/labs';
import type {State} from '@/lib/labs';
import {ping} from '@/lib/connectivity';
export default function NetworkTopology({state,labId,onSelect,onHostSelect,selectedHost}:{state:State,labId:string,onSelect:(device:string)=>void,onHostSelect:(host:'PC1'|'PC2')=>void,selectedHost:'PC1'|'PC2'|null}){
 const l2=!labId.startsWith('routing');const a=state.devices.SW1,b=state.devices.SW2;
 const ports=labId.startsWith('ether')?['gi0/23','gi0/24']:['gi0/24'];
 const active=ports.every(p=>a.ports[p]?.up&&b.ports[p]?.up);
 const trunk=ports.every(p=>a.ports[p]?.mode==='trunk'&&b.ports[p]?.mode==='trunk');
 const lacp=labId.startsWith('ether');
 const compatible=ports.every(p=>lacpCompatible(a.ports[p],b.ports[p]));
 const color=active&&(!lacp||compatible)?(trunk?'#10b981':'#f59e0b'):'#ef4444';
 return <div className="network-visual" aria-label="Topologia interativa do laboratório">
  <svg viewBox="0 0 440 180" role="img" aria-label={l2?'Dois switches interligados':'Switch SW1 com VLANs 10 e 20'}>
   {l2?<><line x1="120" y1="65" x2="320" y2="65" stroke={color} strokeWidth="5" strokeLinecap="round"/><text x="220" y="50" textAnchor="middle" fontSize="12" fill="currentColor">{ports.join(' + ')}</text><text x="220" y="88" textAnchor="middle" fontSize="11" fill="currentColor">{!active?'administrativamente down':lacp?(compatible?'LACP compatível por regras':'LACP incompatível por regras'):trunk?'trunk configurado':'link sem trunk nos dois lados'}</text></>:<><line x1="120" y1="65" x2="320" y2="65" stroke="#64748b" strokeWidth="3"/><text x="220" y="50" textAnchor="middle" fontSize="12" fill="currentColor">SVI / VLANs</text></>}
   <rect x="12" y="30" width="108" height="70" rx="10" fill={state.device==='SW1'?'#0f766e':'#334155'}/><text x="66" y="61" fill="white" textAnchor="middle" fontWeight="bold">SW1</text><text x="66" y="80" fill="white" textAnchor="middle" fontSize="11">{Object.keys(a.vlans).length-1} VLANs</text>
   <rect x="320" y="30" width="108" height="70" rx="10" fill={state.device==='SW2'&&l2?'#0f766e':'#334155'}/><text x="374" y="61" fill="white" textAnchor="middle" fontWeight="bold">{l2?'SW2':'VLANs'}</text><text x="374" y="80" fill="white" textAnchor="middle" fontSize="11">{l2?`${Object.keys(b.vlans).length-1} VLANs`:'10 / 20'}</text>
   <text x="66" y="126" textAnchor="middle" fontSize="11" fill="currentColor">{a.ports['gi0/1'].mode} · VLAN {a.ports['gi0/1'].vlan}</text><text x="66" y="143" textAnchor="middle" fontSize="11" fill="currentColor">Gi0/1</text>
   {l2&&<text x="374" y="126" textAnchor="middle" fontSize="11" fill="currentColor">Gi0/24: {b.ports['gi0/24'].mode}</text>}
  </svg>
  {l2&&<div className="topology-actions"><button type="button" className={selectedHost==='PC1'?'topo-selected':''} onClick={()=>onHostSelect('PC1')}>PC1 · 192.168.10.11</button><button type="button" className={selectedHost==='PC2'?'topo-selected':''} onClick={()=>onHostSelect('PC2')}>PC2 · 192.168.10.12</button><span>Conectividade: {ping(state,'PC1','PC2').ok?'disponível':'indisponível'}</span></div>}<div className="topology-actions"><button type="button" className={state.device==='SW1'?'topo-selected':''} onClick={()=>onSelect('SW1')}>Selecionar SW1</button>{l2&&<button type="button" className={state.device==='SW2'?'topo-selected':''} onClick={()=>onSelect('SW2')}>Selecionar SW2</button>}</div>
  <div className="topology-state">{Object.entries(state.devices).filter(([name])=>l2||name==='SW1').map(([name,d])=><div key={name}><strong>{name}</strong><span>VLANs: {Object.keys(d.vlans).join(', ')}</span><span>Gi0/24: {d.ports['gi0/24'].mode} · {d.ports['gi0/24'].up?'no shutdown':'shutdown'}</span><span>Permitidas: {d.ports['gi0/24'].allowedNone?'nenhuma':d.ports['gi0/24'].allowed.join(', ')||'todas (padrão)'}</span>{labId.startsWith('ether')&&<span>LACP: {['gi0/23','gi0/24'].filter(p=>d.ports[p].group===1).map(p=>p+' '+(d.ports[p].lacp||'não definido')).join(', ')||'nenhum'}</span>}</div>)}</div>
  <p className="notice">PC1 ligado a SW1 Gi0/1; PC2 ligado a SW2 Gi0/1. Selecione um PC para usar seu próprio terminal. Estado derivado dos comandos CLI. Links indicam configuração e estado administrativo, não conectividade real nem negociação de protocolos.</p>
 </div>;
}
