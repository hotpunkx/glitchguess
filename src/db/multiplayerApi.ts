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
  playerSession: string
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

  // Join the game
  const { data, error } = await supabase
    .from('multiplayer_games')
    .update({
      player2_name: playerName,
      player2_session: playerSession,
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
  answer: string
): Promise<void> {
  const { error } = await supabase
    .from('multiplayer_questions')
    .insert({
      game_id: gameId,
      question_number: questionNumber,
      question_text: questionText,
      answer,
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

// Update secret word
export async function updateSecretWord(
  gameId: string, 
  secretWord: string, 
  setterPlayer: 'player1' | 'player2'
): Promise<void> {
  // The player who sets the word is the thinker/answerer
  // The other player is the questioner
  const questioner = setterPlayer === 'player1' ? 'player2' : 'player1';
  
  const { error } = await supabase
    .from('multiplayer_games')
    .update({ 
      secret_word: secretWord,
      game_status: 'active',
      current_thinker: setterPlayer,
      current_questioner: questioner
    })
    .eq('id', gameId);

  if (error) throw error;
}

// End multiplayer game
export async function endMultiplayerGame(
  gameId: string,
  isWon: boolean
): Promise<void> {
  const { error } = await supabase
    .from('multiplayer_games')
    .update({
      game_status: 'ended',
      is_won: isWon,
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
  const newThinker = oldGame.current_thinker === 'player1' ? 'player2' : 'player1';

  // Create new game with switched roles
  const { data, error } = await supabase
    .from('multiplayer_games')
    .insert({
      game_code: gameCode,
      player1_name: oldGame.player1_name,
      player2_name: oldGame.player2_name,
      player1_session: oldGame.player1_session,
      player2_session: oldGame.player2_session,
      current_thinker: newThinker,
      game_status: 'active',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to create rematch');

  return data.id;
}

// Subscribe to game updates
export function subscribeToGame(
  gameId: string,
  callback: (game: MultiplayerGame) => void
) {
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
        callback(payload.new as MultiplayerGame);
      }
    )
    .subscribe();

  return () => {
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
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
