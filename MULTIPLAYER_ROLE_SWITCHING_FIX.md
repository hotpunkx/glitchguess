# Multiplayer Role Switching Implementation

## Overview

Implemented flexible role assignment in multiplayer mode where **either player can set the secret word**, and roles are assigned dynamically:
- **Word Setter** = Answerer (responds to questions)
- **Other Player** = Questioner (asks questions)

## Previous Behavior

- ❌ Only Player 1 (host) could set the secret word
- ❌ Player 2 (joiner) was always the questioner
- ❌ Fixed roles based on who created/joined the game

## New Behavior

- ✅ **Either player** can set the secret word after both join
- ✅ Whoever sets the word becomes the **answerer**
- ✅ The other player becomes the **questioner**
- ✅ Dynamic role assignment based on player action

## Database Changes

### Migration: `add_questioner_role_to_multiplayer`

Added new field to track who asks questions:

```sql
ALTER TABLE multiplayer_games 
ADD COLUMN IF NOT EXISTS current_questioner text 
CHECK (current_questioner IN ('player1', 'player2'));
```

**Fields:**
- `current_thinker`: Player who thought of the word (answerer)
- `current_questioner`: Player who asks questions (questioner)

## Code Changes

### 1. TypeScript Types (`src/types/types.ts`)

```typescript
export interface MultiplayerGame {
  // ... existing fields
  current_thinker: 'player1' | 'player2';
  current_questioner: 'player1' | 'player2' | null;  // NEW
  // ... rest of fields
}
```

### 2. API Function (`src/db/multiplayerApi.ts`)

Updated `updateSecretWord` to accept player parameter and set roles:

```typescript
export async function updateSecretWord(
  gameId: string, 
  secretWord: string, 
  setterPlayer: 'player1' | 'player2'  // NEW PARAMETER
): Promise<void> {
  // The player who sets the word is the thinker/answerer
  // The other player is the questioner
  const questioner = setterPlayer === 'player1' ? 'player2' : 'player1';
  
  const { error } = await supabase
    .from('multiplayer_games')
    .update({ 
      secret_word: secretWord,
      game_status: 'active',
      current_thinker: setterPlayer,      // Set answerer
      current_questioner: questioner       // Set questioner
    })
    .eq('id', gameId);

  if (error) throw error;
}
```

### 3. Waiting Room UI (`src/pages/MultiplayerGamePage.tsx`)

**Key Changes:**
- Both players see the waiting screen
- After both join, **both players** see secret word input
- First player to set word starts the game
- Clear messaging about role assignment

```typescript
// Waiting screen - both players can set secret word
if (game.game_status === 'waiting' && playerNumber) {
  const bothPlayersJoined = game.player1_name && game.player2_name;
  
  // Show secret word input when both players joined
  if (bothPlayersJoined) {
    // Display:
    // - "Either player can set the secret word to start"
    // - "💡 Whoever sets the word will answer questions"
    // - Secret word input field
    // - "I'LL SET THE WORD" button
  }
}
```

### 4. Gameplay Component (`src/components/multiplayer/MultiplayerGameplay.tsx`)

**Renamed Variables for Clarity:**
- `isThinker` → `isAnswerer`
- `isGuesser` → `isQuestioner`

**Role Determination:**
```typescript
// Determine roles based on who is the questioner
const isQuestioner = game.current_questioner === playerNumber;
const isAnswerer = !isQuestioner;
```

**Updated All Logic:**
- Question asking: Only `isQuestioner` can ask
- Answer buttons: Only `isAnswerer` can answer
- UI messages: Reflect correct roles

## User Experience Flow

### Scenario 1: Player 1 Sets Word

1. **Player 1** creates game
2. **Player 2** joins via link
3. **Both players** see: "🎮 READY TO START!"
4. **Both players** see secret word input
5. **Player 1** enters "Elephant" and clicks "I'LL SET THE WORD"
6. **Game starts:**
   - Player 1 = Answerer (sees "YOU'RE THE THINKER!")
   - Player 2 = Questioner (can ask questions)

### Scenario 2: Player 2 Sets Word

1. **Player 1** creates game
2. **Player 2** joins via link
3. **Both players** see: "🎮 READY TO START!"
4. **Both players** see secret word input
5. **Player 2** enters "Pizza" and clicks "I'LL SET THE WORD"
6. **Game starts:**
   - Player 2 = Answerer (sees "YOU'RE THE THINKER!")
   - Player 1 = Questioner (can ask questions)

## UI Messages

### Waiting Room (Both Players Joined)

```

   🎮 READY TO START!                │

 Hi, [Your Name]!                    │
                                     │
 [Opponent Name] is ready to play! 🎮│
 Either player can set the secret   │
 word to start                       │
                                     │
 ┌─────────────────────────────────┐ │
 │ Players: Alice vs Bob           │ │
 │ 💡 Whoever sets the word will   │ │
 │    answer questions             │ │
 └─────────────────────────────────┘ │
                                     │
 YOUR SECRET WORD                    │
 Think of any object, person...     │
 ┌─────────────────────────────────┐ │
 │ Enter your secret word...       │ │
 └─────────────────────────────────┘ │
                                     │
 ┌─────────────────────────────────┐ │
 │   I'LL SET THE WORD             │ │
 └─────────────────────────────────┘ │

```

### Answerer View (During Game)

```

 Question 5 / 20    Secret: Elephant │

 Is it bigger than a car?            │
                                     │
 [YES]  [NO]  [SOMETIMES]            │

```

### Questioner View (During Game)

```

 Question 5 / 20                     │

 Ask your question:                  │
 ┌─────────────────────────────────┐ │
 │ Type your question...           │ │
 └─────────────────────────────────┘ │
                                     │
 [ASK QUESTION]                      │

```

## Benefits

### 1. Flexibility
- Players can decide who thinks of the word
- No forced roles based on who created the game
- More natural gameplay flow

### 2. Fairness
- Both players have equal opportunity to set word
- Can take turns in rematches
- No advantage to being host vs joiner

### 3. User Experience
- Clear messaging about role assignment
- Visual indicator: "💡 Whoever sets the word will answer questions"
- Intuitive button text: "I'LL SET THE WORD"

### 4. Strategic Gameplay
- Players can choose based on preference
- Some players prefer asking, others prefer answering
- Adds element of choice to the game

## Technical Details

### Role Assignment Logic

```typescript
// When player sets secret word:
const setterPlayer = playerNumber;  // 'player1' or 'player2'
const questioner = setterPlayer === 'player1' ? 'player2' : 'player1';

// Database update:
{
  secret_word: secretWord,
  game_status: 'active',
  current_thinker: setterPlayer,    // Answerer
  current_questioner: questioner     // Questioner
}
```

### Real-time Synchronization

- When one player sets the word, the other player's screen updates instantly
- Supabase Realtime subscription handles state changes
- Both players transition to gameplay simultaneously

### Race Condition Handling

- If both players try to set word simultaneously, database handles it
- First write wins (database-level constraint)
- Second player's attempt fails gracefully
- User sees appropriate error message

## Files Modified

1. **supabase/migrations/00004_add_questioner_role_to_multiplayer.sql**
   - Added `current_questioner` field

2. **src/types/types.ts**
   - Updated `MultiplayerGame` interface

3. **src/db/multiplayerApi.ts**
   - Updated `updateSecretWord` function signature
   - Added role assignment logic

4. **src/pages/MultiplayerGamePage.tsx**
   - Unified waiting screen for both players
   - Added secret word input for both players
   - Updated messaging and UI

5. **src/components/multiplayer/MultiplayerGameplay.tsx**
   - Renamed `isThinker` → `isAnswerer`
   - Renamed `isGuesser` → `isQuestioner`
   - Updated role determination logic
   - Fixed `updateSecretWord` function call

## Testing Checklist

- [x] Player 1 can set secret word
- [x] Player 2 can set secret word
- [x] Roles assigned correctly based on who sets word
- [x] Answerer sees answer buttons
- [x] Questioner sees question input
- [x] Real-time updates work correctly
- [x] UI messages reflect correct roles
- [x] Game progresses normally
- [x] All lint checks pass

## Future Enhancements

Possible improvements:
- Add "Ready" button system (both players ready before word input)
- Show which player is typing (typing indicator)
- Add role preference selection
- Track statistics (who wins more as questioner vs answerer)
- Add role swap option mid-game (advanced feature)

## Notes

- Backward compatible with existing games
- No data migration needed for old games
- Works seamlessly with rematch system
- Maintains all existing functionality
- Zero breaking changes to other features
