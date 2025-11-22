# GLITCHGUESS Changelog

## 2025-11-22 - Theme Switcher & Game State Persistence

### Added
- **Theme Switcher**: Light/Dark mode toggle
  - Fixed position in top right corner (always visible)
  - Sun (☀️) icon for light mode, Moon (🌙) icon for dark mode
  - Persists theme preference in localStorage
  - Smooth transitions between themes
  - Works on all pages (home, game, how-to-play)
  - Styled with Neubrutalism aesthetic (brutal border, shadow effects)
  - File: `src/components/common/ThemeToggle.tsx`

- **Game State Persistence**: Auto-save functionality
  - Automatically saves game progress to localStorage
  - Restores game state on page refresh
  - Shows "⚡ CONTINUE GAME" button when saved game exists
  - Displays which mode was being played (I Think / AI Thinks)
  - 24-hour expiration for saved games
  - Clears saved state on game end or new game start
  - Supports both game modes with full state restoration:
    - Question history
    - Question count
    - Current question (Human Thinks mode)
    - Secret word (AI Thinks mode)
    - Instruction screen state
  - File: `src/hooks/use-game-storage.ts`

### Changed
- **App.tsx**: Added ThemeToggle component at root level
- **GamePage.tsx**: Integrated useGameStorage hook
  - Added initialState prop passing to game mode components
  - Added onStateChange callback for auto-saving
  - Added onContinueGame handler for resuming saved games
- **StartScreen.tsx**: Added Continue Game button
  - Shows when saved game exists
  - Displays saved game mode
  - Positioned above mode selection buttons
- **HumanThinksMode.tsx**: Added state persistence support
  - Accepts initialState prop for restoration
  - Calls onStateChange callback on state updates
  - Restores question history, count, and current question
- **AIThinksMode.tsx**: Added state persistence support
  - Accepts initialState prop for restoration
  - Calls onStateChange callback on state updates
  - Restores question history, count, and secret word

### Technical Details
- Uses localStorage with key `glitchguess-game-state`
- Theme stored with key `glitchguess-theme`
- State includes timestamp for expiration checking
- Only saves state during active gameplay (not on start/end screens)
- Graceful error handling for corrupted localStorage data
- All lint checks passing (81 files)

---

## 2025-11-22 - How to Play Page

### Added
- **How to Play Page**: Created comprehensive tutorial page at `/how-to-play`
  - Detailed explanation of game basics and objectives
  - Step-by-step instructions for both game modes:
    - Mode 1: I Think – AI Guesses
    - Mode 2: AI Thinks – I Guess
  - Clear winning conditions for both players
  - Pro tips section with strategic advice
  - Fair game categories reference
  - Styled with GLITCHGUESS Neubrutalism aesthetic (brutal borders, neon colors, bold typography)
  - Fully responsive design for mobile and desktop
  - File: `src/pages/HowToPlayPage.tsx`

- **Navigation Button**: Added "HOW TO PLAY" button on home screen
  - Positioned below the title, above game mode buttons
  - Uses question mark emoji (❓) for visual clarity
  - Styled with brutal border and shadow effects
  - Navigates to `/how-to-play` route
  - File: `src/components/game/StartScreen.tsx` (lines 18-25)

### Changed
- **Routing**: Updated routes configuration to include How to Play page
  - Added `/how-to-play` route
  - File: `src/routes.tsx`

### Technical Details
- Uses React Router's `useNavigate` hook for navigation
- Maintains consistent Neubrutalism design system
- All semantic color tokens used (bg-accent, text-foreground, etc.)
- Responsive typography with mobile-first approach
- All lint checks passing (79 files)

---

## 2025-11-22 - UX Improvements: Duplicate Questions & Button Hover States

### Changed
- **AI Question Generation**: Added duplicate question prevention
  - AI now explicitly instructed: "Never ask the same question twice"
  - Checks conversation history before generating new questions
  - Improves game flow and user experience
  - File: `src/services/aiService.ts` (line 92)

### Fixed
- **Button Hover States**: Fixed white text on hover for all green (accent) buttons
  - "I'M READY!" button in HumanThinksMode
  - "YES" button in HumanThinksMode
  - "AI THINKS OF SOMETHING" button (already had fix)
  - "PLAY AGAIN" button (already had fix)
  - Improved visual feedback and consistency across all green buttons
  - Files: `src/components/game/HumanThinksMode.tsx` (lines 95, 126)

### Technical Details
- All buttons with `bg-accent` now include `hover:text-white` class
- AI prompt updated to prevent repetitive questioning
- All lint checks passing (78 files)

---

## 2025-11-22 - Critical Bug Fix: AI Victory Logic

### Fixed
- **CRITICAL BUG**: AI was automatically declaring victory on regular "is it" questions
  - **Problem**: When AI asked "Is it edible?" and human answered "Yes", the app incorrectly declared AI victory
  - **Root Cause**: Code couldn't distinguish between regular questions and final guesses
  - **Solution**: Now only declares victory when AI makes a "My final guess:" statement and human confirms
  - **Impact**: Game now works correctly - human must confirm final guess before AI wins

### Technical Details
- File: `src/components/game/HumanThinksMode.tsx` (lines 48-74)
- Changed victory detection from `startsWith('is it')` to `includes('my final guess:')`
- Added proper extraction of guessed answer from final guess format
- Regular questions now never trigger automatic victory

---

## 2025-11-22 - Footer & AI Prompt Updates

### Added
- **Footer Component**: Added attribution footer with "With ❤️ by IamIsPra in LK"
  - Styled with GLITCHGUESS Neubrutalism aesthetic (black background, neon accent border)
  - Includes clickable GitHub link to IamIsPra's profile
  - Displays current year and GLITCHGUESS branding
  - Integrated into App.tsx layout

### Changed
- **AI Question Generation Prompt**: Updated `generateAIQuestion` method
  - Added explicit instruction: "Ask direct questions to get yes or no as answers"
  - Added concrete examples: "is it edible? Is it a place?"
  - Removed "slightly chaotic" descriptor for more focused questioning
  - Emphasizes clarity and unambiguous yes/no responses

### Documentation Updates
- Updated `TODO.md` with footer implementation and bug fix
- Updated `AI_PERSONALITY.md` with new prompt wording
- Updated `PROMPT_QUICK_REFERENCE.md` with revised generateAIQuestion section
- Updated `CHANGELOG.md` for tracking changes

### Technical Details
- File: `src/components/common/Footer.tsx` - Complete rewrite
- File: `src/App.tsx` - Added Footer import and component
- File: `src/services/aiService.ts` - Updated generateAIQuestion prompt (lines 83-94)
- All lint checks passing (78 files)

---

## Previous Updates (2025-11-21)

### AI Personality Overhaul
- Updated all 4 AI service functions to match "brutal neon" brand aesthetic
- Added "GLITCHGUESS" branding to all prompts
- Shifted tone from polite to aggressive/confident
- Reduced word count by ~40% for efficiency

### Game Improvements
- Fixed green text contrast issues (added accent-dark color)
- Implemented smart answer detection with fuzzy matching
- Added "Give Up & See Answer" button in AI Thinks Mode
- Question field now detects correct answers automatically
- Updated QuestionHistory to show latest question on top

### UI Enhancements
- Added fair game categories list on home screen (12 categories)
- Added white text hover effects to buttons
- Improved responsive design and mobile experience

---

## Version History

**v2.1** (2025-11-22)
- Footer with attribution
- Improved AI question clarity

**v2.0** (2025-11-21)
- AI personality overhaul
- Smart answer detection
- Accessibility improvements

**v1.0** (2025-11-20)
- Initial GLITCHGUESS release
- Dual game modes
- Neubrutalism design
- AI-powered gameplay
