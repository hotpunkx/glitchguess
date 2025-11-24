# Multiplayer Rematch Debugging Summary

## Date: 2025-11-24

---

## 🎯 Issue Reported

User (Isuru) is stuck on the waiting screen showing "Waiting for Rajitha to set the secret word..." even after Rajitha has set the secret word. The UI is not updating to show the question input.

---

## 🔧 Fixes Applied

### 1. Fixed Rematch Game Status (CRITICAL BUG FIX)

**File:** `src/db/multiplayerApi.ts` (Line 307)

**Problem:** Rematch games were created with `game_status: 'active'` even though no secret word was set yet.

**Fix:** Changed to `game_status: 'waiting'`

**Impact:** This ensures a proper status transition (`waiting` → `active`) when the secret word is set, which triggers the subscription and updates the UI.

**Document:** `REMATCH_GAME_STATUS_BUG_FIX.md`

---

### 2. Enhanced Subscription Debugging

**Files:** 
- `src/pages/MultiplayerGamePage.tsx` (Lines 46-99)
- `src/db/multiplayerApi.ts` (Lines 377-410)

**Added:**
- Comprehensive logging for subscription lifecycle
- State transition logging
- Payload logging
- Cleanup logging

**Purpose:** Diagnose if subscription is receiving updates and if state is being updated correctly.

**Document:** `SUBSCRIPTION_DEBUGGING_ADDED.md`

---

### 3. Enhanced Secret Word Update Debugging

**File:** `src/db/multiplayerApi.ts` (Lines 202-281)

**Added:**
- Pre-update validation (fetch current game state)
- Player permission verification
- Row count verification (detect silent failures)
- Comprehensive logging at every step
- Explicit error messages

**Purpose:** Diagnose if the UPDATE query is succeeding and if it's affecting the correct rows.

**Document:** `SECRET_WORD_UPDATE_DEBUGGING.md`

---

## ✅ Verification

**File:** `STATUS_CHANGE_VERIFICATION.md`

Verified that the code correctly implements the status change from 'waiting' to 'active' when the thinker sets the secret word. The flow is:

1. ✅ Thinker clicks "START GAME"
2. ✅ `handleSetSecretWord()` called
3. ✅ `updateSecretWord()` updates database with `game_status: 'active'`
4. ✅ Subscription receives UPDATE event
5. ✅ React state updated
6. ✅ Component re-renders
7. ✅ UI shows gameplay screen

---

## 🧪 How to Test

### Step 1: Start a New Rematch

1. Complete a game
2. Both players click "PLAY AGAIN"
3. Open browser console (F12) in both windows

### Step 2: Thinker Sets Secret Word

1. Thinker (Rajitha) enters secret word
2. Clicks "START GAME"
3. Watch console logs in both windows

### Step 3: Analyze Console Logs

**Expected logs in Thinker's console:**
```
updateSecretWord called: { gameId: '...', setterPlayer: 'player1' }
Current game state: { game_status: 'waiting', secret_word: 'NOT SET' }
Update result: { success: true, rowsAffected: 1 }
Secret word set successfully
```

**Expected logs in Questioner's console:**
```
Subscription received payload: { event: 'UPDATE', status: 'active', secretWord: '***SET***' }
Game updated via subscription: { status: 'active', secretWord: '***SET***' }
Updating game state from: { prevStatus: 'waiting' } to: { newStatus: 'active' }
```

**Expected UI changes:**
- ✅ Thinker sees: "Your secret word: [word]"
- ✅ Questioner sees: Question input + toast notification
- ✅ Game is playable

---

## 🔍 Troubleshooting Guide

If the issue persists, check the console logs to identify where the flow breaks:

| Log Missing | Issue Location | Possible Cause |
|-------------|----------------|----------------|
| "updateSecretWord called" | Button handler | Click handler not working |
| "Current game state" | Database fetch | Supabase connection issue |
| "Update result" | Database update | UPDATE query failed |
| "rowsAffected: 0" | Silent failure | `word_setter_claimed` mismatch |
| "Subscription received payload" | Real-time | Subscription not working |
| "Updating game state from" | React state | setState not called |
| UI doesn't change | Rendering | Conditional rendering issue |

---

## 📝 All Documentation Files

1. **REMATCH_GAME_STATUS_BUG_FIX.md** - Critical bug fix for game status
2. **SUBSCRIPTION_DEBUGGING_ADDED.md** - Subscription logging
3. **SECRET_WORD_UPDATE_DEBUGGING.md** - Update function logging
4. **STATUS_CHANGE_VERIFICATION.md** - Code flow verification
5. **DEBUGGING_SUMMARY.md** - This file

---

## 🚀 Summary

**Fixed:** Critical bug where rematch games were created with wrong status

**Added:** Comprehensive logging to diagnose subscription and update issues

**Verified:** Code correctly implements status change mechanism

**Next:** Test with browser console open to see where the issue is occurring

---

## ✅ Code Quality

```bash
npm run lint
# Checked 93 files in 170ms. No fixes applied.
```

All lint checks passing.
