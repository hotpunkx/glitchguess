import { useState, useEffect } from 'react';
import { QuestionAnswer } from '@/types/game';

export interface SavedGameState {
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

const STORAGE_KEY = 'glitchguess-game-state';
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Simple encoding/decoding to prevent users from seeing the secret word in DevTools
const encodeSecret = (text: string): string => {
  try {
    return btoa(encodeURIComponent(text));
  } catch {
    return text;
  }
};

const decodeSecret = (encoded: string): string => {
  try {
    return decodeURIComponent(atob(encoded));
  } catch {
    return encoded;
  }
};

export function useGameStorage() {
  const [savedState, setSavedState] = useState<SavedGameState | null>(null);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedGameState = JSON.parse(saved);
        
        // Check if saved state is not too old
        const age = Date.now() - parsed.timestamp;
        if (age < MAX_AGE && parsed.gameMode !== 'start' && parsed.gameMode !== 'end') {
          // Decode secret word if it exists
          if (parsed.secretWord) {
            parsed.secretWord = decodeSecret(parsed.secretWord);
          }
          setSavedState(parsed);
        } else {
          // Clear old state
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading saved game state:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveGameState = (state: Partial<SavedGameState>) => {
    try {
      const currentState: SavedGameState = {
        gameMode: state.gameMode || 'start',
        currentMode: state.currentMode || 'human-thinks',
        questionCount: state.questionCount || 0,
        isWon: state.isWon || false,
        correctAnswer: state.correctAnswer,
        history: state.history || [],
        secretWord: state.secretWord ? encodeSecret(state.secretWord) : undefined,
        currentQuestion: state.currentQuestion,
        showInstruction: state.showInstruction,
        timestamp: Date.now(),
      };

      // Only save if game is in progress
      if (currentState.gameMode !== 'start' && currentState.gameMode !== 'end') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
      }
    } catch (error) {
      console.error('Error saving game state:', error);
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
    saveGameState,
    clearGameState,
    hasSavedGame: savedState !== null,
  };
}
