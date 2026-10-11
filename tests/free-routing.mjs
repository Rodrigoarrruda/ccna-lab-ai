import assert from 'node:assert/strict';
import {addNode,configurePC,connect,emptyNetwork,executeSwitch,removeNode,restoreNetwork,testPing,localCoach} from '../lib/free-network.ts';
let n=emptyNetwork();for(const kind of ['router','router','pc','pc'])n=addNode(n,kind);
const link=(a,ap,b,bp)=>n=connect(n,{node:a,port:ap},{node:b,port:bp});
link('PC3','eth0','R1','gi0/0');link('R1','gi0/1','R2','gi0/1');link('R2','gi0/0','PC4','eth0');
const cli=(id,commands)=>{if(n.config.device!==id&&!['enable','en'].includes(commands[0]))n=executeSwitch(n,id,'enable').network;for(const c of commands){const result=executeSwitch(n,id,c);assert(!result.output.startsWith('%'),c+': '+result.output);n=result.network;}};
const reject=(id,c)=>{const before=structuredClone(n);assert.match(executeSwitch(n,id,c).output,/^%/);assert.deepEqual(n,before);};
reject('R1','configure terminal');reject('R1','ip address 192.168.10.1 255.255.255.0');
for(const [id,lan,wan] of [['R1','192.168.10.1','10.0.0.1'],['R2','192.168.20.1','10.0.0.2']])cli(id,['en','conf t','int g0/0',`ip address ${lan} 255.255.255.0`,'no shutdown','int gi0/1',`ip address ${wan} 255.255.255.0`,'no shutdown','end']);
n=configurePC(n,'PC4','192.168.20.12');assert.match(testPing(n,'PC3','PC4').reason,/gateway/);
assert.throws(()=>configurePC(n,'PC3','192.168.10.11','192.168.20.1'),/Gateway/);assert.throws(()=>configurePC(n,'PC3','192.168.10.1'),/outro/);
n=configurePC(n,'PC3','192.168.10.11','192.168.10.1');n=configurePC(n,'PC4','192.168.20.12','192.168.20.1');
assert.match(testPing(n,'PC3','PC4').reason,/R1: sem rota/);
cli('R1',['conf t','ip route 192.168.20.0 255.255.255.0 10.0.0.2','end']);assert.match(testPing(n,'PC3','PC4').reason,/retorno.*R2: sem rota/);
cli('R2',['conf t','ip route 192.168.10.0 255.255.255.0 10.0.0.1','end']);assert.equal(testPing(n,'PC3','PC4').ok,true);assert.deepEqual(testPing(n,'PC3','PC4').path,['PC3','R1','R2','PC4']);
cli('R1',[]);assert.match(executeSwitch(n,'R1','show ip route').output,/C 10.0.0.0\/24/);assert.match(executeSwitch(n,'R1','show ip route').output,/S 192.168.20.0\/24/);
cli('R1',['conf t','int gi0/1','shutdown','end']);assert.equal(testPing(n,'PC3','PC4').ok,false);assert(!executeSwitch(n,'R1','show ip route').output.includes('C 10.0.0.0'));
cli('R1',['conf t','int gi0/1','no shutdown','end']);assert.equal(testPing(n,'PC3','PC4').ok,true);
cli('R1',['conf t']);for(const c of ['ip route 192.168.20.1 255.255.255.0 10.0.0.2','ip route 192.168.20.0 255.255.0.0 10.0.0.2','ip route 192.168.20.0 255.255.255.0 10.0.0.1','router ospf 1','interface gi0/99'])reject('R1',c);
cli('R1',['int gi0/2']);for(const c of ['ip address 192.168.30.1 255.255.255.252','ip address 192.168.10.2 255.255.255.0','ip address 192.168.20.12 255.255.255.0','ip route 192.168.30.0 255.255.255.0 10.0.0.2','show ip route'])reject('R1',c);
assert.match(executeSwitch(n,'R1','do show ip route').output,/C /);cli('R1',['end','conf t','no ip route 192.168.20.0 255.255.255.0 10.0.0.2','ip route 0.0.0.0 0.0.0.0 10.0.0.2','end']);assert.equal(testPing(n,'PC3','PC4').ok,true);
cli('R1',['conf t','ip route 192.168.20.0 255.255.255.0 10.0.0.99','end']);assert.match(testPing(n,'PC3','PC4').reason,/próximo salto/);cli('R1',['conf t','no ip route 192.168.20.0 255.255.255.0 10.0.0.99','end']);
assert.equal(testPing(restoreNetwork(JSON.stringify(n)),'PC3','PC4').ok,true);assert.match(localCoach(n,'PC3','PC4').evidence,/ida e volta/);
for(const mutate of [x=>x.routers.R1.interfaces['gi0/0'].ip='192.168.20.1',x=>x.routers.R1.interfaces['gi0/0'].up='yes',x=>x.nodes[2].gateway='192.168.99.1',x=>x.routers.R1.routes[0].mask='255.255.0.0',x=>delete x.routers.R1]){const bad=structuredClone(n);mutate(bad);assert.throws(()=>restoreNetwork(JSON.stringify(bad)));}
assert.equal(testPing(removeNode(n,'R1'),'PC3','PC4').ok,false);
// Roteamento através de duas VLANs no mesmo switch, portas físicas distintas.
let v=emptyNetwork();for(const kind of ['router','switch','pc','pc'])v=addNode(v,kind);
for(const [a,ap,b,bp] of [['R1','gi0/0','SW2','gi0/1'],['R1','gi0/1','PC4','eth0'],['PC3','eth0','SW2','gi0/2']])v=connect(v,{node:a,port:ap},{node:b,port:bp});
for(const c of ['enable','configure terminal','interface gi0/0','ip address 192.168.10.1 255.255.255.0','no shutdown','interface gi0/1','ip address 192.168.20.1 255.255.255.0','no shutdown','end'])v=executeSwitch(v,'R1',c).network;
v=configurePC(v,'PC3','192.168.10.11','192.168.10.1');v=configurePC(v,'PC4','192.168.20.12','192.168.20.1');assert.equal(testPing(v,'PC3','PC4').ok,true);
for(const c of ['enable','configure terminal','vlan 10','exit','interface gi0/2','switchport access vlan 10','end'])v=executeSwitch(v,'SW2',c).network;
assert.match(testPing(v,'PC3','PC4').reason,/sem caminho L2/);
// Limite de rotas, loop L3, IP padrão disponível e compatibilidade de versão antiga.
cli('R1',['conf t']);for(let i=1;i<=31;i++)cli('R1',[`ip route 172.16.${i}.0 255.255.255.0 10.0.0.2`]);reject('R1','ip route 172.16.32.0 255.255.255.0 10.0.0.2');cli('R1',['end']);
const old=emptyNetwork();assert.doesNotThrow(()=>restoreNetwork(JSON.stringify(old)));
console.log('PASS: routers, CLI modes, IPv4/gateway validation, connected/static/default routes, return path, VLAN failure, shutdown, persistence and route limit.');
