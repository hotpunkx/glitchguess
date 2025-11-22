import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StartScreenProps {
  onSelectMode: (mode: 'human-thinks' | 'ai-thinks') => void;
}

export function StartScreen({ onSelectMode }: StartScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-8 xl:space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl xl:text-8xl font-black text-center text-foreground animate-glitch max-sm:text-4xl">
            GLITCHGUESS
          </h1>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/how-to-play')}
              className="h-auto py-3 px-6 xl:py-4 xl:px-8 text-sm xl:text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-card text-foreground max-sm:text-xs max-sm:py-2 max-sm:px-4"
            >
              ❓ HOW TO PLAY
            </Button>
          </div>
        </div>

        <div className="space-y-4 xl:space-y-6">
          <Button
            onClick={() => onSelectMode('human-thinks')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-secondary text-secondary-foreground max-sm:text-lg max-sm:py-5"
          >
            I THINK OF SOMETHING – AI GUESSES
          </Button>

          <Button
            onClick={() => onSelectMode('ai-thinks')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-lg max-sm:py-5"
          >
            AI THINKS OF SOMETHING – I GUESS
          </Button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-base xl:text-xl font-bold text-muted-foreground max-sm:text-sm">
            20 QUESTIONS. YES/NO ANSWERS. CAN YOU WIN?
          </p>
        </div>

        <div className="brutal-border bg-card p-4 xl:p-6 shadow-brutal">
          <h2 className="text-xl xl:text-2xl font-black text-foreground mb-3 max-sm:text-lg">
            ⚡ FAIR GAME CATEGORIES
          </h2>
          <p className="text-sm xl:text-base font-bold text-muted-foreground mb-4 max-sm:text-xs">
            For a fair game, choose something from these categories:
          </p>
          <div className="grid grid-cols-2 gap-2 xl:gap-3">
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🐾 Animals</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🍎 Food & Drinks</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🎬 Movies & TV Shows</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🎮 Video Games</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🏆 Sports & Athletes</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🌍 Countries & Cities</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🎵 Musicians & Bands</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">📚 Famous Books</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🚗 Vehicles</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🏛️ Famous Landmarks</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🎨 Famous Artists</span>
            </div>
            <div className="brutal-border bg-background p-2 xl:p-3">
              <span className="font-black text-secondary text-sm xl:text-base max-sm:text-xs">🔧 Common Objects</span>
            </div>
          </div>
          <p className="text-xs xl:text-sm font-bold text-accent-dark mt-4 max-sm:text-[10px]">
            💡 Tip: Avoid overly specific or obscure items that can't be guessed in 20 questions!
          </p>
        </div>
      </div>
    </div>
  );
}
