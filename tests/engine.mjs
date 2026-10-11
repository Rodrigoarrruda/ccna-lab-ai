import assert from 'node:assert/strict';
import {labs,initial,run,grade} from '../lib/labs.ts';
for(const lab of labs){let s=initial();assert(grade(lab.id,s).some(x=>!x.ok));for(const device of lab.id==='routing'?['SW1']:['SW1','SW2']){s.device=device;s.mode='user';for(const c of lab.solution){const r=run(s,c);assert(!r.output.startsWith('%'),c+': '+r.output);s=r.state;}}assert(grade(lab.id,s).every(x=>x.ok),lab.id);}
let s=initial();const blocked=run(s,'switchport mode trunk');assert(blocked.output.startsWith('%'));assert.deepEqual(blocked.state,s);assert(run(s,'ping 192.168.10.1').output.startsWith('%'));console.log('PASS: 3 soluções completas; avaliação inicial; modo inválido; comando não suportado.');

for (const command of ["int Gi0/2","Int g0/2","interface gi0/2"]) { let s=initial(); s=run(s,"en").state;s=run(s,"conf t").state;const r=run(s,command);assert.equal(r.state.mode,"interface");assert.equal(r.state.target,"gi0/2");assert.equal(r.output,""); }
console.log("PASS: abreviações int Gi0/2 e int g0/2.");
for(const lab of labs.filter(l=>l.id.endsWith('-diag'))){let s=initial(lab.id);assert.equal(grade(lab.id,s).filter(x=>!x.ok).length,lab.id==='ether-diag'?3:2,lab.id);for(const device of lab.id.startsWith('routing')?['SW1']:['SW1','SW2']){s.device=device;s.mode='user';for(const c of lab.solution)s=run(s,c).state;}assert(grade(lab.id,s).every(x=>x.ok),lab.id);}
let range=initial();for(const c of ['en','conf t','int g0/1','int range g0/23-24'])range=run(range,c).state;assert.equal(range.target,'gi0/23,gi0/24');
console.log('PASS: diagnósticos detectam falhas locais e incompatibilidade entre pares LACP e aceitam correção; troca direta de interface e range sem espaços.');
