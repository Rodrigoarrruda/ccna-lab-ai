import {ccnaBlueprintV11} from '../lib/blueprint.ts';

export type ContentDifficulty='Básico'|'Intermediário'|'Avançado';

export type GeneratedQuestionDraft={
  id:string;
  objectiveId:string;
  domainId:string;
  domain:string;
  topic:string;
  difficulty:ContentDifficulty;
  prompt:string;
  options:string[];
  answer:string;
  explanation:string;
  sourceRef:string;
  generatedAt:string;
  generator:string;
  practice?:string;
};

export type ContentBatch={
  id:string;
  blueprintId:string;
  version:number;
  generatedAt:string;
  items:GeneratedQuestionDraft[];
};

export type ContentValidationOptions={
  existingIds?:Iterable<string>;
  existingPrompts?:Iterable<string>;
};

export type ContentValidationResult={
  ok:boolean;
  errors:string[];
  warnings:string[];
};

const difficulties=new Set<ContentDifficulty>(['Básico','Intermediário','Avançado']);
const secretFieldPattern=/(password|secret|token|api[_-]?key|credential|private[_-]?key)/i;

function normalized(value:string):string{
  return value.trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
}

function isRecord(value:unknown):value is Record<string,unknown>{
  return typeof value==='object'&&value!==null&&!Array.isArray(value);
}

function scanForSecretLikeFields(value:unknown,path='batch'):string[]{
  if(Array.isArray(value)){
    return value.flatMap((item,index)=>scanForSecretLikeFields(item,path+'['+index+']'));
  }
  if(!isRecord(value))return [];
  const findings:string[]=[];
  for(const [key,child] of Object.entries(value)){
    const childPath=path+'.'+key;
    if(secretFieldPattern.test(key))findings.push(childPath+' usa campo não permitido');
    findings.push(...scanForSecretLikeFields(child,childPath));
  }
  return findings;
}

function getObjectiveIndex(){
  const objectives=new Map<string,{domainId:string;domain:string}>();
  for(const domain of ccnaBlueprintV11.domains){
    for(const objective of domain.objectives){
      objectives.set(objective.id,{domainId:domain.id,domain:domain.title});
    }
  }
  return objectives;
}

export function validateContentBatch(
  batch:unknown,
  options:ContentValidationOptions={}
):ContentValidationResult{
  const errors:string[]=[];
  const warnings:string[]=[];
  const objectives=getObjectiveIndex();
  const existingIds=new Set(options.existingIds??[]);
  const existingPrompts=new Set(Array.from(options.existingPrompts??[],normalized));

  if(!isRecord(batch)){
    return {ok:false,errors:['O lote precisa ser um objeto JSON.'],warnings:[]};
  }
  if(batch.blueprintId!==ccnaBlueprintV11.id)errors.push('blueprintId não corresponde ao blueprint CCNA versionado.');
  if(typeof batch.id!=='string'||!batch.id.trim())errors.push('id do lote é obrigatório.');
  if(!Number.isInteger(batch.version)||Number(batch.version)<1)errors.push('version precisa ser um inteiro positivo.');
  if(typeof batch.generatedAt!=='string'||Number.isNaN(Date.parse(batch.generatedAt)))errors.push('generatedAt precisa ser uma data ISO válida.');
  if(!Array.isArray(batch.items)||batch.items.length===0){
    errors.push('items precisa conter pelo menos uma questão.');
    return {ok:false,errors,warnings};
  }

  const seenIds=new Set<string>();
  const seenPrompts=new Set<string>();
  const answerPositions=new Set<number>();

  for(const [index,item] of batch.items.entries()){
    const label='items['+index+']';
    if(!isRecord(item)){
      errors.push(label+' precisa ser um objeto.');
      continue;
    }
    const id=typeof item.id==='string'?item.id.trim():'';
    const prompt=typeof item.prompt==='string'?item.prompt.trim():'';
    const objectiveId=typeof item.objectiveId==='string'?item.objectiveId.trim():'';
    const optionsList=Array.isArray(item.options)?item.options:[];
    const answer=typeof item.answer==='string'?item.answer.trim():'';

    if(!id)errors.push(label+'.id é obrigatório.');
    else if(seenIds.has(id)||existingIds.has(id))errors.push(label+'.id duplicado no banco ou no lote.');
    else seenIds.add(id);

    const promptKey=normalized(prompt);
    if(!prompt)errors.push(label+'.prompt é obrigatório.');
    else if(seenPrompts.has(promptKey)||existingPrompts.has(promptKey))errors.push(label+'.prompt duplicado no banco ou no lote.');
    else seenPrompts.add(promptKey);

    const objective=objectives.get(objectiveId);
    if(!objective)errors.push(label+'.objectiveId não existe no blueprint.');
    else{
      if(item.domainId!==objective.domainId)errors.push(label+'.domainId não corresponde ao objetivo.');
      if(item.domain!==objective.domain)errors.push(label+'.domain não corresponde ao blueprint.');
    }

    if(typeof item.topic!=='string'||!item.topic.trim())errors.push(label+'.topic é obrigatório.');
    if(!difficulties.has(item.difficulty as ContentDifficulty))errors.push(label+'.difficulty é inválida.');
    if(typeof item.explanation!=='string'||!item.explanation.trim())errors.push(label+'.explanation é obrigatória.');
    if(typeof item.sourceRef!=='string'||!item.sourceRef.trim())errors.push(label+'.sourceRef é obrigatório.');
    if(typeof item.generatedAt!=='string'||Number.isNaN(Date.parse(item.generatedAt)))errors.push(label+'.generatedAt precisa ser uma data ISO válida.');
    if(typeof item.generator!=='string'||!item.generator.trim())errors.push(label+'.generator é obrigatório.');

    const optionValues=optionsList.filter((option):option is string=>typeof option==='string').map(option=>option.trim());
    if(optionsList.length!==4||optionValues.length!==4||new Set(optionValues.map(normalized)).size!==4){
      errors.push(label+'.options precisa ter exatamente quatro alternativas distintas.');
    }
    const answerIndex=optionValues.findIndex(option=>normalized(option)===normalized(answer));
    if(answerIndex<0)errors.push(label+'.answer precisa corresponder a uma alternativa.');
    else answerPositions.add(answerIndex);

    errors.push(...scanForSecretLikeFields(item,label));
  }

  if(batch.items.length>=4&&answerPositions.size<2){
    errors.push('O lote precisa distribuir as respostas em pelo menos duas posições diferentes.');
  }
  if(batch.items.length<4)warnings.push('Lote pequeno: a distribuição de respostas será auditada novamente quando crescer.');
  return {ok:errors.length===0,errors,warnings};
}
