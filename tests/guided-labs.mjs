import assert from 'node:assert/strict';
import {initial,run,grade,labs,permitsVlan,lacpCompatible} from '../lib/labs.ts';
import {ping} from '../lib/connectivity.ts';
const commands=(s,list)=>list.reduce((state,c)=>{const r=run(state,c);assert(!r.output.startsWith('%'),c+': '+r.output);return r.state;},s);
let s=commands(initial(),['en','conf t','int gi0/24','switchport mode trunk','switchport trunk allowed vlan 10,20','switchport trunk allowed vlan add 30']);
assert.deepEqual(s.devices.SW1.ports['gi0/24'].allowed,[10,20,30]);
s=commands(s,['switchport trunk allowed vlan add 30']);assert.equal(s.devices.SW1.ports['gi0/24'].allowed.length,3);
s=commands(s,['switchport trunk allowed vlan 30']);assert.deepEqual(s.devices.SW1.ports['gi0/24'].allowed,[30]);
s=commands(s,['switchport trunk allowed vlan remove 30']);assert(!permitsVlan(s.devices.SW1.ports['gi0/24'],30));
assert.match(run(s,'do show interfaces trunk').output,/none/);
s=commands(s,['switchport trunk allowed vlan add 1,4094']);assert(permitsVlan(s.devices.SW1.ports['gi0/24'],1));assert(permitsVlan(s.devices.SW1.ports['gi0/24'],4094));
for(const c of ['switchport trunk allowed vlan add 0','switchport trunk allowed vlan remove 4095','switchport trunk allowed vlan add 10,','switchport trunk allowed vlan add']){const r=run(s,c);assert(r.output.startsWith('%'));assert.deepEqual(r.state,s);}
let defaults=commands(initial(),['en','conf t','int gi0/24','switchport trunk allowed vlan add 30']);assert(permitsVlan(defaults.devices.SW1.ports['gi0/24'],20));
defaults=commands(defaults,['switchport trunk allowed vlan remove 30']);assert(!permitsVlan(defaults.devices.SW1.ports['gi0/24'],30));assert(permitsVlan(defaults.devices.SW1.ports['gi0/24'],20));
let recovery=initial('vlan-preserve');assert(grade('vlan-preserve',recovery).some(c=>!c.ok));recovery.device='SW2';recovery=commands(recovery,['en','conf t','int gi0/24','switchport trunk allowed vlan add 30']);assert(grade('vlan-preserve',recovery).every(c=>c.ok));
recovery=commands(recovery,['switchport trunk allowed vlan 30']);assert(grade('vlan-preserve',recovery).some(c=>!c.ok));
let ether=initial();for(const device of ['SW1','SW2']){ether.device=device;ether.mode='user';ether=commands(ether,labs.find(l=>l.id==='ether').solution);}assert(grade('ether',ether).every(c=>c.ok));
for(const device of ['SW1','SW2']){ether.device=device;ether.mode='exec';ether=commands(ether,['conf t','int range gi0/23 - 24','channel-group 1 mode passive','end']);}
assert(grade('ether',ether).some(c=>!c.ok));assert(!lacpCompatible(ether.devices.SW1.ports['gi0/24'],ether.devices.SW2.ports['gi0/24']));
ether.device='SW1';ether=commands(ether,['conf t','int range gi0/23 - 24','channel-group 1 mode active','end']);assert(grade('ether',ether).every(c=>c.ok));
for(const device of ['SW1','SW2']){ether.device=device;ether.mode='exec';ether=commands(ether,['conf t','vlan 10','exit','int gi0/1','switchport access vlan 10','end']);}assert(ping(ether,'PC1','PC2').ok);
ether.devices.SW1.ports['gi0/24'].lacp='passive';assert(!ping(ether,'PC1','PC2').ok);ether.devices.SW1.ports['gi0/24'].lacp='active';
ether.devices.SW1.ports['gi0/24'].up=false;assert(grade('ether',ether).some(c=>!c.ok));ether.devices.SW1.ports['gi0/24'].up=true;
let link=initial();for(const device of ['SW1','SW2']){link.device=device;link.mode='user';link=commands(link,['en','conf t','vlan 10','exit','int gi0/1','switchport access vlan 10','int gi0/24','switchport mode trunk','switchport trunk allowed vlan 10','end']);}assert(ping(link,'PC1','PC2').ok);
link.device='SW2';link=commands(link,['conf t','int gi0/24','switchport trunk allowed vlan remove 10','end']);assert(!ping(link,'PC1','PC2').ok);
console.log('PASS: VLAN replacement/add/remove, boundaries, default all, recovery, active/passive, shutdown and connectivity regressions.');
