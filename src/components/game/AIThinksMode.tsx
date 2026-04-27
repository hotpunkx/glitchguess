import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { QuestionHistory } from './QuestionHistory';
import { Answer, QuestionAnswer } from '@/types/game';
import { generateSecretWord, answerQuestion } from '@/services/aiService';
import { Loader2, Flag, Send, Search, ArrowLeft } from 'lucide-react';
import { supabase } from '@/db/supabase';

interface AIThinksModeProps {
  sessionId: string;
  onGameEnd: (won: boolean, answer?: string, count?: number) => void;
  onSaveQuestion: (
    sessionId: string,
    questionNumber: number,
    questionText: string,
    answer: string
  ) => Promise<void>;
  onBack: () => void;
  initialState?: any;
}

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= len1; i++) matrix[i] = [i];
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[len1][len2];
}

function normalizeGuess(input: string): string {
  let normalized = input.toLowerCase().trim();
  normalized = normalized.replace(/^is it\s+/i, '').replace(/^it is\s+/i, '').replace(/^it's\s+/i, '').replace(/\?+$/g, '');
  return normalized.trim();
}

function isGuessCorrect(guess: string, answer: string): boolean {
  const normalizedGuess = normalizeGuess(guess);
  const normalizedAnswer = answer.toLowerCase().trim();
  if (normalizedGuess === normalizedAnswer) return true;
  const maxLength = Math.max(normalizedGuess.length, normalizedAnswer.length);
  const distance = levenshteinDistance(normalizedGuess, normalizedAnswer);
  const threshold = maxLength <= 5 ? 1 : maxLength <= 10 ? 2 : 3;
  return distance <= threshold;
}

export function AIThinksMode({
  sessionId,
  onGameEnd,
  onSaveQuestion,
  onBack,
  initialState,
}: AIThinksModeProps) {
  const [history, setHistory] = useState<QuestionAnswer[]>(initialState?.history || []);
  const [questionCount, setQuestionCount] = useState(initialState?.questionCount || 0);
  const [secretWord, setSecretWord] = useState(initialState?.secretWord || '');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [isLoading, setIsLoading] = useState(!initialState?.secretWord);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (!initialState?.secretWord) {
      initializeGame();
    }
  }, []);

  const initializeGame = async () => {
    setIsLoading(true);
    try {
      const word = await generateSecretWord();
      const finalWord = word && word.trim().length > 0 ? word : 'Pizza';
      setSecretWord(finalWord);
      await updateSecretWord(finalWord);
    } catch (error) {
      setSecretWord('Pizza');
      await updateSecretWord('Pizza');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSecretWord = async (word: string) => {
    try {
      await supabase.from('game_sessions').update({ secret_word: word }).eq('id', sessionId);
    } catch (error) {}
  };

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim() || questionCount >= 20 || isAnswering) return;
    if (isGuessCorrect(currentQuestion, secretWord)) {
      await onSaveQuestion(sessionId, questionCount + 1, currentQuestion, 'Yes');
      onGameEnd(true, secretWord, questionCount + 1);
      return;
    }

    setIsAnswering(true);
    try {
      const answer = await answerQuestion(secretWord, currentQuestion);
      const newHistory: QuestionAnswer = { question: currentQuestion, answer: answer as Answer, asker: 'human' };
      const updatedHistory = [...history, newHistory];
      const updatedCount = questionCount + 1;
      setHistory(updatedHistory);
      setQuestionCount(updatedCount);
      setCurrentQuestion('');
      await onSaveQuestion(sessionId, updatedCount, currentQuestion, answer);
    } catch (error) {
    } finally {
      setIsAnswering(false);
    }
  };

  const handleMakeGuess = async () => {
    if (!currentGuess.trim() || isAnswering) return;
    const isCorrect = isGuessCorrect(currentGuess, secretWord);
    const normalizedGuess = normalizeGuess(currentGuess);
    const guessQuestion = `Is it ${normalizedGuess}?`;

    if (isCorrect) {
      await onSaveQuestion(sessionId, questionCount + 1, guessQuestion, 'Yes');
      onGameEnd(true, secretWord, questionCount + 1);
    } else {
      const newHistory: QuestionAnswer = { question: guessQuestion, answer: 'No', asker: 'human' };
      const updatedHistory = [...history, newHistory];
      const updatedCount = questionCount + 1;
      setHistory(updatedHistory);
      setQuestionCount(updatedCount);
      setCurrentGuess('');
      await onSaveQuestion(sessionId, updatedCount, guessQuestion, 'No');
      if (updatedCount >= 20) onGameEnd(false, secretWord, updatedCount);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-background text-foreground">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-accentPink" size={64} />
            <div className="absolute inset-0 blur-md opacity-30 bg-accentPink rounded-full animate-pulse text-6xl"></div>
          </div>
          <p className="text-3xl font-black uppercase tracking-tighter italic glitch-text animate-pulse">
            TRANSMITTING SECRET...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen flex flex-col items-center justify-between p-4 bg-background overflow-hidden pb-8">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Header & Progress Display */}
        <div className="flex justify-between items-end shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="neubrutal-border bg-white dark:bg-darkBg text-black dark:text-white p-1 shadow-neubrutal active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              title="Back to menu"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="neubrutal-border bg-accentPink px-2 py-0.5 shadow-neubrutal">
              <span className="text-[10px] font-black text-black uppercase tracking-widest">Q {questionCount + 1}/20</span>
            </div>
          </div>
          <div className="text-[8px] font-black uppercase text-accentGreen italic">
            SIGNAL: SECURE
          </div>
        </div>

        <div className="neubrutal-border bg-white text-black p-6 shadow-neubrutal-blue relative overflow-hidden shrink-0 min-h-[100px] flex flex-col items-center justify-center">
          <div className="absolute top-1 left-2 text-[8px] font-black opacity-20 uppercase">Core Data</div>
          <p className="text-xl font-black uppercase leading-tight tracking-tighter text-center">
            I'm thinking of something...
          </p>
          <p className="text-[10px] font-bold text-center opacity-70 uppercase mt-1">
            Crack my firewall in 20 moves.
          </p>
        </div>

        <div className="space-y-3 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="PROBE..."
                disabled={isAnswering}
                className="h-12 text-sm font-black neubrutal-border shadow-neubrutal placeholder:opacity-30 uppercase pr-10 focus-visible:ring-brand"
              />
              <Send className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20" size={16} />
            </div>
            <button
              onClick={handleAskQuestion}
              disabled={!currentQuestion.trim() || isAnswering}
              className="h-12 px-5 bg-brand text-white neubrutal-border shadow-neubrutal hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 font-black text-sm uppercase"
            >
              {isAnswering ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'ASK'}
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMakeGuess()}
                placeholder="GUESS..."
                disabled={isAnswering}
                className="h-12 text-sm font-black neubrutal-border shadow-neubrutal-pink placeholder:opacity-30 uppercase pr-10 focus-visible:ring-accentPink"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20" size={16} />
            </div>
            <button
              onClick={handleMakeGuess}
              disabled={!currentGuess.trim() || isAnswering}
              className="h-12 px-5 bg-accentPink text-black neubrutal-border shadow-neubrutal hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 font-black text-sm uppercase"
            >
              GUESS
            </button>
          </div>

          <button
            onClick={() => onGameEnd(false, secretWord, questionCount)}
            className="w-full text-[10px] font-black text-white hover:underline uppercase tracking-widest opacity-40 flex items-center justify-center gap-2"
          >
            <Flag size={10} /> I SURRENDER
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl flex-1 mt-4 overflow-hidden">
        <QuestionHistory history={history} questionCount={questionCount} />
      </div>
    </div>
  );
}
