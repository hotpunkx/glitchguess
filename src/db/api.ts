import { supabase } from './supabase';
import type { GameSession, GameQuestion, GameSessionWithQuestions } from '@/types/types';

// Create a new game session
export async function createGameSession(
  gameType: 'human-thinks' | 'ai-thinks',
  secretWord?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      game_type: gameType,
      secret_word: secretWord || null,
    })
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to create session');
  
  return data.id;
}

// Add a question to a session
export async function addQuestion(
  sessionId: string,
  questionNumber: number,
  questionText: string,
  answer: string
): Promise<void> {
  const { error } = await supabase
    .from('game_questions')
    .insert({
      session_id: sessionId,
      question_number: questionNumber,
      question_text: questionText,
      answer: answer,
    });

  if (error) throw error;
}

// Update session when game ends
export async function endGameSession(
  sessionId: string,
  isWon: boolean,
  questionCount: number
): Promise<void> {
  const { error } = await supabase
    .from('game_sessions')
    .update({
      is_won: isWon,
      question_count: questionCount,
      ended_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw error;
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

// Admin: Get all sessions with questions
export async function getAllSessions(): Promise<GameSessionWithQuestions[]> {
  const { data: sessions, error: sessionsError } = await supabase
    .from('game_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (sessionsError) throw sessionsError;
  if (!Array.isArray(sessions)) return [];

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

  return sessionsWithQuestions;
}

// Admin: Get session statistics
export async function getSessionStats() {
  const { data: sessions, error } = await supabase
    .from('game_sessions')
    .select('game_type, is_won, question_count');

  if (error) throw error;
  if (!Array.isArray(sessions)) return null;

  const stats = {
    total: sessions.length,
    humanThinksMode: sessions.filter(s => s.game_type === 'human-thinks').length,
    aiThinksMode: sessions.filter(s => s.game_type === 'ai-thinks').length,
    won: sessions.filter(s => s.is_won).length,
    lost: sessions.filter(s => !s.is_won && s.question_count >= 20).length,
    avgQuestions: sessions.length > 0 
      ? Math.round(sessions.reduce((sum, s) => sum + s.question_count, 0) / sessions.length)
      : 0,
  };

  return stats;
}
