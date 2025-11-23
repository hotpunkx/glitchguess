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

// Multiplayer game types
export interface MultiplayerGame {
  id: string;
  game_code: string;
  player1_name: string;
  player2_name: string | null;
  player1_session: string;
  player2_session: string | null;
  current_thinker: 'player1' | 'player2';
  current_questioner: 'player1' | 'player2' | null;
  word_setter_claimed: 'player1' | 'player2' | null;
  winner: 'player1' | 'player2' | null;
  game_status: 'waiting' | 'active' | 'ended';
  secret_word: string | null;
  question_count: number;
  is_won: boolean;
  player1_rematch: boolean;
  player2_rematch: boolean;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
}

export interface MultiplayerQuestion {
  id: string;
  game_id: string;
  question_number: number;
  question_text: string;
  answer: string;
  is_guess: boolean;
  created_at: string;
}
