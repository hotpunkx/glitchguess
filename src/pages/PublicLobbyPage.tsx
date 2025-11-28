import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPublicGames, subscribeToPublicGames, getMultiplayerGame } from '@/db/multiplayerApi';
import { MultiplayerGame } from '@/types/types';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { ArrowLeft, Users, Clock, Play, RefreshCw } from 'lucide-react';

export default function PublicLobbyPage() {
  const [games, setGames] = useState<MultiplayerGame[]>([]);
  const [myGames, setMyGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadGames = async () => {
    try {
      const publicGames = await getPublicGames();
      
      // Get my games from localStorage to filter them out
      const storedGames = JSON.parse(localStorage.getItem('my-multiplayer-games') || '[]');
      const myGameIds = storedGames.map((g: any) => g.gameId);
      
      // Filter out games that the user created (host)
      const filteredGames = publicGames.filter(game => !myGameIds.includes(game.id));
      setGames(filteredGames);
      
      // Load my games from localStorage and check their status
      const updatedMyGames = await Promise.all(
        storedGames.map(async (game: any) => {
          try {
            const gameData = await getMultiplayerGame(game.gameId);
            return {
              ...game,
              currentStatus: gameData.game_status,
              hasPlayer2: !!gameData.player2_name,
            };
          } catch {
            return game;
          }
        })
      );
      setMyGames(updatedMyGames.filter((g: any) => g.currentStatus !== 'ended'));
    } catch (error) {
      console.error('Error loading games:', error);
      toast.error('Failed to load games');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadGames();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPublicGames(() => {
      loadGames();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadGames();
  };

  const handleJoinGame = (gameId: string) => {
    navigate(`/multiplayer/join/${gameId}`);
  };

  const handleContinueGame = (gameId: string) => {
    navigate(`/multiplayer/game/${gameId}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-6xl space-y-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={() => navigate('/')}
            className="brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            variant="outline"
          >
            <ArrowLeft className="mr-2" size={20} />
            BACK
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            variant="outline"
          >
            <RefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} size={20} />
            REFRESH
          </Button>
        </div>

        <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-5xl font-black text-center">
              🌐 PUBLIC LOBBY
            </CardTitle>
            <p className="text-center text-muted-foreground font-bold">
              Join a public game or check your ongoing games
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* My Games Section */}
            {myGames.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black uppercase brutal-border bg-accent text-accent-foreground p-3 text-center">
                  📋 MY GAMES
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {myGames.map((game) => (
                    <Card
                      key={game.gameId}
                      className="brutal-border shadow-brutal bg-card hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-black text-lg">
                              {game.isPublic ? '🌐' : '🔒'} {game.gameCode}
                            </p>
                            <p className="text-sm font-bold text-muted-foreground">
                              {game.role === 'host' ? '👑 Host' : '🎮 Player'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase">
                              {game.currentStatus === 'waiting' ? '⏳ Waiting' : '🎮 Active'}
                            </p>
                            {game.currentStatus === 'waiting' && !game.hasPlayer2 && (
                              <p className="text-xs font-bold text-muted-foreground">
                                Waiting for player...
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleContinueGame(game.gameId)}
                          className="w-full brutal-border shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground font-black"
                        >
                          <Play className="mr-2" size={16} />
                          CONTINUE
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Public Games Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-black uppercase brutal-border bg-primary text-primary-foreground p-3 text-center">
                🎮 AVAILABLE GAMES
              </h2>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-foreground border-t-transparent"></div>
                  <p className="mt-4 font-bold">Loading games...</p>
                </div>
              ) : games.length === 0 ? (
                <div className="brutal-border bg-muted p-8 text-center space-y-4">
                  <p className="text-xl font-black">No public games available</p>
                  <p className="text-sm font-bold text-muted-foreground">
                    Be the first to create a public game!
                  </p>
                  <Button
                    onClick={() => navigate('/multiplayer/create')}
                    className="brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-accent text-accent-foreground font-black"
                  >
                    CREATE PUBLIC GAME
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {games.map((game) => (
                    <Card
                      key={game.id}
                      className="brutal-border shadow-brutal bg-card hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-black text-lg">🌐 {game.game_code}</p>
                            <p className="text-sm font-bold">
                              <Users className="inline mr-1" size={14} />
                              {game.player1_name}
                              {game.player2_name && ` vs ${game.player2_name}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase">
                              {game.game_status === 'waiting' ? '⏳ Waiting' : '🎮 Active'}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground">
                              <Clock className="inline mr-1" size={12} />
                              {formatTimeAgo(game.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        {game.game_status === 'waiting' && !game.player2_name ? (
                          <Button
                            onClick={() => handleJoinGame(game.id)}
                            className="w-full brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground font-black"
                          >
                            <Play className="mr-2" size={16} />
                            JOIN GAME
                          </Button>
                        ) : (
                          <div className="brutal-border bg-muted p-2 text-center">
                            <p className="text-xs font-bold">Game in progress</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
