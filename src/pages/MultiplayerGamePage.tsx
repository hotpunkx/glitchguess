import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getMultiplayerGame,
  subscribeToGame,
  joinMultiplayerGame,
  updateSecretWord,
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
  const [secretWord, setSecretWord] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isSettingWord, setIsSettingWord] = useState(false);
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
    if (!game?.id) return;

    console.log('Setting up game subscription for game:', game.id);

    // Subscribe to game updates
    const unsubscribe = subscribeToGame(game.id, (updatedGame) => {
      console.log('Game updated via subscription:', {
        gameId: updatedGame.id,
        status: updatedGame.game_status,
        secretWord: updatedGame.secret_word ? '***SET***' : 'NOT SET',
        currentThinker: updatedGame.current_thinker,
        currentQuestioner: updatedGame.current_questioner,
      });
      
      // Use functional setState to avoid depending on game in dependencies
      setGame((prevGame) => {
        console.log('Updating game state from:', {
          prevStatus: prevGame?.game_status,
          prevSecretWord: prevGame?.secret_word ? '***SET***' : 'NOT SET',
        }, 'to:', {
          newStatus: updatedGame.game_status,
          newSecretWord: updatedGame.secret_word ? '***SET***' : 'NOT SET',
        });
        
        // Notify Player 1 when Player 2 joins
        if (
          playerNumber === 'player1' &&
          !prevGame?.player2_name &&
          updatedGame.player2_name
        ) {
          toast.success(`${updatedGame.player2_name} joined the game! 🎮`, {
            duration: 4000,
          });
        }
        
        // Notify questioner when secret word is set
        if (
          prevGame?.game_status === 'waiting' &&
          updatedGame.game_status === 'active' &&
          updatedGame.current_questioner === playerNumber
        ) {
          toast.success('Opponent set the secret word! You can now ask questions.', {
            duration: 4000,
          });
        }
        
        return updatedGame;
      });
      
      // Check if both players requested rematch
      // Only player1 creates the rematch game to avoid creating duplicate games
      if (
        updatedGame.player1_rematch &&
        updatedGame.player2_rematch &&
        updatedGame.game_status === 'ended'
      ) {
        if (playerNumber === 'player1') {
          // Player 1 creates the rematch game
          handleRematchAccepted();
        } else if (playerNumber === 'player2' && updatedGame.rematch_game_id) {
          // Player 2 navigates to the rematch game created by player 1
          toast.success('Rematch starting!');
          navigate(`/multiplayer/game/${updatedGame.rematch_game_id}`);
        }
      }
    });

    return () => {
      console.log('Cleaning up game subscription for game:', game.id);
      unsubscribe();
    };
  }, [game?.id, playerNumber]);

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
      } else if (session === gameData.player2_session && gameData.player2_session) {
        setPlayerNumber('player2');
        console.log('This is player 2');
      } else {
        // New player or session mismatch
        console.log('This is a new player (not player 1 or 2)');
        // If game is waiting and no player2, this is a potential player 2
        if (gameData.game_status === 'waiting' && !gameData.player2_name) {
          console.log('Showing join screen for potential player 2');
          setPlayerNumber(null);
        }
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
      toast.success('Joined game! Waiting for host to start...');
      
      // Reload game data to get updated state
      await loadGame();
    } catch (error: any) {
      console.error('Error joining game:', error);
      toast.error(error.message || 'Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/play/${game?.game_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/play/${game?.game_code}`;
    
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

  const handleSetSecretWord = async () => {
    if (!secretWord.trim()) {
      toast.error('Please enter a secret word');
      return;
    }

    if (secretWord.trim().length < 2) {
      toast.error('Secret word must be at least 2 characters');
      return;
    }

    if (!playerNumber) {
      toast.error('Player role not determined');
      return;
    }

    setIsSettingWord(true);
    try {
      // Set the secret word (role was already assigned when player 2 joined)
      await updateSecretWord(game!.id, secretWord.trim(), playerNumber);
      toast.success('Secret word set! Game starting...');
      // Game will update via real-time subscription
    } catch (error: any) {
      console.error('Error setting secret word:', error);
      toast.error(error.message || 'Failed to set secret word');
    } finally {
      setIsSettingWord(false);
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

  // Waiting screen - randomly assigned word setter
  if (game.game_status === 'waiting' && playerNumber) {
    const isPlayer1 = playerNumber === 'player1';
    const currentPlayerName = isPlayer1 ? game.player1_name : game.player2_name;
    const opponentName = isPlayer1 ? game.player2_name : game.player1_name;
    const bothPlayersJoined = game.player1_name && game.player2_name;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="text-3xl xl:text-5xl font-black text-center">
                {bothPlayersJoined ? '🎮 READY TO START!' : '⏳ WAITING FOR OPPONENT'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-xl font-bold">
                  Hi, {currentPlayerName}!
                </p>
                
                {!bothPlayersJoined ? (
                  <>
                    {isPlayer1 && (
                      <>
                        <p className="text-lg text-muted-foreground font-bold">
                          Share this link with your friend to start playing
                        </p>

                        <div className="brutal-border bg-muted p-4 space-y-3">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl font-black tracking-wider">
                              {game.game_code}
                            </span>
                            <span className="text-sm text-muted-foreground font-mono break-all px-2">
                              {window.location.origin}/play/{game.game_code}
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
                      </>
                    )}

                    <div className="animate-pulse">
                      <Loader2 className="animate-spin mx-auto" size={32} />
                      <p className="text-sm font-bold text-muted-foreground mt-2">
                        Waiting for {isPlayer1 ? 'player 2' : game.player1_name} to join...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-accent font-black">
                      {opponentName} is ready to play! 🎮
                    </p>
                    
                    {/* Show who was randomly selected to set the word */}
                    {game.word_setter_claimed === playerNumber ? (
                      <>
                        <div className="brutal-border bg-accent/20 p-4 mb-4">
                          <p className="text-lg font-black text-center">
                            🎲 You were randomly selected to set the secret word!
                          </p>
                        </div>
                        <p className="text-md text-muted-foreground font-bold">
                          Enter your secret word to start the game
                        </p>
                        <div className="brutal-border bg-accent/10 p-4 mb-4">
                          <p className="text-sm font-bold">
                            Players: {game.player1_name} vs {game.player2_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 You'll answer questions, {opponentName} will try to guess
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-black uppercase">
                              Your Secret Word
                            </label>
                            <p className="text-xs text-muted-foreground font-bold">
                              Think of any object, person, animal, movie, or place
                            </p>
                            <Input
                              type="text"
                              placeholder="Enter your secret word..."
                              value={secretWord}
                              onChange={(e) => setSecretWord(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSetSecretWord()}
                              maxLength={50}
                              className="h-14 text-lg font-bold brutal-border"
                              disabled={isSettingWord}
                            />
                          </div>

                          <Button
                            onClick={handleSetSecretWord}
                            disabled={isSettingWord || !secretWord.trim()}
                            className="w-full h-auto py-6 text-xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground"
                          >
                            {isSettingWord ? 'STARTING GAME...' : 'START GAME'}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="brutal-border bg-muted p-6">
                          <div className="text-center space-y-4">
                            <p className="text-lg font-black">
                              🎲 {opponentName} was randomly selected to set the word!
                            </p>
                            <Loader2 className="animate-spin mx-auto" size={32} />
                            <p className="text-sm font-bold text-muted-foreground">
                              Waiting for {opponentName} to set the secret word...
                            </p>
                            <div className="brutal-border bg-accent/10 p-4 mt-4">
                              <p className="text-xs text-muted-foreground">
                                💡 You'll be asking questions to guess the word
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
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

  // Both players joined, waiting for game to start (thinker setting word)
  if (game.game_status === 'waiting' && playerNumber === 'player2') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="text-3xl xl:text-5xl font-black text-center">
                ⏳ GAME STARTING...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-xl font-bold">
                  Hi, {game.player2_name}!
                </p>
                <p className="text-lg text-muted-foreground font-bold">
                  Waiting for {game.player1_name} to set their secret word...
                </p>

                <div className="animate-pulse">
                  <Loader2 className="animate-spin mx-auto" size={32} />
                  <p className="text-sm font-bold text-muted-foreground mt-2">
                    Game will start soon!
                  </p>
                </div>
              </div>
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
