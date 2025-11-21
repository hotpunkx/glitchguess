export type GameMode = 'start' | 'human-thinks' | 'ai-thinks' | 'end';

export type Answer = 'Yes' | 'No' | 'Sometimes';

export interface QuestionAnswer {
  question: string;
  answer: Answer;
  asker: 'ai' | 'human';
}

export interface GameState {
  mode: GameMode;
  questionCount: number;
  history: QuestionAnswer[];
  secretWord?: string;
  isWon: boolean;
  correctAnswer?: string;
}
