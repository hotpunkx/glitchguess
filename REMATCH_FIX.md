# Rematch Role Assignment Fix

## Problem Statement

When players requested a rematch in the 1v1 multiplayer game, both players were able to set the secret word. This violated the game's role-switching mechanic and caused confusion.

### Expected Behavior

In a rematch, roles should **switch**:
- The player who was **thinking of the word** (answerer) in the previous game should become the **questioner**
- The player who was **asking questions** (questioner) in the previous game should become the **thinker** (answerer) and set the new word

### Actual Behavior (Before Fix)

Both players could set the secret word, leading to:
- Race conditions (whoever sets first wins)
- Confusion about whose turn it is
- Violation of fair play (roles not switching)

## Root Cause

The `createRematchGame()` function was correctly switching the `current_thinker` role, but it was **not setting** the `word_setter_claimed` field. This field is critical because it:

1. **Prevents race conditions** - Only one player can claim the right to set the word
2. **Enforces role assignment** - The UI checks this field to determine who can set the word
3. **Maintains game state** - Tracks which player has claimed the word-setting privilege

### Code Before Fix

```typescript
export async function createRematchGame(oldGameId: string): Promise<string> {
  // ... fetch old game data ...

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
      // ❌ Missing: word_setter_claimed field!
      game_status: 'active',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  // ...
}
```

## Solution

Set the `word_setter_claimed` field to the `newThinker` when creating the rematch game. This ensures that only the player who should be thinking (the previous questioner) can set the word.

### Code After Fix

```typescript
export async function createRematchGame(oldGameId: string): Promise<string> {
  // ... fetch old game data ...

  // Switch roles - if player1 was thinking, now player2 thinks
  // The previous questioner becomes the new thinker (answerer)
  const newThinker = oldGame.current_thinker === 'player1' ? 'player2' : 'player1';

  // Create new game with switched roles
  // Set word_setter_claimed to the new thinker so only they can set the word
  const { data, error } = await supabase
    .from('multiplayer_games')
    .insert({
      game_code: gameCode,
      player1_name: oldGame.player1_name,
      player2_name: oldGame.player2_name,
      player1_session: oldGame.player1_session,
      player2_session: oldGame.player2_session,
      current_thinker: newThinker,
      word_setter_claimed: newThinker,  // ✅ Added: Claim word setter for new thinker
      game_status: 'active',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  // ...
}
```

## How It Works

### Database Schema

The `multiplayer_games` table has these relevant fields:

```sql
CREATE TABLE multiplayer_games (
  id uuid PRIMARY KEY,
  current_thinker text CHECK (current_thinker IN ('player1', 'player2')),
  word_setter_claimed text CHECK (word_setter_claimed IN ('player1', 'player2')),
  secret_word text,
  -- ... other fields ...
);
```

### Role Assignment Logic

1. **Fetch Old Game Data**
   ```typescript
   const oldGame = await fetchGame(oldGameId);
   // oldGame.current_thinker = 'player1' (example)
   ```

2. **Calculate New Thinker**
   ```typescript
   const newThinker = oldGame.current_thinker === 'player1' ? 'player2' : 'player1';
   // newThinker = 'player2' (switched!)
   ```

3. **Create New Game with Claimed Word Setter**
   ```typescript
   await createGame({
     current_thinker: newThinker,        // 'player2'
     word_setter_claimed: newThinker,    // 'player2' (same as thinker)
   });
   ```

4. **UI Checks Word Setter**
   ```typescript
   // In MultiplayerGameplay.tsx
   const canSetWord = game.word_setter_claimed === playerNumber;
   
   if (canSetWord) {
     // Show word input form
   } else {
     // Show waiting screen
   }
   ```

## Example Scenarios

### Scenario 1: Complete Game Flow

**Initial Game:**
```
Player A (player1): Thinker
  - Sets word: "elephant"
  - Answers questions
  
Player B (player2): Questioner
  - Asks questions
  - Guesses correctly in 12 questions
  - Wins!

Database State:
  current_thinker: 'player1'
  word_setter_claimed: 'player1'
  secret_word: 'elephant'
```

**Rematch Requested:**
```
Both players click "Request Rematch"
→ createRematchGame() is called
```

**New Game Created:**
```
Player A (player1): Questioner ← Role switched!
  - Sees waiting screen
  - Cannot set word
  
Player B (player2): Thinker ← Role switched!
  - Sees word input form
  - Can set word
  - Sets word: "dolphin"

Database State:
  current_thinker: 'player2'        ← Switched from player1
  word_setter_claimed: 'player2'    ← Set to new thinker
  secret_word: null (until player2 sets it)
```

### Scenario 2: What Happens Without the Fix

**Without `word_setter_claimed` set:**
```
New Game Created:
  current_thinker: 'player2'
  word_setter_claimed: null  ← Problem!
  
Player A (player1):
  - Tries to claim word setter → Success! (race condition)
  - Sets word: "cat"
  
Player B (player2):
  - Tries to claim word setter → Fails (already claimed)
  - Sees waiting screen
  
Result: Player A sets word even though they should be questioner! ❌
```

**With `word_setter_claimed` set:**
```
New Game Created:
  current_thinker: 'player2'
  word_setter_claimed: 'player2'  ← Already claimed!
  
Player A (player1):
  - Tries to claim word setter → Fails (already claimed)
  - Sees waiting screen ✓
  
Player B (player2):
  - Already has word setter claimed
  - Sees word input form
  - Sets word: "dolphin" ✓
  
Result: Only Player B can set word, as intended! ✅
```

## Technical Details

### Word Setter Claiming Mechanism

The database has an RPC function `claim_word_setter` that atomically claims the word setter role:

```sql
CREATE OR REPLACE FUNCTION claim_word_setter(
  p_game_id uuid,
  p_player text
) RETURNS boolean AS $$
BEGIN
  -- Try to claim the word setter role atomically
  UPDATE multiplayer_games
  SET word_setter_claimed = p_player
  WHERE id = p_game_id
    AND game_status = 'waiting'
    AND word_setter_claimed IS NULL  -- Only if not already claimed
    AND player1_name IS NOT NULL
    AND player2_name IS NOT NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

### Why This Matters for Rematch

In a **new game** (not rematch):
- `word_setter_claimed` starts as `NULL`
- Both players race to claim it
- First one to call `claim_word_setter()` wins
- This is fine because there's no predetermined thinker

In a **rematch**:
- `word_setter_claimed` is **pre-set** to the new thinker
- The `claim_word_setter()` function will fail for the other player
- Only the designated thinker can set the word
- This enforces the role-switching mechanic

## Files Changed

### `src/db/multiplayerApi.ts`

**Function:** `createRematchGame()`

**Changes:**
1. Added `word_setter_claimed: newThinker` to the insert statement
2. Added explanatory comments about role switching
3. Clarified that the previous questioner becomes the new thinker

**Lines Changed:** 288-303

## Testing

### Manual Test Steps

1. **Start a game**
   - Player A creates game, sets word "elephant"
   - Player B joins game
   - Player B asks questions and wins

2. **Request rematch**
   - Both players click "Request Rematch"
   - Wait for rematch to start

3. **Verify role switch**
   - Player A (previous thinker) should see waiting screen
   - Player B (previous questioner) should see word input form
   - Player B sets word "dolphin"
   - Game starts with switched roles

4. **Verify word setter**
   - Check database: `word_setter_claimed` should equal `current_thinker`
   - Player A should NOT be able to set word
   - Only Player B can set word

### Expected Results

✅ **Pass Criteria:**
- Only the previous questioner can set the word in rematch
- The previous thinker sees a waiting screen
- Roles are correctly switched
- No race conditions occur
- `word_setter_claimed` matches `current_thinker`

❌ **Fail Criteria:**
- Both players can set the word
- Wrong player can set the word
- Roles are not switched
- Race condition allows wrong player to claim word setter

## Benefits

### 1. Fair Play
- ✅ Roles switch correctly in rematch
- ✅ Each player gets a turn as thinker and questioner
- ✅ No advantage from being first to load the page

### 2. No Race Conditions
- ✅ Word setter is predetermined
- ✅ No race to claim the role
- ✅ Atomic assignment prevents conflicts

### 3. Clear UX
- ✅ Players know their role immediately
- ✅ No confusion about who sets the word
- ✅ Consistent with game rules

### 4. Code Clarity
- ✅ Explicit role assignment
- ✅ Clear comments explain logic
- ✅ Easier to maintain and debug

## Related Code

### Word Setting UI Logic

**File:** `src/components/multiplayer/MultiplayerGameplay.tsx`

```typescript
// Determine if this player should set the word
const shouldSetWord = isAnswerer && !game.secret_word;

// Check if this player has claimed word setter
const hasClaimedWordSetter = game.word_setter_claimed === playerNumber;

// Show word input if:
// 1. Player is the answerer (thinker)
// 2. No word has been set yet
// 3. This player has claimed word setter OR no one has claimed it yet
const showSecretInput = shouldSetWord && (
  hasClaimedWordSetter || 
  !game.word_setter_claimed
);
```

### Game Status Flow

```
1. Game Ends
   ↓
2. Both Players Request Rematch
   ↓
3. createRematchGame() called
   ↓
4. New game created with:
   - Switched current_thinker
   - word_setter_claimed = new thinker
   - game_status = 'active'
   ↓
5. Players navigate to new game
   ↓
6. UI checks word_setter_claimed
   ↓
7. Only new thinker sees word input
   ↓
8. Game starts after word is set
```

## Summary

This fix ensures that rematch games correctly assign the word-setting role to the previous questioner by pre-setting the `word_setter_claimed` field. This prevents race conditions, enforces fair role-switching, and provides a clear, predictable user experience.

**Key Change:** Added one line to `createRematchGame()`:
```typescript
word_setter_claimed: newThinker,
```

**Impact:** Fixes role assignment in all rematch scenarios, ensuring only the correct player can set the secret word.
