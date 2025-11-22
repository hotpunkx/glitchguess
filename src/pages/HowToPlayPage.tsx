import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function HowToPlayPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background py-12">
      <div className="w-full max-w-4xl space-y-6 xl:space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl xl:text-7xl font-black text-foreground animate-glitch max-sm:text-3xl">
            HOW TO PLAY
          </h1>
          <p className="text-lg xl:text-2xl font-bold text-secondary max-sm:text-base">
            Master the art of GLITCHGUESS in 2 minutes!
          </p>
        </div>

        <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-pink space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl xl:text-4xl font-black text-foreground max-sm:text-xl">
              🎯 THE BASICS
            </h2>
            <div className="brutal-border bg-background p-4 xl:p-6 space-y-3">
              <p className="text-base xl:text-xl font-bold text-foreground leading-relaxed max-sm:text-sm">
                GLITCHGUESS is a modern twist on the classic 20 Questions game. You play against an AI opponent in a battle of wits and deduction!
              </p>
              <p className="text-sm xl:text-lg font-bold text-accent-dark max-sm:text-xs">
                ⚡ 20 questions maximum • Yes/No/Sometimes answers • Two game modes
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xl:text-4xl font-black text-secondary max-sm:text-xl">
              🧠 MODE 1: I THINK – AI GUESSES
            </h2>
            <div className="brutal-border bg-background p-4 xl:p-6 space-y-3">
              <div className="space-y-2">
                <p className="text-base xl:text-lg font-black text-foreground max-sm:text-sm">
                  STEP 1: Think of Something
                </p>
                <p className="text-sm xl:text-base font-bold text-muted-foreground pl-4 max-sm:text-xs">
                  Choose any object, person, animal, movie, or place from the fair game categories. Keep it secret!
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-base xl:text-lg font-black text-foreground max-sm:text-sm">
                  STEP 2: Answer AI's Questions
                </p>
                <p className="text-sm xl:text-base font-bold text-muted-foreground pl-4 max-sm:text-xs">
                  The AI will ask up to 20 yes/no questions. Answer honestly with Yes, No, or Sometimes.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-base xl:text-lg font-black text-foreground max-sm:text-sm">
                  STEP 3: AI Makes Final Guess
                </p>
                <p className="text-sm xl:text-base font-bold text-muted-foreground pl-4 max-sm:text-xs">
                  When the AI says "My final guess: [thing]", confirm if it's correct. If the AI guesses right, it wins! If it reaches 20 questions without guessing, you win!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xl:text-4xl font-black text-accent max-sm:text-xl">
              🤖 MODE 2: AI THINKS – I GUESS
            </h2>
            <div className="brutal-border bg-background p-4 xl:p-6 space-y-3">
              <div className="space-y-2">
                <p className="text-base xl:text-lg font-black text-foreground max-sm:text-sm">
                  STEP 1: AI Picks a Secret
                </p>
                <p className="text-sm xl:text-base font-bold text-muted-foreground pl-4 max-sm:text-xs">
                  The AI secretly chooses something from the fair game categories. Your job is to guess it!
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-base xl:text-lg font-black text-foreground max-sm:text-sm">
                  STEP 2: Ask Yes/No Questions
                </p>
                <p className="text-sm xl:text-base font-bold text-muted-foreground pl-4 max-sm:text-xs">
                  Type your questions in the input field. The AI will respond with Yes, No, or Sometimes. You have 20 questions maximum.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-base xl:text-lg font-black text-foreground max-sm:text-sm">
                  STEP 3: Make Your Guess
                </p>
                <p className="text-sm xl:text-base font-bold text-muted-foreground pl-4 max-sm:text-xs">
                  When you think you know the answer, type it in the question field. If you're right, you win! If you run out of questions, you can give up to see the answer.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xl:text-4xl font-black text-foreground max-sm:text-xl">
              🏆 WINNING CONDITIONS
            </h2>
            <div className="brutal-border bg-background p-4 xl:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="brutal-border bg-card p-3 xl:p-4 space-y-2">
                  <p className="text-base xl:text-lg font-black text-accent max-sm:text-sm">
                    ✅ YOU WIN IF:
                  </p>
                  <ul className="text-sm xl:text-base font-bold text-foreground space-y-1 pl-4 max-sm:text-xs">
                    <li>• You guess correctly (AI Thinks mode)</li>
                    <li>• AI fails to guess in 20 questions (I Think mode)</li>
                  </ul>
                </div>
                <div className="brutal-border bg-card p-3 xl:p-4 space-y-2">
                  <p className="text-base xl:text-lg font-black text-secondary max-sm:text-sm">
                    ❌ AI WINS IF:
                  </p>
                  <ul className="text-sm xl:text-base font-bold text-foreground space-y-1 pl-4 max-sm:text-xs">
                    <li>• AI guesses correctly (I Think mode)</li>
                    <li>• You can't guess in 20 questions (AI Thinks mode)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xl:text-4xl font-black text-foreground max-sm:text-xl">
              💡 PRO TIPS
            </h2>
            <div className="brutal-border bg-background p-4 xl:p-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <p className="text-sm xl:text-base font-bold text-foreground max-sm:text-xs">
                  <span className="font-black">Start broad, then narrow down:</span> Begin with category questions like "Is it alive?" or "Is it edible?" before getting specific.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧩</span>
                <p className="text-sm xl:text-base font-bold text-foreground max-sm:text-xs">
                  <span className="font-black">Use the categories:</span> Stick to the fair game categories for the best experience. Avoid overly obscure or specific items.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <p className="text-sm xl:text-base font-bold text-foreground max-sm:text-xs">
                  <span className="font-black">Think strategically:</span> Each question should eliminate roughly half of the remaining possibilities.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎲</span>
                <p className="text-sm xl:text-base font-bold text-foreground max-sm:text-xs">
                  <span className="font-black">Use "Sometimes" wisely:</span> This answer means the question doesn't have a clear yes/no answer for the secret thing.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xl:text-4xl font-black text-secondary max-sm:text-xl">
              📋 FAIR GAME CATEGORIES
            </h2>
            <div className="brutal-border bg-background p-4 xl:p-6">
              <p className="text-sm xl:text-base font-bold text-muted-foreground mb-4 max-sm:text-xs">
                Choose from these 12 categories for the best gameplay:
              </p>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-3">
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🐾 Animals</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🍎 Food & Drinks</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🎬 Movies & TV</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🎮 Video Games</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🏆 Sports</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🌍 Places</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🎵 Musicians</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">📚 Books</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🚗 Vehicles</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🏛️ Landmarks</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🎨 Artists</span>
                </div>
                <div className="brutal-border bg-card p-2 xl:p-3">
                  <span className="font-black text-foreground text-xs xl:text-sm">🔧 Objects</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-lg max-sm:py-5"
          >
            BACK TO HOME
          </Button>
          <p className="text-center text-sm xl:text-base font-bold text-muted-foreground max-sm:text-xs">
            Ready to play? Head back and choose your mode!
          </p>
        </div>
      </div>
    </div>
  );
}
