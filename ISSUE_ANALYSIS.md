# Issue Analysis: Questioner Stuck on Waiting Screen

## Current Situation

**User (Isuru - Questioner)** is stuck seeing:
```
"Waiting for Rajitha to set the secret word..."
```

Even after **Rajitha (Thinker)** has set the secret word.

---

## Code Locations to Review

### 1. Waiting Screen Condition (Line 282)
**File:** `src/pages/MultiplayerGamePage.tsx`

```typescript
// Waiting screen - randomly assigned word setter
if (game.game_status === 'waiting' && playerNumber) {
  // ... shows waiting screen
}
```

**This renders when:** `game.game_status === 'waiting'`

---

### 2. Active Game Condition (Line 543)
**File:** `src/pages/MultiplayerGamePage.tsx`

```typescript
// Active game
if (game.game_status === 'active' && playerNumber) {
  return (
    <MultiplayerGameplay
      game={game}
      playerNumber={playerNumber}
    />
  );
}
```

**This renders when:** `game.game_status === 'active'`

---

### 3. Update Secret Word Function (Lines 202-281)
**File:** `src/db/multiplayerApi.ts`

```typescript
export async function updateSecretWord(
  gameId: string, 
  secretWord: string, 
  setterPlayer: 'player1' | 'player2'
): Promise<void> {
  // ... validation code ...
  
  // Update the game
  const { data, error } = await supabase
    .from('multiplayer_games')
    .update({ 
      secret_word: secretWord,
      game_status: 'active',  // ← SHOULD CHANGE STATUS HERE
      current_thinker: setterPlayer,
      current_questioner: questioner,
      word_setter_claimed: setterPlayer
    })
    .eq('id', gameId)
    .eq('word_setter_claimed', setterPlayer)  // ← CRITICAL: Only updates if this matches
    .select();
  
  // ... error handling ...
}
```

**This should:** Change `game_status` from 'waiting' to 'active'

---

### 4. Subscription Callback (Lines 62-94)
**File:** `src/pages/MultiplayerGamePage.tsx`

```typescript
const unsubscribe = subscribeToGame(game.id, (updatedGame) => {
  console.log('Game updated via subscription:', {
    gameId: updatedGame.id,
    status: updatedGame.game_status,  // ← Should be 'active' after word is set
    secretWord: updatedGame.secret_word ? '***SET***' : 'NOT SET',
  });
  
  setGame((prevGame) => {
    console.log('Updating game state from:', {
      prevStatus: prevGame?.game_status,  // ← Should be 'waiting'
    }, 'to:', {
      newStatus: updatedGame.game_status,  // ← Should be 'active'
    });
    
    return updatedGame;  // ← Updates React state
  });
});
```

**This should:** Receive UPDATE event and update React state

---

## Possible Root Causes

### Hypothesis 1: Old Game Issue
**Problem:** User is testing with a game created BEFORE the fix
- Old games were created with `game_status: 'active'` (wrong!)
- When secret word is set, status changes from 'active' to 'active' (no change!)
- Subscription doesn't fire because there's no change

**Solution:** Start a FRESH rematch after the fix

---

### Hypothesis 2: word_setter_claimed Mismatch
**Problem:** The UPDATE query has this condition:
```typescript
.eq('word_setter_claimed', setterPlayer)
```

If `word_setter_claimed` in the database doesn't match `setterPlayer`, the UPDATE affects 0 rows (silent failure).

**Check:** Console logs should show `rowsAffected: 0`

---

### Hypothesis 3: Subscription Not Firing
**Problem:** Real-time subscription is not receiving UPDATE events

**Check:** Console logs should show "Subscription received payload"

---

### Hypothesis 4: React Not Re-rendering
**Problem:** State updates but component doesn't re-render

**Check:** Console logs should show "Updating game state from"

---

## What I Need From You

Please help me identify which hypothesis is correct by checking:

1. **Is this an OLD game or a NEW rematch?**
   - If OLD: Please start a fresh rematch
   - If NEW: Continue to step 2

2. **Open browser console (F12) on BOTH screens**
   - Rajitha's screen (thinker)
   - Isuru's screen (questioner)

3. **When Rajitha clicks "START GAME", check console logs:**

**In Rajitha's console, look for:**
```
updateSecretWord called: { ... }
Current game state: { game_status: '???', ... }
Update result: { success: ???, rowsAffected: ??? }
```

**In Isuru's console, look for:**
```
Subscription received payload: { event: 'UPDATE', status: '???' }
Game updated via subscription: { status: '???' }
Updating game state from: { prevStatus: '???' } to: { newStatus: '???' }
```

4. **Share the console output with me**

This will help me identify exactly where the flow is breaking!

---

## Questions for You

1. **Which game are you testing?**
   - [ ] An old game from before my fixes
   - [ ] A fresh rematch created after my fixes

2. **What do you see in the console logs?**
   - Please share the output

3. **Do you see any errors in the console?**
   - Red error messages?

4. **What is the current value of `game.game_status`?**
   - You can check this by adding `console.log('Current game status:', game.game_status)` in the component

---

## My Suspicion

I suspect the issue is **Hypothesis 1**: You're testing with an old game that was created with `game_status: 'active'`. When the secret word is set, it tries to change from 'active' to 'active', which is no change, so the subscription doesn't fire.

**Solution:** Start a completely fresh rematch and test again.

But I need your console logs to confirm this!
