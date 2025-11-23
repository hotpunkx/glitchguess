# Multiplayer Game Fixes - Race Condition & Winning Logic

## Overview
This document describes the fixes implemented to address two critical issues in the multiplayer game:
1. **Race Condition**: Preventing both players from setting the secret word simultaneously
2. **Winning Logic**: Implementing proper guess mechanism and winner tracking

## Changes Made

### 1. Database Schema Updates

#### Migration: `00005_fix_multiplayer_word_setting.sql`

**New Fields:**
- `word_setter_claimed` - Tracks which player has claimed the right to set the word
  - Type: `text` with CHECK constraint (`'player1'` or `'player2'`)
  - Purpose: Prevents race conditions when both players try to set word simultaneously
  - NULL = no one has claimed yet

- `winner` - Tracks which player won the game
  - Type: `text` with CHECK constraint (`'player1'` or `'player2'`)
  - Purpose: Properly track the winner for end screen display
  - NULL = no winner (game not ended or draw)

**New RPC Function:**
```sql
claim_word_setter(p_game_id uuid, p_player text) RETURNS boolean
```
- Atomic operation to claim the word setter role
- Only succeeds if:
  - Game status is 'waiting'
  - Both players have joined
  - No one has claimed the role yet
- Returns `true` if claim successful, `false` otherwise

### 2. TypeScript Type Updates

**File: `src/types/types.ts`**

Updated `MultiplayerGame` interface:
```typescript
interface MultiplayerGame {
  // ... existing fields
  word_setter_claimed: 'player1' | 'player2' | null;
  winner: 'player1' | 'player2' | null;
}
```

### 3. API Function Updates

**File: `src/db/multiplayerApi.ts`**

**New Function:**
```typescript
claimWordSetter(gameId: string, player: 'player1' | 'player2'): Promise<boolean>
```
- Calls the `claim_word_setter` RPC function
- Returns boolean indicating if claim was successful

**Updated Function:**
```typescript
updateSecretWord(gameId: string, secretWord: string, setterPlayer: 'player1' | 'player2'): Promise<void>
```
- Now also sets `word_setter_claimed` field
- Includes WHERE clause to verify the player has claimed the role

**Updated Function:**
```typescript
endMultiplayerGame(gameId: string, isWon: boolean, winner?: 'player1' | 'player2'): Promise<void>
```
- Added optional `winner` parameter
- Sets the winner field in the database

### 4. UI Updates - Waiting Screen

**File: `src/pages/MultiplayerGamePage.tsx`**

**Word Setting Flow:**
1. Player clicks "I'LL SET THE WORD" button
2. System attempts to claim the word setter role (atomic operation)
3. If successful, player can set the word
4. If failed, shows error: "Your opponent is already setting the word!"

**Visual Indicators:**
- When opponent has claimed the role:
  - Shows loading spinner
  - Message: "⏳ {opponent} is setting the word..."
  - Disables word input for current player
  
- When no one has claimed:
  - Both players see the word input field
  - Button text: "I'LL SET THE WORD"

### 5. Gameplay Updates - Winning Logic

**File: `src/components/multiplayer/MultiplayerGameplay.tsx`**

**Questioner (Guesser) View:**

Added "Make a Guess" button:
- Two-mode interface:
  - **Normal Mode**: "ASK QUESTION" and "🎯 MAKE A GUESS" buttons
  - **Guess Mode**: Input field for guess with "SUBMIT GUESS" and "CANCEL" buttons

**Guess Submission:**
```typescript
handleMakeGuess()
```
- Formats guess as "Is it {guess}?"
- Submits as a regular question
- Opponent sees it as a guess with special indicator

**Answerer (Thinker) View:**

Enhanced question display:
- Detects if question starts with "Is it"
- Shows special indicator: "🎯 OPPONENT IS MAKING A GUESS!"
- Highlights the importance of the answer

**Updated Answer Logic:**
```typescript
handleAnswer(answer: Answer)
```
- Checks if question is a guess (starts with "Is it")
- If guess is correct (answer = "Yes"):
  - Ends game with `is_won = true`
  - Sets winner to the questioner
- If 20 questions reached:
  - Ends game with `is_won = false`
  - Sets winner to the answerer (thinker)

## How It Works

### Race Condition Prevention

**Scenario: Both players try to set word simultaneously**

1. Player 1 clicks "I'LL SET THE WORD"
   - Calls `claimWordSetter(gameId, 'player1')`
   - Database atomically checks and sets `word_setter_claimed = 'player1'`
   - Returns `true`

2. Player 2 clicks "I'LL SET THE WORD" (at same time)
   - Calls `claimWordSetter(gameId, 'player2')`
   - Database sees `word_setter_claimed` is already set
   - Returns `false`
   - UI shows error: "Your opponent is already setting the word!"

3. Player 1 enters secret word
   - Calls `updateSecretWord(gameId, word, 'player1')`
   - Database verifies `word_setter_claimed = 'player1'`
   - Game starts with Player 1 as answerer, Player 2 as questioner

**Real-time Updates:**
- Player 2's UI updates via Supabase subscription
- Shows: "⏳ {Player 1} is setting the word..."
- Word input is hidden/disabled

### Winning Logic Flow

**Scenario 1: Questioner guesses correctly**

1. Questioner clicks "🎯 MAKE A GUESS"
2. Enters guess (e.g., "elephant")
3. System formats as "Is it elephant?"
4. Answerer sees:
   - Special indicator: "🎯 OPPONENT IS MAKING A GUESS!"
   - Question: "Is it elephant?"
5. Answerer clicks "YES"
6. Game ends:
   - `is_won = true`
   - `winner = current_questioner`
   - `game_status = 'ended'`

**Scenario 2: 20 questions reached**

1. Answerer answers the 20th question
2. System checks: `questionNumber >= 20`
3. Game ends:
   - `is_won = false`
   - `winner = current_thinker`
   - `game_status = 'ended'`

**Scenario 3: Questioner guesses incorrectly**

1. Questioner makes a guess
2. Answerer clicks "NO"
3. Game continues (if under 20 questions)
4. Guess is recorded in history like a regular question

## Benefits

1. **No Race Conditions**: Database-level atomic operations prevent simultaneous word setting
2. **Clear UI Feedback**: Players always know what's happening
3. **Proper Winning Logic**: Explicit guess mechanism instead of text parsing
4. **Better UX**: Dedicated "Make a Guess" button makes the game flow clearer
5. **Accurate Winner Tracking**: Database stores the actual winner for proper display

## Technical Details

### Why RPC Function?

Using a PostgreSQL RPC function for `claim_word_setter` ensures:
- **Atomicity**: The check-and-set operation is atomic
- **Race Condition Safety**: Multiple simultaneous calls are handled correctly
- **Server-side Logic**: No client-side race conditions possible

### Why "Is it" Detection?

The answerer's logic detects guesses by checking if the question starts with "Is it":
- Consistent format from the guess submission
- Easy to detect on the answering side
- Clear distinction between questions and guesses
- Works with any guess content

### Database Constraints

The CHECK constraints on `word_setter_claimed` and `winner` ensure:
- Only valid player values ('player1' or 'player2')
- Type safety at the database level
- Prevents invalid data from being stored
