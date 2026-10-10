import assert from 'node:assert/strict';
import {labs,initial,run,grade} from '../lib/labs.ts';
for(const id of ['vlan-branch','vlan-guest']){
 const lab=labs.find(l=>l.id===id);assert(lab,id);
 let state=initial(id);assert(grade(id,state).some(x=>!x.ok));
 for(const device of ['SW1','SW2']){
  state.device=device;state.mode='user';state.target='';
  for(const command of lab.solution){const result=run(state,command);assert(!result.output.startsWith('%'),id+': '+command+' '+result.output);state=result.state;}
 }
 assert(grade(id,state).every(x=>x.ok),id);
 state.devices.SW2.ports['gi0/24'].allowed=[];
 assert(grade(id,state).some(x=>!x.ok),'Must detect missing allowed VLANs');
}
console.log('PASS: two new scenarios, solutions and negative trunk test');
