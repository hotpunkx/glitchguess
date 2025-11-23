// Database types matching Supabase schema

export interface GameSession {
  id: string;
  game_type: 'human-thinks' | 'ai-thinks';
  secret_word: string | null;
  is_won: boolean;
  question_count: number;
  created_at: string;
  ended_at: string | null;
  ip_address: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
}

export interface GameQuestion {
  id: string;
  session_id: string;
  question_number: number;
  question_text: string;
  answer: string;
  created_at: string;
}

// Extended type with questions for admin dashboard
export interface GameSessionWithQuestions extends GameSession {
  questions: GameQuestion[];
}
