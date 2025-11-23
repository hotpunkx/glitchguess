import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MultiplayerGame } from '@/types/types';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

interface MultiplayerEndScreenProps {
  game: MultiplayerGame;
  playerNumber: 'player1' | 'player2';
  onRequestRematch: () => void;
  onBackToHome: () => void;
}

interface Confetti {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
}

export default function MultiplayerEndScreen({
  game,
  playerNumber,
  onRequestRematch,
  onBackToHome,
}: MultiplayerEndScreenProps) {
  const isThinker = game.current_thinker === playerNumber;
  const isGuesser = !isThinker;
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  
  const playerRematchRequested = playerNumber === 'player1' 
    ? game.player1_rematch 
    : game.player2_rematch;
  
  const opponentRematchRequested = playerNumber === 'player1'
    ? game.player2_rematch
    : game.player1_rematch;

  const bothWantRematch = game.player1_rematch && game.player2_rematch;

  // Show confetti if guesser won
  useEffect(() => {
    if (game.is_won && isGuesser) {
      const colors = ['#FF006E', '#CCFF00', '#000000', '#FFFFFF'];
      const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
      }));
      setConfetti(newConfetti);
    }
  }, [game.is_won, isGuesser]);

  const getResultMessage = () => {
    if (game.is_won) {
      return isGuesser 
        ? `🎉 YOU WON IN ${game.question_count} QUESTIONS!`
        : `😔 OPPONENT GUESSED IT IN ${game.question_count} QUESTIONS!`;
    } else {
      return isThinker
        ? `🎉 YOU WIN! THEY COULDN'T GUESS IT!`
        : `😔 YOU COULDN'T GUESS IT IN 20 QUESTIONS!`;
    }
  };

  const getPlayerName = (player: 'player1' | 'player2') => {
    return player === 'player1' ? game.player1_name : game.player2_name;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-2xl space-y-6">
        <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-5xl font-black text-center">
              {getResultMessage()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="brutal-border bg-muted p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm font-black uppercase text-muted-foreground mb-2">
                  The Secret Word Was:
                </p>
                <p className="text-4xl font-black text-foreground">
                  {game.secret_word}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-foreground">
                <div className="text-center">
                  <p className="text-sm font-black uppercase text-muted-foreground">
                    Thinker
                  </p>
                  <p className="text-xl font-black">
                    {getPlayerName(game.current_thinker)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase text-muted-foreground">
                    Guesser
                  </p>
                  <p className="text-xl font-black">
                    {getPlayerName(game.current_thinker === 'player1' ? 'player2' : 'player1')}
                  </p>
                </div>
              </div>

              <div className="text-center pt-4 border-t-2 border-foreground">
                <p className="text-sm font-black uppercase text-muted-foreground">
                  Questions Asked
                </p>
                <p className="text-3xl font-black">
                  {game.question_count} / 20
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {bothWantRematch ? (
                <div className="brutal-border bg-accent p-4 text-center">
                  <p className="text-xl font-black text-accent-foreground">
                    🔄 STARTING REMATCH...
                  </p>
                  <p className="text-sm font-bold text-accent-foreground/80 mt-2">
                    Roles will be switched!
                  </p>
                </div>
              ) : playerRematchRequested ? (
                <div className="brutal-border bg-muted p-4 text-center">
                  <p className="text-lg font-black">
                    ⏳ WAITING FOR OPPONENT...
                  </p>
                  <p className="text-sm font-bold text-muted-foreground mt-2">
                    You requested a rematch
                  </p>
                </div>
              ) : opponentRematchRequested ? (
                <div className="brutal-border bg-secondary p-4 text-center">
                  <p className="text-lg font-black text-secondary-foreground">
                    🔔 OPPONENT WANTS A REMATCH!
                  </p>
                  <Button
                    onClick={onRequestRematch}
                    className="w-full mt-3 h-auto py-4 text-lg font-black brutal-border shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
                  >
                    ACCEPT REMATCH
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={onRequestRematch}
                  className="w-full h-auto py-6 text-xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
                >
                  🔄 REQUEST REMATCH
                </Button>
              )}

              <Button
                onClick={onBackToHome}
                variant="outline"
                className="w-full h-auto py-4 text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                BACK TO HOME
              </Button>
            </div>

            {!bothWantRematch && (
              <div className="brutal-border bg-card p-4">
                <p className="text-sm font-bold text-center text-muted-foreground">
                  💡 In a rematch, roles will be switched!<br />
                  {isThinker ? "You'll be the guesser" : "You'll be the thinker"} next time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {confetti.map((item) => (
        <div
          key={item.id}
          className="absolute w-3 h-3 xl:w-4 xl:h-4 animate-confetti"
          style={{
            left: `${item.left}%`,
            backgroundColor: item.color,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
