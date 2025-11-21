import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onSelectMode: (mode: 'human-thinks' | 'ai-thinks') => void;
}

export function StartScreen({ onSelectMode }: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-8 xl:space-y-12">
        <h1 className="text-5xl xl:text-8xl font-black text-center text-foreground animate-glitch max-sm:text-4xl">
          GLITCHGUESS
        </h1>

        <div className="space-y-4 xl:space-y-6">
          <Button
            onClick={() => onSelectMode('human-thinks')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-secondary text-secondary-foreground max-sm:text-lg max-sm:py-5"
          >
            I THINK OF SOMETHING – AI GUESSES
          </Button>

          <Button
            onClick={() => onSelectMode('ai-thinks')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-accent text-accent-foreground max-sm:text-lg max-sm:py-5"
          >
            AI THINKS OF SOMETHING – I GUESS
          </Button>
        </div>

        <div className="text-center">
          <p className="text-base xl:text-xl font-bold text-muted-foreground max-sm:text-sm">
            20 QUESTIONS. YES/NO ANSWERS. CAN YOU WIN?
          </p>
        </div>
      </div>
    </div>
  );
}
