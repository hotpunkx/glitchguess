import { useState, useEffect } from 'react';
import { StartScreen } from '@/components/game/StartScreen';
import { HumanThinksMode } from '@/components/game/HumanThinksMode';
import { AIThinksMode } from '@/components/game/AIThinksMode';
import { EndScreen } from '@/components/game/EndScreen';
import { GameMode } from '@/types/game';
import { Toaster } from 'sonner';
import { useGameStorage } from '@/hooks/use-game-storage';

export default function GamePage() {
  const { savedState, saveGameState, clearGameState, hasSavedGame } = useGameStorage();
  
  const [gameMode, setGameMode] = useState<GameMode>('start');
  const [currentMode, setCurrentMode] = useState<'human-thinks' | 'ai-thinks'>('human-thinks');
  const [questionCount, setQuestionCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>();
  const [initialState, setInitialState] = useState<typeof savedState>(null);

  // Load saved state on mount
  useEffect(() => {
    if (savedState && hasSavedGame) {
      setInitialState(savedState);
    }
  }, [savedState, hasSavedGame]);

  const handleSelectMode = (mode: 'human-thinks' | 'ai-thinks') => {
    setCurrentMode(mode);
    setGameMode(mode);
    setQuestionCount(0);
    setIsWon(false);
    setCorrectAnswer(undefined);
    setInitialState(null);
    clearGameState();
  };

  const handleContinueGame = () => {
    if (initialState) {
      setGameMode(initialState.gameMode);
      setCurrentMode(initialState.currentMode);
      setQuestionCount(initialState.questionCount);
      setIsWon(initialState.isWon);
      setCorrectAnswer(initialState.correctAnswer);
    }
  };

  const handleGameEnd = (won: boolean, answer?: string, count?: number) => {
    setIsWon(won);
    setCorrectAnswer(answer);
    setQuestionCount(count || 0);
    setGameMode('end');
    clearGameState();
  };

  const handlePlayAgain = () => {
    setGameMode('start');
    setQuestionCount(0);
    setIsWon(false);
    setCorrectAnswer(undefined);
    setInitialState(null);
    clearGameState();
  };

  return (
    <>
      <Toaster position="top-center" />
      {gameMode === 'start' && (
        <StartScreen 
          onSelectMode={handleSelectMode}
          onContinueGame={hasSavedGame ? handleContinueGame : undefined}
          savedGameMode={initialState?.currentMode}
        />
      )}
      {gameMode === 'human-thinks' && (
        <HumanThinksMode 
          onGameEnd={handleGameEnd}
          onStateChange={saveGameState}
          initialState={initialState}
        />
      )}
      {gameMode === 'ai-thinks' && (
        <AIThinksMode 
          onGameEnd={handleGameEnd}
          onStateChange={saveGameState}
          initialState={initialState}
        />
      )}
      {gameMode === 'end' && (
        <EndScreen
          isWon={isWon}
          questionCount={questionCount}
          correctAnswer={correctAnswer}
          mode={currentMode}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
