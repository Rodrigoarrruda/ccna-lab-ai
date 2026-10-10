import assert from 'node:assert/strict';
import {examQuestions, getExamQuestion, isCorrect} from '../lib/exam.ts';

assert.equal(examQuestions.length, 6);
assert.equal(getExamQuestion(6).id, examQuestions[0].id);
assert.equal(isCorrect(examQuestions[0], examQuestions[0].answer), true);
assert.equal(isCorrect(examQuestions[0], examQuestions[0].options[0]), false);
assert.ok(examQuestions.every(question => question.domain && question.topic && question.explanation));
console.log('PASS: banco autoral do coach CCNA possui explicação, domínio e correção determinística.');
