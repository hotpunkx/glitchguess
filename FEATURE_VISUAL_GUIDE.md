# GLITCHGUESS - Visual Feature Guide

## 🌓 Theme Switcher

### Light Mode (Default)
```
┌─────────────────────────────────────────────────────────┐
│                                              [🌙]       │  ← Click to switch to dark
│                                                         │
│                    GLITCHGUESS                          │
│                  (Black on White)                       │
│                                                         │
│              [❓ HOW TO PLAY]                           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  I THINK OF SOMETHING – AI GUESSES               │ │
│  │  (Pink button with black text)                    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  AI THINKS OF SOMETHING – I GUESS                │ │
│  │  (Green button with black text)                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Background: White (#FFFFFF)                            │
│  Text: Black (#000000)                                  │
│  Borders: Black                                         │
└─────────────────────────────────────────────────────────┘
```

### Dark Mode
```
┌─────────────────────────────────────────────────────────┐
│                                              [☀️]       │  ← Click to switch to light
│                                                         │
│                    GLITCHGUESS                          │
│                  (White on Black)                       │
│                                                         │
│              [❓ HOW TO PLAY]                           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  I THINK OF SOMETHING – AI GUESSES               │ │
│  │  (Pink button with white text)                    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  AI THINKS OF SOMETHING – I GUESS                │ │
│  │  (Green button with black text)                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Background: Black (#000000)                            │
│  Text: White (#FFFFFF)                                  │
│  Borders: White                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 💾 Game State Persistence

### Scenario 1: No Saved Game (Fresh Start)
```
┌─────────────────────────────────────────────────────────┐
│                                              [🌙]       │
│                                                         │
│                    GLITCHGUESS                          │
│                                                         │
│              [❓ HOW TO PLAY]                           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  I THINK OF SOMETHING – AI GUESSES               │ │  ← Start new game
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  AI THINKS OF SOMETHING – I GUESS                │ │  ← Start new game
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  No saved game found                                    │
└─────────────────────────────────────────────────────────┘
```

### Scenario 2: Saved Game Exists
```
┌─────────────────────────────────────────────────────────┐
│                                              [🌙]       │
│                                                         │
│                    GLITCHGUESS                          │
│                                                         │
│              [❓ HOW TO PLAY]                           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  ⚡ CONTINUE GAME                                 │ │  ← NEW! Resume saved game
│  │  (I Think Mode)                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  I THINK OF SOMETHING – AI GUESSES               │ │  ← Start new game (clears save)
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  AI THINKS OF SOMETHING – I GUESS                │ │  ← Start new game (clears save)
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Saved game detected: Question 7/20                     │
└─────────────────────────────────────────────────────────┘
```

### Scenario 3: During Gameplay (Auto-Saving)
```
┌─────────────────────────────────────────────────────────┐
│                                              [🌙]       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Is it something you can eat?                     │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────┬─────────┬─────────┐                       │
│  │  YES    │   NO    │SOMETIMES│                       │
│  └─────────┴─────────┴─────────┘                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  QUESTION HISTORY (7/20)                          │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │ Q7: Is it something you can eat?            │ │ │
│  │  │ A7: (waiting for answer...)                 │ │ │
│  │  │                                             │ │ │
│  │  │ Q6: Is it bigger than a car?                │ │ │
│  │  │ A6: No                                      │ │ │
│  │  │                                             │ │ │
│  │  │ Q5: Is it a living thing?                   │ │ │
│  │  │ A5: No                                      │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  💾 Auto-saving... (every action)                      │
└─────────────────────────────────────────────────────────┘
```

### Scenario 4: After Page Refresh (Restored State)
```
User refreshes page (F5 or Ctrl+R)
         ↓
┌─────────────────────────────────────────────────────────┐
│  Loading saved game...                                  │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│                                              [🌙]       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Is it something you can eat?                     │ │  ← Restored!
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────┬─────────┬─────────┐                       │
│  │  YES    │   NO    │SOMETIMES│                       │
│  └─────────┴─────────┴─────────┘                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  QUESTION HISTORY (7/20)                          │ │  ← Restored!
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │ Q7: Is it something you can eat?            │ │ │
│  │  │ A7: (waiting for answer...)                 │ │ │
│  │  │                                             │ │ │
│  │  │ Q6: Is it bigger than a car?                │ │ │
│  │  │ A6: No                                      │ │ │
│  │  │                                             │ │ │
│  │  │ Q5: Is it a living thing?                   │ │ │
│  │  │ A5: No                                      │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ✅ Game restored successfully!                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎮 User Interaction Flow

### Theme Switching
```
1. User sees theme toggle button (top right)
   ↓
2. User clicks button
   ↓
3. Theme switches instantly
   ↓
4. Icon changes (🌙 ↔ ☀️)
   ↓
5. Preference saved to localStorage
   ↓
6. Theme persists on next visit
```

### Game State Persistence
```
STARTING A GAME:
1. User clicks "I THINK OF SOMETHING"
   ↓
2. Game starts
   ↓
3. User answers questions
   ↓
4. State auto-saves after each answer
   ↓
5. localStorage updated

ACCIDENTAL REFRESH:
1. User accidentally refreshes page (F5)
   ↓
2. Page reloads
   ↓
3. useGameStorage hook loads saved state
   ↓
4. User sees "CONTINUE GAME" button
   ↓
5. User clicks button
   ↓
6. Game resumes exactly where they left off

INTENTIONAL NEW GAME:
1. User has saved game
   ↓
2. User clicks "I THINK OF SOMETHING" (new game)
   ↓
3. Saved state is cleared
   ↓
4. New game starts fresh

GAME COMPLETION:
1. User completes game (win or lose)
   ↓
2. End screen shows
   ↓
3. Saved state is cleared
   ↓
4. User clicks "PLAY AGAIN"
   ↓
5. No saved game exists
```

---

## 📱 Mobile View

### Theme Toggle (Mobile)
```
┌─────────────────────────┐
│                    [🌙] │  ← Smaller but still visible
│                         │
│    GLITCHGUESS          │
│                         │
│   [❓ HOW TO PLAY]      │
│                         │
│  ┌───────────────────┐  │
│  │ I THINK – AI     │  │
│  │ GUESSES          │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ AI THINKS – I    │  │
│  │ GUESS            │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Continue Game Button (Mobile)
```
┌─────────────────────────┐
│                    [🌙] │
│                         │
│    GLITCHGUESS          │
│                         │
│   [❓ HOW TO PLAY]      │
│                         │
│  ┌───────────────────┐  │
│  │ ⚡ CONTINUE GAME │  │  ← Full width
│  │ (I Think Mode)   │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ I THINK – AI     │  │
│  │ GUESSES          │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ AI THINKS – I    │  │
│  │ GUESS            │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## 🎨 Color Comparison

### Light Mode Colors
| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Background | White | #FFFFFF | Page background |
| Foreground | Black | #000000 | Text |
| Card | White | #FFFFFF | Card backgrounds |
| Border | Black | #000000 | All borders |
| Secondary | Hot Pink | #FF006E | Pink buttons |
| Accent | Electric Lime | #CCFF00 | Green buttons |
| Muted | Light Gray | #F5F5F5 | Subtle backgrounds |

### Dark Mode Colors
| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Background | Black | #000000 | Page background |
| Foreground | White | #FFFFFF | Text |
| Card | Black | #000000 | Card backgrounds |
| Border | White | #FFFFFF | All borders |
| Secondary | Hot Pink | #FF006E | Pink buttons (unchanged) |
| Accent | Electric Lime | #CCFF00 | Green buttons (unchanged) |
| Muted | Dark Gray | #262626 | Subtle backgrounds |

---

## 💡 Pro Tips for Users

### Theme Switcher
1. **Try Both Themes**: See which one you prefer
2. **Dark Mode at Night**: Easier on the eyes in low light
3. **Light Mode in Daylight**: Better visibility in bright environments
4. **Instant Switch**: No page reload needed

### Game State Persistence
1. **Don't Worry About Refreshes**: Your progress is safe
2. **Continue Later**: Come back within 24 hours to resume
3. **Start Fresh Anytime**: Just click a mode button to start new game
4. **Check Mode**: Continue button shows which mode you were playing
5. **No Manual Save**: Everything saves automatically

---

## 🔍 Technical Details

### localStorage Structure

**Theme**:
```json
{
  "glitchguess-theme": "dark"
}
```

**Game State**:
```json
{
  "glitchguess-game-state": {
    "gameMode": "human-thinks",
    "currentMode": "human-thinks",
    "questionCount": 7,
    "isWon": false,
    "history": [
      {
        "question": "Is it alive?",
        "answer": "No",
        "asker": "ai"
      },
      {
        "question": "Is it bigger than a car?",
        "answer": "No",
        "asker": "ai"
      }
    ],
    "currentQuestion": "Is it something you can eat?",
    "showInstruction": false,
    "timestamp": 1700000000000
  }
}
```

### State Lifecycle
```
NEW GAME
   ↓
PLAYING (auto-saving every action)
   ↓
PAGE REFRESH (state preserved)
   ↓
CONTINUE GAME (state restored)
   ↓
GAME END (state cleared)
   ↓
PLAY AGAIN (fresh start)
```

---

## ✅ Feature Checklist

### Theme Switcher
- [x] Button visible on all pages
- [x] Icon changes based on theme
- [x] Theme switches instantly
- [x] Preference persists
- [x] Works on mobile
- [x] Neubrutalism styling
- [x] Smooth transitions

### Game State Persistence
- [x] Auto-saves during gameplay
- [x] Continue button appears when needed
- [x] Shows correct mode
- [x] Restores full state
- [x] Clears on game end
- [x] Clears on new game
- [x] 24-hour expiration
- [x] Error handling
- [x] Works on mobile
- [x] Both modes supported

---

**Version**: v2.3.0  
**Date**: 2025-11-22  
**Status**: ✅ COMPLETE
