import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMultiplayerGameByCode } from '@/db/multiplayerApi';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

export default function PlayPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) {
      toast.error('Invalid game code');
      navigate('/');
      return;
    }

    loadGameByCode();
  }, [code]);

  const loadGameByCode = async () => {
    try {
      console.log('Loading game with code:', code);
      const game = await getMultiplayerGameByCode(code!);
      
      if (!game) {
        toast.error('Game not found');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      // Redirect to full game URL
      navigate(`/multiplayer/game/${game.id}?code=${code}`);
    } catch (error) {
      console.error('Error loading game:', error);
      toast.error('Failed to load game');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Toaster position="top-center" />
      
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin mx-auto" size={48} />
        <p className="text-xl font-black">LOADING GAME...</p>
        <p className="text-sm text-muted-foreground font-bold">
          Code: {code?.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
