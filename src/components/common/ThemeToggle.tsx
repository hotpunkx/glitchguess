import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    const initialDark = savedTheme === 'dark';
    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    const themeStr = newDark ? 'dark' : 'light';
    localStorage.setItem('theme', themeStr);
    document.documentElement.classList.toggle('dark', newDark);
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center neubrutal-border bg-white dark:bg-darkBg text-black dark:text-white shadow-neubrutal active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        aria-label="Toggle Theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
