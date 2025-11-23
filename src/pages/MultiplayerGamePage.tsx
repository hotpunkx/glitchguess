import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getMultiplayerGame,
  subscribeToGame,
  joinMultiplayerGame,
  requestRematch,
  createRematchGame,
} from '@/db/multiplayerApi';
import type { MultiplayerGame } from '@/types/types';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { Copy, Share2, Loader2 } from 'lucide-react';
import MultiplayerGameplay from '@/components/multiplayer/MultiplayerGameplay';
import MultiplayerEndScreen from '@/components/multiplayer/MultiplayerEndScreen';

export default function MultiplayerGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState<MultiplayerGame | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerNumber, setPlayerNumber] = useState<'player1' | 'player2' | null>(null);

  const gameCode = searchParams.get('code');

  useEffect(() => {
    if (!gameId) {
      console.error('No gameId provided');
      navigate('/');
      return;
    }

    loadGame();
  }, [gameId, navigate]);

  useEffect(() => {
    if (!game) return;

    // Subscribe to game updates
    const unsubscribe = subscribeToGame(game.id, (updatedGame) => {
      console.log('Game updated:', updatedGame);
      setGame(updatedGame);
      
      // Check if both players requested rematch
      if (
        updatedGame.player1_rematch &&
        updatedGame.player2_rematch &&
        updatedGame.game_status === 'ended'
      ) {
        handleRematchAccepted();
      }
    });

    return unsubscribe;
  }, [game?.id]);

  const loadGame = async () => {
    setIsLoading(true);
    try {
      console.log('Loading game:', gameId);
      const gameData = await getMultiplayerGame(gameId!);
      console.log('Game data loaded:', gameData);
      
      if (!gameData) {
        console.error('Game not found');
        toast.error('Game not found');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      setGame(gameData);

      // Determine which player this is
      const session = localStorage.getItem('multiplayer-session');
      console.log('Player session:', session);
      console.log('Player1 session:', gameData.player1_session);
      console.log('Player2 session:', gameData.player2_session);
      
      if (session === gameData.player1_session) {
        setPlayerNumber('player1');
        console.log('This is player 1');
      } else if (session === gameData.player2_session) {
        setPlayerNumber('player2');
        console.log('This is player 2');
      } else {
        console.log('This is a new player (not player 1 or 2)');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading game:', error);
      toast.error('Failed to load game');
      setTimeout(() => navigate('/'), 2000);
      setIsLoading(false);
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

    setIsJoining(true);
    try {
      const playerSession = crypto.randomUUID();
      localStorage.setItem('multiplayer-session', playerSession);

      await joinMultiplayerGame(game!.game_code, playerName.trim(), playerSession);
      setPlayerNumber('player2');
      toast.success('Joined game!');
    } catch (error: any) {
      console.error('Error joining game:', error);
      toast.error(error.message || 'Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/multiplayer/game/${gameId}?code=${game?.game_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/multiplayer/game/${gameId}?code=${game?.game_code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my GLITCHGUESS game!',
          text: `Join my 1v1 game with code: ${game?.game_code}`,
          url: link,
        });
      } catch (error) {
        // User cancelled or share failed
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleRequestRematch = async () => {
    if (!game || !playerNumber) return;

    try {
      await requestRematch(game.id, playerNumber);
      toast.success('Rematch requested! Waiting for opponent...');
    } catch (error) {
      console.error('Error requesting rematch:', error);
      toast.error('Failed to request rematch');
    }
  };

  const handleRematchAccepted = async () => {
    if (!game) return;

    try {
      const newGameId = await createRematchGame(game.id);
      toast.success('Rematch starting!');
      navigate(`/multiplayer/game/${newGameId}`);
    } catch (error) {
      console.error('Error creating rematch:', error);
      toast.error('Failed to create rematch');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!game) {
    return null;
  }

  // Waiting for player 2 to join
  if (game.game_status === 'waiting' && playerNumber === 'player1') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="text-3xl xl:text-5xl font-black text-center">
                ⏳ WAITING FOR OPPONENT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-xl font-bold">
                  Hi, {game.player1_name}!
                </p>
                <p className="text-lg text-muted-foreground font-bold">
                  Share this link with your friend to start playing
                </p>

                <div className="brutal-border bg-muted p-4 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-black tracking-wider">
                      {game.game_code}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyLink}
                      className="flex-1 brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      <Copy className="mr-2" size={20} />
                      COPY LINK
                    </Button>
                    <Button
                      onClick={handleShare}
                      className="flex-1 brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      <Share2 className="mr-2" size={20} />
                      SHARE
                    </Button>
                  </div>
                </div>

                <div className="animate-pulse">
                  <Loader2 className="animate-spin mx-auto" size={32} />
                  <p className="text-sm font-bold text-muted-foreground mt-2">
                    Waiting for player to join...
                  </p>
                </div>
              </div>

              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full brutal-border"
              >
                CANCEL
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Join screen for player 2
  if (game.game_status === 'waiting' && !playerNumber) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="text-3xl xl:text-5xl font-black text-center">
                👥 JOIN GAME
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xl font-bold">
                  {game.player1_name} invited you to play!
                </p>
                <p className="text-lg text-muted-foreground font-bold">
                  Game Code: <span className="text-foreground text-2xl">{game.game_code}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
                  maxLength={20}
                  className="h-14 text-lg font-bold brutal-border"
                  disabled={isJoining}
                />
              </div>

              <Button
                onClick={handleJoinGame}
                disabled={isJoining || !playerName.trim()}
                className="w-full h-auto py-6 text-xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
              >
                {isJoining ? 'JOINING...' : 'JOIN GAME'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Game ended - show end screen
  if (game.game_status === 'ended') {
    return (
      <MultiplayerEndScreen
        game={game}
        playerNumber={playerNumber!}
        onRequestRematch={handleRequestRematch}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  // Active game
  if (game.game_status === 'active' && playerNumber) {
    return (
      <MultiplayerGameplay
        game={game}
        playerNumber={playerNumber}
      />
    );
  }

  // Fallback for unknown state or spectator
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-2xl space-y-6">
        <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-5xl font-black text-center">
              ⚠️ GAME IN PROGRESS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-bold text-muted-foreground">
                This game is already in progress between {game.player1_name} and {game.player2_name || 'another player'}.
              </p>
              <p className="text-sm font-bold text-muted-foreground">
                You cannot join this game as it has already started.
              </p>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="w-full h-auto py-4 text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              BACK TO HOME
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
