import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createMultiplayerGame } from '@/db/multiplayerApi';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { ArrowLeft, Lock, Globe } from 'lucide-react';

export default function MultiplayerCreatePage() {
  const [playerName, setPlayerName] = useState('');
  const [gameType, setGameType] = useState<'private' | 'public' | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateGame = async (isPublic: boolean) => {
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
        playerSession,
        isPublic
      );

      // Store game info in localStorage for tracking
      const myGames = JSON.parse(localStorage.getItem('my-multiplayer-games') || '[]');
      myGames.push({
        gameId,
        gameCode,
        role: 'host',
        playerName: playerName.trim(),
        isPublic,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('my-multiplayer-games', JSON.stringify(myGames));

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
                  maxLength={20}
                  className="h-14 text-lg font-bold brutal-border"
                  disabled={isCreating}
                />
              </div>

              {!gameType ? (
                <div className="space-y-4">
                  <p className="text-sm font-black uppercase text-center">Choose Game Type:</p>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setGameType('private')}
                      disabled={!playerName.trim() || isCreating}
                      className="h-auto py-6 text-lg font-black brutal-border-thick shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-card text-foreground flex flex-col gap-2"
                    >
                      <Lock size={32} />
                      <span>PRIVATE GAME</span>
                      <span className="text-xs font-normal">Share link with a friend</span>
                    </Button>

                    <Button
                      onClick={() => setGameType('public')}
                      disabled={!playerName.trim() || isCreating}
                      className="h-auto py-6 text-lg font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground flex flex-col gap-2"
                    >
                      <Globe size={32} />
                      <span>PUBLIC GAME</span>
                      <span className="text-xs font-normal">Anyone can join from lobby</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="brutal-border bg-muted p-4 text-center">
                    <p className="font-black text-sm uppercase">
                      {gameType === 'private' ? '🔒 Private Game' : '🌐 Public Game'}
                    </p>
                    <p className="text-xs font-bold mt-1">
                      {gameType === 'private' 
                        ? 'You will get a link to share with your friend'
                        : 'Your game will appear in the public lobby'
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setGameType(null)}
                      disabled={isCreating}
                      variant="outline"
                      className="brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      BACK
                    </Button>

                    <Button
                      onClick={() => handleCreateGame(gameType === 'public')}
                      disabled={isCreating}
                      className="brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground font-black"
                    >
                      {isCreating ? 'CREATING...' : 'CREATE'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="brutal-border bg-muted p-4 space-y-2">
              <h3 className="font-black text-sm uppercase">How it works:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm font-bold">
                <li>Enter your name and choose game type</li>
                <li>Private: Share link with a friend | Public: Wait in lobby</li>
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
