import { supabase } from './supabase';
import type { GameSession, GameQuestion, GameSessionWithQuestions, MultiplayerGame, MultiplayerQuestion } from '@/types/types';

// Extended type for multiplayer games with questions
export interface MultiplayerGameWithQuestions extends MultiplayerGame {
  questions: MultiplayerQuestion[];
}

// Create a new game session
export async function createGameSession(
  gameType: 'human-thinks' | 'ai-thinks',
  secretWord?: string
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        game_type: gameType,
        secret_word: secretWord || null,
      })
      .select('id')
      .single();

    if (error) {
      console.warn('Supabase session creation failed, using local fallback:', error.message);
      return crypto.randomUUID();
    }
    if (!data) return crypto.randomUUID();
    
    return data.id;
  } catch (err) {
    console.warn('Network error in createGameSession, using local fallback:', err);
    return crypto.randomUUID();
  }
}

// Add a question to a session
export async function addQuestion(
  sessionId: string,
  questionNumber: number,
  questionText: string,
  answer: string
): Promise<void> {
  if (!questionText || questionText.trim() === '') {
    return; // Don't throw, just skip
  }
  
  try {
    const { error } = await supabase
      .from('game_questions')
      .insert({
        session_id: sessionId,
        question_number: questionNumber,
        question_text: questionText,
        answer: answer,
      });
    
    if (error) console.warn('Failed to save question to Supabase:', error.message);
  } catch (err) {
    console.warn('Network error in addQuestion:', err);
  }
}

// Update session when game ends
export async function endGameSession(
  sessionId: string,
  isWon: boolean,
  questionCount: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        is_won: isWon,
        question_count: questionCount,
        ended_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) console.warn('Failed to end session in Supabase:', error.message);
  } catch (err) {
    console.warn('Network error in endGameSession:', err);
  }
}

// Get session by ID
export async function getGameSession(sessionId: string): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Get questions for a session
export async function getSessionQuestions(sessionId: string): Promise<GameQuestion[]> {
  const { data, error } = await supabase
    .from('game_questions')
    .select('*')
    .eq('session_id', sessionId)
    .order('question_number', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Admin: Get all sessions with questions (paginated)
export async function getAllSessions(page: number = 1, pageSize: number = 10): Promise<{ sessions: GameSessionWithQuestions[], total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get total count
  const { count } = await supabase
    .from('game_sessions')
    .select('*', { count: 'exact', head: true });

  const { data: sessions, error: sessionsError } = await supabase
    .from('game_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (sessionsError) throw sessionsError;
  if (!Array.isArray(sessions)) return { sessions: [], total: 0 };

  // Fetch questions for all sessions
  const sessionsWithQuestions = await Promise.all(
    sessions.map(async (session) => {
      const questions = await getSessionQuestions(session.id);
      return {
        ...session,
        questions,
      };
    })
  );

  return { sessions: sessionsWithQuestions, total: count || 0 };
}

// Admin: Get all multiplayer games with questions (paginated)
export async function getAllMultiplayerGames(page: number = 1, pageSize: number = 10): Promise<{ games: MultiplayerGameWithQuestions[], total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get total count
  const { count } = await supabase
    .from('multiplayer_games')
    .select('*', { count: 'exact', head: true });

  const { data: games, error: gamesError } = await supabase
    .from('multiplayer_games')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (gamesError) throw gamesError;
  if (!Array.isArray(games)) return { games: [], total: 0 };

  // Fetch questions for all games
  const gamesWithQuestions = await Promise.all(
    games.map(async (game) => {
      const { data: questions, error: questionsError } = await supabase
        .from('multiplayer_questions')
        .select('*')
        .eq('game_id', game.id)
        .order('question_number', { ascending: true });

      if (questionsError) throw questionsError;

      return {
        ...game,
        questions: Array.isArray(questions) ? questions : [],
      };
    })
  );

  return { games: gamesWithQuestions, total: count || 0 };
}

// Admin: Get session statistics
export async function getSessionStats() {
  // Get single player sessions
  const { data: sessions, error } = await supabase
    .from('game_sessions')
    .select('game_type, is_won, question_count');

  if (error) throw error;
  if (!Array.isArray(sessions)) return null;

  // Get multiplayer games
  const { data: multiplayerGames, error: mpError } = await supabase
    .from('multiplayer_games')
    .select('game_status, is_won, question_count, rematch_game_id');

  if (mpError) throw mpError;
  const mpGames = Array.isArray(multiplayerGames) ? multiplayerGames : [];

  // Count completed multiplayer games (each rematch is counted as a new game)
  const completedMpGames = mpGames.filter(g => g.game_status === 'ended');

  const stats = {
    total: sessions.length + completedMpGames.length,
    humanThinksMode: sessions.filter(s => s.game_type === 'human-thinks').length,
    aiThinksMode: sessions.filter(s => s.game_type === 'ai-thinks').length,
    multiplayerMode: completedMpGames.length,
    won: sessions.filter(s => s.is_won).length + completedMpGames.filter(g => g.is_won).length,
    lost: sessions.filter(s => !s.is_won && s.question_count >= 20).length + completedMpGames.filter(g => !g.is_won && g.question_count >= 20).length,
    avgQuestions: (sessions.length + completedMpGames.length) > 0 
      ? Math.round((sessions.reduce((sum, s) => sum + s.question_count, 0) + completedMpGames.reduce((sum, g) => sum + g.question_count, 0)) / (sessions.length + completedMpGames.length))
      : 0,
  };

  return stats;
}
