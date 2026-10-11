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
    assert.deepEqual(errors,[],'uncaught browser errors');
    await context.close();console.log(`PASS UI ${name}: wrong/correct answer, bank switch, persistence, review and mission/CLI/save/finish/next with API fixtures`);
  }
}catch(error){console.error(serverLogs);throw error;}
finally{await browser?.close();server.kill('SIGTERM');}
