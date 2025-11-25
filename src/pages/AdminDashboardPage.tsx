import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllSessions, getAllMultiplayerGames, getSessionStats } from '@/db/api';
import type { GameSessionWithQuestions } from '@/types/types';
import type { MultiplayerGameWithQuestions } from '@/db/api';
import { isAdminAuthenticated, clearAdminAuth } from './AdminLoginPage';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [sessions, setSessions] = useState<GameSessionWithQuestions[]>([]);
  const [multiplayerGames, setMultiplayerGames] = useState<MultiplayerGameWithQuestions[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<GameSessionWithQuestions | null>(null);
  const [selectedMpGame, setSelectedMpGame] = useState<MultiplayerGameWithQuestions | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMpGames, setTotalMpGames] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'multiplayer'>('single');
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      navigate('/lokka');
      return;
    }

    loadData();
  }, [navigate, currentPage, viewMode]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const statsData = await getSessionStats();
      setStats(statsData);

      if (viewMode === 'single') {
        const { sessions: sessionsData, total } = await getAllSessions(currentPage, pageSize);
        setSessions(sessionsData);
        setTotalSessions(total);
      } else {
        const { games: gamesData, total } = await getAllMultiplayerGames(currentPage, pageSize);
        setMultiplayerGames(gamesData);
        setTotalMpGames(total);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    toast.success('Logged out successfully');
    navigate('/lokka');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedSession(null);
    setSelectedMpGame(null);
  };

  const handleViewModeChange = (mode: 'single' | 'multiplayer') => {
    setViewMode(mode);
    setCurrentPage(1);
    setSelectedSession(null);
    setSelectedMpGame(null);
  };

  const totalPages = viewMode === 'single' 
    ? Math.ceil(totalSessions / pageSize) 
    : Math.ceil(totalMpGames / pageSize);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl font-black">LOADING DASHBOARD...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-background p-4 xl:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-black mb-2">ADMIN DASHBOARD</h1>
              <p className="text-muted-foreground">GLITCHGUESS Game Analytics</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-foreground font-black"
            >
              LOGOUT
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-sm">TOTAL GAMES</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black">{stats.total}</div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-sm">HUMAN THINKS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black">{stats.humanThinksMode}</div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-sm">AI THINKS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black">{stats.aiThinksMode}</div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-sm">1v1 MULTIPLAYER</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black">🎮 {stats.multiplayerMode}</div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-sm">GAMES WON</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-green-600">{stats.won}</div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-sm">GAMES LOST</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-red-600">{stats.lost}</div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-sm">AVG QUESTIONS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black">{stats.avgQuestions}</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Game Sessions/Multiplayer Toggle */}
          <div className="space-y-4">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
              <h2 className="text-2xl font-black">
                {viewMode === 'single' ? `SINGLE PLAYER SESSIONS (${totalSessions})` : `MULTIPLAYER GAMES (${totalMpGames})`}
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleViewModeChange('single')}
                  variant={viewMode === 'single' ? 'default' : 'outline'}
                  className="border-2 border-foreground font-black"
                >
                  SINGLE PLAYER
                </Button>
                <Button
                  onClick={() => handleViewModeChange('multiplayer')}
                  variant={viewMode === 'multiplayer' ? 'default' : 'outline'}
                  className="border-2 border-foreground font-black"
                >
                  MULTIPLAYER
                </Button>
              </div>
            </div>

            {/* Single Player Sessions */}
            {viewMode === 'single' && (
              <>
                {sessions.length === 0 ? (
                  <Card className="border-4 border-foreground">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No game sessions yet
                    </CardContent>
                  </Card>
                ) : (
                  sessions.map((session) => (
                    <Card
                      key={session.id}
                      className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
                    >
                      <CardHeader>
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-black uppercase">
                              {session.game_type === 'human-thinks' ? '🧠 HUMAN THINKS' : '🤖 AI THINKS'}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(session.created_at)}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-3 py-1 text-xs font-black border-2 border-foreground ${
                              session.is_won ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {session.is_won ? 'WON' : 'LOST'}
                            </span>
                            <span className="px-3 py-1 text-xs font-black border-2 border-foreground bg-background">
                              {session.question_count} QUESTIONS
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {selectedSession?.id === session.id && (
                        <CardContent className="border-t-4 border-foreground pt-4">
                          {session.secret_word && (
                            <div className="mb-4 p-4 bg-muted border-2 border-foreground">
                              <p className="text-sm font-bold mb-1">SECRET WORD:</p>
                              <p className="text-xl font-black">{session.secret_word}</p>
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            <p className="text-sm font-bold">QUESTIONS & ANSWERS:</p>
                            {session.questions.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No questions recorded</p>
                            ) : (
                              session.questions.map((q) => (
                                <div
                                  key={q.id}
                                  className="p-3 bg-muted border-2 border-foreground"
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="text-xs font-black bg-foreground text-background px-2 py-1 shrink-0">
                                      Q{q.question_number}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold break-words">{q.question_text}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Answer: <span className="font-black">{q.answer}</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          
                          <div className="mt-4 text-xs text-muted-foreground">
                            <p>Session ID: {session.id}</p>
                            {session.ended_at && <p>Ended: {formatDate(session.ended_at)}</p>}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </>
            )}

            {/* Multiplayer Games */}
            {viewMode === 'multiplayer' && (
              <>
                {multiplayerGames.length === 0 ? (
                  <Card className="border-4 border-foreground">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No multiplayer games yet
                    </CardContent>
                  </Card>
                ) : (
                  multiplayerGames.map((game) => (
                    <Card
                      key={game.id}
                      className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      onClick={() => setSelectedMpGame(selectedMpGame?.id === game.id ? null : game)}
                    >
                      <CardHeader>
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-black uppercase">
                              🎮 {game.player1_name} vs {game.player2_name || 'WAITING'}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(game.created_at)}
                            </p>
                            <p className="text-xs font-bold mt-1">
                              Code: {game.game_code}
                              {game.rematch_game_id && <span className="ml-2 text-accent">🔄 REMATCH</span>}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-3 py-1 text-xs font-black border-2 border-foreground ${
                              game.game_status === 'ended' ? 'bg-blue-500 text-white' : 
                              game.game_status === 'active' ? 'bg-yellow-500 text-black' : 
                              'bg-gray-500 text-white'
                            }`}>
                              {game.game_status.toUpperCase()}
                            </span>
                            {game.game_status === 'ended' && (
                              <>
                                <span className={`px-3 py-1 text-xs font-black border-2 border-foreground ${
                                  game.is_won ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                  {game.is_won ? 'WON' : 'LOST'}
                                </span>
                                <span className="px-3 py-1 text-xs font-black border-2 border-foreground bg-background">
                                  {game.question_count} QUESTIONS
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {selectedMpGame?.id === game.id && (
                        <CardContent className="border-t-4 border-foreground pt-4">
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                            <div className="p-4 bg-muted border-2 border-foreground">
                              <p className="text-sm font-bold mb-2">GAME INFO:</p>
                              <p className="text-xs">Thinker: <span className="font-black">{game.current_thinker === 'player1' ? game.player1_name : game.player2_name}</span></p>
                              <p className="text-xs">Questioner: <span className="font-black">{game.current_questioner === 'player1' ? game.player1_name : game.current_questioner === 'player2' ? game.player2_name : 'N/A'}</span></p>
                              {game.winner && (
                                <p className="text-xs mt-1">Winner: <span className="font-black text-green-600">{game.winner === 'player1' ? game.player1_name : game.player2_name}</span></p>
                              )}
                            </div>
                            {game.secret_word && (
                              <div className="p-4 bg-muted border-2 border-foreground">
                                <p className="text-sm font-bold mb-1">SECRET WORD:</p>
                                <p className="text-xl font-black">{game.secret_word}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-sm font-bold">QUESTIONS & ANSWERS:</p>
                            {game.questions.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No questions recorded</p>
                            ) : (
                              game.questions.map((q) => (
                                <div
                                  key={q.id}
                                  className="p-3 bg-muted border-2 border-foreground"
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="text-xs font-black bg-foreground text-background px-2 py-1 shrink-0">
                                      Q{q.question_number}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold break-words">{q.question_text}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Answer: <span className="font-black">{q.answer}</span>
                                        {q.is_guess && <span className="ml-2 text-accent font-black">🎯 GUESS</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          
                          <div className="mt-4 text-xs text-muted-foreground">
                            <p>Game ID: {game.id}</p>
                            {game.started_at && <p>Started: {formatDate(game.started_at)}</p>}
                            {game.ended_at && <p>Ended: {formatDate(game.ended_at)}</p>}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-2 border-foreground font-black"
                >
                  <ChevronLeft size={20} />
                  PREV
                </Button>
                <span className="font-black">
                  PAGE {currentPage} OF {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-2 border-foreground font-black"
                >
                  NEXT
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
