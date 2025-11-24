# 1v1 Rematch Communication Flow

## Date: 2025-11-24

---

## 🎯 Overview

Complete communication system for 1v1 rematch when a player sets the secret word. The opponent is notified and can immediately start asking questions.

---

## 🎬 Complete Flow

### Step-by-Step Communication

```

                    REMATCH INITIATED                            │

                              ↓
        ┌─────────────────────────────────────────┐
        │  Both players click "PLAY AGAIN"        │
        │  Roles switch (questioner ↔ thinker)    │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  New game created with:                 │
        │  - secret_word = NULL                   │
        │  - Roles assigned                       │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Both players redirected to new game    │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  THINKER: Sees "Enter secret word"      │
        │  QUESTIONER: Sees "Waiting for opponent"│
        └─────────────────────────────────────────┘
                              ↓

                 THINKER SETS SECRET WORD                        │

                              ↓
        ┌─────────────────────────────────────────┐
        │  1. Thinker types "elephant"            │
        │  2. Clicks "SET SECRET WORD"            │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  updateSecretWord() called              │
        │  Database: secret_word = "elephant"     │
        └─────────────────────────────────────────┘
                              ↓

                  REAL-TIME COMMUNICATION                        │

                              ↓
        ┌─────────────────────────────────────────┐
        │  Supabase fires UPDATE event            │
        │  Table: multiplayer_games               │
        │  Field: secret_word = "elephant"        │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Game subscription receives update      │
        │  (MultiplayerGamePage.tsx)              │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  setGame((prevGame) => updatedGame)     │
        │  State updates with new secret_word     │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  React re-renders MultiplayerGameplay   │
        │  game.secret_word now exists            │
        └─────────────────────────────────────────┘
                              ↓

                   QUESTIONER UI UPDATES                         │

                              ↓
        ┌─────────────────────────────────────────┐
        │  1. Waiting message disappears          │
        │  2. Toast notification appears:         │
        │     "Opponent set the secret word!      │
        │      You can now ask questions."        │
        │  3. Question input field appears        │
        │  4. "ASK QUESTION" button enabled       │
        └─────────────────────────────────────────┘
                              ↓

                    GAME READY TO PLAY                           │

```

---

## 🔧 Technical Implementation

### 1. Game Subscription (MultiplayerGamePage.tsx)

**Purpose:** Listen for game state changes in real-time

**Code (Lines 46-80):**
```typescript
useEffect(() => {
  if (!game?.id) return;

  // Subscribe to game updates
  const unsubscribe = subscribeToGame(game.id, (updatedGame) => {
    console.log('Game updated:', updatedGame);
    
    // ✅ Use functional setState to avoid stale closures
    setGame((prevGame) => {
      // Notify Player 1 when Player 2 joins
      if (
        playerNumber === 'player1' &&
        !prevGame?.player2_name &&
        updatedGame.player2_name
      ) {
        toast.success(`${updatedGame.player2_name} joined the game! 🎮`, {
          duration: 4000,
        });
      }
      
      return updatedGame;  // ✅ Update state with new game data
    });
    
    // Check if both players requested rematch
    if (
      updatedGame.player1_rematch &&
      updatedGame.player2_rematch &&
      updatedGame.game_status === 'ended'
    ) {
      handleRematchAccepted();
    }
  });

  return unsubscribe;
}, [game?.id, playerNumber]);  // ✅ Stable dependencies
```

**Key Features:**
- Functional setState prevents stale closures
- Stable subscription (only re-created when game ID changes)
- Receives all game updates in real-time

---

### 2. Secret Word Notification (MultiplayerGameplay.tsx)

**Purpose:** Notify questioner when opponent sets secret word

**Code (Lines 85-93):**
```typescript
// Show notification when opponent sets secret word
useEffect(() => {
  if (isQuestioner && game.secret_word && !hasShownSecretWordNotification) {
    toast.success('Opponent set the secret word! You can now ask questions.', {
      duration: 4000,
    });
    setHasShownSecretWordNotification(true);
  }
}, [game.secret_word, isQuestioner, hasShownSecretWordNotification]);
```

**Key Features:**
- Only shows to questioner (not thinker)
- Only shows once per game
- Clear, actionable message
- 4-second duration

---

### 3. Questioner Wait State (MultiplayerGameplay.tsx)

**Purpose:** Show waiting message until secret word is set

**Code (Lines 360-395):**
```typescript
// Guesser view
if (isQuestioner) {
  // ✅ Check if secret word is set
  if (!game.secret_word) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background gap-6">
        <Toaster position="top-center" />
        
        <div className="w-full max-w-2xl space-y-6">
          <div className="brutal-border bg-card p-4 flex justify-between items-center">
            <span className="font-black text-lg">
              Question {game.question_count} / 20
            </span>
            <span className="font-black text-lg">
              🤔 Opponent is thinking...
            </span>
          </div>

          {/* ✅ Show waiting message */}
          <div className="brutal-border-thick bg-card p-6 xl:p-8 text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-xl xl:text-3xl font-black text-foreground leading-relaxed">
              Waiting for opponent to set their secret word...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Only show question input after secret word is set
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background gap-6">
      {/* Question input and buttons */}
    </div>
  );
}
```

**Key Features:**
- Conditional rendering based on `game.secret_word`
- Loading spinner for visual feedback
- Clear waiting message
- Smooth transition to question input

---

### 4. Real-Time Subscription (multiplayerApi.ts)

**Purpose:** Subscribe to database changes

**Code (Lines 318-342):**
```typescript
export function subscribeToGame(
  gameId: string,
  callback: (game: MultiplayerGame) => void
) {
  const channel = supabase
    .channel(`game:${gameId}`)
    .on(
      'postgres_changes',
      {
        event: '*',  // ✅ Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'multiplayer_games',
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        callback(payload.new as MultiplayerGame);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
```

**Key Features:**
- Listens to all database events
- Filters for specific game ID
- Calls callback with updated game data
- Returns cleanup function

---

## 🎨 User Experience

### Thinker's View

**1. After Rematch:**
```

  🎮 READY TO START!                     │

  Hi, Alice!                             │
                                         │
  🎲 You were randomly selected to       │
     set the secret word!                │
                                         │
  Enter your secret word to start        │
                                         │
  [Input: Enter your secret word...]    │
                                         │
  [SET SECRET WORD]                      │

```

**2. After Setting Word:**
```

  Question 0 / 20    🤔 You're thinking  │

  Your secret word: elephant             │
                                         │
  Waiting for opponent to ask a          │
  question...                            │
                                         │
  [Question History]                     │
  (empty)                                │

```

---

### Questioner's View

**1. After Rematch (Waiting):**
```

  Question 0 / 20    🤔 Opponent...      │

                                         │
         [Spinning Loader]               │
                                         │
  Waiting for opponent to set their      │
  secret word...                         │
                                         │

```

**2. After Opponent Sets Word:**
```

  🎉 Toast Notification (4 seconds)      │
  Opponent set the secret word!          │
  You can now ask questions.             │



  Question 0 / 20    🤔 Opponent...      │

  [Input: Type your question...]         │
                                         │
  [ASK QUESTION]  [MAKE A GUESS]         │
                                         │
  [Question History]                     │
  (empty)                                │

```

---

## 🧪 Testing Scenarios

### Test 1: Basic Communication

**Steps:**
1. Complete a game
2. Both players click "PLAY AGAIN"
3. Roles switch
4. Thinker sets secret word "dolphin"
5. Observe questioner's screen

**Expected:**
- ✅ Questioner sees waiting message
- ✅ Thinker sets word successfully
- ✅ Questioner receives notification
- ✅ Question input appears
- ✅ Game ready to play

**Result:** ✅ PASS

---

### Test 2: Multiple Rematches

**Steps:**
1. Play game 1
2. Rematch → Game 2
3. Rematch → Game 3
4. Verify communication works each time

**Expected:**
- ✅ Communication works in all rematches
- ✅ Roles switch correctly
- ✅ Notifications appear each time
- ✅ No stale state

**Result:** ✅ PASS

---

### Test 3: Network Delay

**Steps:**
1. Start rematch
2. Thinker sets word
3. Simulate slow network
4. Verify questioner eventually receives update

**Expected:**
- ✅ Update received (may be delayed)
- ✅ UI updates when data arrives
- ✅ No errors or crashes

**Result:** ✅ PASS

---

## 📊 Communication Timeline

```
Time    Thinker                          Questioner

0:00    Sees "Enter secret word"         Sees "Waiting..."
        [Input field visible]            [Loader spinning]

0:05    Types "elephant"                 Still waiting...
        [Typing...]                      [Loader spinning]

0:08    Clicks "SET SECRET WORD"         Still waiting...
        [Button clicked]                 [Loader spinning]

0:09    Database updated                 Subscription fires
        Toast: "Secret word set!"        Game state updates

0:10    Sees "Waiting for question"      🎉 Toast appears!
        [Answerer view]                  "Opponent set word!"

0:10    [Question history empty]         Input field appears
                                         [Can type questions]

0:15    Receives question                Types question
        "Is it an animal?"               [Typing...]

0:16    Answers "Yes"                    Sees answer "Yes"
        [Clicked YES button]             [History updates]

        ✅ Game in progress              ✅ Game in progress
```

---

## 🚀 Summary

The 1v1 rematch communication system provides:

1. **Real-Time Updates** - Instant communication via Supabase subscriptions
2. **Clear Notifications** - Toast messages inform players of state changes
3. **Smooth Transitions** - UI updates seamlessly from waiting to ready
4. **Stable Subscriptions** - No race conditions or missed updates
5. **Professional UX** - Loading indicators and clear messages

**Communication Flow:**
```
Thinker sets word → Database updates → Subscription fires → 
State updates → UI re-renders → Notification shows → 
Questioner can ask questions
```

**All components working together:**
- ✅ Game subscription (MultiplayerGamePage.tsx)
- ✅ Secret word notification (MultiplayerGameplay.tsx)
- ✅ Questioner wait state (MultiplayerGameplay.tsx)
- ✅ Real-time subscription (multiplayerApi.ts)

The multiplayer game now has complete, reliable communication between players!
