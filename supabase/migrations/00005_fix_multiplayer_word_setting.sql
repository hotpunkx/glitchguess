/*
# Fix Multiplayer Word Setting - One Thinker at a Time

## Changes

1. **Add word_setter_claimed field**
   - Tracks which player has claimed the right to set the word
   - Prevents race conditions when both players try to set word simultaneously
   - NULL = no one has claimed yet
   - 'player1' or 'player2' = that player has claimed the right

2. **Add winner field**
   - Tracks which player won the game
   - NULL = no winner (game not ended or draw)
   - 'player1' or 'player2' = that player won

## Purpose

- Ensure only ONE player can become the thinker at a time
- Prevent simultaneous word setting by both players
- Track winner properly for end screen display
*/

-- Add word_setter_claimed field to prevent race conditions
ALTER TABLE multiplayer_games 
ADD COLUMN IF NOT EXISTS word_setter_claimed text 
CHECK (word_setter_claimed IN ('player1', 'player2'));

-- Add winner field to track who won
ALTER TABLE multiplayer_games 
ADD COLUMN IF NOT EXISTS winner text 
CHECK (winner IN ('player1', 'player2'));

-- Create function to claim word setter role (atomic operation)
CREATE OR REPLACE FUNCTION claim_word_setter(
  p_game_id uuid,
  p_player text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_claimed boolean;
BEGIN
  -- Try to claim the word setter role atomically
  UPDATE multiplayer_games
  SET word_setter_claimed = p_player
  WHERE id = p_game_id
    AND game_status = 'waiting'
    AND word_setter_claimed IS NULL
    AND player1_name IS NOT NULL
    AND player2_name IS NOT NULL;
  
  -- Check if we successfully claimed it
  GET DIAGNOSTICS v_claimed = ROW_COUNT;
  
  RETURN v_claimed > 0;
END;
$$;
