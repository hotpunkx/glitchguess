import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { joinMultiplayerGame, getMultiplayerGame } from '@/db/multiplayerApi';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function MultiplayerJoinPage() {
  const { gameId } = useParams<{ gameId?: string }>();
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [gameInfo, setGameInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If gameId is provided in URL, load game info
    if (gameId) {
      loadGameInfo();
    }
  }, [gameId]);

  const loadGameInfo = async () => {
    if (!gameId) return;
    
    try {
      const game = await getMultiplayerGame(gameId);
      setGameInfo(game);
      setGameCode(game.game_code);
    } catch (error) {
      console.error('Error loading game:', error);
      toast.error('Game not found');
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (playerName.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (!gameCode.trim() && !gameId) {
      toast.error('Please enter a game code');
      return;
    }

    setIsJoining(true);
    try {
      // Generate a unique session ID for this player
      const playerSession = crypto.randomUUID();
      localStorage.setItem('multiplayer-session', playerSession);

      const joinedGameId = await joinMultiplayerGame(
        gameCode.trim() || gameInfo?.game_code,
        playerName.trim(),
        playerSession
      );

      // Store game info in localStorage for tracking
      const myGames = JSON.parse(localStorage.getItem('my-multiplayer-games') || '[]');
      myGames.push({
        gameId: joinedGameId,
        gameCode: gameCode.trim() || gameInfo?.game_code,
        role: 'player',
        playerName: playerName.trim(),
        isPublic: gameInfo?.is_public || false,
        joinedAt: new Date().toISOString(),
      });
      localStorage.setItem('my-multiplayer-games', JSON.stringify(myGames));

      // Navigate to game
      navigate(`/multiplayer/game/${joinedGameId}`);
    } catch (error: any) {
      console.error('Error joining game:', error);
      toast.error(error.message || 'Failed to join game. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-2xl space-y-6">
        <Button
          onClick={() => navigate(-1)}
          className="brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          variant="outline"
        >
          <ArrowLeft className="mr-2" size={20} />
          BACK
        </Button>

        <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-5xl font-black text-center">
              🎮 JOIN GAME
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {gameInfo && (
                <div className="brutal-border bg-accent text-accent-foreground p-4 text-center space-y-2">
                  <p className="font-black text-lg">
                    {gameInfo.is_public ? '🌐' : '🔒'} {gameInfo.game_code}
                  </p>
                  <p className="text-sm font-bold">
                    Host: {gameInfo.player1_name}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-black uppercase">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  className="h-14 text-lg font-bold brutal-border"
                  disabled={isJoining}
                />
              </div>

              {!gameId && (
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">Game Code</label>
                  <Input
                    type="text"
                    placeholder="Enter game code..."
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="h-14 text-lg font-bold brutal-border uppercase"
                    disabled={isJoining}
                  />
                </div>
              )}

              <Button
                onClick={handleJoinGame}
                disabled={isJoining || !playerName.trim() || (!gameCode.trim() && !gameId)}
                className="w-full h-auto py-6 text-xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
              >
                {isJoining ? 'JOINING...' : 'JOIN GAME'}
              </Button>
            </div>

            <div className="brutal-border bg-muted p-4 space-y-2">
              <h3 className="font-black text-sm uppercase">How to join:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm font-bold">
                <li>Enter your name</li>
                <li>Enter the game code shared by your friend (or join from lobby)</li>
                <li>Wait for the game to start</li>
                <li>Have fun guessing!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
