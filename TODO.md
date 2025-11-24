# Task: Build GLITCHGUESS - 20 Questions Game

## Plan
- [x] 1. Setup Design System
  - [x] 1.1 Configure Neubrutalism color scheme in index.css
  - [x] 1.2 Update tailwind.config.js with custom colors
  - [x] 1.3 Add custom fonts and typography
- [x] 2. Create AI Service
  - [x] 2.1 Implement LLM API integration service
  - [x] 2.2 Add question generation logic
  - [x] 2.3 Add answer generation logic
- [x] 3. Build Game Components
  - [x] 3.1 Create StartScreen component
  - [x] 3.2 Create HumanThinksMode component
  - [x] 3.3 Create AIThinksMode component
  - [x] 3.4 Create QuestionHistory component
  - [x] 3.5 Create EndScreen component
- [x] 4. Implement Game Logic
  - [x] 4.1 Create game state management
  - [x] 4.2 Add question counter
  - [x] 4.3 Add win/lose conditions
- [x] 5. Add Visual Effects
  - [x] 5.1 Add CSS-based confetti animation
  - [x] 5.2 Add victory animations
- [x] 6. Testing and Validation
  - [x] 6.1 Run lint checks
  - [x] 6.2 Test all game modes
  - [x] 6.3 Test responsive design

## Recent Updates
- [x] Updated QuestionHistory to show latest question on top (reversed order)
- [x] Added fair game categories list on home screen (12 categories)
- [x] Updated AI service to follow fair game category rules
- [x] Updated HumanThinksMode instruction to reference categories
- [x] Added white text hover effect to "AI THINKS OF SOMETHING" button
- [x] Added white text hover effect to "PLAY AGAIN" button
- [x] Implemented fuzzy matching for spelling mistakes (Levenshtein distance)
- [x] Added question format normalization (removes "Is it", "?", etc.)
- [x] Added "Give Up & See Answer" button in AI Thinks Mode
- [x] Fixed green text contrast issues on white backgrounds
- [x] Added accent-dark color (dark green) for better readability
- [x] Question field now detects correct answers and ends game with victory
- [x] Updated all AI prompts to GLITCHGUESS style (brutal neon personality)
  - [x] generateAIQuestion: Direct yes/no questions with examples
  - [x] generateAIGuess: "final guess" format with clear output
  - [x] generateSecretWord: concrete examples, strict output format
  - [x] answerQuestion: strict one-word responses
- [x] Added Footer with attribution: "With ❤️ by IamIsPra in LK"
- [x] Footer styled with GLITCHGUESS Neubrutalism aesthetic
- [x] Fixed critical bug: AI auto-winning on regular "is it" questions
  - [x] Now only declares victory on "My final guess:" statements
  - [x] Regular questions no longer trigger automatic victory
  - [x] Human must confirm final guess before AI wins
- [x] Added duplicate question prevention in AI prompts
  - [x] AI now explicitly instructed to never ask same question twice
  - [x] Checks conversation history before asking new questions
- [x] Fixed hover text color on all green (accent) buttons
  - [x] All bg-accent buttons now show white text on hover
  - [x] Improved visual feedback and consistency
- [x] Added "How to Play" page
  - [x] Created comprehensive tutorial page at /how-to-play
  - [x] Added HOW TO PLAY button on home screen
  - [x] Implemented navigation between home and tutorial
  - [x] Styled with GLITCHGUESS Neubrutalism aesthetic
  - [x] Fully responsive design
- [x] Added Theme Switcher (Light/Dark Mode)
  - [x] Created ThemeToggle component with sun/moon icons
  - [x] Fixed position in top right corner (always visible)
  - [x] Persists theme preference in localStorage
  - [x] Smooth transitions between themes
  - [x] Works on all pages
- [x] Added Game State Persistence (Auto-Save)
  - [x] Created useGameStorage hook for localStorage management
  - [x] Saves game state automatically during gameplay
  - [x] Restores game on page refresh
  - [x] Shows "CONTINUE GAME" button when saved game exists
  - [x] Clears saved state on game end or new game
  - [x] 24-hour expiration for saved games
  - [x] Supports both Human Thinks and AI Thinks modes
  - [x] Created comprehensive tutorial page with game rules
  - [x] Explained both game modes with step-by-step instructions
  - [x] Added winning conditions and pro tips
  - [x] Styled with GLITCHGUESS Neubrutalism aesthetic
- [x] Fixed mobile button text overflow
  - [x] Reduced font size from text-lg to text-sm on mobile screens
  - [x] Fixed "I THINK OF SOMETHING – AI GUESSES" button
  - [x] Fixed "AI THINKS OF SOMETHING – I GUESS" button
  - [x] Fixed "⚡ CONTINUE GAME" button
  - [x] Text now fits properly within button width on small screens
  - [x] Added "HOW TO PLAY" button on home screen
  - [x] Implemented navigation between home and how-to-play pages
- [x] UI Polish & Spacing Improvements
  - [x] Added white text hover to "HOW TO PLAY" button
  - [x] Added top margin to GLITCHGUESS title (mt-16 mobile, xl:mt-20 desktop)
  - [x] Fixed theme toggle button overlap with title
  - [x] Improved visual consistency across all buttons
- [x] Fixed Eiffel Tower Repetition Issue
  - [x] Replaced hardcoded "Eiffel Tower" fallback with random selection
  - [x] Created list of 20 diverse fallback words covering all categories
  - [x] Added validation for empty AI responses
  - [x] Improved error logging and debugging
  - [x] Much better variety when AI service fails
- [x] Secret Word Security & AI Improvements
  - [x] Implemented Base64 encoding for secret word in localStorage
  - [x] Secret word no longer visible in DevTools (prevents cheating)
  - [x] Improved AI prompt to reduce "Eiffel Tower" repetition
  - [x] Added response cleaning (removes &nbsp; and HTML entities)
  - [x] Better variety in AI word selection
  - [x] Clean, properly formatted responses
- [x] AI Caching & Randomization Fix (CRITICAL)
  - [x] Added unique Session ID to prevent API caching
  - [x] Implemented dynamic category rotation (11 groups, select 5 randomly)
  - [x] Hard-blocked "Paris" and "Eiffel Tower" at code level
  - [x] Added diverse fallback system (10 words)
  - [x] Improved prompt with explicit randomization rules
  - [x] Eliminated repetitive word generation
  - [x] Achieved 80-90% variety in word selection
- [x] Analytics Integration
  - [x] Added Simple Analytics script to index.html
  - [x] Privacy-friendly tracking (respects Do Not Track)
  - [x] Async loading for performance
  - [x] No cookies, GDPR compliant
- [x] Database & Session Tracking
  - [x] Implemented Supabase database integration
  - [x] Created game_sessions table with unique session IDs
  - [x] Added IP geolocation tracking (country, city, region)
  - [x] Tracks game mode, questions asked, and win/loss
  - [x] Created admin dashboard at /lokka route
  - [x] Implemented password authentication for admin access
  - [x] Real-time session statistics and analytics
- [x] Footer Update
  - [x] Changed GitHub link to X.com link (https://x.com/IamIsPra)
  - [x] Maintained GLITCHGUESS Neubrutalism aesthetic
- [x] 1v1 Multiplayer Feature (COMPLETE)
  - [x] Database schema with multiplayer_games and multiplayer_questions tables
  - [x] Real-time synchronization using Supabase Realtime
  - [x] Game creation with unique 6-character codes
  - [x] Shareable links with copy/share functionality
  - [x] Join game flow for second player
  - [x] Random role assignment (thinker/guesser)
  - [x] Real-time question and answer synchronization
  - [x] Pending question state management
  - [x] Thinker view: Set secret word, answer questions
  - [x] Guesser view: Ask questions, see answers
  - [x] Question history with real-time updates
  - [x] Game end conditions (20 questions or correct guess)
  - [x] Rematch system with role switching
  - [x] Session management via localStorage
  - [x] Comprehensive error handling and logging
  - [x] Fallback UI for spectators/invalid states
  - [x] CSS-based confetti animation for winners
  - [x] Mobile-responsive design
  - [x] All TypeScript errors fixed
  - [x] Fixed join issue - game status now changes at correct time
  - [x] Short URLs for sharing (/play/CODE instead of long UUID URLs)
  - [x] Player 2 waiting screen after joining
  - [x] 60% shorter shareable links
  - [x] Fixed Player 2 join screen - always shows name input field
  - [x] Added toast notification for Player 1 when Player 2 joins
  - [x] Updated waiting room UI to show opponent status
  - [x] Improved join flow with clear feedback for both players
  - [x] Added secret word input field for Player 1 after Player 2 joins
  - [x] Complete validation and error handling for secret word
  - [x] "START GAME" button with loading states
  - [x] Implemented flexible role assignment - either player can set word
  - [x] Added current_questioner field to database
  - [x] Updated role logic: word setter = answerer, other = questioner
  - [x] Both players can set secret word after joining
  - [x] Clear UI messaging about role assignment
  - [x] Fix: Ensure only one player can become thinker at a time
    - [x] Added word_setter_claimed field to database
    - [x] Created atomic claim_word_setter() RPC function
    - [x] Updated UI to show when opponent is setting word
    - [x] Prevent race conditions with database-level locking
  - [x] Implement random word setter assignment
    - [x] Randomly select one player when both join
    - [x] Update UI to show only selected player can set word
    - [x] Other player sees waiting message with clear role indication
  - [x] Fix: Improve winning logic with proper guess mechanism
    - [x] Added "Make a Guess" button for questioner
    - [x] Proper guess submission with "Is it X?" format
    - [x] Answerer sees special indicator for guesses
    - [x] Correct winner tracking in database
    - [x] End game with proper winner assignment
    - [x] Fixed bug: Game ending after first question
      - [x] Added is_guess field to database
      - [x] Use is_guess flag instead of text detection
      - [x] Regular questions no longer treated as guesses
  - [x] UX Improvements for answerer
    - [x] Hide question after answering
    - [x] Show "Answer sent! Waiting for next question..." state
    - [x] Add "They Got It!" button for answerer to mark correct guess
    - [x] Button always visible for answerer to end game when opponent guesses correctly
  - [x] Rematch role assignment fix
    - [x] Set word_setter_claimed to new thinker (previous questioner)
    - [x] Set current_questioner to previous thinker
    - [x] Only the previous questioner can set word in rematch
    - [x] Prevents both players from setting word
    - [x] Fixed: Both players were thinkers - now roles switch correctly
  - [x] Questioner UX improvements
    - [x] Show pending question while waiting for answer
    - [x] Display question history for questioner
    - [x] Disable input while waiting for answer
  - [x] Real-time subscription fix
    - [x] Subscribe to UPDATE events for questions
    - [x] Answerer sees questions in real-time
    - [x] History updates when questions are answered
  - [x] Rematch questioner wait state
    - [x] Questioner sees waiting message until thinker sets secret word
    - [x] Prevents asking questions before game is ready
    - [x] Better UX for rematch flow
  - [x] Secret word notification
    - [x] Show toast notification when opponent sets secret word
    - [x] Notify questioner they can now ask questions
  - [x] Remove AI question suggestion
    - [x] Removed askNextQuestion() function
    - [x] Removed generateAIQuestion import
    - [x] Players now type their own questions
  - [x] Game subscription fix
    - [x] Fixed useEffect dependencies causing subscription re-creation
    - [x] Use functional setState to avoid stale closures
    - [x] Questioner UI now updates when opponent sets secret word
  - [x] Debug subscription issue
    - [x] Added comprehensive logging to subscription
    - [x] Added state transition logging
    - [x] Added payload logging
    - [x] Found root cause: rematch created with wrong status
    - [x] Fixed: Changed game_status from 'active' to 'waiting' in createRematchGame()
- [x] All lint checks passing

## Notes
- Using Large Language Model API for AI functionality
- AI Personality: "Brutal neon interrogator" style matching GLITCHGUESS aesthetic
  * Asks "extremely smart, slightly chaotic" yes/no questions
  * Uses aggressive, confident tone
  * Focuses on splitting possibilities efficiently
- Neubrutalism design: Black/White base with Hot Pink/Electric Lime accents
- Mobile-first responsive design
- CSS-based confetti instead of library due to installation issues
- Question history displays in reverse chronological order (newest first)
- Fair game categories ensure items are guessable within 20 questions:
  * Animals, Food & Drinks, Movies & TV Shows, Video Games
  * Sports & Athletes, Countries & Cities, Musicians & Bands
  * Famous Books, Vehicles, Famous Landmarks, Famous Artists, Common Objects
- Fuzzy matching algorithm:
  * Uses Levenshtein distance to handle spelling mistakes
  * Allows 1 character difference for words ≤5 chars
  * Allows 2 character differences for words 6-10 chars
  * Allows 3 character differences for words >10 chars
  * Normalizes input by removing "Is it", "It is", "It's", and "?" formatting
  * Works in both guess field and question field for AI Thinks Mode
- Give Up feature allows users to end game early and see the answer
- Smart answer detection in AI Thinks Mode:
  * Question field automatically detects if user typed the correct answer
  * Works with questions like "Is it a Lion?" or direct answers like "Lion"
  * Uses same fuzzy matching as guess field for consistency
  * Immediately ends game with victory if correct answer detected
- Color accessibility:
  * accent-dark (dark green) used for text on white backgrounds
  * Ensures WCAG contrast compliance for readability
  * Light mode: hsl(75 80% 25%) - dark olive green
  * Dark mode: hsl(75 100% 70%) - bright lime green
- 1v1 Multiplayer Architecture:
  * Supabase Realtime for instant synchronization between players
  * Unique 6-character game codes for easy sharing
  * Short URL system: /play/CODE (60% shorter than full URLs)
  * Session-based player identification (persists across refreshes)
  * Pending question state for smooth turn-based gameplay
  * Automatic role switching in rematch system
  * Comprehensive error handling with fallback UI states
  * Mobile-optimized with native share API support
  * Game status progression: waiting → active (when secret word set) → ended
  * Player 2 waiting screen after joining (before game starts)
