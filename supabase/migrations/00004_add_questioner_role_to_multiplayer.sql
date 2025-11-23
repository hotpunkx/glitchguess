/*
# Add Questioner Role to Multiplayer Games

## Overview
Add a field to track which player is asking questions (the other player is answering).

## Changes
- Add `current_questioner` field to track who asks questions
- The player who sets the secret word is the answerer
- The other player is the questioner

## Fields Added
- `current_questioner` (text): 'player1' or 'player2' - who is asking questions
*/

-- Add current_questioner field
ALTER TABLE multiplayer_games 
ADD COLUMN IF NOT EXISTS current_questioner text CHECK (current_questioner IN ('player1', 'player2'));