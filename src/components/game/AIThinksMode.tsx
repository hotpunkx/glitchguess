import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionHistory } from './QuestionHistory';
import { Answer, QuestionAnswer } from '@/types/game';
import { generateSecretWord, answerQuestion } from '@/services/aiService';
import { Loader2 } from 'lucide-react';

interface AIThinksModeProps {
  onGameEnd: (isWon: boolean, correctAnswer: string, questionCount?: number) => void;
}

export function AIThinksMode({ onGameEnd }: AIThinksModeProps) {
  const [history, setHistory] = useState<QuestionAnswer[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [secretWord, setSecretWord] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    setIsLoading(true);
    try {
      const word = await generateSecretWord();
      setSecretWord(word);
    } catch (error) {
      console.error('Error generating secret word:', error);
      setSecretWord('Eiffel Tower');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim() || questionCount >= 20) return;

    setIsAnswering(true);
    try {
      const answer = await answerQuestion(secretWord, currentQuestion);
      const newHistory: QuestionAnswer = {
        question: currentQuestion,
        answer: answer as Answer,
        asker: 'human',
      };

      setHistory([...history, newHistory]);
      setQuestionCount(questionCount + 1);
      setCurrentQuestion('');
    } catch (error) {
      console.error('Error answering question:', error);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleMakeGuess = () => {
    if (!currentGuess.trim()) return;

    const isCorrect =
      currentGuess.toLowerCase().trim() === secretWord.toLowerCase().trim();

    if (isCorrect) {
      onGameEnd(true, secretWord, questionCount + 1);
    } else {
      const newHistory: QuestionAnswer = {
        question: `Is it ${currentGuess}?`,
        answer: 'No',
        asker: 'human',
      };
      setHistory([...history, newHistory]);
      setQuestionCount(questionCount + 1);
      setCurrentGuess('');

      if (questionCount + 1 >= 20) {
        onGameEnd(false, secretWord, questionCount + 1);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-2xl xl:text-3xl font-black text-foreground max-sm:text-xl">
            THINKING OF SOMETHING...
          </p>
        </div>
      </div>
    );
  }

  if (questionCount >= 20) {
    onGameEnd(false, secretWord, questionCount);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background gap-6 xl:gap-8 py-8">
      <div className="w-full max-w-2xl space-y-6 xl:space-y-8">
        <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-lime">
          <p className="text-xl xl:text-2xl font-black text-foreground mb-4 max-sm:text-lg">
            I'M THINKING OF SOMETHING...
          </p>
          <p className="text-base xl:text-lg font-bold text-muted-foreground max-sm:text-sm">
            Ask me yes/no questions or make a guess!
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 flex-col xl:flex-row">
            <Input
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Type your yes/no question..."
              disabled={isAnswering}
              className="flex-1 h-12 xl:h-14 text-base xl:text-lg font-bold brutal-border max-sm:h-10 max-sm:text-sm"
            />
            <Button
              onClick={handleAskQuestion}
              disabled={!currentQuestion.trim() || isAnswering}
              className="h-12 xl:h-14 px-6 xl:px-8 text-base xl:text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-primary text-primary-foreground max-sm:h-10 max-sm:text-sm"
            >
              {isAnswering ? <Loader2 className="animate-spin" /> : 'ASK'}
            </Button>
          </div>

          <div className="flex gap-2 flex-col xl:flex-row">
            <Input
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMakeGuess()}
              placeholder="Or make a guess..."
              disabled={isAnswering}
              className="flex-1 h-12 xl:h-14 text-base xl:text-lg font-bold brutal-border max-sm:h-10 max-sm:text-sm"
            />
            <Button
              onClick={handleMakeGuess}
              disabled={!currentGuess.trim() || isAnswering}
              className="h-12 xl:h-14 px-6 xl:px-8 text-base xl:text-lg font-black brutal-border shadow-brutal-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-secondary text-secondary-foreground max-sm:h-10 max-sm:text-sm"
            >
              GUESS
            </Button>
          </div>
        </div>
      </div>

      <QuestionHistory history={history} questionCount={questionCount} />
    </div>
  );
}
