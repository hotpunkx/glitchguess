import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Volume2, VolumeX, Trash2, Info, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Sync theme state with document class
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
    
    // Load sound preference
    const savedSound = localStorage.getItem('sound_enabled');
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    const themeStr = newDark ? 'dark' : 'light';
    localStorage.setItem('theme', themeStr);
    document.documentElement.classList.toggle('dark', newDark);
    toast.success(`Theme set to ${newDark ? 'Dark' : 'Light'}`, {
      icon: newDark ? <Moon size={16} /> : <Sun size={16} />
    });
  };

  const toggleSound = () => {
    const newSound = !soundEnabled;
    setSoundEnabled(newSound);
    localStorage.setItem('sound_enabled', String(newSound));
    toast.success(`Sound ${newSound ? 'Enabled' : 'Disabled'}`, {
      icon: newSound ? <Volume2 size={16} /> : <VolumeX size={16} />
    });
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all game data? This will reset your progress.')) {
      localStorage.clear();
      toast.success('All data cleared successfully');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pt-20 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-foreground opacity-70 hover:opacity-100 transition-opacity group"
        >
          <div className="p-1 neubrutal-border bg-white dark:bg-black group-hover:bg-brand group-hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-black italic text-[10px] uppercase tracking-widest">Return to Glitch</span>
        </button>

        <header className="mb-8">
          <div className="inline-block px-4 py-1 neubrutal-border bg-brand text-white shadow-neubrutal mb-2 rotate-[-1deg]">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">System Settings</h1>
          </div>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest px-1">Configure your game experience</p>
        </header>

        <div className="space-y-6">
          {/* Appearance Section */}
          <section className="neubrutal-border bg-white dark:bg-zinc-900 p-5 shadow-neubrutal-green relative">
            <div className="absolute -top-3 -left-3 px-2 py-0.5 neubrutal-border bg-accentGreen text-black text-[8px] font-black uppercase">Appearance</div>
            
            <div className="flex items-center justify-between mt-2">
              <div>
                <h3 className="font-black italic uppercase text-sm leading-none mb-1">Dark Mode</h3>
                <p className="text-[9px] opacity-60 font-bold uppercase tracking-tight">Toggle visual theme</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 neubrutal-border relative transition-colors ${isDark ? 'bg-brand' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 bottom-0.5 w-4 neubrutal-border bg-white transition-all ${isDark ? 'right-0.5' : 'left-0.5'}`}></div>
              </button>
            </div>
          </section>

          {/* Audio Section */}
          <section className="neubrutal-border bg-white dark:bg-zinc-900 p-5 shadow-neubrutal-pink relative">
            <div className="absolute -top-3 -left-3 px-2 py-0.5 neubrutal-border bg-accentPink text-black text-[8px] font-black uppercase">Audio</div>
            
            <div className="flex items-center justify-between mt-2">
              <div>
                <h3 className="font-black italic uppercase text-sm leading-none mb-1">Sound Effects</h3>
                <p className="text-[9px] opacity-60 font-bold uppercase tracking-tight">Game audio & feedback</p>
              </div>
              <button 
                onClick={toggleSound}
                className={`p-2 neubrutal-border transition-all active:translate-x-0.5 active:translate-y-0.5 ${soundEnabled ? 'bg-accentPink text-white shadow-neubrutal-pink' : 'bg-gray-100 text-black shadow-none'}`}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
          </section>

          {/* Data Section */}
          <section className="neubrutal-border bg-white dark:bg-zinc-900 p-5 shadow-neubrutal relative">
            <div className="absolute -top-3 -left-3 px-2 py-0.5 neubrutal-border bg-white text-black text-[8px] font-black uppercase">Storage</div>
            
            <div className="mt-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black italic uppercase text-sm leading-none mb-1">Clear Local Data</h3>
                  <p className="text-[9px] opacity-60 font-bold uppercase tracking-tight text-red-500">Warning: IRREVERSIBLE</p>
                </div>
                <button 
                  onClick={clearData}
                  className="p-2 neubrutal-border bg-white hover:bg-red-500 hover:text-white transition-colors shadow-neubrutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Info Section */}
          <section className="neubrutal-border bg-brand p-5 text-white shadow-neubrutal-blue relative">
             <div className="flex items-start gap-4">
               <Info className="w-8 h-8 shrink-0" />
               <div>
                  <h3 className="font-black italic uppercase text-sm leading-none mb-1">Game Version</h3>
                  <p className="text-[10px] font-mono opacity-80 mb-2">V 2.1.0-BETA</p>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-black/20 rounded-none border border-white/30 w-fit">
                    <CheckCircle2 size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Base Network Active</span>
                  </div>
               </div>
             </div>
          </section>
        </div>

        <footer className="mt-12 text-center pb-8">
          <p className="text-[8px] font-black uppercase opacity-30 tracking-[0.2em]">Designed for the decentralized future</p>
        </footer>
      </div>
    </div>
  );
}
