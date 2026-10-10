import assert from 'node:assert/strict';
import {readFile,writeFile,unlink} from 'node:fs/promises';
const source=await readFile(new URL('../lib/tutor.ts',import.meta.url),'utf8');
const testModule=new URL('../lib/.tutor-node-test.ts',import.meta.url);
await writeFile(testModule,source.replace("from './labs'","from './labs.ts'"));
let contextualize,localAnswer;
try {({contextualize,localAnswer}=await import(testModule.href));} finally {await unlink(testModule);}
for(const id of ['vlan','ether','routing','vlan-diag','ether-diag','routing-diag']){const c=contextualize(id,[]);for(const level of ['initial','detailed','solution']){const text=localAnswer(c,level);assert.match(text,/Resposta local por regras/);assert.ok(text.length>45);}assert.equal(c.checks.length>0,true);}
const c=contextualize('vlan',[{device:'SW1',command:'enable'},{device:'SW1',command:'configure terminal'},{device:'SW1',command:'comando inválido'}]);assert.equal(c.errors.length,1);assert.match(localAnswer(c,'detailed'),/comando inválido/);assert.throws(()=>contextualize('vlan',[{device:'BAD',command:'enable'}]));
console.log('PASS: tutor em 3 níveis, seis labs, contexto de erros e validação de comandos.');
