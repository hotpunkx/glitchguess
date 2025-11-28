import { supabase } from './supabase';
import type { MultiplayerGame, MultiplayerQuestion } from '@/types/types';

// Generate a random 6-character game code
function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new multiplayer game
export async function createMultiplayerGame(
  playerName: string,
  playerSession: string,
  isPublic: boolean = false
): Promise<{ gameId: string; gameCode: string }> {
  // Generate unique game code
  let gameCode = generateGameCode();
  let attempts = 0;
  
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from('multiplayer_games')
      .select('id')
      .eq('game_code', gameCode)
      .maybeSingle();
    
    if (!existing) break;
    gameCode = generateGameCode();
    attempts++;
  }

  // Randomly assign who thinks first
  const currentThinker = Math.random() > 0.5 ? 'player1' : 'player2';

  const { data, error } = await supabase
    .from('multiplayer_games')
    .insert({
      game_code: gameCode,
      player1_name: playerName,
      player1_session: playerSession,
      current_thinker: currentThinker,
      game_status: 'waiting',
      is_public: isPublic,
    })
    .select('id, game_code')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to create game');

  return { gameId: data.id, gameCode: data.game_code };
}

// Join an existing multiplayer game
export async function joinMultiplayerGame(
  gameCode: string,
  playerName: string,
  playerSession: string
): Promise<string> {
  // Check if game exists and is waiting
  const { data: game, error: fetchError } = await supabase
    .from('multiplayer_games')
    .select('*')
    .eq('game_code', gameCode.toUpperCase())
    .eq('game_status', 'waiting')
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!game) throw new Error('Game not found or already started');
  if (game.player2_name) throw new Error('Game is full');

  // Randomly select who will set the word (player1 or player2)
  const randomWordSetter: 'player1' | 'player2' = Math.random() < 0.5 ? 'player1' : 'player2';

  // Join the game
  const { data, error } = await supabase
    .from('multiplayer_games')
    .update({
      player2_name: playerName,
      player2_session: playerSession,
      word_setter_claimed: randomWordSetter,
      started_at: new Date().toISOString(),
    })
    .eq('id', game.id)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to join game');

  return data.id;
}

// Get multiplayer game by ID
export async function getMultiplayerGame(gameId: string): Promise<MultiplayerGame | null> {
  const { data, error } = await supabase
    .from('multiplayer_games')
    .select('*')
    .eq('id', gameId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Get multiplayer game by code
export async function getMultiplayerGameByCode(gameCode: string): Promise<MultiplayerGame | null> {
  const { data, error } = await supabase
    .from('multiplayer_games')
    .select('*')
    .eq('game_code', gameCode.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Add question to multiplayer game
export async function addMultiplayerQuestion(
  gameId: string,
  questionNumber: number,
  questionText: string,
  answer: string,
  isGuess: boolean = false
): Promise<void> {
  const { error } = await supabase
    .from('multiplayer_questions')
    .insert({
      game_id: gameId,
      question_number: questionNumber,
      question_text: questionText,
      answer,
      is_guess: isGuess,
    });

  if (error) throw error;

  // Update question count only if not pending
  if (answer !== 'pending') {
    await supabase
      .from('multiplayer_games')
      .update({ question_count: questionNumber })
      .eq('id', gameId);
  }
}

// Update answer for a pending question
export async function updateQuestionAnswer(
  gameId: string,
  questionNumber: number,
  answer: string
): Promise<void> {
  const { error } = await supabase
    .from('multiplayer_questions')
    .update({ answer })
    .eq('game_id', gameId)
    .eq('question_number', questionNumber);

  if (error) throw error;

  // Update question count
  await supabase
    .from('multiplayer_games')
    .update({ question_count: questionNumber })
    .eq('id', gameId);
}

// Get questions for a multiplayer game
export async function getMultiplayerQuestions(gameId: string): Promise<MultiplayerQuestion[]> {
  const { data, error } = await supabase
    .from('multiplayer_questions')
    .select('*')
    .eq('game_id', gameId)
    .order('question_number', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Claim word setter role (atomic operation to prevent race conditions)
export async function claimWordSetter(
  gameId: string,
  player: 'player1' | 'player2'
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('claim_word_setter', {
      p_game_id: gameId,
      p_player: player
    });

  if (error) {
    console.error('Error claiming word setter:', error);
    return false;
  }

  return data === true;
}

// Update secret word
export async function updateSecretWord(
  gameId: string, 
  secretWord: string, 
  setterPlayer: 'player1' | 'player2'
): Promise<void> {
  // The player who sets the word is the thinker/answerer
  // The other player is the questioner
  const questioner = setterPlayer === 'player1' ? 'player2' : 'player1';
  
  console.log('updateSecretWord called:', {
    gameId,
    secretWord: '***HIDDEN***',
    setterPlayer,
    questioner,
  });
  
  // First, verify the current game state
  const { data: currentGame, error: fetchError } = await supabase
    .from('multiplayer_games')
    .select('word_setter_claimed, game_status, secret_word')
    .eq('id', gameId)
    .maybeSingle();
  
  if (fetchError) {
    console.error('Error fetching game:', fetchError);
    throw fetchError;
  }
  
  if (!currentGame) {
    console.error('Game not found');
    throw new Error('Game not found');
  }
  
  console.log('Current game state:', {
    word_setter_claimed: currentGame.word_setter_claimed,
    game_status: currentGame.game_status,
    secret_word: currentGame.secret_word ? '***SET***' : 'NOT SET',
  });
  
  // Check if this player is allowed to set the word
  if (currentGame.word_setter_claimed !== setterPlayer) {
    console.error('Player not allowed to set word:', {
      expected: currentGame.word_setter_claimed,
      actual: setterPlayer,
    });
    throw new Error('You are not allowed to set the secret word');
  }
  
  // Update the game
  const { data, error } = await supabase
    .from('multiplayer_games')
    .update({ 
      secret_word: secretWord,
      game_status: 'active',
      current_thinker: setterPlayer,
      current_questioner: questioner,
      word_setter_claimed: setterPlayer
    })
    .eq('id', gameId)
    .eq('word_setter_claimed', setterPlayer)
    .select();
  
  console.log('Update result:', {
    success: !error,
    rowsAffected: data?.length || 0,
    error: error?.message,
  });

  if (error) {
    console.error('Error updating secret word:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    console.error('No rows updated - word_setter_claimed mismatch');
    throw new Error('Failed to update game - please refresh and try again');
  }
  
  console.log('Secret word set successfully');
}

// End multiplayer game
export async function endMultiplayerGame(
  gameId: string,
  isWon: boolean,
  winner?: 'player1' | 'player2'
): Promise<void> {
  const { error } = await supabase
    .from('multiplayer_games')
    .update({
      game_status: 'ended',
      is_won: isWon,
      winner: winner || null,
      ended_at: new Date().toISOString(),
    })
    .eq('id', gameId);

  if (error) throw error;
}

// Request rematch
export async function requestRematch(
  gameId: string,
  playerNumber: 'player1' | 'player2'
): Promise<void> {
  const updateField = playerNumber === 'player1' ? 'player1_rematch' : 'player2_rematch';
  
  const { error } = await supabase
    .from('multiplayer_games')
    .update({ [updateField]: true })
    .eq('id', gameId);

  if (error) throw error;
}

// Create rematch game
export async function createRematchGame(oldGameId: string): Promise<string> {
  // Get old game data
  const { data: oldGame, error: fetchError } = await supabase
    .from('multiplayer_games')
    .select('*')
    .eq('id', oldGameId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!oldGame) throw new Error('Original game not found');

  // Check if rematch already exists
  if (oldGame.rematch_game_id) {
    console.log('Rematch already created, returning existing game ID:', oldGame.rematch_game_id);
    return oldGame.rematch_game_id;
  }

  // Generate new game code
  let gameCode = generateGameCode();
  let attempts = 0;
  
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from('multiplayer_games')
      .select('id')
      .eq('game_code', gameCode)
      .maybeSingle();
    
    if (!existing) break;
    gameCode = generateGameCode();
    attempts++;
  }

  // Switch roles - if player1 was thinking, now player2 thinks
  // The previous questioner becomes the new thinker (answerer)
  const newThinker = oldGame.current_thinker === 'player1' ? 'player2' : 'player1';
  const newQuestioner = oldGame.current_thinker; // Previous thinker becomes questioner

  // Create new game with switched roles
  // Set word_setter_claimed to the new thinker so only they can set the word
  // Game starts in 'waiting' status until secret word is set
  const { data, error } = await supabase
    .from('multiplayer_games')
    .insert({
      game_code: gameCode,
      player1_name: oldGame.player1_name,
      player2_name: oldGame.player2_name,
      player1_session: oldGame.player1_session,
      player2_session: oldGame.player2_session,
      current_thinker: newThinker,
      current_questioner: newQuestioner,
      word_setter_claimed: newThinker,
      game_status: 'waiting', // Changed from 'active' - wait for secret word
      started_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to create rematch');

  // Update old game with rematch_game_id so player2 can find it
  const { error: updateError } = await supabase
    .from('multiplayer_games')
    .update({ rematch_game_id: data.id })
    .eq('id', oldGameId);

  if (updateError) {
    console.error('Failed to update rematch_game_id:', updateError);
    // Don't throw - the rematch game was created successfully
  }

  return data.id;
}

// Subscribe to game updates
export function subscribeToGame(
  gameId: string,
  callback: (game: MultiplayerGame) => void
) {
  console.log('Creating subscription for game:', gameId);
  
  const channel = supabase
    .channel(`game:${gameId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'multiplayer_games',
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        console.log('Subscription received payload:', {
          event: payload.eventType,
          gameId: (payload.new as any)?.id,
          status: (payload.new as any)?.game_status,
          secretWord: (payload.new as any)?.secret_word ? '***SET***' : 'NOT SET',
        });
        callback(payload.new as MultiplayerGame);
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  return () => {
    console.log('Removing subscription for game:', gameId);
    supabase.removeChannel(channel);
  };
}

// Subscribe to question updates
export function subscribeToQuestions(
  gameId: string,
  callback: (question: MultiplayerQuestion) => void
) {
  const channel = supabase
    .channel(`questions:${gameId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'multiplayer_questions',
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => {
        callback(payload.new as MultiplayerQuestion);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'multiplayer_questions',
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => {
        callback(payload.new as MultiplayerQuestion);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Get all public games for lobby
export async function getPublicGames(): Promise<MultiplayerGame[]> {
  const { data, error } = await supabase
    .from('multiplayer_games')
    .select('*')
    .eq('is_public', true)
    .in('game_status', ['waiting', 'active'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Subscribe to public games changes for lobby
export function subscribeToPublicGames(callback: (game: MultiplayerGame) => void) {
  const channel = supabase
    .channel('public-games-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'multiplayer_games',
        filter: 'is_public=eq.true',
      },
      (payload) => {
        callback(payload.new as MultiplayerGame);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

