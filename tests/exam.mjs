import assert from 'node:assert/strict';
import {ccnaBlueprintV11} from '../lib/blueprint.ts';
import {studyUnits} from '../lib/study-content.ts';
import {countMastered,examQuestions,getExamQuestion,isCorrect,selectNextQuestion} from '../lib/exam.ts';

assert.equal(ccnaBlueprintV11.id,'ccna-200-301-v1.1');
assert.equal(ccnaBlueprintV11.domains.length,6);
assert.deepEqual(ccnaBlueprintV11.domains.slice(0,3).map(domain=>domain.contentStatus),['available','available','available']);
assert.equal(examQuestions.length,26);
assert.equal(studyUnits.length,26);
assert.equal(getExamQuestion(26).id,examQuestions[0].id);
assert.ok(examQuestions.every(question=>question.objectiveId&&question.domainId&&question.domain&&question.topic&&question.explanation));
assert.ok(studyUnits.every(unit=>unit.summary&&unit.keyPoints.length>=2&&unit.commonMistake&&unit.question.objectiveId===unit.objectiveId));
assert.ok(examQuestions.every(question=>['1.0','2.0','3.0'].includes(question.domainId)));
assert.equal(isCorrect(examQuestions[0],examQuestions[0].answer),true);
assert.equal(isCorrect(examQuestions[0],examQuestions[0].options[0]),false);

const weakId=examQuestions[1].id;
assert.equal(selectNextQuestion(examQuestions,{},examQuestions[0].id),1);
assert.equal(selectNextQuestion(examQuestions,{[weakId]:{correct:0,incorrect:1,lastAnswered:1}},examQuestions[0].id),1);
assert.equal(countMastered(examQuestions,{[examQuestions[0].id]:{correct:4,incorrect:0,lastAnswered:1}}),1);
assert.equal(countMastered(examQuestions,{[examQuestions[1].id]:{correct:1,incorrect:1,lastAnswered:1}}),0);
console.log('PASS: blueprint v1.1, pacote inicial e seleção adaptativa determinística validados.');
