# Rematch Role Assignment & Questioner UX Fix

## Date: 2025-11-24

---

## 🎯 Summary

Fixed two critical issues in the multiplayer rematch system:

1. **Both players were thinkers** - Missing `current_questioner` field caused role confusion
2. **Questioner couldn't see history** - No visual feedback for pending questions or history

---

## 🐛 Problem 1: Both Players Were Thinkers

### Issue
When a rematch was created, the `current_questioner` field was not being set. This caused:
- Both players to appear as "thinkers"
- No clear role distinction
- Confusion about who should ask questions vs answer

### Root Cause
The `createRematchGame()` function only set `current_thinker` but not `current_questioner`.

### Solution
Calculate and set `current_questioner` to the previous thinker (who becomes the new questioner).

```typescript
// Before
const newThinker = oldGame.current_thinker === 'player1' ? 'player2' : 'player1';
// Missing: current_questioner assignment

// After
const newThinker = oldGame.current_thinker === 'player1' ? 'player2' : 'player1';
const newQuestioner = oldGame.current_thinker; // Previous thinker becomes questioner
```

---

## 🐛 Problem 2: Questioner Couldn't See History

### Issue
After asking a question, the questioner had no visual feedback:
- Question disappeared immediately
- No indication of what they asked
- Couldn't see question history
- No way to track previous answers

### Root Cause
The questioner UI showed `currentQuestion` (input field value) which was cleared after asking. The pending question wasn't displayed separately.

### Solution
1. Show `pendingQuestion` in a prominent card while waiting for answer
2. Display question history (already existed, now more visible)
3. Disable input while waiting for answer

```tsx
{/* Show pending question if exists */}
{pendingQuestion && (
  <div className="brutal-border-thick bg-card p-6 xl:p-8 shadow-brutal-pink">
    <p className="text-xl xl:text-3xl font-black text-foreground leading-relaxed mb-4">
      {pendingQuestion}
    </p>
    <p className="text-sm text-muted-foreground font-bold text-center">
      ⏳ Waiting for opponent to answer...
    </p>
  </div>
)}
```

---

## 📝 Files Changed

### 1. `src/db/multiplayerApi.ts`

**Function:** `createRematchGame()`

**Changes:**
- Added `current_questioner` field calculation
- Set `current_questioner: newQuestioner` in insert statement
- Added explanatory comments

**Lines:** 288-310

```typescript
// Line 291: Calculate new questioner
const newQuestioner = oldGame.current_thinker; // Previous thinker becomes questioner

// Line 304: Set questioner in database
current_questioner: newQuestioner,
```

### 2. `src/components/multiplayer/MultiplayerGameplay.tsx`

**Section:** Questioner View (lines 371-471)

**Changes:**
- Added pending question display card
- Show "⏳ Waiting for opponent to answer..." message
- Disable input while `pendingQuestion` exists
- Disable "ASK QUESTION" and "MAKE A GUESS" buttons while waiting

**Lines:** 387-397, 409, 414, 421

---

## 🎨 Visual Changes

### Before Fix

**Questioner sees:**
```

  Question 5 / 20    🤔 Opponent...      │


[Input: Type your question...]
[ASK QUESTION] [MAKE A GUESS]

 No indication of what they asked
 No history visible
 Can ask multiple questions at once
```

### After Fix

**Questioner sees:**
```

  Question 5 / 20    🤔 Opponent...      │



  Is it a mammal?                        │
  ⏳ Waiting for opponent to answer...  │


[Input: Type your question... (disabled)]
[ASK QUESTION (disabled)] [MAKE A GUESS (disabled)]


  QUESTION HISTORY                       │
  Q1: Is it alive? → Yes                 │
  Q2: Is it an animal? → Yes             │
  Q3: Does it live in water? → Yes       │
  Q4: Is it a fish? → No                 │


 Clear feedback on pending question
 Full history visible
 Input disabled while waiting
```

---

## 🧪 Testing

### Test Case 1: Rematch Role Assignment

**Steps:**
1. Player A creates game, sets word "elephant"
2. Player B joins and asks questions
3. Player B wins
4. Both players request rematch
5. Verify roles

**Expected Result:**
```
Game 1:
  Player A: Thinker (current_thinker = 'player1')
  Player B: Questioner (current_questioner = 'player2')

Rematch (Game 2):
  Player A: Questioner (current_questioner = 'player1') ✅
  Player B: Thinker (current_thinker = 'player2') ✅
```

**Actual Result:** ✅ PASS
- Player A sees question input
- Player B sees word input
- Roles correctly switched

### Test Case 2: Questioner Pending Question

**Steps:**
1. Questioner asks "Is it alive?"
2. Observe UI immediately after asking

**Expected Result:**
- Pending question shows in card
- "⏳ Waiting for opponent to answer..." message
- Input disabled
- Buttons disabled

**Actual Result:** ✅ PASS
- Question visible in prominent card
- Clear waiting message
- Cannot ask another question while waiting

### Test Case 3: Questioner History

**Steps:**
1. Questioner asks 5 questions
2. Answerer responds to each
3. Verify history shows all Q&A pairs

**Expected Result:**
- All questions visible
- All answers visible
- Chronological order
- Latest at bottom

**Actual Result:** ✅ PASS
- Full history visible
- Proper formatting
- Auto-scrolls to latest

---

## 📊 Impact

### Before These Fixes
- ❌ Both players were thinkers in rematch
- ❌ No role distinction
- ❌ Questioner had no feedback
- ❌ Couldn't see history
- ❌ Could spam questions

### After These Fixes
- ✅ Roles correctly assigned
- ✅ Clear thinker vs questioner distinction
- ✅ Pending question visible
- ✅ Full history visible
- ✅ Input disabled while waiting
- ✅ Better user experience

---

## 🔍 Technical Details

### Database Fields

```sql
-- Rematch game creation now sets:
current_thinker: 'player2'      -- Previous questioner
current_questioner: 'player1'   -- Previous thinker
word_setter_claimed: 'player2'  -- Same as current_thinker
```

### UI State Management

```typescript
// Pending question from database
const pendingQuestion = questions.find(q => q.answer === 'pending')?.question;

// Show pending question card
{pendingQuestion && (
  <div>Show pending question with waiting message</div>
)}

// Disable input while waiting
disabled={isAnswering || game.question_count >= 20 || !!pendingQuestion}
```

---

## ✅ All Lint Checks: PASSING

```bash
npm run lint
# Checked 93 files in 182ms. No fixes applied.
```

---

## 🚀 Summary

These fixes ensure:
1. **Proper role assignment** - Each player has a distinct role (thinker or questioner)
2. **Clear visual feedback** - Questioner sees what they asked and all previous answers
3. **Better UX** - No confusion about game state or whose turn it is
4. **Fair gameplay** - Prevents spamming questions or role confusion

The multiplayer rematch system now works correctly with clear role separation and excellent user feedback!
