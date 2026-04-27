import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletConnect } from '@/components/common/WalletConnect';
import { Trophy } from 'lucide-react';

interface StartScreenProps {
  onSelectMode: (mode: 'human-thinks' | 'ai-thinks', category: string) => void;
  onContinueGame?: () => void;
  savedGameMode?: 'human-thinks' | 'ai-thinks';
}

export function StartScreen({ onSelectMode, onContinueGame, savedGameMode }: StartScreenProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Animals');

  return (
    <div className="min-h-screen flex flex-col p-4 bg-background text-foreground overflow-y-auto no-scrollbar">
      {/* BEGIN: MainHeader */}
      <header className="mt-2 mb-4 text-center shrink-0 relative">
        <div className="inline-block px-3 py-0.5 neubrutal-border bg-brand mb-1 rotate-[-2deg] shadow-neubrutal">
          <span className="text-[9px] font-black uppercase tracking-widest text-white">The Ultimate Trivia</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase glitch-text leading-none mb-1">
          THE <br /> GLITCH
        </h1>
        <p className="text-accentGreen font-bold tracking-tighter text-xs uppercase">Can you guess the source?</p>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: GameModes */}
      <section className="space-y-2 mb-4 w-full max-w-2xl mx-auto shrink-0">
        <h2 className="text-[10px] font-black uppercase mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-accentPink inline-block"></span> Select Mode
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {onContinueGame && (
            <button
              onClick={onContinueGame}
              className="flex items-center justify-between p-2.5 bg-accent text-black neubrutal-border shadow-neubrutal-green hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
            >
              <div className="text-left z-10">
                <span className="block text-lg font-black uppercase">Continue</span>
                <span className="text-[9px] font-bold opacity-80 uppercase leading-none">
                  {savedGameMode === 'human-thinks' ? 'AI Guesses Your Prompt' : 'You Guess AI'}
                </span>
              </div>
              <img src="/modes/continue.png" alt="Continue" className="w-16 h-16 object-cover neubrutal-border animate-float z-10 shrink-0" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectMode('human-thinks', selectedCategory)}
              className="flex items-center justify-between p-2.5 bg-accentGreen text-black neubrutal-border shadow-neubrutal hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 group h-full overflow-hidden"
            >
              <div className="text-left z-10">
                <span className="block text-[12px] font-black uppercase leading-tight">Human<br />Thinks</span>
                <span className="text-[8px] font-bold opacity-80 uppercase leading-none mt-1">AI Guesses</span>
              </div>
              <img src="/modes/human.png" alt="Human Thinks" className="w-14 h-14 object-cover neubrutal-border animate-float z-10 shrink-0 ml-1" />
            </button>

            <button
              onClick={() => onSelectMode('ai-thinks', selectedCategory)}
              className="flex items-center justify-between p-2.5 bg-accentPink text-black neubrutal-border shadow-neubrutal-pink hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 h-full overflow-hidden"
            >
              <div className="text-left z-10">
                <span className="block text-[12px] font-black uppercase leading-tight">AI<br />Thinks</span>
                <span className="text-[8px] font-bold opacity-80 uppercase leading-none mt-1">You Guess</span>
              </div>
              <img src="/modes/ai.png" alt="AI Thinks" className="w-14 h-14 object-cover neubrutal-border animate-float z-10 shrink-0 ml-1" />
            </button>
          </div>

          <button
            onClick={() => navigate('/multiplayer/create')}
            className="flex items-center justify-between p-2.5 bg-brand text-white neubrutal-border shadow-neubrutal-blue hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 overflow-hidden"
          >
            <div className="text-left z-10">
              <span className="block text-lg font-black uppercase">Multiplayer</span>
              <span className="text-[9px] font-bold opacity-80 uppercase leading-none">Battle Against Friends</span>
            </div>
            <img src="/modes/multiplayer.png" alt="Multiplayer" className="w-16 h-16 object-cover neubrutal-border animate-float z-10 shrink-0" />
          </button>
        </div>
      </section>
      {/* END: GameModes */}

      {/* BEGIN: Categories */}
      <section className="mb-4 w-full max-w-2xl mx-auto shrink-0 overflow-hidden">
        <div className="flex justify-between items-end mb-1.5">
          <h2 className="text-[10px] font-black uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand inline-block"></span> Categories
          </h2>
          <button onClick={() => navigate('/how-to-play')} className="text-[8px] font-black underline text-accentGreen uppercase tracking-tighter">
            HELP
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 px-1 pb-2">
          <CategoryCard 
            imageSrc="/categories/animals.png"
            label="Animals" 
            shadow="green" 
            isSelected={selectedCategory === 'Animals'} 
            onClick={() => setSelectedCategory('Animals')} 
          />
          <CategoryCard 
            imageSrc="/categories/food.png"
            label="Food" 
            shadow="pink" 
            isSelected={selectedCategory === 'Food'} 
            onClick={() => setSelectedCategory('Food')} 
          />
          <CategoryCard 
            imageSrc="/categories/movies.png"
            label="Movies" 
            shadow="blue" 
            isSelected={selectedCategory === 'Movies'} 
            onClick={() => setSelectedCategory('Movies')} 
          />
          <CategoryCard 
            imageSrc="/categories/games.png"
            label="Games" 
            shadow="green" 
            isSelected={selectedCategory === 'Games'} 
            onClick={() => setSelectedCategory('Games')} 
          />
          <CategoryCard 
            imageSrc="/categories/places.png"
            label="Places" 
            shadow="pink" 
            isSelected={selectedCategory === 'Places'} 
            onClick={() => setSelectedCategory('Places')} 
          />
          <CategoryCard 
            imageSrc="/categories/objects.png"
            label="Objects" 
            shadow="blue" 
            isSelected={selectedCategory === 'Objects'} 
            onClick={() => setSelectedCategory('Objects')} 
          />
        </div>
      </section>
      {/* END: Categories */}

      {/* BEGIN: GlobalActions */}
      <section className="mt-auto w-full max-w-2xl mx-auto shrink-0 pb-2">
        <div className="flex flex-col items-center gap-2 mb-3">
          <WalletConnect isInline />
          <button 
            onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-2 px-4 py-2 neubrutal-border bg-white text-black font-black uppercase italic shadow-neubrutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
          >
            <Trophy size={16} className="text-brand" /> Leaderboard
          </button>
        </div>
        <div className="flex justify-center gap-6 opacity-60">
          <button onClick={() => navigate('/profile')} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-foreground">Profile</button>
          <button onClick={() => navigate('/settings')} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-foreground">Settings</button>
        </div>
      </section>
      {/* END: GlobalActions */}
    </div>
  );
}

function CategoryCard({ 
  imageSrc, 
  label, 
  shadow, 
  isSelected, 
  onClick 
}: { 
  imageSrc: string; 
  label: string; 
  shadow: 'green' | 'pink' | 'blue';
  isSelected: boolean;
  onClick: () => void;
}) {
  const shadowClass = shadow === 'green' ? 'shadow-neubrutal-green' : shadow === 'pink' ? 'shadow-neubrutal-pink' : 'shadow-neubrutal-blue';
  const activeBg = shadow === 'green' ? 'bg-accentGreen' : shadow === 'pink' ? 'bg-accentPink' : 'bg-brand';
  const activeText = shadow === 'blue' ? 'text-white' : 'text-black';

  return (
    <button 
      onClick={onClick}
      className={`w-full aspect-square neubrutal-border ${shadowClass} flex flex-col items-center justify-center transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
        isSelected ? `${activeBg} ${activeText} translate-x-1 translate-y-1 shadow-none` : 'bg-white text-black hover:bg-gray-50'
      }`}
    >
      <img src={imageSrc} alt={label} className="w-8 h-8 mb-1 object-contain animate-float" />
      <span className="font-black text-[10px] uppercase tracking-tighter leading-none">{label}</span>
    </button>
  );
}
