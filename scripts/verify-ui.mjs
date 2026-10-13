import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {labs,initial,run,grade} from '../lib/labs.ts';
import {advancedExamQuestions} from '../lib/exam-advanced.ts';

// Test-only credentials generated per run. Never use or print production credentials.
const password=randomBytes(24).toString('hex');
const port=3217;
const baseURL=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',String(port)],{env:{...process.env,APP_PASSWORD:password},stdio:['ignore','pipe','pipe']});
let serverLogs='';server.stdout.on('data',chunk=>serverLogs+=chunk);server.stderr.on('data',chunk=>serverLogs+=chunk);
let browser;
try{
  let ready=false;
  for(let attempt=0;attempt<100;attempt++){
    try{const response=await fetch(baseURL,{headers:{authorization:'Basic '+Buffer.from('rodrigo:'+password).toString('base64')}});if(response.ok){ready=true;break;}}catch{}
    if(server.exitCode!==null)throw Error('Test server exited');
    await new Promise(resolve=>setTimeout(resolve,300));
  }
  assert(ready,'Test server failed to start');
  await mkdir('ui-artifacts',{recursive:true});
  browser=await chromium.launch({headless:true});
  for(const [name,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1365,height:900}]]){
    const context=await browser.newContext({viewport,hasTouch:name==='mobile',httpCredentials:{username:'rodrigo',password}});
    const page=await context.newPage();const view=async(label)=>{if(name==='mobile')await page.locator('.free-view-tabs').getByRole('button',{name:label,exact:true}).click();};const selectDevice=async(id)=>{await view('Rede');await page.locator(`[data-node="${id}"]`).click();await view('Terminal');};const closeCLI=async()=>{const b=page.getByRole('button',{name:'Ocultar teclado',exact:true});if(await b.count())await b.click();};const freeLog=async()=>{await view('Terminal');return page.getByRole('log',{name:'Terminal do laboratório livre'}).innerText();};const errors=[];page.on('pageerror',error=>errors.push(error.message));
    // Deterministic API fixtures test view behavior; they do not certify production DB access.
    const history=[];
    await page.route('**/api/progress',async route=>{
      if(route.request().method()==='GET')return route.fulfill({json:{results:history}});
      const body=route.request().postDataJSON();let state=initial(body.lab);
      for(const item of body.commands){state.device=item.device;state=run(state,item.command).state;}
      const checks=grade(body.lab,state),score=checks.filter(c=>c.ok).length;
      history.push({id:history.length+1,lab:body.lab,score,total:checks.length,assisted:body.assisted?1:0,created:new Date().toISOString()});
      await route.fulfill({json:{checks,score,total:checks.length}});
    });
    await page.route('**/api/tutor',route=>route.fulfill({json:{mode:'local'}}));
    await page.goto(baseURL);
    await page.locator('nav').getByRole('button',{name:'Questões CCNA'}).click();
    await page.waitForSelector('#exam-mode');
    assert.equal(await page.locator('#exam-mode').inputValue(),'advanced');
    assert.match(await page.locator('.exam-question').innerText(),/DE 40/);
    assert.equal(await page.getByRole('button',{name:'Responder',exact:true}).isDisabled(),true);
    await page.screenshot({path:`ui-artifacts/${name}-advanced.png`,fullPage:true});
    const overflow=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,15).map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right}))}));
    assert(overflow.document<=overflow.width,JSON.stringify(overflow));
    await page.locator('.exam-option').filter({hasText:advancedExamQuestions[0].options[0]}).click();
    await page.getByRole('button',{name:'Responder',exact:true}).click();
    assert.match(await page.locator('.exam-feedback').innerText(),/Vamos corrigir/);
    assert.equal(await page.getByRole('button',{name:'Responder',exact:true}).isDisabled(),true);
    await page.getByRole('button',{name:'Próxima questão adaptativa'}).click();
    await page.locator('.exam-option').filter({hasText:advancedExamQuestions[1].answer}).click();
    await page.getByRole('button',{name:'Responder',exact:true}).click();
    assert.match(await page.locator('.exam-feedback').innerText(),/Resposta correta/);
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ccna-exam-progress')));
    assert.equal(saved['advanced-v1-1'].incorrect,1);assert.equal(saved['advanced-v1-2'].correct,1);
    await page.locator('#exam-mode').selectOption('foundation');
    assert.match(await page.locator('.exam-question').innerText(),/DE 134/);
    assert.equal(await page.locator('.exam-feedback').count(),0);
    await page.locator('#exam-mode').selectOption('advanced');
    assert.equal(await page.getByRole('button',{name:'Responder',exact:true}).isDisabled(),true);
    await page.reload();await page.locator('nav').getByRole('button',{name:'Questões CCNA'}).click();
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('ccna-exam-progress'))),saved);
    assert.match(await page.locator('.exam-question h3').innerText(),/older switch port/);
    await page.locator('.exam-option').nth(3).click();await page.getByRole('button',{name:'Responder',exact:true}).click();
    await page.getByRole('button',{name:'Revisar este objetivo'}).click();
    assert.match(await page.locator('#study-module').innerText(),/1\.4/);

    await page.locator('nav').getByRole('button',{name:'Laboratórios'}).click();
    const cli=page.locator('#cli');
    await cli.fill('configure terminal');await cli.press('Enter');await closeCLI();
    assert.match(await page.locator('.terminal').innerText(),/enable primeiro/);
    for(const device of ['SW1','SW2']){
      if(device==='SW2')await page.locator('.devices').getByRole('button',{name:device,exact:true}).click();
      for(const command of labs.find(l=>l.id==='vlan').solution){await cli.fill(command);await cli.press('Enter');await closeCLI();}
    }
    await page.getByRole('button',{name:'Verificar e salvar',exact:true}).click();
    await page.waitForSelector('.completion-panel');
    assert.match(await page.locator('.completion-panel').innerText(),/Resultado registrado no histórico/);
    assert.equal(await page.getByRole('button',{name:'Finalizar laboratório',exact:true}).isEnabled(),true);
    await page.getByRole('button',{name:'Finalizar laboratório',exact:true}).click();
    assert.match(await page.locator('.completion-panel').innerText(),/Missão finalizada/);
    await page.screenshot({path:`ui-artifacts/${name}-lab-finished.png`,fullPage:true});
    await page.getByRole('button',{name:'Iniciar próxima situação'}).click();
    assert.match(await page.locator('.mission-header h2').innerText(),/EtherChannel/);
    assert.equal(await page.locator('.completion-panel').count(),0);
    assert.match(await page.locator('.terminal').innerText(),/Nova tentativa/);
    await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    await page.getByRole('button',{name:'+ Switch',exact:true}).click();
    await page.getByRole('button',{name:'+ Switch',exact:true}).click();
    await page.getByRole('button',{name:'+ PC',exact:true}).click();
    await page.getByRole('button',{name:'+ PC',exact:true}).click();
    await page.getByRole('button',{name:'Enquadrar toda a rede',exact:true}).click();
    const fittedZoom=await page.getByLabel('Zoom atual').innerText();
    await page.getByRole('button',{name:'Aumentar zoom',exact:true}).click();assert.notEqual(await page.getByLabel('Zoom atual').innerText(),fittedZoom);
    await page.getByRole('button',{name:'Enquadrar toda a rede',exact:true}).click();
    assert(await page.evaluate(()=>{const area=document.querySelector('.free-canvas-wrap').getBoundingClientRect();return [...document.querySelectorAll('[data-node]')].every(n=>{const b=n.getBoundingClientRect();return b.left>=area.left-1&&b.right<=area.right+1&&b.top>=area.top-1&&b.bottom<=area.bottom+1;});}),'fit must show all devices');
    const firstNode=page.locator('[data-node="SW1"]');await firstNode.scrollIntoViewIfNeeded();
    const before=await firstNode.getAttribute('style');const box=await firstNode.boundingBox();
    await page.mouse.move(box.x+30,box.y+20);await page.mouse.down();await page.mouse.move(box.x+70,box.y+50,{steps:5});await page.mouse.up();
    assert.notEqual(await firstNode.getAttribute('style'),before,'node drag must update coordinates');
    const cable=async(a,ap,b,bp)=>{await view('Rede');await page.getByLabel('Equipamento A',{exact:true}).selectOption(a);await page.getByLabel('Porta A',{exact:true}).selectOption(ap);await page.getByLabel('Equipamento B',{exact:true}).selectOption(b);await page.getByLabel('Porta B',{exact:true}).selectOption(bp);await page.getByRole('button',{name:'Conectar cabo',exact:true}).click();};
    await cable('PC3','eth0','SW1','gi0/1');await cable('PC4','eth0','SW2','gi0/1');await cable('SW1','gi0/24','SW2','gi0/24');
    assert.equal(await page.locator('[data-cable]').count(),3);
    assert.equal(await page.locator('[data-interface]').count(),10);
    await page.getByLabel('Equipamento A',{exact:true}).selectOption('SW1');
    assert(!(await page.getByLabel('Equipamento B',{exact:true}).locator('option').evaluateAll(items=>items.map(i=>i.value))).includes('SW1'));
    const anchors=await page.locator('[data-cable]').evaluateAll(paths=>paths.map(p=>[p.dataset.start,p.dataset.end]));
    assert(anchors.every(([a,b])=>a!==b),'cables must have distinct port endpoints');
    const portMatches=await page.locator('[data-cable]').evaluateAll(paths=>paths.every(path=>[path.dataset.start,path.dataset.end].every(pair=>{const [x,y]=pair.split(',').map(Number);return [...document.querySelectorAll('[data-interface] rect')].some(port=>Number(port.getAttribute('x'))+5===x&&Number(port.getAttribute('y'))+5===y);})));
    assert(portMatches,'every cable endpoint must coincide with a visible interface');
    await page.getByLabel('Equipamento A',{exact:true}).selectOption('SW1');
    const portValues=async(label)=>page.getByLabel(label,{exact:true}).locator('option').evaluateAll(items=>items.map(i=>i.value));
    assert.deepEqual(await portValues('Porta A'),['','gi0/2','gi0/23']);
    assert.equal(await page.getByLabel('Porta A',{exact:true}).inputValue(),'');
    assert(await page.getByRole('button',{name:'Conectar cabo',exact:true}).isDisabled());
    await page.getByLabel('Equipamento B',{exact:true}).selectOption('PC3');assert(await page.getByLabel('Porta B',{exact:true}).isDisabled());assert.match(await page.getByLabel('Porta B',{exact:true}).innerText(),/Sem portas disponíveis/);
    await page.locator('.free-cables li').first().getByRole('button').click();
    assert((await portValues('Porta A')).includes('gi0/1'));assert.deepEqual(await portValues('Porta B'),['','eth0']);assert(!(await page.getByLabel('Porta B',{exact:true}).isDisabled()));
    await cable('PC3','eth0','SW1','gi0/1');
    assert.equal(await page.getByLabel('Porta A',{exact:true}).inputValue(),'');assert.equal(await page.getByLabel('Porta B',{exact:true}).inputValue(),'');
    await cable('SW1','gi0/2','SW2','gi0/2');assert.match(await page.locator('.free-message').innerText(),/loop/);
    await view('Tutor');await page.getByLabel('PC de origem').selectOption('PC3');await page.getByLabel('PC de destino').selectOption('PC4');await page.getByRole('button',{name:'Testar ping',exact:true}).click();
    assert.match(await page.locator('.free-coach').innerText(),/Investigue a causa/);
    for(const device of ['SW1','SW2']){
      await selectDevice(device);
      for(const command of ['enable','configure terminal','vlan 10','exit','interface gi0/1','switchport mode access','switchport access vlan 10','interface gi0/24','switchport mode trunk','switchport trunk allowed vlan 10','end']){await view('Terminal');await page.locator('#free-cli').fill(command);await page.locator('#free-cli').press('Enter');await closeCLI();}
    }
    assert(!((await freeLog()).includes('SW1>')),'selected SW2 terminal must not display SW1 history');
    assert.match(await page.locator('.free-coach').innerText(),/Conectividade confirmada/);
    await page.getByRole('button',{name:'Salvar topologia',exact:true}).click();
    await view('Rede');await page.getByRole('button',{name:'Enquadrar toda a rede',exact:true}).click();
    await page.screenshot({path:`ui-artifacts/${name}-free-network.png`,fullPage:true});
    if(name==='mobile'){await view('Terminal');await page.screenshot({path:'ui-artifacts/mobile-workspace-terminal.png',fullPage:true});await view('Tutor');await page.screenshot({path:'ui-artifacts/mobile-workspace-tutor.png',fullPage:true});}
    await view('Terminal');
    assert.match(await page.getByLabel('Interfaces do equipamento selecionado').innerText(),/gi0\/24/);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'free editor document must fit viewport');
    for(const command of ['configure terminal','interface gi0/24','shutdown','end']){await view('Terminal');await page.locator('#free-cli').fill(command);await page.locator('#free-cli').press('Enter');await closeCLI();}
    assert.match(await page.locator('.free-coach').innerText(),/Investigue a causa/);
    await page.reload();await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    assert.equal(await page.locator('[data-node]').count(),4);assert.equal(await page.locator('.free-cables li').count(),3);
    assert.match(await freeLog(),/shutdown/);
    await view('Tutor');await page.getByLabel('PC de origem').selectOption('PC3');await page.getByLabel('PC de destino').selectOption('PC4');await page.getByRole('button',{name:'Testar ping',exact:true}).click();
    assert.match(await page.locator('.free-coach').innerText(),/Investigue a causa/);
    for(const c of ['enable','configure terminal','interface gi0/24','no shutdown','end']){await view('Terminal');await page.locator('#free-cli').fill(c);await page.locator('#free-cli').press('Enter');await closeCLI();}
    assert.match(await page.locator('.free-coach').innerText(),/Conectividade confirmada/);
    await view('Rede');if(name==='mobile')await page.locator('[data-node="PC4"]').tap();else await page.locator('[data-node="PC4"]').click();await page.getByRole('button',{name:'Excluir equipamento selecionado',exact:true}).click();
    assert.equal(await page.locator('[data-node]').count(),3);assert.equal(await page.locator('.free-cables li').count(),2);
    await page.locator('nav').getByRole('button',{name:'Início'}).click();
    await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    assert.equal(await page.locator('[data-node]').count(),3);
    await page.reload();await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    assert.equal(await page.locator('[data-node]').count(),3);assert.equal(await page.locator('[data-cable]').count(),2);
    await page.evaluate(()=>{localStorage.removeItem('ccna-free-network-v1');localStorage.removeItem('ccna-free-workspace-v1');});
    await page.reload();await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    for(let i=0;i<2;i++)await page.getByRole('button',{name:'+ Roteador',exact:true}).click();
    for(let i=0;i<2;i++)await page.getByRole('button',{name:'+ PC',exact:true}).click();
    await cable('PC3','eth0','R1','gi0/0');await cable('R1','gi0/1','R2','gi0/1');await cable('R2','gi0/0','PC4','eth0');
    for(const [pc,address,gateway] of [['PC3','192.168.10.11','192.168.10.1'],['PC4','192.168.20.12','192.168.20.1']]){
      await selectDevice(pc);await page.getByLabel('Endereço IPv4',{exact:true}).fill(address);await page.getByLabel('Gateway padrão',{exact:true}).fill(gateway);await page.getByRole('button',{name:'Aplicar IPv4',exact:true}).click();
    }
    const routerCLI=async(id,commands)=>{await selectDevice(id);if(commands[0]!=='enable'&&(await page.locator('.free-device .commandline label').innerText()).endsWith('>')){await view('Terminal');await page.locator('#free-cli').fill('enable');await page.locator('#free-cli').press('Enter');await closeCLI();}for(const command of commands){await view('Terminal');await page.locator('#free-cli').fill(command);await page.locator('#free-cli').press('Enter');await closeCLI();}};
    for(const [id,lan,wan] of [['R1','192.168.10.1','10.0.0.1'],['R2','192.168.20.1','10.0.0.2']])await routerCLI(id,['enable','configure terminal','interface gi0/0',`ip address ${lan} 255.255.255.0`,'no shutdown','interface gi0/1',`ip address ${wan} 255.255.255.0`,'no shutdown','end']);
    await view('Tutor');await page.getByLabel('PC de origem').selectOption('PC3');await page.getByLabel('PC de destino').selectOption('PC4');await page.getByRole('button',{name:'Testar ping',exact:true}).click();
    assert.match(await page.locator('.free-coach').innerText(),/R1: sem rota/);
    await routerCLI('R1',['configure terminal','ip route 192.168.20.0 255.255.255.0 10.0.0.2','end']);
    assert.match(await page.locator('.free-coach').innerText(),/retorno/);
    await routerCLI('R2',['configure terminal','ip route 192.168.10.0 255.255.255.0 10.0.0.1','end','show ip route']);
    assert.match(await page.locator('.free-coach').innerText(),/ida e volta válido/);
    assert.match(await freeLog(),/S 192.168.10.0/);
    assert.equal(await page.locator('[data-interface]').count(),8);
    await view('Terminal');await page.locator('#free-cli').fill('show running-config');await closeCLI();
    const lastNetwork=await page.evaluate(()=>JSON.parse(localStorage.getItem('ccna-free-workspace-v1')).network);
    await page.locator('nav').getByRole('button',{name:'Início'}).click();await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    assert.equal(await page.locator('#free-cli').inputValue(),'show running-config');
    assert.match(await freeLog(),/S 192.168.10.0/);
    const reopened=await page.evaluate(()=>JSON.parse(localStorage.getItem('ccna-free-workspace-v1')).network);
    assert.deepEqual(reopened.nodes,lastNetwork.nodes);assert.deepEqual(reopened.cables,lastNetwork.cables);assert.deepEqual(reopened.routers,lastNetwork.routers);
    if(name==='mobile'){
      await view('Terminal');await page.locator('#free-cli').focus();await page.setViewportSize({width:390,height:420});
      await page.waitForFunction(()=>document.querySelector('.cli-workspace.is-typing')?.getBoundingClientRect().bottom<=innerHeight);
      await page.waitForFunction(()=>{const t=document.querySelector('.cli-workspace.is-typing .terminal');return t&&Math.abs(t.scrollHeight-t.scrollTop-t.clientHeight)<2;});
      const visible=await page.locator('#free-cli').boundingBox();assert(visible.y>=0&&visible.y+visible.height<=420,'command field fits reduced visible viewport');
      await page.screenshot({path:'ui-artifacts/mobile-cli-reduced-viewport.png'});
      await page.getByRole('button',{name:'Ver rede',exact:true}).click();assert.equal(await page.locator('.free-editor').getAttribute('data-mobile-view'),'rede');assert.equal(await page.locator('.cli-workspace.is-typing').count(),0);assert.equal(await page.locator('#free-cli').inputValue(),'show running-config');
      await page.setViewportSize(viewport);
    }

    await page.getByRole('button',{name:'Salvar topologia',exact:true}).click();
    await view('Rede');await page.getByRole('button',{name:'Enquadrar toda a rede',exact:true}).click();
    await page.screenshot({path:`ui-artifacts/${name}-free-router.png`,fullPage:true});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'router editor must fit viewport');
    await routerCLI('R2',['configure terminal','interface gi0/1','shutdown','end']);assert.match(await page.locator('.free-coach').innerText(),/Investigue/);
    await page.reload();await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    await view('Tutor');await page.getByLabel('PC de origem').selectOption('PC3');await page.getByLabel('PC de destino').selectOption('PC4');await page.getByRole('button',{name:'Testar ping',exact:true}).click();assert.match(await page.locator('.free-coach').innerText(),/Investigue/);
    await routerCLI('R2',['configure terminal','interface gi0/1','no shutdown','end']);assert.match(await page.locator('.free-coach').innerText(),/ida e volta válido/);
    await view('Rede');await page.locator('[data-node="R1"]').click();await page.getByRole('button',{name:'Excluir equipamento selecionado',exact:true}).click();assert.equal(await page.locator('[data-cable]').count(),1);
    const blockedPage=await context.newPage();await blockedPage.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('test quota');};});
    await blockedPage.goto(baseURL);await blockedPage.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();await blockedPage.getByRole('button',{name:'+ Switch',exact:true}).click();
    await blockedPage.waitForFunction(()=>document.querySelector('.free-save-status')?.textContent.includes('Não foi possível salvar'));await blockedPage.close();
    console.log(`PASS routers ${name}: interfaces, PC gateways, missing route/return route, static routes, shutdown, persisted configuration and removal`);
    console.log(`PASS free editor ${name}: add, pointer drag, cables, loop guard, CLI VLAN/trunk/shutdown, live coach, save/reopen and delete`);
    assert.deepEqual(errors,[],'uncaught browser errors');
    await context.close();console.log(`PASS UI ${name}: wrong/correct answer, bank switch, persistence, review and mission/CLI/save/finish/next with API fixtures`);
  }
}catch(error){console.error(serverLogs);throw error;}
finally{await browser?.close();server.kill('SIGTERM');}

