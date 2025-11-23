import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionHistory } from '@/components/game/QuestionHistory';
import type { MultiplayerGame, MultiplayerQuestion } from '@/types/types';
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
  const [questions, setQuestions] = useState<MultiplayerQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [guess, setGuess] = useState('');
  const [showGuessInput, setShowGuessInput] = useState(false);
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
      // Update raw questions array
      setQuestions(prev => {
        const exists = prev.find(q => q.id === question.id);
        if (exists) {
          // Update existing question
          return prev.map(q => q.id === question.id ? question : q);
        } else {
          // Add new question
          return [...prev, question];
        }
      });

      // Update UI state
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
      const loadedQuestions = await getMultiplayerQuestions(game.id);
      setQuestions(loadedQuestions); // Store raw questions for is_guess checking
      
      const formattedHistory: QuestionAnswer[] = [];
      
      for (const q of loadedQuestions) {
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

      // Check if this is a formal guess (marked with is_guess flag)
      const currentQuestionData = questions.find(q => q.question_number === questionNumber);
      const isGuess = currentQuestionData?.is_guess || false;
      
      if (isGuess && answer === 'Yes') {
        // Questioner guessed correctly!
        await updateQuestionAnswer(game.id, questionNumber, answer);
        await endMultiplayerGame(game.id, true, game.current_questioner!);
        return;
      }

      // Update the answer
      await updateQuestionAnswer(game.id, questionNumber, answer);

      // Check if we've reached 20 questions
      if (questionNumber >= 20) {
        // Answerer wins if questioner couldn't guess in 20 questions
        await endMultiplayerGame(game.id, false, game.current_thinker);
      }
    } catch (error) {
      console.error('Error answering question:', error);
      toast.error('Failed to answer question');
    }
  };

  const handleMakeGuess = async () => {
    if (!guess.trim()) {
      toast.error('Please enter your guess');
      return;
    }

    setIsAnswering(true);
    try {
      const questionNumber = game.question_count + 1;
      const guessQuestion = `Is it ${guess.trim()}?`;
      
      // Add the guess as a question with is_guess flag set to true
      await addMultiplayerQuestion(game.id, questionNumber, guessQuestion, 'pending', true);
      
      setGuess('');
      setShowGuessInput(false);
    } catch (error) {
      console.error('Error making guess:', error);
      toast.error('Failed to make guess');
    } finally {
      setIsAnswering(false);
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
              {(() => {
                const currentQuestionData = questions.find(q => q.question_number === game.question_count + 1);
                return currentQuestionData?.is_guess && (
                  <div className="brutal-border bg-accent/20 p-3 mb-4 text-center">
                    <p className="text-sm font-black text-accent-foreground">
                      🎯 OPPONENT IS MAKING A GUESS!
                    </p>
                  </div>
                );
              })()}
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
            {!showGuessInput ? (
              <>
                <Input
                  type="text"
                  placeholder="Type your question..."
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  className="h-14 text-lg font-bold brutal-border"
                  disabled={isAnswering || game.question_count >= 20}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleAskQuestion}
                    disabled={!currentQuestion.trim() || isAnswering || game.question_count >= 20}
                    className="h-auto py-4 text-lg font-black brutal-border shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
                  >
                    {isAnswering ? 'ASKING...' : 'ASK QUESTION'}
                  </Button>
                  <Button
                    onClick={() => setShowGuessInput(true)}
                    disabled={isAnswering || game.question_count >= 20}
                    variant="outline"
                    className="h-auto py-4 text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    🎯 MAKE A GUESS
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="What do you think it is?"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMakeGuess()}
                  className="h-14 text-lg font-bold brutal-border"
                  disabled={isAnswering}
                  autoFocus
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleMakeGuess}
                    disabled={!guess.trim() || isAnswering}
                    className="h-auto py-4 text-lg font-black brutal-border shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
                  >
                    {isAnswering ? 'GUESSING...' : 'SUBMIT GUESS'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowGuessInput(false);
                      setGuess('');
                    }}
                    disabled={isAnswering}
                    variant="outline"
                    className="h-auto py-4 text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    CANCEL
                  </Button>
                </div>
              </>
            )}
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
