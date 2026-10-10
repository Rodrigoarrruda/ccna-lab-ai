import assert from 'node:assert/strict';
import {initial,run} from '../lib/labs.ts';
import {ping,macTable} from '../lib/connectivity.ts';
let s=initial();
assert.equal(ping(s,'PC1','PC2').ok,false);
for(const d of ['SW1','SW2']){
 s.device=d;s.mode='user';
 for(const c of ['enable','configure terminal','vlan 10','exit','interface gi0/1','switchport access vlan 10','exit','interface gi0/24','switchport mode trunk','switchport trunk allowed vlan 10,20','end'])s=run(s,c).state;
}
assert.equal(ping(s,'PC1','PC2').ok,true);
assert.equal(macTable(s,'SW1').some(e=>e.host==='PC2'),true);
s.device='SW2';s.mode='exec';for(const c of ['configure terminal','interface gi0/24','switchport trunk allowed vlan 20'])s=run(s,c).state;
assert.equal(ping(s,'PC1','PC2').ok,false);
console.log('Connectivity L2 tests passed');
