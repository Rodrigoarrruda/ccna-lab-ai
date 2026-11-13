export type ExamQuestion = {
  id: string;
  objectiveId: string;
  domainId: string;
  domain: string;
  topic: string;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  practice?: string;
};

export type StudyUnit = {
  id: string;
  objectiveId: string;
  domainId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  commonMistake: string;
  question: ExamQuestion;
};
