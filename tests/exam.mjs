import assert from 'node:assert/strict';
import {ccnaBlueprintV11} from '../lib/blueprint.ts';
import {studyUnits} from '../lib/study-content.ts';
import {studyLessons} from '../lib/study-lessons.ts';
import {extendedStudyLessons} from '../lib/study-lessons-advanced.ts';
import {packetTracerLabs} from '../lib/packet-tracer-labs.ts';
import {advancedExamQuestions,countMastered,examQuestions,getExamQuestion,isCorrect,isQuestionBankMastered,selectNextQuestion} from '../lib/exam.ts';

assert.equal(ccnaBlueprintV11.id,'ccna-200-301-v1.1');
assert.equal(ccnaBlueprintV11.domains.length,6);
assert.deepEqual(ccnaBlueprintV11.domains.map(domain=>domain.contentStatus),['available','available','available','available','available','available']);
assert.equal(examQuestions.length,134);
assert.equal(studyUnits.length,27);
assert.equal(Object.keys(studyLessons).length,studyUnits.length);
assert.ok(studyUnits.every(unit=>{const lesson=studyLessons[unit.objectiveId];return lesson&&lesson.overview&&lesson.whyItMatters&&lesson.concepts.length>=3&&lesson.commands.length>=2&&lesson.scenario&&lesson.checkOptions.length===4&&lesson.checkOptions.includes(lesson.checkAnswer);}));
assert.equal(Object.keys(extendedStudyLessons).length,26);
const advancedObjectives=ccnaBlueprintV11.domains.slice(3).flatMap(domain=>domain.objectives.map(objective=>objective.id));
assert.deepEqual(Object.keys(extendedStudyLessons).sort(),advancedObjectives.sort());
assert.deepEqual(examQuestions.slice(108).map(question=>question.objectiveId).sort(),advancedObjectives.sort());
assert.ok(advancedObjectives.every(objectiveId=>{const lesson=extendedStudyLessons[objectiveId];const lab=packetTracerLabs[objectiveId];return lesson.overview&&lesson.whyItMatters&&lesson.concepts.length>=3&&lesson.commands.length>=2&&lesson.scenario&&lesson.checkOptions.length===4&&lesson.checkOptions.includes(lesson.checkAnswer)&&lab&&lab.tasks.length>=3&&lab.verification.length>=2;}));
assert.equal(getExamQuestion(81).id,examQuestions[81].id);
assert.equal(getExamQuestion(108).id,examQuestions[108].id);
assert.equal(getExamQuestion(134).id,examQuestions[0].id);
assert.equal(examQuestions[27].objectiveId,examQuestions[0].objectiveId);
assert.equal(examQuestions[54].objectiveId,examQuestions[0].objectiveId);
assert.equal(examQuestions[81].objectiveId,examQuestions[0].objectiveId);
assert.ok(examQuestions.every(question=>question.objectiveId&&question.domainId&&question.domain&&question.topic&&question.explanation));
assert.ok(studyUnits.every(unit=>unit.summary&&unit.keyPoints.length>=2&&unit.commonMistake&&unit.question.objectiveId===unit.objectiveId));
assert.ok(examQuestions.every(question=>['1.0','2.0','3.0','4.0','5.0','6.0'].includes(question.domainId)));
assert.equal(isCorrect(examQuestions[0],examQuestions[0].answer),true);
assert.equal(isCorrect(examQuestions[0],examQuestions[0].options[0]),false);

const weakId=examQuestions[1].id;
assert.equal(selectNextQuestion(examQuestions,{},examQuestions[0].id),1);
const history=Object.fromEntries(examQuestions.map(question=>[question.id,{correct:4,incorrect:0,lastAnswered:2}]));
history[weakId]={correct:0,incorrect:1,lastAnswered:1};
assert.equal(selectNextQuestion(examQuestions,history,examQuestions[0].id),1);
const initialCycle=Object.fromEntries(examQuestions.slice(0,54).map(question=>[question.id,{correct:1,incorrect:0,lastAnswered:2}]));
assert.equal(selectNextQuestion(examQuestions,initialCycle,examQuestions[53].id),54);
const answerPositions=examQuestions.map(question=>question.options.indexOf(question.answer));
assert.ok(answerPositions.every(position=>position>=0));
assert.equal(new Set(answerPositions).size,4);
assert.ok(answerPositions.filter(position=>position===0).length<examQuestions.length/2);
assert.equal(countMastered(examQuestions,{[examQuestions[0].id]:{correct:4,incorrect:0,lastAnswered:1}}),0);
assert.equal(countMastered(examQuestions,{[examQuestions[1].id]:{correct:1,incorrect:1,lastAnswered:1}}),0);
assert.equal(isQuestionBankMastered(examQuestions,initialCycle),false);
const fullMastery=Object.fromEntries(examQuestions.map(question=>[question.id,{correct:3,incorrect:0,lastAnswered:2}]));
assert.equal(isQuestionBankMastered(examQuestions,history),false);
assert.equal(isQuestionBankMastered(examQuestions,fullMastery),true);
console.log('PASS: blueprint v1.1, quatro ciclos autorais, alternativas distribuídas, módulos interativos dos domínios 1–6, roteiros Packet Tracer e seleção adaptativa determinística validados.');

assert.equal(advancedExamQuestions.length,40);
assert.deepEqual(ccnaBlueprintV11.domains.map(domain=>advancedExamQuestions.filter(q=>q.domainId===domain.id).length),[8,8,10,4,6,4]);
assert.equal(new Set([...examQuestions,...advancedExamQuestions].map(q=>q.id)).size,174);
assert.ok(advancedExamQuestions.every(q=>q.difficulty==='Avançado'&&q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)&&q.explanation.length>100));
assert.ok(advancedExamQuestions.every(q=>ccnaBlueprintV11.domains.find(d=>d.id===q.domainId).objectives.some(o=>o.id===q.objectiveId)));
for(const q of advancedExamQuestions){assert.equal(isCorrect(q,q.answer),true);for(const wrong of q.options.filter(o=>o!==q.answer))assert.equal(isCorrect(q,wrong),false);}
const advancedProgress=Object.fromEntries(advancedExamQuestions.map(q=>[q.id,{correct:3,incorrect:0,lastAnswered:1}]));
assert.equal(isQuestionBankMastered(advancedExamQuestions,{}),false);
assert.equal(isQuestionBankMastered(advancedExamQuestions,fullMastery),false); // foundation history never unlocks new bank
assert.equal(isQuestionBankMastered(advancedExamQuestions,advancedProgress),true);
const first=advancedExamQuestions[0];
assert.equal(isQuestionBankMastered([first],{[first.id]:{correct:2,incorrect:0,lastAnswered:1}}),false);
assert.equal(isQuestionBankMastered([first],{[first.id]:{correct:4,incorrect:1,lastAnswered:1}}),true); // 80% boundary
assert.equal(isQuestionBankMastered([first],{[first.id]:{correct:3,incorrect:1,lastAnswered:1}}),false);
assert.equal(isQuestionBankMastered([],{}),false);
assert.equal(countMastered(advancedExamQuestions,{[first.id]:advancedProgress[first.id]}),0); // other VLSM item still unanswered
assert.equal(selectNextQuestion(advancedExamQuestions,{},first.id),1);
// Independently derive VLSM block sizes from the requested host counts.
const blockFor=hosts=>2**Math.ceil(Math.log2(hosts+2));
const offset=blockFor(100)+blockFor(50);
const prefix=32-Math.log2(blockFor(20));
assert.ok(first.answer.includes(`192.0.2.${offset}/${prefix}`));
assert.ok(first.answer.includes(`.${offset+1}–.${offset+blockFor(20)-2}`));
const lanCount=2**(64-56);
assert.ok(advancedExamQuestions[4].answer.includes(lanCount.toString()));
assert.ok(advancedExamQuestions[4].answer.includes((0x1200+lanCount-1).toString(16)));
assert.match(advancedExamQuestions[16].answer,/192\.0\.2\.6/);
console.log('PASS: 40 advanced original scenarios, weights, grading, separate history and consistency boundaries.');
