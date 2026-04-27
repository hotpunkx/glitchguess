import { useState, useEffect } from 'react';
import { StartScreen } from '@/components/game/StartScreen';
import { HumanThinksMode } from '@/components/game/HumanThinksMode';
import { AIThinksMode } from '@/components/game/AIThinksMode';
import { EndScreen } from '@/components/game/EndScreen';
import { GameMode } from '@/types/game';
import { Toaster } from 'sonner';
import { useGameStorage } from '@/hooks/use-game-storage';

export default function GamePage() {
  const { 
    savedState, 
    isLoading,
    createNewSession, 
    saveQuestion,
    endSession,
    clearGameState, 
    hasSavedGame 
  } = useGameStorage();
  
  const [gameMode, setGameMode] = useState<GameMode>('start');
  const [currentMode, setCurrentMode] = useState<'human-thinks' | 'ai-thinks'>('human-thinks');
  const [questionCount, setQuestionCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [category, setCategory] = useState('Animals');
  const [error, setError] = useState<string | null>(null);

  // Load saved state on mount
  useEffect(() => {
    if (savedState && hasSavedGame) {
      setSessionId(savedState.sessionId);
    }
  }, [savedState, hasSavedGame]);

  const handleSelectMode = async (mode: 'human-thinks' | 'ai-thinks', selectedCategory: string) => {
    setCurrentMode(mode);
    setCategory(selectedCategory);
    setGameMode(mode);
    setQuestionCount(0);
    setIsWon(false);
    setCorrectAnswer(undefined);
    clearGameState();
    
    // Create new session in database (secret word will be set later in AI mode)
    try {
      setError(null);
      const newSessionId = await createNewSession(mode);
      if (!newSessionId) throw new Error('No session ID returned');
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Failed to create session:', error);
      setError('Connection glitch! Please check your internet and try again.');
      setGameMode('start');
      toast.error('Failed to start game session. Please try again.');
    }
  };

  const handleContinueGame = () => {
    if (savedState) {
      setGameMode(savedState.gameMode);
      setCurrentMode(savedState.currentMode);
      setQuestionCount(savedState.questionCount);
      setIsWon(savedState.isWon);
      setCorrectAnswer(savedState.correctAnswer);
      setSessionId(savedState.sessionId);
    }
  };

  const handleGameEnd = async (won: boolean, answer?: string, count?: number) => {
    setIsWon(won);
    setCorrectAnswer(answer);
    const finalCount = count || 0;
    setQuestionCount(finalCount);
    setGameMode('end');
    
    // End session in database
    if (sessionId) {
      await endSession(sessionId, won, finalCount);
    }
  };

  const handlePlayAgain = () => {
    setGameMode('start');
    setQuestionCount(0);
    setIsWon(false);
    setCorrectAnswer(undefined);
    setSessionId(null);
    clearGameState();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl font-black">LOADING...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      {gameMode === 'start' && (
        <div className="relative">
          {error && (
            <div className="fixed top-20 left-4 right-4 z-50 neubrutal-border bg-accentPink text-white p-3 shadow-neubrutal animate-glitch text-center">
              <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}
          <StartScreen 
            onSelectMode={handleSelectMode}
            onContinueGame={hasSavedGame ? handleContinueGame : undefined}
            savedGameMode={savedState?.currentMode}
          />
        </div>
      )}
      {gameMode === 'human-thinks' && sessionId && (
        <HumanThinksMode 
          sessionId={sessionId}
          onGameEnd={handleGameEnd}
          onSaveQuestion={saveQuestion}
          onBack={handlePlayAgain}
          initialState={savedState}
        />
      )}
      {gameMode === 'ai-thinks' && sessionId && (
        <AIThinksMode 
          sessionId={sessionId}
          onGameEnd={handleGameEnd}
          onSaveQuestion={saveQuestion}
          onBack={handlePlayAgain}
          initialState={savedState}
        />
      )}
      {gameMode === 'end' && (
        <EndScreen
          isWon={isWon}
          questionCount={questionCount}
          correctAnswer={correctAnswer}
          mode={currentMode}
          category={category}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
