import assert from 'node:assert/strict';
import {recommend} from '../lib/training.ts';
const attempt=(lab,score,assisted)=>({lab,score,total:6,assisted,created:new Date().toISOString()});
assert.equal(recommend([attempt('vlan',3,0),attempt('ether',6,1)],['vlan','ether'])[0].id,'vlan');
assert.match(recommend([attempt('ether',6,1)],['ether'])[0].reason,/apoio/);
assert.match(recommend([attempt('ether',6,0)],['ether'])[0].reason,/sem dicas/);
assert(!recommend([],['ospf']).some(x=>x.id==='ospf'));
console.log('PASS: revisão prioriza pendências, distingue ajuda e limita recomendações ao motor suportado.');
