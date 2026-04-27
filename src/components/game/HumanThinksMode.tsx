import { useState, useEffect, useRef } from 'react';
import { QuestionHistory } from './QuestionHistory';
import { Answer, QuestionAnswer } from '@/types/game';
import { generateAIQuestion, generateAIGuess } from '@/services/aiService';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface HumanThinksModeProps {
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

export function HumanThinksMode({
  sessionId,
  onGameEnd,
  onSaveQuestion,
  onBack,
  initialState,
}: HumanThinksModeProps) {
  const [history, setHistory] = useState<QuestionAnswer[]>(initialState?.history || []);
  const [questionCount, setQuestionCount] = useState(initialState?.questionCount || 0);
  const [currentQuestion, setCurrentQuestion] = useState(initialState?.currentQuestion || '');
  const [thinkingSnippet, setThinkingSnippet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstruction, setShowInstruction] = useState(initialState?.showInstruction ?? true);
  
  const isAskingRef = useRef(false);

  useEffect(() => {
    if (!showInstruction && !currentQuestion && !isLoading) {
      askNextQuestion();
    }
  }, [showInstruction]);

  const parseAIResponse = (response: string) => {
    const thinkingMatch = response.match(/Thinking:\s*(.*(?:\n(?!Question:|My final guess:).*)*)/i);
    const questionMatch = response.match(/Question:\s*(.*)/i);
    const guessMatch = response.match(/My final guess:\s*(.*)/i);

    return {
      thinking: thinkingMatch ? thinkingMatch[1].trim() : '',
      question: questionMatch ? questionMatch[1].trim() : (guessMatch ? `My final guess: ${guessMatch[1].trim()}` : response.trim())
    };
  };

  const askNextQuestion = async () => {
    if (isAskingRef.current) return;
    if (questionCount >= 20) {
      onGameEnd(false, undefined, questionCount);
      return;
    }

    isAskingRef.current = true;
    setIsLoading(true);
    setThinkingSnippet('');
    try {
      let rawResponse = '';
      if (questionCount > 0 && questionCount % 5 === 0 && Math.random() > 0.4) {
        rawResponse = await generateAIGuess(history);
      } else {
        rawResponse = await generateAIQuestion(history);
      }

      const { thinking, question } = parseAIResponse(rawResponse);
      setThinkingSnippet(thinking);
      setCurrentQuestion(question);
    } catch (error) {
      toast.error('AI service error. Using fallback question.');
      setCurrentQuestion('Is it something you can hold in your hand?');
    } finally {
      setIsLoading(false);
      isAskingRef.current = false;
    }
  };

  const handleAnswer = async (answer: Answer) => {
    if (isLoading) return;

    const newHistory: QuestionAnswer = {
      question: currentQuestion,
      answer,
      asker: 'ai',
    };

    const updatedHistory = [...history, newHistory];
    const updatedCount = questionCount + 1;
    
    setHistory(updatedHistory);
    setQuestionCount(updatedCount);

    await onSaveQuestion(sessionId, updatedCount, currentQuestion, answer);

    // Check if this is a final guess
    const isFinalGuess = currentQuestion.toLowerCase().includes('my final guess:');
    
    if (isFinalGuess && answer === 'Yes') {
      const guessedAnswer = currentQuestion.replace(/^.*my final guess:\s*/i, '').replace(/\?$/, '').trim();
      onGameEnd(true, guessedAnswer, updatedCount);
      return;
    }

    if (updatedCount >= 20) {
      onGameEnd(false, undefined, updatedCount);
      return;
    }

    setCurrentQuestion('');
    await askNextQuestion();
  };

  if (showInstruction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-background text-foreground">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="inline-block px-4 py-2 neubrutal-border bg-accentGreen mb-4 rotate-[-2deg] shadow-neubrutal">
            <span className="text-xs font-bold uppercase tracking-widest text-black">Human Thinks Mode</span>
          </div>
          <h2 className="text-6xl font-black italic uppercase glitch-text leading-none mb-2">
            GET <br /> READY!
          </h2>

          <div className="neubrutal-border bg-white text-black p-8 shadow-neubrutal-pink space-y-4 text-left">
            <p className="text-2xl font-black uppercase leading-tight">
              Think of something from the fair game categories.
            </p>
            <p className="text-sm font-bold opacity-70 uppercase">
              I'll ask up to 20 questions to crack it. Don't blink.
            </p>
          </div>

          <button
            onClick={() => setShowInstruction(false)}
            className="w-full py-6 bg-brand text-white neubrutal-border shadow-neubrutal-green font-black text-2xl uppercase tracking-tighter hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
          >
            I'M READY
          </button>
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
            <div className="neubrutal-border bg-brand px-2 py-0.5 shadow-neubrutal">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Q {questionCount + 1}/20</span>
            </div>
          </div>
          {thinkingSnippet && !isLoading && (
            <div className="text-accentGreen text-[8px] font-black uppercase italic animate-pulse max-w-[150px] truncate">
              AI: {thinkingSnippet}
            </div>
          )}
        </div>

        <div className="neubrutal-border bg-white text-black p-6 shadow-neubrutal-pink min-h-[140px] flex items-center justify-center relative overflow-hidden shrink-0">
          {isLoading || !currentQuestion ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="animate-spin text-brand" size={32} />
              <p className="text-xl font-black uppercase tracking-tighter italic glitch-text">
                Deducing...
              </p>
            </div>
          ) : (
            <p className="text-2xl font-black uppercase leading-tight tracking-tighter text-center">
              {currentQuestion}
            </p>
          )}
        </div>

        {!isLoading && currentQuestion && (
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <button
              onClick={() => handleAnswer('Yes')}
              className="py-4 bg-accentGreen text-black neubrutal-border shadow-neubrutal hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 font-black text-xl uppercase"
            >
              YES
            </button>
            <button
              onClick={() => handleAnswer('No')}
              className="py-4 bg-accentPink text-black neubrutal-border shadow-neubrutal hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 font-black text-xl uppercase"
            >
              NO
            </button>
            <button
              onClick={() => handleAnswer('Sometimes')}
              className="py-4 bg-white text-black neubrutal-border shadow-neubrutal hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 font-black text-xs uppercase"
            >
              MAYBE
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl flex-1 mt-4 overflow-hidden">
        <QuestionHistory history={history} questionCount={questionCount} />
      </div>
    </div>
  );
}
