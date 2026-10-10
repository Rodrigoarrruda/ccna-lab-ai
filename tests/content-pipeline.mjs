import assert from 'node:assert/strict';
import {ccnaBlueprintV11} from '../lib/blueprint.ts';
import {validateContentBatch} from '../content/pipeline.ts';

const base={
  blueprintId:ccnaBlueprintV11.id,
  version:1,
  generatedAt:'2026-10-10T12:00:00.000Z'
};

function item(index,answerIndex,objectiveId,domainId,domain){
  const options=['A','B','C','D'];
  return {
    id:'draft-'+index,
    objectiveId,
    domainId,
    domain,
    topic:'Diagnóstico',
    difficulty:'Intermediário',
    prompt:'Pergunta inédita sobre '+objectiveId+' número '+index,
    options,
    answer:options[answerIndex],
    explanation:'A alternativa correta é justificada pelo comportamento do protocolo.',
    sourceRef:'blueprint:'+objectiveId,
    generatedAt:base.generatedAt,
    generator:'content-draft-test'
  };
}

const valid={
  ...base,
  id:'batch-test-001',
  items:[
    item(1,0,'1.1','1.0','Network Fundamentals'),
    item(2,1,'1.2','1.0','Network Fundamentals'),
    item(3,2,'2.1','2.0','Network Access'),
    item(4,3,'3.1','3.0','IP Connectivity')
  ]
};
const validResult=validateContentBatch(valid);
assert.equal(validResult.ok,true,validResult.errors.join('; '));

const invalid=structuredClone(valid);
const invalidItems=invalid.items;
invalidItems[1]={...invalidItems[1],id:'draft-1',objectiveId:'9.9',domainId:'9.0',domain:'Outro',options:['A','A','A','A'],answer:'Z',password:'não permitido'};
const invalidResult=validateContentBatch(invalid,{existingIds:['draft-3']});
assert.equal(invalidResult.ok,false);
assert(invalidResult.errors.some(error=>error.includes('blueprint')));
assert(invalidResult.errors.some(error=>error.includes('duplicado')));
assert(invalidResult.errors.some(error=>error.includes('quatro alternativas')));
assert(invalidResult.errors.some(error=>error.includes('corresponder')));
assert(invalidResult.errors.some(error=>error.includes('não permitido')));

const allA={
  ...base,
  id:'batch-test-all-a',
  items:[1,2,3,4].map((index)=>item(index,0,'1.1','1.0','Network Fundamentals'))
};
const allAResult=validateContentBatch(allA);
assert.equal(allAResult.ok,false);
assert(allAResult.errors.some(error=>error.includes('posições diferentes')));

console.log('content-pipeline: ok');
