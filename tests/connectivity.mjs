import assert from 'node:assert/strict';
import {labs,initial,run,grade} from '../lib/labs.ts';
import {ping,macTable,hostAddress,hostFromAddress} from '../lib/connectivity.ts';

for(const id of ['vlan','vlan-branch','vlan-guest']){
 const lab=labs.find(item=>item.id===id);
 assert(lab,id);
 let state=initial(id);

 assert.equal(ping(state,'PC1','PC2').ok,false);
 assert.equal(hostFromAddress(state,hostAddress(state,'PC2')),'PC2');

 for(const device of ['SW1','SW2']){
  state.device=device;
  state.mode='user';
  for(const command of lab.solution)state=run(state,command).state;
 }

 assert.equal(grade(id,state).every(check=>check.ok),true,id+' solution should pass grading');
 assert.equal(ping(state,'PC1','PC2').ok,true,id+' PCs should communicate after the reference configuration');
 assert.equal(macTable(state,'SW1').some(entry=>entry.host==='PC2'),true,id+' should learn the remote PC');
 assert.equal(hostFromAddress(state,'192.168.255.99'),null);

 const vlan=state.devices.SW1.ports['gi0/1'].vlan;
 state.devices.SW2.ports['gi0/24'].allowed=[vlan===4094?1:4094];
 assert.equal(ping(state,'PC1','PC2').ok,false,id+' should fail when the trunk blocks its host VLAN');

 state.devices.SW2.ports['gi0/24'].allowed=[vlan];
 state.devices.SW2.ports['gi0/1'].vlan=1;
 assert.equal(ping(state,'PC1','PC2').ok,false,id+' should fail when the remote access port is in another VLAN');
}

console.log('PASS: connectivity follows mission host VLANs, endpoints, and trunk state.');
