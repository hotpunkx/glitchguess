import { useState, useEffect } from 'react';
import { QuestionAnswer } from '@/types/game';
import { createGameSession, addQuestion, endGameSession, getGameSession, getSessionQuestions } from '@/db/api';

export interface SavedGameState {
  sessionId: string;
  gameMode: 'start' | 'human-thinks' | 'ai-thinks' | 'end';
  currentMode: 'human-thinks' | 'ai-thinks';
  questionCount: number;
  isWon: boolean;
  correctAnswer?: string;
  history: QuestionAnswer[];
  secretWord?: string;
  currentQuestion?: string;
  showInstruction?: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'glitchguess-session-id';
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

export function useGameStorage() {
  const [savedState, setSavedState] = useState<SavedGameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved state on mount
  useEffect(() => {
    loadSavedState();
  }, []);

  const loadSavedState = async () => {
    try {
      const sessionId = localStorage.getItem(STORAGE_KEY);
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      // Fetch session from database
      const session = await getGameSession(sessionId);
      if (!session) {
        localStorage.removeItem(STORAGE_KEY);
        setIsLoading(false);
        return;
      }

      // Check if session is not too old
      const age = Date.now() - new Date(session.created_at).getTime();
      if (age >= MAX_AGE || session.ended_at) {
        localStorage.removeItem(STORAGE_KEY);
        setIsLoading(false);
        return;
      }

      // Fetch questions
      const questions = await getSessionQuestions(sessionId);
      const history: QuestionAnswer[] = questions.map(q => ({
        question: q.question_text,
        answer: q.answer,
      }));

      // Reconstruct state
      const state: SavedGameState = {
        sessionId: session.id,
        gameMode: session.game_type,
        currentMode: session.game_type,
        questionCount: session.question_count,
        isWon: session.is_won,
        history,
        secretWord: session.secret_word || undefined,
        timestamp: new Date(session.created_at).getTime(),
      };

      setSavedState(state);
    } catch (error) {
      console.error('Error loading saved game state:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async (
    gameType: 'human-thinks' | 'ai-thinks',
    secretWord?: string
  ): Promise<string> => {
    try {
      const sessionId = await createGameSession(gameType, secretWord);
      localStorage.setItem(STORAGE_KEY, sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  };

  const saveQuestion = async (
    sessionId: string,
    questionNumber: number,
    questionText: string,
    answer: string
  ) => {
    try {
      await addQuestion(sessionId, questionNumber, questionText, answer);
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const endSession = async (
    sessionId: string,
    isWon: boolean,
    questionCount: number
  ) => {
    try {
      await endGameSession(sessionId, isWon, questionCount);
      localStorage.removeItem(STORAGE_KEY);
      setSavedState(null);
    } catch (error) {
      console.error('Error ending game session:', error);
    }
  };

  const clearGameState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSavedState(null);
    } catch (error) {
      console.error('Error clearing game state:', error);
    }
  };

  return {
    savedState,
    isLoading,
    createNewSession,
    saveQuestion,
    endSession,
    clearGameState,
    hasSavedGame: savedState !== null,
  };
}
