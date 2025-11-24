# Secret Word Update Debugging Enhancement

## Date: 2025-11-24

---

## 🐛 Issue

User (Isuru) is stuck on the waiting screen showing "Waiting for Rajitha to set the secret word..." even after Rajitha has set the secret word. The UI is not updating to show the question input.

---

## 🔍 Analysis

### Potential Root Causes

1. **Silent Update Failure**: The `updateSecretWord` function has a WHERE clause `.eq('word_setter_claimed', setterPlayer)` that could cause the UPDATE to affect 0 rows if there's a mismatch, but this would fail silently without throwing an error.

2. **Subscription Not Firing**: If the UPDATE doesn't happen, the subscription won't fire because there's no database change.

3. **State Mismatch**: There could be a mismatch between who the database thinks should set the word (`word_setter_claimed`) and who is actually trying to set it (`setterPlayer`).

---

## 💡 The Fix

### Enhanced `updateSecretWord` Function

Added comprehensive logging and validation to the `updateSecretWord` function in `src/db/multiplayerApi.ts`:

**Key Improvements:**

1. **Pre-Update Validation**
   - Fetch current game state before attempting update
   - Verify the player is allowed to set the word
   - Log current game state for debugging

2. **Explicit Error Handling**
   - Check if UPDATE affected any rows
   - Throw error if 0 rows updated (silent failure detection)
   - Provide clear error messages

3. **Comprehensive Logging**
   - Log function call parameters
   - Log current game state
   - Log update result
   - Log success/failure

---

## 📝 Code Changes

### File: `src/db/multiplayerApi.ts`

**Before:**
```typescript
export async function updateSecretWord(
  gameId: string, 
  secretWord: string, 
  setterPlayer: 'player1' | 'player2'
): Promise<void> {
  const questioner = setterPlayer === 'player1' ? 'player2' : 'player1';
  
  const { error } = await supabase
    .from('multiplayer_games')
    .update({ 
      secret_word: secretWord,
      game_status: 'active',
      current_thinker: setterPlayer,
      current_questioner: questioner,
      word_setter_claimed: setterPlayer
    })
    .eq('id', gameId)
    .eq('word_setter_claimed', setterPlayer);

  if (error) throw error;
}
```

**After:**
```typescript
export async function updateSecretWord(
  gameId: string, 
  secretWord: string, 
  setterPlayer: 'player1' | 'player2'
): Promise<void> {
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
```

---

## 🔍 What the Logs Will Show

### Expected Console Output (Success)

```
updateSecretWord called: {
  gameId: 'abc123',
  secretWord: '***HIDDEN***',
  setterPlayer: 'player1',
  questioner: 'player2'
}

Current game state: {
  word_setter_claimed: 'player1',
  game_status: 'waiting',
  secret_word: 'NOT SET'
}

Update result: {
  success: true,
  rowsAffected: 1,
  error: undefined
}

Secret word set successfully
```

### Possible Error Scenarios

#### Scenario 1: Player Not Allowed
```
updateSecretWord called: { ... }

Current game state: {
  word_setter_claimed: 'player1',
  game_status: 'waiting',
  secret_word: 'NOT SET'
}

Player not allowed to set word: {
  expected: 'player1',
  actual: 'player2'
}

 Error: You are not allowed to set the secret word
```

#### Scenario 2: Silent Update Failure
```
updateSecretWord called: { ... }

Current game state: {
  word_setter_claimed: 'player1',
  game_status: 'waiting',
  secret_word: 'NOT SET'
}

Update result: {
  success: true,
  rowsAffected: 0,
  error: undefined
}

No rows updated - word_setter_claimed mismatch

 Error: Failed to update game - please refresh and try again
```

#### Scenario 3: Database Error
```
updateSecretWord called: { ... }

Current game state: { ... }

Update result: {
  success: false,
  rowsAffected: 0,
  error: 'permission denied'
}

Error updating secret word: { ... }

 Error: permission denied
```

---

## 🧪 Testing Instructions

### Step 1: Open Browser Console

1. Open the game as Rajitha (thinker)
2. Open Developer Tools (F12)
3. Go to Console tab

### Step 2: Set Secret Word

1. Enter a secret word
2. Click "START GAME"
3. Watch the console logs

### Step 3: Analyze Logs

Look for the console output patterns above:

- **If successful**: You'll see "Secret word set successfully"
- **If player not allowed**: You'll see "Player not allowed to set word"
- **If silent failure**: You'll see "No rows updated - word_setter_claimed mismatch"
- **If database error**: You'll see "Error updating secret word"

### Step 4: Check Questioner's Screen

1. Open the game as Isuru (questioner) in another window
2. After Rajitha sets the word, check if:
   - Toast notification appears
   - Question input becomes visible
   - Waiting screen disappears

---

## 📊 Debugging Checklist

Use this checklist to diagnose the issue:

- [ ] **Function Called?**
  - Look for: `"updateSecretWord called:"`
  - If missing: Button click handler not working

- [ ] **Game State Fetched?**
  - Look for: `"Current game state:"`
  - If missing: Database fetch failed

- [ ] **Player Allowed?**
  - Check: `word_setter_claimed` matches `setterPlayer`
  - If mismatch: Role assignment issue

- [ ] **Update Successful?**
  - Check: `rowsAffected: 1`
  - If 0: Silent update failure (WHERE clause mismatch)

- [ ] **Success Message?**
  - Look for: `"Secret word set successfully"`
  - If missing: Update failed

- [ ] **Subscription Fired?**
  - Look for: `"Subscription received payload:"` (from previous logging)
  - If missing: Real-time subscription issue

- [ ] **UI Updated?**
  - Check: Questioner sees question input
  - If not: React re-render issue

---

## 🎯 Expected Behavior

### Thinker (Rajitha) Flow

1. Sees "Enter secret word" input
2. Types secret word
3. Clicks "START GAME"
4. Console logs show successful update
5. Toast: "Secret word set! Game starting..."
6. UI changes to show "Your secret word: [word]"
7. Waits for opponent to ask questions

### Questioner (Isuru) Flow

1. Sees "Waiting for Rajitha to set the secret word..."
2. When Rajitha sets word:
   - Subscription fires
   - Console logs show game update
   - Toast: "Opponent set the secret word! You can now ask questions."
   - UI changes to show question input
3. Can now ask questions

---

## 🔧 Next Steps

Based on the console logs, we can determine:

1. **If "Player not allowed" error:**
   - Check role assignment logic
   - Verify `word_setter_claimed` is set correctly when game is created

2. **If "No rows updated" error:**
   - Check for race conditions
   - Verify `word_setter_claimed` hasn't changed between fetch and update

3. **If update succeeds but UI doesn't update:**
   - Check subscription is receiving the UPDATE event
   - Check React state is updating
   - Check conditional rendering logic

4. **If database error:**
   - Check RLS policies
   - Check Supabase connection
   - Check user permissions

---

## 📝 Files Modified

**src/db/multiplayerApi.ts**
- Added pre-update validation
- Added comprehensive logging
- Added explicit error handling for silent failures
- Added row count verification

---

## ✅ Code Quality

```bash
npm run lint
# Checked 93 files in 170ms. No fixes applied.
```

All lint checks passing.

---

## 🚀 Summary

Enhanced the `updateSecretWord` function with comprehensive logging and validation to diagnose why the questioner's UI is not updating when the thinker sets the secret word. The enhanced function will:

1. **Validate** the player is allowed to set the word before attempting update
2. **Log** all steps of the process for debugging
3. **Detect** silent update failures (0 rows affected)
4. **Throw** explicit errors with helpful messages

This will help identify exactly where the issue is occurring in the secret word update flow.

**Next:** Run the game with browser console open and analyze the logs to pinpoint the exact issue.

---

## 📚 Related Fixes

- `REMATCH_GAME_STATUS_BUG_FIX.md` - Fixed game status initialization
- `GAME_SUBSCRIPTION_FIX.md` - Fixed subscription dependencies
- `SUBSCRIPTION_DEBUGGING_ADDED.md` - Added subscription logging
- `SECRET_WORD_NOTIFICATION_AND_AI_REMOVAL_FIX.md` - Added toast notifications

This debugging enhancement completes the diagnostic tooling for the rematch system!
