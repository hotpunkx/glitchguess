# GLITCHGUESS Navigation Structure

## 🗺️ Site Map

```
┌─────────────────────────────────────────────────────────────┐
│                        HOME PAGE (/)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              GLITCHGUESS (Title)                    │    │
│  │                                                      │    │
│  │         [❓ HOW TO PLAY] ← NEW BUTTON               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  [I THINK OF SOMETHING – AI GUESSES]               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  [AI THINKS OF SOMETHING – I GUESS]                │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Fair Game Categories (12 categories displayed)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Click "HOW TO PLAY"
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  HOW TO PLAY PAGE (/how-to-play)            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              HOW TO PLAY (Title)                    │    │
│  │    Master the art of GLITCHGUESS in 2 minutes!     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  🎯 THE BASICS                                      │    │
│  │  - Game overview                                    │    │
│  │  - 20 questions, Yes/No/Sometimes answers           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  🧠 MODE 1: I THINK – AI GUESSES                   │    │
│  │  - Step 1: Think of something                       │    │
│  │  - Step 2: Answer AI's questions                    │    │
│  │  - Step 3: AI makes final guess                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  🤖 MODE 2: AI THINKS – I GUESS                    │    │
│  │  - Step 1: AI picks a secret                        │    │
│  │  - Step 2: Ask yes/no questions                     │    │
│  │  - Step 3: Make your guess                          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  🏆 WINNING CONDITIONS                              │    │
│  │  - You win if...                                    │    │
│  │  - AI wins if...                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  💡 PRO TIPS                                        │    │
│  │  - 4 strategic tips for better gameplay             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  📋 FAIR GAME CATEGORIES                           │    │
│  │  - 12 categories grid                               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           [BACK TO HOME] ← Return button            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Click "BACK TO HOME"
                              ↓
                         (Returns to Home Page)
```

---

## 🔗 Route Configuration

### Routes Defined in `src/routes.tsx`

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | GamePage | Main game interface with mode selection |
| `/how-to-play` | HowToPlayPage | Tutorial and instructions page |
| `*` | Navigate to `/` | Catch-all redirect to home |

---

## 🎯 Navigation Buttons

### Home Screen → How to Play

**Button**: "❓ HOW TO PLAY"
- **Location**: `src/components/game/StartScreen.tsx` (lines 18-25)
- **Position**: Below title, above game mode buttons
- **Style**: Brutal border, shadow effect, card background
- **Action**: `navigate('/how-to-play')`

```tsx
<Button
  onClick={() => navigate('/how-to-play')}
  className="h-auto py-3 px-6 xl:py-4 xl:px-8 text-sm xl:text-lg font-black brutal-border shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-card text-foreground max-sm:text-xs max-sm:py-2 max-sm:px-4"
>
  ❓ HOW TO PLAY
</Button>
```

### How to Play → Home Screen

**Button**: "BACK TO HOME"
- **Location**: `src/pages/HowToPlayPage.tsx` (bottom of page)
- **Position**: Below all tutorial content
- **Style**: Large green button with white hover text
- **Action**: `navigate('/')`

```tsx
<Button
  onClick={() => navigate('/')}
  className="w-full h-auto py-6 xl:py-8 text-xl xl:text-3xl font-black brutal-border-thick shadow-brutal-lime hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:text-white transition-all bg-accent text-accent-foreground max-sm:text-lg max-sm:py-5"
>
  BACK TO HOME
</Button>
```

---

## 📱 User Flow

### New Player Journey

```
1. Land on Home Page
   ↓
2. See "HOW TO PLAY" button
   ↓
3. Click to learn game rules
   ↓
4. Read tutorial (2-3 minutes)
   ↓
5. Click "BACK TO HOME"
   ↓
6. Choose game mode
   ↓
7. Start playing!
```

### Returning Player Journey

```
1. Land on Home Page
   ↓
2. Skip tutorial (already know rules)
   ↓
3. Choose game mode immediately
   ↓
4. Start playing!
```

---

## 🎨 Visual Hierarchy

### Home Screen

```
┌─────────────────────────────────────┐
│  GLITCHGUESS (Huge, animated)       │  ← Primary focus
│  [HOW TO PLAY] (Small, subtle)      │  ← Secondary action
│                                      │
│  [I THINK...] (Large, pink)         │  ← Primary actions
│  [AI THINKS...] (Large, green)      │  ← Primary actions
│                                      │
│  Categories (Medium, informative)   │  ← Supporting info
└─────────────────────────────────────┘
```

### How to Play Page

```
┌─────────────────────────────────────┐
│  HOW TO PLAY (Large, bold)          │  ← Page title
│  Subtitle (Medium)                   │  ← Context
│                                      │
│  [Content Sections] (Scrollable)    │  ← Main content
│  - The Basics                        │
│  - Mode 1                            │
│  - Mode 2                            │
│  - Winning                           │
│  - Tips                              │
│  - Categories                        │
│                                      │
│  [BACK TO HOME] (Large, green)      │  ← Exit action
└─────────────────────────────────────┘
```

---

## 🔄 Navigation Patterns

### Pattern 1: Discovery
User discovers "HOW TO PLAY" button naturally while exploring home screen.

### Pattern 2: Direct Access
User can access tutorial at any time from home screen without starting a game.

### Pattern 3: Easy Return
Large "BACK TO HOME" button ensures users can easily return after reading.

### Pattern 4: No Dead Ends
All routes lead somewhere - no 404 errors, all undefined paths redirect to home.

---

## 🎯 Design Decisions

### Why "HOW TO PLAY" is on Home Screen
- ✅ Immediately visible to new players
- ✅ Doesn't interrupt game flow for returning players
- ✅ Small enough to not dominate the interface
- ✅ Positioned logically (near title, before mode selection)

### Why Not a Modal/Popup
- ✅ Full page allows comprehensive tutorial
- ✅ Better for mobile reading experience
- ✅ Doesn't clutter home screen
- ✅ Can be bookmarked/shared directly

### Why "BACK TO HOME" is Large
- ✅ Primary action after reading tutorial
- ✅ Matches visual weight of game mode buttons
- ✅ Clear call-to-action
- ✅ Hard to miss on mobile

---

## 📊 Navigation Analytics (Potential)

If analytics were added, track:
- How many users click "HOW TO PLAY"
- Average time spent on tutorial page
- Bounce rate from tutorial page
- Conversion rate (tutorial → game start)

---

## 🚀 Future Navigation Enhancements

Potential additions:
1. **In-Game Help**: Quick tips during gameplay
2. **FAQ Page**: Common questions and answers
3. **Settings Page**: Customize game preferences
4. **Leaderboard**: Track high scores
5. **Share Results**: Social sharing functionality

---

**Version**: v2.2.0  
**Date**: 2025-11-22  
**Status**: ✅ COMPLETE
