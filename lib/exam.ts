import {ccnaBlueprintV11} from './blueprint.ts';
import {studyUnits} from './study-content.ts';
import {studyQuestionVariants} from './study-question-variants.ts';
import {studyQuestionCycle3} from './study-question-cycle-3.ts';
import {studyQuestionCycle4} from './study-question-cycle-4.ts';
import type {ExamQuestion} from './exam-types.ts';

export type {ExamQuestion} from './exam-types.ts';

export type ExamRecord={
  correct:number;
  incorrect:number;
  lastAnswered:number;
};

export type ExamProgress=Record<string,ExamRecord>;

export const examBlueprint=ccnaBlueprintV11;
export const examQuestions:ExamQuestion[]=[
  ...studyUnits.map(unit=>unit.question),
  ...studyQuestionVariants,
  ...studyQuestionCycle3,
  ...studyQuestionCycle4
];

export function getExamQuestion(index:number):ExamQuestion{
  return examQuestions[Math.max(0,index)%examQuestions.length];
}

export function isCorrect(question:ExamQuestion,answer:string):boolean{
  return question.answer===answer;
}

function isMastered(record?:ExamRecord):boolean{
  if(!record)return false;
  const total=record.correct+record.incorrect;
  return total>=1&&record.correct>record.incorrect&&record.correct/total>=0.8;
}

export function selectNextQuestion(
  questions:ExamQuestion[],
  progress:ExamProgress,
  currentId?:string
):number{
  const candidates=questions
    .map((question,index)=>{
      const record=progress[question.id];
      const total=(record?.correct??0)+(record?.incorrect??0);
      const accuracy=total?record!.correct/total:0;
      const priority=!record?0:record.incorrect>0?1:accuracy<0.8?2:3;
      return {index,priority,accuracy,lastAnswered:record?.lastAnswered??0};
    })
    .filter(item=>questions[item.index].id!==currentId);
  candidates.sort((a,b)=>a.priority-b.priority||a.accuracy-b.accuracy||a.lastAnswered-b.lastAnswered||a.index-b.index);
  return (candidates[0]??{index:0}).index;
}

export function countMastered(questions:ExamQuestion[],progress:ExamProgress):number{
  return new Set(
    questions
      .filter(question=>isMastered(progress[question.id]))
      .map(question=>question.objectiveId)
  ).size;
}

export function isQuestionBankMastered(questions:ExamQuestion[],progress:ExamProgress):boolean{
  return questions.length>0&&questions.every(question=>isMastered(progress[question.id]));
}
