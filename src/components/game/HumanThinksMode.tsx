import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QuestionHistory } from './QuestionHistory';
import { Answer, QuestionAnswer } from '@/types/game';
import { generateAIQuestion, generateAIGuess } from '@/services/aiService';
import { Loader2 } from 'lucide-react';
import { SavedGameState } from '@/hooks/use-game-storage';

interface HumanThinksModeProps {
  sessionId: string;
  onGameEnd: (isWon: boolean, correctAnswer?: string, questionCount?: number) => void;
  onSaveQuestion: (sessionId: string, questionNumber: number, questionText: string, answer: string) => Promise<void>;
  initialState?: SavedGameState | null;
}

export function HumanThinksMode({ sessionId, onGameEnd, onSaveQuestion, initialState }: HumanThinksModeProps) {
  const [history, setHistory] = useState<QuestionAnswer[]>(initialState?.history || []);
  const [questionCount, setQuestionCount] = useState(initialState?.questionCount || 0);
  const [currentQuestion, setCurrentQuestion] = useState(initialState?.currentQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstruction, setShowInstruction] = useState(initialState?.showInstruction ?? true);

  useEffect(() => {
    if (!showInstruction && questionCount === 0 && !currentQuestion) {
      askNextQuestion();
    }
  }, [showInstruction]);

  const askNextQuestion = async () => {
    if (questionCount >= 20) {
      onGameEnd(false, undefined, questionCount);
      return;
    }

    setIsLoading(true);
    try {
      if (questionCount > 0 && questionCount % 5 === 0 && Math.random() > 0.5) {
        const guess = await generateAIGuess(history);
        setCurrentQuestion(guess);
      } else {
        const question = await generateAIQuestion(history);
        setCurrentQuestion(question);
      }
    } catch (error) {
      console.error('Error generating question:', error);
      setCurrentQuestion('Is it something you can hold in your hand?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: Answer) => {
    const newHistory: QuestionAnswer = {
      question: currentQuestion,
      answer,
      asker: 'ai',
    };

    const updatedHistory = [...history, newHistory];
    const updatedCount = questionCount + 1;
    
    setHistory(updatedHistory);
    setQuestionCount(updatedCount);

    // Save question to database
    await onSaveQuestion(sessionId, updatedCount, currentQuestion, answer);

    // Check if this is a final guess (not a regular question)
    const isFinalGuess = currentQuestion.toLowerCase().includes('my final guess:');
    
    if (isFinalGuess && answer === 'Yes') {
      // Extract the guessed answer from "My final guess: X" format
      const guessedAnswer = currentQuestion.replace(/^.*my final guess:\s*/i, '').replace(/\?$/, '').trim();
      onGameEnd(true, guessedAnswer, updatedCount);
      return;
    }

    if (updatedCount >= 20) {
      onGameEnd(false, undefined, updatedCount);
      return;
    }

    await askNextQuestion();
  };

  if (showInstruction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-2xl space-y-6 xl:space-y-8">
          <h2 className="text-3xl xl:text-5xl font-black text-center text-foreground max-sm:text-2xl">
            GET READY!
          </h2>

          <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-pink space-y-4">
            <p className="text-lg xl:text-2xl font-bold text-foreground leading-relaxed max-sm:text-base">
              Perfect! Think of something from the <span className="text-secondary">fair game categories</span> shown on the home screen. Don't tell me what it is. I'll ask up to 20 yes/no questions.
            </p>
            <p className="text-sm xl:text-base font-bold text-accent-dark max-sm:text-xs">
              💡 Remember: Choose from Animals, Food & Drinks, Movies & TV Shows, Video Games, Sports & Athletes, Countries & Cities, Musicians & Bands, Famous Books, Vehicles, Famous Landmarks, Famous Artists, or Common Objects!
            </p>
          </div>

          <Button
            onClick={() => setShowInstruction(false)}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-2xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-lg max-sm:py-5"
          >
            I'M READY!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background gap-6 xl:gap-8">
      <div className="w-full max-w-2xl space-y-6 xl:space-y-8">
        <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-pink">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-xl xl:text-2xl font-black text-foreground max-sm:text-lg">
                THINKING...
              </p>
            </div>
          ) : (
            <p className="text-xl xl:text-3xl font-black text-foreground leading-relaxed max-sm:text-lg">
              {currentQuestion}
            </p>
          )}
        </div>

        {!isLoading && (
          <div className="grid grid-cols-3 gap-3 xl:gap-4">
            <Button
              onClick={() => handleAnswer('Yes')}
              className="h-auto py-4 xl:py-6 text-lg xl:text-xl font-black brutal-border shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-base max-sm:py-3"
            >
              YES
            </Button>
            <Button
              onClick={() => handleAnswer('No')}
              className="h-auto py-4 xl:py-6 text-lg xl:text-xl font-black brutal-border shadow-brutal-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-secondary text-secondary-foreground max-sm:text-base max-sm:py-3"
            >
              NO
            </Button>
            <Button
              onClick={() => handleAnswer('Sometimes')}
              className="h-auto py-4 xl:py-6 text-lg xl:text-xl font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-muted text-foreground max-sm:text-base max-sm:py-3"
            >
              SOMETIMES
            </Button>
          </div>
        )}
      </div>

      <QuestionHistory history={history} questionCount={questionCount} />
    </div>
  );
}
