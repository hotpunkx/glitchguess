/*
# Create Multiplayer Game Tables

## Overview
Add tables for 1v1 multiplayer gameplay with real-time synchronization.

## Tables

### multiplayer_games
Stores multiplayer game sessions:
- `id` (uuid, primary key): Unique game identifier
- `game_code` (text, unique): Shareable 6-character code (e.g., "ABC123")
- `player1_name` (text): First player's name
- `player2_name` (text, nullable): Second player's name (null until joined)
- `player1_session` (text): Player 1's browser session ID
- `player2_session` (text, nullable): Player 2's browser session ID
- `current_thinker` (text): 'player1' or 'player2' - who is thinking
- `game_status` (text): 'waiting', 'active', 'ended'
- `secret_word` (text, nullable): The word being guessed
- `question_count` (integer): Current question number
- `is_won` (boolean): Whether the game was won
- `player1_rematch` (boolean): Player 1 wants rematch
- `player2_rematch` (boolean): Player 2 wants rematch
- `created_at` (timestamptz): When game was created
- `started_at` (timestamptz, nullable): When both players joined
- `ended_at` (timestamptz, nullable): When game ended

### multiplayer_questions
Stores questions for multiplayer games:
- `id` (uuid, primary key)
- `game_id` (uuid, foreign key): References multiplayer_games
- `question_number` (integer): Question order
- `question_text` (text): The question
- `answer` (text): Yes/No/Sometimes
- `created_at` (timestamptz)

## Indexes
- game_code for fast lookups
- game_status for filtering active games
- Foreign key index for questions

## Security
- Public read/write access (no RLS)
- Real-time enabled for live updates
*/

-- Create multiplayer_games table
CREATE TABLE IF NOT EXISTS multiplayer_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_code text UNIQUE NOT NULL,
  player1_name text NOT NULL,
  player2_name text,
  player1_session text NOT NULL,
  player2_session text,
  current_thinker text NOT NULL CHECK (current_thinker IN ('player1', 'player2')),
  game_status text NOT NULL DEFAULT 'waiting' CHECK (game_status IN ('waiting', 'active', 'ended')),
  secret_word text,
  question_count integer DEFAULT 0,
  is_won boolean DEFAULT false,
  player1_rematch boolean DEFAULT false,
  player2_rematch boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  ended_at timestamptz
);

-- Create multiplayer_questions table
CREATE TABLE IF NOT EXISTS multiplayer_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES multiplayer_games(id) ON DELETE CASCADE,
  question_number integer NOT NULL,
  question_text text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_multiplayer_games_code ON multiplayer_games(game_code);
CREATE INDEX IF NOT EXISTS idx_multiplayer_games_status ON multiplayer_games(game_status);
CREATE INDEX IF NOT EXISTS idx_multiplayer_questions_game_id ON multiplayer_questions(game_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE multiplayer_games;
ALTER PUBLICATION supabase_realtime ADD TABLE multiplayer_questions;