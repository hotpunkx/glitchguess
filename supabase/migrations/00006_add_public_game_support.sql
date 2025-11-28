/*
# Add Public Game Support

1. Schema Changes
- Add `is_public` column to `multiplayer_games` table
  - `is_public` (boolean, default: false) - Indicates if the game is public (visible in lobby) or private (requires code/link)

2. Purpose
- Enable players to create either private games (shared via link/code) or public games (visible in lobby)
- Public games appear in the lobby for anyone to join
- Private games require the game code or direct link to join

3. Notes
- Default is false (private) to maintain backward compatibility
- Public games will be queryable by game_status for lobby display
*/

-- Add is_public column to multiplayer_games table
ALTER TABLE multiplayer_games
ADD COLUMN is_public boolean DEFAULT false NOT NULL;

-- Create index for efficient public game queries
CREATE INDEX idx_multiplayer_games_public_status ON multiplayer_games(is_public, game_status)
WHERE is_public = true;
