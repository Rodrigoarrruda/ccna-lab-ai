import {readFile} from 'node:fs/promises';
import {validateContentBatch} from '../content/pipeline.ts';
import {examQuestions} from '../lib/exam.ts';

const inputPath=process.argv[2];
if(!inputPath){
  console.error('Uso: npm run content:validate -- caminho/para/lote.json');
  process.exit(2);
}

let raw:string;
try{
  raw=await readFile(inputPath,'utf8');
}catch{
  console.error('Não foi possível ler o arquivo do lote.');
  process.exit(2);
}

let batch:unknown;
try{
  batch=JSON.parse(raw);
}catch{
  console.error('O arquivo do lote não contém JSON válido.');
  process.exit(2);
}

const result=validateContentBatch(batch,{
  existingIds:examQuestions.map(question=>question.id),
  existingPrompts:examQuestions.map(question=>question.prompt)
});
if(result.warnings.length)for(const warning of result.warnings)console.warn('AVISO: '+warning);
if(!result.ok){
  for(const error of result.errors)console.error('ERRO: '+error);
  process.exit(1);
}
console.log('Lote válido. Próximo passo: revisão humana e abertura de PR.');
