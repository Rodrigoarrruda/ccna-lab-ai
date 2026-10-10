import {ccnaBlueprintV11} from './blueprint';
import {studyUnits} from './study-content';
import type {ExamQuestion} from './exam-types';

export type {ExamQuestion} from './exam-types';

export type ExamRecord={
  correct:number;
  incorrect:number;
  lastAnswered:number;
};

export type ExamProgress=Record<string,ExamRecord>;

export const examBlueprint=ccnaBlueprintV11;
export const examQuestions:ExamQuestion[]=studyUnits.map(unit=>unit.question);

export function getExamQuestion(index:number):ExamQuestion{
  return examQuestions[Math.max(0,index)%examQuestions.length];
}

export function isCorrect(question:ExamQuestion,answer:string):boolean{
  return question.answer===answer;
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
  return questions.filter(question=>{
    const record=progress[question.id];
    const total=(record?.correct??0)+(record?.incorrect??0);
    return Boolean(record&&total>=1&&record.correct>record.incorrect&&record.correct/total>=0.8);
  }).length;
}
