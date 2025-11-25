#20Questions Game Requirements Document

## 1. Game Overview

### 1.1 Game Name

GLITCHGUESS

### 1.2 Game Description

A fully functional guessing game where players and AI take turns thinking of objects and asking yes/no questions to guess what the other is thinking. The game features three modes: Human thinks (AI guesses), AI thinks (Human guesses), and 1v1 Multiplayer (two players compete against each other).

### 1.3 Core Features

- Three game modes: Human vs AI (two modes) and 1v1 Multiplayer
- Category selection system for fair gameplay
- AI-powered question generation using Large Language Model
- 20-question limit per round
- Real-time question history tracking
- Dramatic reveal and celebration screens
- Mobile-friendly responsive design
- How to Play instructional page
- Browser local session storage for game state persistence
- Theme switcher for visual customization
- Database-backed session management with unique session IDs
- Admin dashboard for game data review\n- IP-based geolocation tracking
- Multiplayer game room creation with shareable URLs
- Real-time multiplayer synchronization
- Rematch system with role switching
\n## 2. Gameplay Mechanics

### 2.1 Start Screen

- Display bold title:'GLITCHGUESS'
- Show'How to Play' link/button in top corner leading to instructional page
- Show category selection section with instruction: 'Choose a category for a fair game:'
- Category options displayed as large clickable cards:\n  + Animals
  + Objects
  + People (Famous)\n  + Movies
  + Places
- Three large action buttons (enabled after category selection):
  + 'I think of something – AI guesses' (Human thinks mode)
  + 'AI thinks of something – I guess' (AI thinks mode)
  + '1v1 Multiplayer – Play with a friend' (Multiplayer mode)
\n### 2.2 How to Play Page

- Display page title: 'HOW TO PLAY'
- Game overview section explaining the core concept:\n  + This is a 20 questions guessing game between you and AI or another player
  + Choose a category to keep the game fair and fun
  + Take turns thinking of something and guessing
- Mode explanations:
  + **Human Thinks Mode**: You think of something in the chosen category, AI asks up to 20 yes/no questions to guess it
  + **AI Thinks Mode**: AI thinks of something in the chosen category, you ask yes/no questions and make guesses
  + **1v1 Multiplayer Mode**: Play against a friend in real-time, one player thinks while the other guesses, then switch roles in rematch
- Game rules:
  + Maximum 20 questions per round
  + Answer with Yes/No/Sometimes
  + All answers must be within the selected category
  + Make your final guess anytime during the game
-'Back to Home' button to return to start screen
- Maintain Neubrutalism design theme throughout the page

### 2.3 Human Thinks Mode

- Display selected category at top of screen
- Show instruction message: 'Perfect! Think of any [CATEGORY] within the selected category. Don't tell me what it is. I'll ask up to 20 yes/no questions.'
- No text input required (human keeps answer in mind)
- AI generates intelligent questions based on selected category and previous answers
- Three response buttons: Yes / No / Sometimes
- AI makes educated guesses based on accumulated information and category constraints
\n### 2.4 AI Thinks Mode

- Display selected category at top of screen\n- AI secretly selects a random word strictly within the chosen category (animal, object, famous person, movie, or place)
- Human types and submits yes/no questions\n- AI responds with Yes/No/Sometimes based on its secret answer
- Human can make guesses at any time
\n### 2.5 1v1 Multiplayer Mode\n
####2.5.1 Game Room Creation

- After selecting '1v1 Multiplayer' button, display name entry screen
- Show input field with label: 'Enter your name:'\n- Submit button to create game room
- Upon submission:\n  + Generate unique game room ID
  + Create shareable URL with game room ID (format: /game/[room-id])
  + Display waiting screen with:\n    * Message: 'Waiting for your friend to join...'
    * Shareable URL displayed prominently
    * 'Copy Link' button to copy URL to clipboard\n    * 'Share' button to open native share dialog (mobile-friendly)
    * Player name displayed\n    * Selected category displayed
\n#### 2.5.2 Joining Game Room

- When friend accesses shared URL, display join screen\n- Show input field with label: 'Enter your name:'
- Display host player's name and selected category
- Submit button to join game room
- Upon joining, both players proceed to game start

#### 2.5.3 Role Assignment

- System randomly assigns roles to two players:\n  + Player 1: Thinker (thinks of word within category)
  + Player 2: Guesser (asks questions and guesses)
- Display role assignment clearly to both players
- Thinker sees: 'You think of a [CATEGORY]. Your friend will guess!'
- Guesser sees: 'Your friend is thinking of a [CATEGORY]. Ask yes/no questions!'
\n#### 2.5.4 Multiplayer Gameplay

- Thinker:\n  + Keeps word in mind (no input required)
  + Receives questions from Guesser in real-time
  + Responds with Yes/No/Sometimes buttons
  + Can see question history\n- Guesser:
  + Types and submits yes/no questions
  + Receives answers in real-time
  + Can make guesses at any time
  + Can see question history
- Both players see:\n  + Question counter (X/20)
  + Real-time question and answer history
  + Opponent's name\n\n#### 2.5.5 Multiplayer End Game

- Game ends when:
  + Guesser guesses correctly
  + 20 questions reached without correct guess
- Display result screen to both players:\n  + Winner announcement
  + Correct answer revealed
  + Number of questions used
  + Confetti animation if Guesser wins
- Show 'Rematch' button to both players
\n#### 2.5.6 Rematch System

- When one player clicks 'Rematch', show waiting message: 'Waiting for opponent to accept rematch...'
- When both players click 'Rematch':
  + Roles automatically switch (previous Thinker becomes Guesser, previous Guesser becomes Thinker)
  + New game starts with same category
  + Question counter resets
  + Question history clears
- If one player leaves or declines, show message: 'Opponent left the game' with'Back to Home' button

### 2.6 Game Progress Display

- Question counter showing current question number out of 20
- Question history panel displaying all previous Q&A pairs in chronological order
- Clear visual distinction between questions and answers
\n### 2.7 End Game Conditions

- AI/Human/Player guesses correctly before 20 questions
- 20 questions reached without correct guess\n\n### 2.8 End Screen

- Victory message: 'I got it in X questions!' (if guessed correctly)
- Surrender message: 'I surrender! What was it?' (if 20 questions reached)
- Display confetti animation on victory
- Reveal the correct answer
- Large'Play Again' button to restart (single player modes)
-'Rematch' button for multiplayer mode

## 3. Design Style

### 3.1 Visual Aesthetic

Neubrutalism design with bold, professional, and intentionally imperfect premium feel\n
### 3.2 Color Scheme

- Base colors: Pure black (#000000) and pure white (#FFFFFF) for extreme contrast
- Accent colors: Hot pink (#FF006E) and electric lime (#CCFF00) for aggressive neon highlights
- Theme switcher allows users to toggle between different color schemes while maintaining Neubrutalism aesthetic

### 3.3 Visual Details

- Typography: Oversized bold sans-serif fonts (Inter or system fonts with font-weight 900)
- Borders: Thick irregular borders with intentional asymmetry
- Shadows: Heavy drop shadows for depth and drama
- Layout: Asymmetric composition with deliberate 'broken' elements
- Cards: Black background cards with neon text for question history
- Buttons: Large, chunky buttons with high contrast and bold labels
- Category cards: Distinct visual style with neon borders and hover effects
- How to Play page: Same Neubrutalism aesthetic with bold headings, neon accents, and chunky text blocks
- Theme switcher: Fixed position button in top right corner, visible on all pages, with bold icon and smooth transition effects
- Multiplayer UI: Clear role indicators, real-time status updates, and prominent share/copy buttons with neon styling

### 3.4 Responsive Design

- Fully mobile-friendly and responsive across all screen sizes
- Touch-optimized button sizes for mobile devices
- Adaptive layout maintaining Neubrutalism aesthetic on all viewports
\n## 4. Technical Requirements

### 4.1 AI Integration

- Use Large Language Model for:\n  + Generating intelligent questions in Human Thinks mode strictly within selected category
  + Creating creative/absurd secret answers in AI Thinks mode strictly within selected category
  + Making educated guesses based on answer patterns and category constraints
  + Responding to human questions in AI Thinks mode
- AI must strictly follow category rules to ensure answers are guessable within20 questions

### 4.2 Interaction Features

- Immediate AI response after each human answer
- Smooth transitions between game states\n- Confetti animation on victory
- Question history auto-scroll to latest entry
- Allow users to share the results with friends, generate dynamic unique url (avoid caching the og image by social medias) and dynamic og image to share the results
- Navigation between home page and How to Play page with smooth transitions
- Real-time synchronization for multiplayer mode
- Copy to clipboard functionality for game room URLs
- Native share dialog integration for mobile devices

### 4.3 Session Management and Database Storage

- Generate a unique session ID for each new game (single player and multiplayer)
- Store session ID in browser local storage
- Save the following data to database for each session:
  + Session ID (unique identifier)
  + Game type (Human thinks mode, AI thinks mode, or 1v1 Multiplayer)
  + Selected category
  + Secret word (if AI thinks mode or multiplayer)
  + All questions asked with corresponding answers (Yes/No/Sometimes)
  + Question order and timestamps
  + Game outcome (won/lost, number of questions used)
  + User geolocation data (country, region, city) obtained from IP address
  + For multiplayer: game room ID, both player names, role assignments, rematch count
- Local storage only stores session ID, all other game data retrieved from database
- Restore game state from database when page is refreshed using session ID
- Clear local storage session ID when game ends or user starts a new game

### 4.4 Multiplayer Real-Time Synchronization

- Use WebSocket or real-time database for instant communication between players
- Synchronize the following in real-time:
  + Player join/leave status
  + Questions submitted by Guesser
  + Answers provided by Thinker
  + Guess attempts
  + Game end state
  + Rematch requests and acceptances
- Handle disconnection scenarios:\n  + Show'Opponent disconnected' message
  + Allow reconnection within time window
  + Provide'Back to Home' option if opponent doesn't return
- Ensure data consistency across both player sessions

### 4.5 Game Room Management

- Generate unique game room IDs (short, shareable format)
- Store game room data in database:\n  + Room ID\n  + Host player name
  + Guest player name
  + Selected category
  + Room creation timestamp
  + Room status (waiting/active/completed)
  + Current game state\n- Expire inactive rooms after reasonable time period
- Validate room ID when guest joins via URL
- Handle edge cases: room full, room expired, invalid room ID

### 4.6 IP Geolocation Tracking
\n- Capture user's IP address when game session starts
- Use IP geolocation service to determine user's location:\n  + Country
  + Region/State
  + City
- Store geolocation data in database linked to session ID
- Handle cases where geolocation data is unavailable or blocked
- Ensure compliance with privacy regulations\n
### 4.7 Admin Dashboard

- Route: /lokka\n- Authentication required:\n  + Username: mamayilokka
  + Password: EHDZDWick@261221
- Dashboard features:
  + Display list of all game sessions with session IDs
  + Show game type (Human thinks, AI thinks, or 1v1 Multiplayer), category, and outcome for each session
  + Display user geolocation data (country, region, city) for each session
  + View detailed game data: all questions and answers in chronological order
  + Display secret word for AI thinks mode and multiplayer games
  + For multiplayer sessions: show both player names, role assignments, and rematch history
  + **1v1 Multiplayer game statistics**: Display total number of multiplayer games, win/loss ratios, average questions per game, and other relevant metrics
  + **Rematch handling**: Each rematch is logged and counted as a new game in statistics, with clear indication of rematch sequence (e.g., 'Game 1', 'Rematch 1', 'Rematch 2')
  + **Pagination**: Display 10 session records per page with navigation controls (Previous/Next buttons and page numbers)
  + Filter and search functionality by date, game type, category, or location
  + Simple, clean interface consistent with overall design aesthetic

### 4.8 Theme Switcher

- Fixed position theme switcher button always visible in top right corner across all pages
- Allow users to toggle between different color themes\n- Save theme preference in browser local storage
- Apply theme changes instantly with smooth transitions
- Maintain Neubrutalism design principles across all theme variations