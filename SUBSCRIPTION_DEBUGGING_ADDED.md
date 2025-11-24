# Subscription Debugging Added

## Date: 2025-11-24

---

## 🎯 Issue

User reported that even after the opponent set the secret word, the questioner's UI still shows "Waiting for opponent to set their secret word..." This indicates the game subscription is not updating the game state properly.

---

## 🔍 Debugging Changes Added

### 1. Enhanced Logging in MultiplayerGamePage.tsx

**File:** `src/pages/MultiplayerGamePage.tsx`
**Lines:** 46-99

**Added logging:**

```typescript
useEffect(() => {
  if (!game?.id) return;

  console.log('Setting up game subscription for game:', game.id);

  // Subscribe to game updates
  const unsubscribe = subscribeToGame(game.id, (updatedGame) => {
    // Log received update
    console.log('Game updated via subscription:', {
      gameId: updatedGame.id,
      status: updatedGame.game_status,
      secretWord: updatedGame.secret_word ? '***SET***' : 'NOT SET',
      currentThinker: updatedGame.current_thinker,
      currentQuestioner: updatedGame.current_questioner,
    });
    
    // Use functional setState
    setGame((prevGame) => {
      // Log state transition
      console.log('Updating game state from:', {
        prevStatus: prevGame?.game_status,
        prevSecretWord: prevGame?.secret_word ? '***SET***' : 'NOT SET',
      }, 'to:', {
        newStatus: updatedGame.game_status,
        newSecretWord: updatedGame.secret_word ? '***SET***' : 'NOT SET',
      });
      
      // ... rest of logic
      
      return updatedGame;
    });
    
    // ... rematch logic
  });

  return () => {
    console.log('Cleaning up game subscription for game:', game.id);
    unsubscribe();
  };
}, [game?.id, playerNumber]);
```

**What it logs:**
1. When subscription is set up
2. When updates are received
3. Game state before and after update
4. When subscription is cleaned up

---

### 2. Enhanced Logging in multiplayerApi.ts

**File:** `src/db/multiplayerApi.ts`
**Lines:** 318-353

**Added logging:**

```typescript
export function subscribeToGame(
  gameId: string,
  callback: (game: MultiplayerGame) => void
) {
  console.log('Creating subscription for game:', gameId);
  
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
        // Log raw payload
        console.log('Subscription received payload:', {
          event: payload.eventType,
          gameId: (payload.new as any)?.id,
          status: (payload.new as any)?.game_status,
          secretWord: (payload.new as any)?.secret_word ? '***SET***' : 'NOT SET',
        });
        callback(payload.new as MultiplayerGame);
      }
    )
    .subscribe((status) => {
      // Log subscription status
      console.log('Subscription status:', status);
    });

  return () => {
    console.log('Removing subscription for game:', gameId);
    supabase.removeChannel(channel);
  };
}
```

**What it logs:**
1. When subscription channel is created
2. Subscription status (SUBSCRIBED, CLOSED, etc.)
3. Raw payload from Supabase
4. When subscription is removed

---

## 🔍 What to Look For

### Expected Console Output (Normal Flow)

**When questioner is waiting:**
```
Setting up game subscription for game: abc123
Creating subscription for game: abc123
Subscription status: SUBSCRIBED
```

**When thinker sets secret word:**
```
Subscription received payload: {
  event: 'UPDATE',
  gameId: 'abc123',
  status: 'active',
  secretWord: '***SET***'
}

Game updated via subscription: {
  gameId: 'abc123',
  status: 'active',
  secretWord: '***SET***',
  currentThinker: 'player1',
  currentQuestioner: 'player2'
}

Updating game state from: {
  prevStatus: 'waiting',
  prevSecretWord: 'NOT SET'
} to: {
  newStatus: 'active',
  newSecretWord: '***SET***'
}
```

**Result:** UI should update from waiting screen to question input

---

### Possible Issues to Diagnose

#### Issue 1: Subscription Not Created
```
Setting up game subscription for game: abc123
Creating subscription for game: abc123
Subscription status: CHANNEL_ERROR
```
**Diagnosis:** Supabase connection issue or RLS policy blocking subscription

---

#### Issue 2: No Payload Received
```
Setting up game subscription for game: abc123
Creating subscription for game: abc123
Subscription status: SUBSCRIBED
(no further logs when secret word is set)
```
**Diagnosis:** 
- Database UPDATE not firing
- Filter not matching (wrong game ID)
- RLS policy blocking the update event

---

#### Issue 3: Payload Received But State Not Updating
```
Subscription received payload: { ... }
Game updated via subscription: { ... }
(no "Updating game state from" log)
```
**Diagnosis:** setState callback not being called (React issue)

---

#### Issue 4: State Updates But UI Doesn't Change
```
Updating game state from: { prevStatus: 'waiting' } to: { newStatus: 'active' }
(UI still shows waiting screen)
```
**Diagnosis:** 
- Component not re-rendering
- Conditional rendering logic issue
- Props not being passed correctly

---

## 🧪 Testing Instructions

### Step 1: Open Browser Console

1. Open the game in two browser windows/tabs
2. Open Developer Tools (F12) in both windows
3. Go to Console tab

### Step 2: Start Rematch

1. Complete a game
2. Both players click "PLAY AGAIN"
3. Watch console logs in both windows

### Step 3: Set Secret Word

1. Thinker enters secret word
2. Thinker clicks "SET SECRET WORD"
3. Watch console logs in **questioner's window**

### Step 4: Analyze Logs

Look for the expected console output patterns above. If any step is missing, that's where the issue is.

---

## 📊 Debugging Checklist

Use this checklist to diagnose the issue:

- [ ] **Subscription Created?**
  - Look for: `"Creating subscription for game:"`
  - If missing: Subscription setup failed

- [ ] **Subscription Status SUBSCRIBED?**
  - Look for: `"Subscription status: SUBSCRIBED"`
  - If different: Connection issue

- [ ] **Payload Received?**
  - Look for: `"Subscription received payload:"`
  - If missing: Database event not firing

- [ ] **Payload Has Correct Data?**
  - Check: `status: 'active'`, `secretWord: '***SET***'`
  - If wrong: Database update issue

- [ ] **Game State Updated?**
  - Look for: `"Updating game state from:"`
  - If missing: setState not called

- [ ] **State Transition Correct?**
  - Check: `prevStatus: 'waiting'` → `newStatus: 'active'`
  - If wrong: Wrong data in payload

- [ ] **UI Updated?**
  - Check: Waiting screen → Question input
  - If not: Rendering issue

---

## 🔧 Next Steps

Based on the console logs, we can determine:

1. **If subscription is not created:** Check Supabase connection
2. **If payload is not received:** Check RLS policies and database triggers
3. **If state is not updated:** Check React state management
4. **If UI is not updated:** Check conditional rendering logic

---

## 📝 Files Modified

**src/pages/MultiplayerGamePage.tsx**
- Added detailed logging to subscription useEffect
- Added state transition logging
- Added cleanup logging

**src/db/multiplayerApi.ts**
- Added subscription creation logging
- Added payload logging
- Added subscription status logging
- Added cleanup logging

---

## ✅ Code Quality

```bash
npm run lint
# Checked 93 files in 181ms. No fixes applied.
```

All lint checks passing.

---

## 🚀 Summary

Added comprehensive logging to diagnose why the questioner's UI is not updating when the opponent sets the secret word. The logs will help identify exactly where in the subscription → state update → UI render pipeline the issue is occurring.

**Next:** Run the game with browser console open and analyze the logs to pinpoint the exact issue.
