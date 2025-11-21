import { useState } from 'react';
import { StartScreen } from '@/components/game/StartScreen';
import { HumanThinksMode } from '@/components/game/HumanThinksMode';
import { AIThinksMode } from '@/components/game/AIThinksMode';
import { EndScreen } from '@/components/game/EndScreen';
import { GameMode } from '@/types/game';
import { Toaster } from 'sonner';

export default function GamePage() {
  const [gameMode, setGameMode] = useState<GameMode>('start');
  const [currentMode, setCurrentMode] = useState<'human-thinks' | 'ai-thinks'>('human-thinks');
  const [questionCount, setQuestionCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>();

  const handleSelectMode = (mode: 'human-thinks' | 'ai-thinks') => {
    setCurrentMode(mode);
    setGameMode(mode);
    setQuestionCount(0);
    setIsWon(false);
    setCorrectAnswer(undefined);
  };

  const handleGameEnd = (won: boolean, answer?: string, count?: number) => {
    setIsWon(won);
    setCorrectAnswer(answer);
    setQuestionCount(count || 0);
    setGameMode('end');
  };

  const handlePlayAgain = () => {
    setGameMode('start');
    setQuestionCount(0);
    setIsWon(false);
    setCorrectAnswer(undefined);
  };

  return (
    <>
      <Toaster position="top-center" />
      {gameMode === 'start' && <StartScreen onSelectMode={handleSelectMode} />}
      {gameMode === 'human-thinks' && <HumanThinksMode onGameEnd={handleGameEnd} />}
      {gameMode === 'ai-thinks' && <AIThinksMode onGameEnd={handleGameEnd} />}
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
