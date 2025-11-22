import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionHistory } from './QuestionHistory';
import { Answer, QuestionAnswer } from '@/types/game';
import { generateSecretWord, answerQuestion } from '@/services/aiService';
import { Loader2, Flag } from 'lucide-react';
import { SavedGameState } from '@/hooks/use-game-storage';

interface AIThinksModeProps {
  onGameEnd: (isWon: boolean, correctAnswer: string, questionCount?: number) => void;
  onStateChange?: (state: Partial<SavedGameState>) => void;
  initialState?: SavedGameState | null;
}

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

// Normalize and clean user input
function normalizeGuess(input: string): string {
  let normalized = input.toLowerCase().trim();
  
  // Remove question formatting
  normalized = normalized.replace(/^is it\s+/i, '');
  normalized = normalized.replace(/^it is\s+/i, '');
  normalized = normalized.replace(/^it's\s+/i, '');
  normalized = normalized.replace(/\?+$/g, '');
  normalized = normalized.trim();
  
  return normalized;
}

// Check if guess matches with fuzzy matching
function isGuessCorrect(guess: string, answer: string): boolean {
  const normalizedGuess = normalizeGuess(guess);
  const normalizedAnswer = answer.toLowerCase().trim();
  
  // Exact match
  if (normalizedGuess === normalizedAnswer) {
    return true;
  }
  
  // Calculate similarity threshold based on length
  const maxLength = Math.max(normalizedGuess.length, normalizedAnswer.length);
  const distance = levenshteinDistance(normalizedGuess, normalizedAnswer);
  
  // Allow 1-2 character differences for shorter words, more for longer
  const threshold = maxLength <= 5 ? 1 : maxLength <= 10 ? 2 : 3;
  
  return distance <= threshold;
}

export function AIThinksMode({ onGameEnd, onStateChange, initialState }: AIThinksModeProps) {
  const [history, setHistory] = useState<QuestionAnswer[]>(initialState?.history || []);
  const [questionCount, setQuestionCount] = useState(initialState?.questionCount || 0);
  const [secretWord, setSecretWord] = useState(initialState?.secretWord || '');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [isLoading, setIsLoading] = useState(!initialState?.secretWord);
  const [isAnswering, setIsAnswering] = useState(false);

  // Save state whenever it changes
  useEffect(() => {
    if (onStateChange && secretWord) {
      onStateChange({
        gameMode: 'ai-thinks',
        currentMode: 'ai-thinks',
        questionCount,
        history,
        secretWord,
        isWon: false,
      });
    }
  }, [history, questionCount, secretWord, onStateChange]);

  useEffect(() => {
    if (!initialState?.secretWord) {
      initializeGame();
    }
  }, []);

  // Fallback words in case AI service fails
  const getRandomFallbackWord = () => {
    const fallbackWords = [
      'Pizza', 'Elephant', 'Titanic', 'Guitar', 'Basketball',
      'Paris', 'Beethoven', 'Smartphone', 'Ferrari', 'Statue of Liberty',
      'Harry Potter', 'Minecraft', 'Coca-Cola', 'Tiger', 'Sushi',
      'The Beatles', 'Mount Everest', 'Bicycle', 'Leonardo da Vinci', 'Coffee'
    ];
    return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  };

  const initializeGame = async () => {
    setIsLoading(true);
    try {
      const word = await generateSecretWord();
      // Validate that we got a proper response
      if (!word || word.trim().length === 0) {
        console.warn('Empty secret word received, using fallback');
        setSecretWord(getRandomFallbackWord());
      } else {
        setSecretWord(word);
      }
    } catch (error) {
      console.error('Error generating secret word:', error);
      setSecretWord(getRandomFallbackWord());
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim() || questionCount >= 20) return;

    // Check if the question contains the correct answer
    const isCorrect = isGuessCorrect(currentQuestion, secretWord);
    
    if (isCorrect) {
      // User guessed correctly in the question field
      onGameEnd(true, secretWord, questionCount + 1);
      return;
    }

    setIsAnswering(true);
    try {
      const answer = await answerQuestion(secretWord, currentQuestion);
      const newHistory: QuestionAnswer = {
        question: currentQuestion,
        answer: answer as Answer,
        asker: 'human',
      };

      const updatedHistory = [...history, newHistory];
      const updatedCount = questionCount + 1;
      
      setHistory(updatedHistory);
      setQuestionCount(updatedCount);
      setCurrentQuestion('');
    } catch (error) {
      console.error('Error answering question:', error);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleMakeGuess = () => {
    if (!currentGuess.trim()) return;

    const isCorrect = isGuessCorrect(currentGuess, secretWord);

    if (isCorrect) {
      onGameEnd(true, secretWord, questionCount + 1);
    } else {
      const normalizedGuess = normalizeGuess(currentGuess);
      const newHistory: QuestionAnswer = {
        question: `Is it ${normalizedGuess}?`,
        answer: 'No',
        asker: 'human',
      };
      const updatedHistory = [...history, newHistory];
      const updatedCount = questionCount + 1;
      
      setHistory(updatedHistory);
      setQuestionCount(updatedCount);
      setCurrentGuess('');

      if (updatedCount >= 20) {
        onGameEnd(false, secretWord, updatedCount);
      }
    }
  };

  const handleGiveUp = () => {
    onGameEnd(false, secretWord, questionCount);
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

          <Button
            onClick={handleGiveUp}
            variant="outline"
            className="w-full h-12 xl:h-14 text-base xl:text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all max-sm:h-10 max-sm:text-sm"
          >
            <Flag className="mr-2" size={20} />
            GIVE UP & SEE ANSWER
          </Button>
        </div>
      </div>

      <QuestionHistory history={history} questionCount={questionCount} />
    </div>
  );
}
