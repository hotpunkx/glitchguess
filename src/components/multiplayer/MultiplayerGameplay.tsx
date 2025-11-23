import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionHistory } from '@/components/game/QuestionHistory';
import type { MultiplayerGame } from '@/types/types';
import type { Answer, QuestionAnswer } from '@/types/game';
import {
  addMultiplayerQuestion,
  getMultiplayerQuestions,
  updateSecretWord,
  endMultiplayerGame,
  subscribeToQuestions,
  updateQuestionAnswer,
} from '@/db/multiplayerApi';
import { generateAIQuestion } from '@/services/aiService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

interface MultiplayerGameplayProps {
  game: MultiplayerGame;
  playerNumber: 'player1' | 'player2';
}

export default function MultiplayerGameplay({ game, playerNumber }: MultiplayerGameplayProps) {
  const [history, setHistory] = useState<QuestionAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [secretWord, setSecretWord] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  // Determine roles based on who is the questioner
  const isQuestioner = game.current_questioner === playerNumber;
  const isAnswerer = !isQuestioner;

  useEffect(() => {
    loadQuestions();
    
    // Subscribe to new questions
    const unsubscribe = subscribeToQuestions(game.id, (question) => {
      if (question.answer === 'pending') {
        setPendingQuestion(question.question_text);
      } else {
        const newQ: QuestionAnswer = {
          question: question.question_text,
          answer: question.answer as Answer,
          asker: isQuestioner ? 'human' : 'ai',
        };
        setHistory(prev => [...prev, newQ]);
        setPendingQuestion(null);
      }
    });

    return unsubscribe;
  }, [game.id]);

  useEffect(() => {
    // If thinker and no secret word set, show input
    if (isAnswerer && !game.secret_word) {
      setShowSecretInput(true);
    }

    // If guesser and thinker has set word, start asking
    if (isQuestioner && game.secret_word && history.length === 0) {
      askNextQuestion();
    }
  }, [game.secret_word, isAnswerer, isQuestioner]);

  const loadQuestions = async () => {
    try {
      const questions = await getMultiplayerQuestions(game.id);
      const formattedHistory: QuestionAnswer[] = [];
      
      for (const q of questions) {
        if (q.answer === 'pending') {
          setPendingQuestion(q.question_text);
        } else {
          formattedHistory.push({
            question: q.question_text,
            answer: q.answer as Answer,
            asker: isQuestioner ? 'human' : 'ai',
          });
        }
      }
      
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleSetSecretWord = async () => {
    if (!secretWord.trim()) {
      toast.error('Please enter a word');
      return;
    }

    try {
      await updateSecretWord(game.id, secretWord.trim(), playerNumber);
      setShowSecretInput(false);
      toast.success('Secret word set! Waiting for opponent to guess...');
    } catch (error) {
      console.error('Error setting secret word:', error);
      toast.error('Failed to set secret word');
    }
  };

  const askNextQuestion = async () => {
    if (game.question_count >= 20) {
      await endMultiplayerGame(game.id, false);
      return;
    }

    setIsLoading(true);
    try {
      const question = await generateAIQuestion(history);
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error generating question:', error);
      setCurrentQuestion('Is it something you can hold in your hand?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim() || game.question_count >= 20) return;

    setIsAnswering(true);
    try {
      // Save question (thinker will see it and answer)
      await addMultiplayerQuestion(
        game.id,
        game.question_count + 1,
        currentQuestion,
        'pending'
      );
      
      setCurrentQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('Failed to ask question');
    } finally {
      setIsAnswering(false);
    }
  };

  const handleAnswer = async (answer: Answer) => {
    if (!game.secret_word || !pendingQuestion) return;

    try {
      const questionNumber = game.question_count + 1;

      // Check if it's a final guess
      const isFinalGuess = pendingQuestion.toLowerCase().includes('is it');
      
      if (isFinalGuess && answer === 'Yes') {
        await updateQuestionAnswer(game.id, questionNumber, answer);
        await endMultiplayerGame(game.id, true);
        return;
      }

      await updateQuestionAnswer(game.id, questionNumber, answer);

      if (questionNumber >= 20) {
        await endMultiplayerGame(game.id, false);
      }
    } catch (error) {
      console.error('Error answering question:', error);
      toast.error('Failed to answer question');
    }
  };

  // Thinker waiting to set secret word
  if (isAnswerer && showSecretInput) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-pink space-y-4">
            <h2 className="text-3xl xl:text-5xl font-black text-center text-foreground">
              🤔 YOU'RE THE THINKER!
            </h2>
            <p className="text-lg font-bold text-center text-muted-foreground">
              Think of something and enter it below. Your opponent will try to guess it!
            </p>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase">Your Secret Word</label>
              <Input
                type="text"
                placeholder="Enter your secret word..."
                value={secretWord}
                onChange={(e) => setSecretWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetSecretWord()}
                maxLength={50}
                className="h-14 text-lg font-bold brutal-border"
              />
            </div>

            <Button
              onClick={handleSetSecretWord}
              disabled={!secretWord.trim()}
              className="w-full h-auto py-6 text-xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
            >
              SET SECRET WORD
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Thinker waiting for guesser
  if (isAnswerer && !showSecretInput) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background gap-6">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <div className="brutal-border bg-card p-4 flex justify-between items-center">
            <span className="font-black text-lg">
              Question {game.question_count} / 20
            </span>
            <span className="font-black text-lg">
              Secret: {game.secret_word}
            </span>
          </div>

          {pendingQuestion ? (
            <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-pink">
              <p className="text-xl xl:text-3xl font-black text-foreground leading-relaxed mb-6">
                {pendingQuestion}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleAnswer('Yes')}
                  className="h-auto py-4 text-lg font-black brutal-border shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
                >
                  YES
                </Button>
                <Button
                  onClick={() => handleAnswer('No')}
                  className="h-auto py-4 text-lg font-black brutal-border shadow-brutal-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-secondary text-secondary-foreground"
                >
                  NO
                </Button>
                <Button
                  onClick={() => handleAnswer('Sometimes')}
                  className="h-auto py-4 text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-muted text-foreground"
                >
                  SOMETIMES
                </Button>
              </div>
            </div>
          ) : (
            <div className="brutal-border-thick bg-card p-6 text-center">
              <Loader2 className="animate-spin mx-auto mb-4" size={32} />
              <p className="text-xl font-black">
                Waiting for opponent to ask a question...
              </p>
            </div>
          )}

          {history.length > 0 && (
            <QuestionHistory history={history} questionCount={game.question_count} />
          )}
        </div>
      </div>
    );
  }

  // Guesser view
  if (isQuestioner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background gap-6">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <div className="brutal-border bg-card p-4 flex justify-between items-center">
            <span className="font-black text-lg">
              Question {game.question_count} / 20
            </span>
            <span className="font-black text-lg">
              🤔 Opponent is thinking...
            </span>
          </div>

          {isLoading ? (
            <div className="brutal-border-thick bg-card p-6 flex items-center justify-center gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-xl font-black">THINKING...</p>
            </div>
          ) : (
            <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-pink">
              <p className="text-xl xl:text-3xl font-black text-foreground leading-relaxed mb-6">
                {currentQuestion}
              </p>
              <p className="text-sm text-muted-foreground font-bold text-center">
                Waiting for opponent to answer...
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Type your question..."
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              className="h-14 text-lg font-bold brutal-border"
              disabled={isAnswering || game.question_count >= 20}
            />
            <Button
              onClick={handleAskQuestion}
              disabled={!currentQuestion.trim() || isAnswering || game.question_count >= 20}
              className="w-full h-auto py-4 text-lg font-black brutal-border shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
            >
              {isAnswering ? 'ASKING...' : 'ASK QUESTION'}
            </Button>
          </div>

          {history.length > 0 && (
            <QuestionHistory history={history} questionCount={game.question_count} />
          )}
        </div>
      </div>
    );
  }

  return null;
}
