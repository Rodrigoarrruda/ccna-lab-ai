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
    const context=await browser.newContext({viewport,httpCredentials:{username:'rodrigo',password}});
    const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
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
    await cli.fill('configure terminal');await cli.press('Enter');
    assert.match(await page.locator('.terminal').innerText(),/enable primeiro/);
    for(const device of ['SW1','SW2']){
      if(device==='SW2')await page.locator('.devices').getByRole('button',{name:device,exact:true}).click();
      for(const command of labs.find(l=>l.id==='vlan').solution){await cli.fill(command);await cli.press('Enter');}
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
    const firstNode=page.locator('[data-node="SW1"]');await firstNode.scrollIntoViewIfNeeded();
    const before=await firstNode.getAttribute('style');const box=await firstNode.boundingBox();
    await page.mouse.move(box.x+30,box.y+20);await page.mouse.down();await page.mouse.move(box.x+70,box.y+50,{steps:5});await page.mouse.up();
    assert.notEqual(await firstNode.getAttribute('style'),before,'node drag must update coordinates');
    const cable=async(a,ap,b,bp)=>{await page.getByLabel('Equipamento A',{exact:true}).selectOption(a);await page.getByLabel('Porta A',{exact:true}).selectOption(ap);await page.getByLabel('Equipamento B',{exact:true}).selectOption(b);await page.getByLabel('Porta B',{exact:true}).selectOption(bp);await page.getByRole('button',{name:'Conectar cabo',exact:true}).click();};
    await cable('PC3','eth0','SW1','gi0/1');await cable('PC4','eth0','SW2','gi0/1');await cable('SW1','gi0/24','SW2','gi0/24');
    await cable('SW1','gi0/2','SW2','gi0/2');assert.match(await page.locator('.free-message').innerText(),/loop/);
    await page.getByLabel('PC de origem').selectOption('PC3');await page.getByLabel('PC de destino').selectOption('PC4');await page.getByRole('button',{name:'Testar ping',exact:true}).click();
    assert.match(await page.locator('.free-coach').innerText(),/Investigue a causa/);
    for(const device of ['SW1','SW2']){
      await page.locator(`[data-node="${device}"]`).click();
      for(const command of ['enable','configure terminal','vlan 10','exit','interface gi0/1','switchport mode access','switchport access vlan 10','interface gi0/24','switchport mode trunk','switchport trunk allowed vlan 10','end']){await page.locator('#free-cli').fill(command);await page.locator('#free-cli').press('Enter');}
    }
    assert(!((await page.getByRole('log',{name:'Terminal do laboratório livre'}).innerText()).includes('SW1>')),'selected SW2 terminal must not display SW1 history');
    assert.match(await page.locator('.free-coach').innerText(),/Conectividade confirmada/);
    await page.getByRole('button',{name:'Salvar topologia',exact:true}).click();
    await page.screenshot({path:`ui-artifacts/${name}-free-network.png`,fullPage:true});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'free editor document must fit viewport');
    for(const command of ['configure terminal','interface gi0/24','shutdown','end']){await page.locator('#free-cli').fill(command);await page.locator('#free-cli').press('Enter');}
    assert.match(await page.locator('.free-coach').innerText(),/Investigue a causa/);
    await page.reload();await page.locator('nav').getByRole('button',{name:'Laboratório livre'}).click();
    assert.equal(await page.locator('[data-node]').count(),4);assert.equal(await page.locator('.free-cables li').count(),3);
    await page.getByLabel('PC de origem').selectOption('PC3');await page.getByLabel('PC de destino').selectOption('PC4');await page.getByRole('button',{name:'Testar ping',exact:true}).click();
    assert.match(await page.locator('.free-coach').innerText(),/Conectividade confirmada/);
    await page.locator('[data-node="PC4"]').click();await page.getByRole('button',{name:'Excluir equipamento selecionado',exact:true}).click();
    assert.equal(await page.locator('[data-node]').count(),3);assert.equal(await page.locator('.free-cables li').count(),2);
    console.log(`PASS free editor ${name}: add, pointer drag, cables, loop guard, CLI VLAN/trunk/shutdown, live coach, save/reopen and delete`);
    assert.deepEqual(errors,[],'uncaught browser errors');
    await context.close();console.log(`PASS UI ${name}: wrong/correct answer, bank switch, persistence, review and mission/CLI/save/finish/next with API fixtures`);
  }
}catch(error){console.error(serverLogs);throw error;}
finally{await browser?.close();server.kill('SIGTERM');}
