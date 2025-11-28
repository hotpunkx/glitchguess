import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Home } from 'lucide-react';

const ADMIN_USERNAME = 'mamayilokka';
const ADMIN_PASSWORD = 'EHDZDWick@261221';
const AUTH_KEY = 'glitchguess-admin-auth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Store auth token
        const authToken = btoa(`${username}:${Date.now()}`);
        localStorage.setItem(AUTH_KEY, authToken);
        toast.success('Login successful!');
        navigate('/lokka/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={() => navigate('/')}
          className="brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          variant="outline"
        >
          <Home className="mr-2" size={20} />
          BACK TO HOME
        </Button>

        <div className="bg-card border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-4xl font-black mb-2 text-center">ADMIN</h1>
          <p className="text-center text-muted-foreground mb-8">GLITCHGUESS Dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">USERNAME</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="border-2 border-foreground"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">PASSWORD</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="border-2 border-foreground"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-black border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Export helper function to check auth
export function isAdminAuthenticated(): boolean {
  const authToken = localStorage.getItem(AUTH_KEY);
  return !!authToken;
}

export function clearAdminAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}
