import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface EndScreenProps {
  isWon: boolean;
  questionCount: number;
  correctAnswer?: string;
  mode: 'human-thinks' | 'ai-thinks';
  onPlayAgain: () => void;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

export function EndScreen({
  isWon,
  questionCount,
  correctAnswer,
  mode,
  onPlayAgain,
}: EndScreenProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    if (isWon) {
      const colors = ['#FF006E', '#CCFF00', '#000000', '#FFFFFF'];
      const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);
    }
  }, [isWon]);

  const handleShare = async () => {
    const winner = mode === 'human-thinks' ? 'AI' : 'Human';
    const result = isWon
      ? `${winner} won in ${questionCount} questions!`
      : `${winner} couldn't guess it in 20 questions!`;

    const shareText = `GLITCHGUESS 🎮\n${result}\n${correctAnswer ? `The answer was: ${correctAnswer}` : ''}\n\nPlay now:`;
    const shareUrl = window.location.href.split('?')[0];

    const fullShareText = `${shareText} ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GLITCHGUESS',
          text: fullShareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullShareText);
        toast.success('Copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {isWon &&
        confetti.map((item) => (
          <div
            key={item.id}
            className="absolute w-3 h-3 xl:w-4 xl:h-4 animate-confetti"
            style={{
              left: `${item.left}%`,
              backgroundColor: item.color,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              top: '-10%',
            }}
          />
        ))}

      <div className="w-full max-w-2xl space-y-6 xl:space-y-8 relative z-10">
        <div className="brutal-border-thick bg-card p-8 xl:p-12 shadow-brutal-lg text-center space-y-4 xl:space-y-6">
          {isWon ? (
            <>
              <h2 className="text-4xl xl:text-6xl font-black text-accent animate-glitch max-sm:text-3xl">
                {mode === 'human-thinks' ? 'I GOT IT!' : 'YOU GOT IT!'}
              </h2>
              <p className="text-2xl xl:text-4xl font-black text-foreground max-sm:text-xl">
                IN {questionCount} QUESTION{questionCount !== 1 ? 'S' : ''}!
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl xl:text-6xl font-black text-secondary animate-glitch max-sm:text-3xl">
                {mode === 'human-thinks' ? 'I SURRENDER!' : 'GAME OVER!'}
              </h2>
              <p className="text-xl xl:text-2xl font-black text-muted-foreground max-sm:text-lg">
                {mode === 'human-thinks' ? 'WHAT WAS IT?' : "COULDN'T GUESS IT!"}
              </p>
            </>
          )}

          {correctAnswer && (
            <div className="brutal-border bg-background p-4 xl:p-6 mt-4">
              <p className="text-base xl:text-lg font-bold text-muted-foreground mb-2 max-sm:text-sm">
                THE ANSWER WAS:
              </p>
              <p className="text-2xl xl:text-4xl font-black text-foreground max-sm:text-xl">
                {correctAnswer.toUpperCase()}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 xl:space-y-4">
          <Button
            onClick={onPlayAgain}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-lg max-sm:py-5"
          >
            PLAY AGAIN
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full h-auto py-4 xl:py-6 text-lg xl:text-xl font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all max-sm:text-base max-sm:py-4"
          >
            <Share2 className="mr-2" />
            SHARE RESULT
          </Button>
        </div>
      </div>
    </div>
  );
}
