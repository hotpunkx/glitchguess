import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StartScreenProps {
  onSelectMode: (mode: 'human-thinks' | 'ai-thinks') => void;
  onContinueGame?: () => void;
  savedGameMode?: 'human-thinks' | 'ai-thinks';
}

export function StartScreen({ onSelectMode, onContinueGame, savedGameMode }: StartScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-8 xl:space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl xl:text-8xl font-black text-center text-foreground animate-glitch max-sm:text-4xl mt-16 xl:mt-20">
            GLITCHGUESS
          </h1>
          <div className="flex flex-col items-center gap-3">
            <a 
              href="https://www.producthunt.com/posts/glitchguess?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-glitchguess" 
              target="_blank" 
              rel="noopener noreferrer"
              className="brutal-border-thick shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-background p-2 inline-block"
            >
              <img 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1042024&theme=light&t=1764238514228" 
                alt="GLITCHGUESS - AI-powered 20 Questions game with multiplayer mode | Product Hunt" 
                style={{ width: '200px', height: '43px' }}
                width="200" 
                height="43"
                className="block"
              />
            </a>
            <Button
              onClick={() => navigate('/how-to-play')}
              className="h-auto py-3 px-6 xl:py-4 xl:px-8 text-sm xl:text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-card text-foreground max-sm:text-xs max-sm:py-2 max-sm:px-4"
            >
              ❓ HOW TO PLAY
            </Button>
          </div>
        </div>

        <div className="space-y-4 xl:space-y-6">
          {onContinueGame && (
            <Button
              onClick={onContinueGame}
              className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-sm max-sm:py-5"
            >
              ⚡ CONTINUE GAME
              {savedGameMode && (
                <span className="block text-sm xl:text-base font-bold mt-2 max-sm:text-xs">
                  ({savedGameMode === 'human-thinks' ? 'I Think Mode' : 'AI Thinks Mode'})
                </span>
              )}
            </Button>
          )}

          <Button
            onClick={() => onSelectMode('human-thinks')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-secondary text-secondary-foreground max-sm:text-sm max-sm:py-5"
          >
            I THINK OF SOMETHING – AI GUESSES
          </Button>

          <Button
            onClick={() => onSelectMode('ai-thinks')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-sm max-sm:py-5"
          >
            AI THINKS OF SOMETHING – I GUESS
          </Button>

          <Button
            onClick={() => navigate('/multiplayer/create')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-primary text-primary-foreground max-sm:text-sm max-sm:py-5"
          >
            👥 1v1 MULTIPLAYER
          </Button>

          <Button
            onClick={() => navigate('/multiplayer/lobby')}
            className="w-full h-auto py-4 xl:py-6 text-lg xl:text-2xl font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-card text-foreground max-sm:text-sm max-sm:py-4"
          >
            🌐 1v1 LOBBY
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
