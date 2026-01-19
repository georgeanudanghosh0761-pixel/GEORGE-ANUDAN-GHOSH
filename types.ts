
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  fact: string;
}

export interface QuizScript {
  topic: string;
  intro: {
    visualDescription: string;
    text: string;
  };
  hook: string;
  questions: QuizQuestion[];
  twist: {
    title: string;
    description: string;
  };
  cta: string;
}

export type AppMode = 'GENERATE' | 'PREVIEW';
