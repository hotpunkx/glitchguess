/*
# Add rematch_game_id field

## Purpose
Add a field to store the ID of the rematch game so both players can navigate to the same game.

## Changes
- Add `rematch_game_id` (uuid, nullable) to multiplayer_games table
- This field will be set by player1 when creating a rematch
- Player2 will read this field to navigate to the same rematch game

## Migration
ALTER TABLE multiplayer_games ADD COLUMN rematch_game_id uuid;
*/

-- Add rematch_game_id column
ALTER TABLE multiplayer_games ADD COLUMN IF NOT EXISTS rematch_game_id uuid;
