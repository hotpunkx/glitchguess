import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createMultiplayerGame } from '@/db/multiplayerApi';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function MultiplayerCreatePage() {
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (playerName.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setIsCreating(true);
    try {
      // Generate a unique session ID for this player
      const playerSession = crypto.randomUUID();
      localStorage.setItem('multiplayer-session', playerSession);

      const { gameId, gameCode } = await createMultiplayerGame(
        playerName.trim(),
        playerSession
      );

      // Navigate to waiting room
      navigate(`/multiplayer/game/${gameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-2xl space-y-6">
        <Button
          onClick={() => navigate('/')}
          className="brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          variant="outline"
        >
          <ArrowLeft className="mr-2" size={20} />
          BACK TO HOME
        </Button>

        <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-5xl font-black text-center">
              👥 CREATE 1v1 GAME
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg font-bold text-center text-muted-foreground">
                Enter your name to create a multiplayer game
              </p>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateGame()}
                  maxLength={20}
                  className="h-14 text-lg font-bold brutal-border"
                  disabled={isCreating}
                />
              </div>

              <Button
                onClick={handleCreateGame}
                disabled={isCreating || !playerName.trim()}
                className="w-full h-auto py-6 text-xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
              >
                {isCreating ? 'CREATING GAME...' : 'CREATE GAME'}
              </Button>
            </div>

            <div className="brutal-border bg-muted p-4 space-y-2">
              <h3 className="font-black text-sm uppercase">How it works:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm font-bold">
                <li>Enter your name and create a game</li>
                <li>Share the game link with your friend</li>
                <li>Wait for them to join</li>
                <li>One of you will think, the other will guess</li>
                <li>After the game, you can rematch with switched roles!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
