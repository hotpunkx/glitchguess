/*
# Game Sessions Tracking System

## Overview
This migration creates tables to track all game sessions, questions, and answers for analytics and admin dashboard.

## Tables

### 1. game_sessions
Stores each game session with unique ID and metadata.

**Columns**:
- `id` (uuid, primary key): Unique session identifier
- `game_type` (text): Type of game ('human-thinks' or 'ai-thinks')
- `secret_word` (text, nullable): The secret word (only for ai-thinks mode)
- `is_won` (boolean, default false): Whether the game was won
- `question_count` (integer, default 0): Total questions asked
- `created_at` (timestamptz): When session started
- `ended_at` (timestamptz, nullable): When session ended

### 2. game_questions
Stores each question and answer pair for a session.

**Columns**:
- `id` (uuid, primary key): Unique question identifier
- `session_id` (uuid, foreign key): References game_sessions(id)
- `question_number` (integer): Question order (1-20)
- `question_text` (text): The question asked
- `answer` (text): The answer given (Yes/No/Sometimes)
- `created_at` (timestamptz): When question was asked

## Security
- No RLS enabled (public read access for admin dashboard)
- Admin authentication handled at application level

## Indexes
- Index on session_id for fast question lookups
- Index on created_at for chronological sorting
*/

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type text NOT NULL CHECK (game_type IN ('human-thinks', 'ai-thinks')),
  secret_word text,
  is_won boolean DEFAULT false,
  question_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create game_questions table
CREATE TABLE IF NOT EXISTS game_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  question_number integer NOT NULL,
  question_text text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_questions_session_id ON game_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_questions_created_at ON game_questions(created_at DESC);

-- Add comment for documentation
COMMENT ON TABLE game_sessions IS 'Stores all game sessions with metadata for analytics';
COMMENT ON TABLE game_questions IS 'Stores questions and answers for each game session';