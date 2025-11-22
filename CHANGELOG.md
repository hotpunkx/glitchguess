# GLITCHGUESS Changelog

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
