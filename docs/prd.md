# GLITCHGUESS Game Requirements Document

## 1. Game Overview

### 1.1 Game Name

GLITCHGUESS

### 1.2 Game Description

A fully functional guessing game where players and AI take turns thinking of objects and asking yes/no questions to guess what the other is thinking. The game features three modes: Human thinks (AI guesses), AI thinks (Human guesses), and 1v1 Multiplayer (two players compete against each other with private or public game options).

### 1.3 Core Features

- Three game modes: Human vs AI (two modes) and 1v1 Multiplayer
- Category selection system for fair gameplay
- AI-powered question generation using Large Language Model\n- 20-question limit per round
- Real-time question history tracking
- Dramatic reveal and celebration screens
- Mobile-friendly responsive design
- How to Play instructional page
- Browser local session storage for game state persistence
- Theme switcher for visual customization
- Database-backed session management with unique session IDs
- Admin dashboard for game data review
- IP-based geolocation tracking
- Multiplayer game room creation with shareable URLs
- Private and public game options for multiplayer mode
- Public game lobby for matchmaking
- Real-time multiplayer synchronization
- Rematch system with role switching
- Local storage tracking for ongoing games
- Back to Home button on all pages that lack navigation to home
\n## 2. Gameplay Mechanics

### 2.1 Start Screen

- Display bold title:'GLITCHGUESS'\n- Show'How to Play' link/button in top corner leading to instructional page
- Show category selection section with instruction: 'Choose a category for a fair game:'
- Category options displayed as large clickable cards:\n  + Animals
  + Objects
  + People (Famous)
  + Movies
  + Places
- Three large action buttons (enabled after category selection):
  + 'I think of something – AI guesses' (Human thinks mode)
  + 'AI thinks of something – I guess' (AI thinks mode)
  + '1v1 Multiplayer – Play with a friend' (Multiplayer mode)
- Additional button visible at all times:
  + '1v1 Lobby' button to access public game lobby
\n### 2.2 How to Play Page

- Display page title: 'HOW TO PLAY'
- Game overview section explaining the core concept:\n  + This is a 20 questions guessing game between you and AI or another player
  + Choose a category to keep the game fair and fun
  + Take turns thinking of something and guessing\n- Mode explanations:
  + **Human Thinks Mode**: You think of something in the chosen category, AI asks up to 20 yes/no questions to guess it
  + **AI Thinks Mode**: AI thinks of something in the chosen category, you ask yes/no questions and make guesses
  + **1v1 Multiplayer Mode**: Play against a friend in real-time (private or public game), one player thinks while the other guesses, then switch roles in rematch
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
- Include'Back to Home' button to return to start screen

### 2.4 AI Thinks Mode

- Display selected category at top of screen
- AI secretly selects a random word strictly within the chosen category (animal, object, famous person, movie, or place)
- Human types and submits yes/no questions\n- AI responds with Yes/No/Sometimes based on its secret answer
- Human can make guesses at any time
- Include 'Back to Home' button to return to start screen

### 2.5 1v1 Multiplayer Mode

#### 2.5.1 Game Type Selection

- After selecting '1v1 Multiplayer' button and choosing category, display game type selection screen
- Show two large option buttons:
  + 'Private Game' - Play with a specific friend via shared link
  + 'Public Game' - Join public lobby for matchmaking
- Display selected category at top of screen
- Include 'Back to Home' button to return to start screen

#### 2.5.2 Private Game Creation

- After selecting 'Private Game', display name entry screen
- Show input field with label: 'Enter your name:'\n- Submit button to create private game room
- Upon submission:\n  + Generate unique game room ID
  + Create shareable URL with game room ID (format: /game/[room-id])
  + Store game information in local storage with status'waiting'
  + Display waiting screen with:\n    * Message: 'Waiting for your friend to join...'
    * Shareable URL displayed prominently
    * 'Copy Link' button to copy URL to clipboard
    * 'Share' button to open native share dialog (mobile-friendly)
    * Player name displayed\n    * Selected category displayed
    * 'Cancel' button to return to home\n\n#### 2.5.3 Public Game Creation

- After selecting 'Public Game', display name entry screen
- Show input field with label: 'Enter your name:'
- Submit button to create public game room
- Upon submission:
  + Generate unique game room ID
  + Add game to public lobby list in database
  + Store game information in local storage with status 'waiting_public'
  + Display waiting screen with:
    * Message: 'Waiting for someone to join from lobby...'
    * Player name displayed
    * Selected category displayed
    * 'View Lobby' button to check lobby status
    * 'Cancel' button to remove game from lobby and return to home
- Host can check local storage to see if someone joined their public game
- When opponent joins, update local storage status to 'active' and proceed to game start

#### 2.5.4 1v1 Lobby

- Accessible via '1v1 Lobby' button on start screen
- Display list of all available public games waiting for players
- For each game in lobby, show:
  + Host player name
  + Selected category
  + Game creation time
  + 'Join Game' button\n- Show separate section for ongoing games:\n  + Display user's active games (both as host and as guest)
  + Show opponent name and game status
  + 'Continue Game' button to rejoin active game
- Filter options:
  + Show only waiting games
  + Show only ongoing games
  + Show all games
- Real-time updates when new games are added or games are joined
-'Back to Home' button to return to start screen

#### 2.5.5 Joining Public Game from Lobby

- When user clicks 'Join Game' in lobby, display name entry screen
- Show input field with label: 'Enter your name:'
- Display host player's name and selected category
- Submit button to join game room
- Upon joining:
  + Remove game from public lobby waiting list
  + Store game information in joiner's local storage with status 'active'
  + Update host's local storage status to 'active'
  + Notify host that opponent has joined
  + Both players proceed to game start
- Include 'Back to Home' button to return to start screen

#### 2.5.6 Joining Private Game via URL

- When friend accesses shared URL, display join screen
- Show input field with label: 'Enter your name:'\n- Display host player's name and selected category
- Submit button to join game room
- Upon joining:
  + Store game information in joiner's local storage with status 'active'
  + Update host's local storage status to 'active'
  + Both players proceed to game start
- Include 'Back to Home' button to return to start screen
\n#### 2.5.7 Local Storage Game Tracking

- Store the following in local storage for each multiplayer game:
  + Game room ID
  + Game type (private/public)
  + Player role (host/guest)
  + Player name
  + Opponent name (once joined)
  + Selected category
  + Game status (waiting/waiting_public/active/completed)
  + Session ID\n- Update local storage in real-time as game progresses
- Allow users to check local storage and continue ongoing games
- Clear completed games from local storage after24 hours
\n#### 2.5.8 Continuing Ongoing Games

- Users can access ongoing games from:\n  + 1v1 Lobby (ongoing games section)
  + Automatic detection when returning to site (check local storage)
- When continuing game:
  + Retrieve game state from database using session ID
  + Restore question history, current question count, and player roles
  + Resume game from exact point where it was left\n- If opponent has disconnected, show 'Waiting for opponent to reconnect...'
- Provide 'Abandon Game' option to exit and clear from local storage
- Include 'Back to Home' button to return to start screen
\n#### 2.5.9 Role Assignment

- System randomly assigns roles to two players:\n  + Player 1: Thinker (thinks of word within category)
  + Player 2: Guesser (asks questions and guesses)
- Display role assignment clearly to both players
- Thinker sees:'You think of a [CATEGORY]. Your friend will guess!'
- Guesser sees: 'Your friend is thinking of a [CATEGORY]. Ask yes/no questions!'
\n#### 2.5.10 Multiplayer Gameplay

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
  + Opponent's name\n- Include 'Back to Home' button to return to start screen

#### 2.5.11 Multiplayer End Game

- Game ends when:
  + Guesser guesses correctly
  + 20 questions reached without correct guess
- Display result screen to both players:\n  + Winner announcement
  + Correct answer revealed
  + Number of questions used
  + Confetti animation if Guesser wins
- Show 'Rematch' button to both players
- Update local storage status to 'completed'\n- Include 'Back to Home' button to return to start screen\n
#### 2.5.12 Rematch System\n
- When one player clicks 'Rematch', show waiting message: 'Waiting for opponent to accept rematch...'
- When both players click 'Rematch':
  + Roles automatically switch (previous Thinker becomes Guesser, previous Guesser becomes Thinker)
  + New game starts with same category\n  + Question counter resets
  + Question history clears
  + Create new session ID for rematch
  + Update local storage with new session ID and status 'active'
- If one player leaves or declines, show message: 'Opponent left the game' with'Back to Home' button
\n### 2.6 Game Progress Display

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
- 'Rematch' button for multiplayer mode
- Include 'Back to Home' button to return to start screen

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
- Lobby UI: List-style layout with game cards showing host info, category badges, and prominent join buttons with neon accents
- Game type selection: Large option cards with distinct visual styling for private vs public games
- Back to Home button: Consistent styling across all pages, positioned clearly for easy navigation

### 3.4 Responsive Design

- Fully mobile-friendly and responsive across all screen sizes
- Touch-optimized button sizes for mobile devices
- Adaptive layout maintaining Neubrutalism aesthetic on all viewports
\n## 4. Technical Requirements

### 4.1 AI Integration

- Use Gemini API for AI-powered features:\n  + API Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
  + API Key: X-goog-api-key: AIzaSyBxta-mOinnGrBjuoV44bd-TrFnKuVk5V4
- AI functionalities:
  + Generating intelligent questions in Human Thinks mode strictly within selected category
  + Creating creative/absurd secret answers in AI Thinks mode strictly within selected category
  + Making educated guesses based on answer patterns and category constraints
  + Responding to human questions in AI Thinks mode
- AI must strictly follow category rules to ensure answers are guessable within20 questions
- Implement proper error handling for API calls
- Optimize API usage to minimize latency and costs

### 4.2 Interaction Features

- Immediate AI response after each human answer
- Smooth transitions between game states\n- Confetti animation on victory
- Question history auto-scroll to latest entry
- Allow users to share the results with friends, generate dynamic unique url (avoid caching the og image by social medias) and dynamic og image to share the results
- Navigation between home page and How to Play page with smooth transitions
- Real-time synchronization for multiplayer mode
- Copy to clipboard functionality for game room URLs
- Native share dialog integration for mobile devices
- Real-time lobby updates when games are added or joined
- Automatic game state restoration from local storage on page load
- Back to Home button functionality on all relevant pages

### 4.3 Session Management and Database Storage

- Generate a unique session ID for each new game (single player and multiplayer)
- Store session ID in browser local storage
- Save the following data to database for each session:
  + Session ID (unique identifier)\n  + Game type (Human thinks mode, AI thinks mode, or 1v1 Multiplayer)
  + Multiplayer game type (private/public, if applicable)
  + Selected category
  + Secret word (if AI thinks mode or multiplayer)
  + All questions asked with corresponding answers (Yes/No/Sometimes)
  + Question order and timestamps
  + Game outcome (won/lost, number of questions used)
  + User geolocation data (country, region, city) obtained from IP address
  + For multiplayer: game room ID, both player names, role assignments, rematch count, game status
- Local storage stores session ID and game tracking information
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
  + Lobby updates (new games added, games joined)
- Handle disconnection scenarios:\n  + Show 'Opponent disconnected' message
  + Allow reconnection within time window
  + Provide 'Back to Home' option if opponent doesn't return
- Ensure data consistency across both player sessions

### 4.5 Game Room Management

- Generate unique game room IDs (short, shareable format)
- Store game room data in database:\n  + Room ID
  + Game type (private/public)
  + Host player name
  + Guest player name
  + Selected category
  + Room creation timestamp
  + Room status (waiting/waiting_public/active/completed)
  + Current game state\n- Expire inactive rooms after reasonable time period
- Validate room ID when guest joins via URL
- Handle edge cases: room full, room expired, invalid room ID
- For public games:\n  + Add to public lobby list when created
  + Remove from lobby list when joined
  + Track lobby visibility status

### 4.6 Public Game Lobby System

- Maintain real-time list of public games in database
- Store lobby game data:
  + Game room ID
  + Host player name
  + Selected category
  + Creation timestamp
  + Game status (waiting/active)\n- Real-time updates when:\n  + New public game is created
  + Public game is joined (remove from waiting list)
  + Player disconnects from waiting game
- Query and display:\n  + All waiting public games
  + User's ongoing games (as host or guest)
- Implement filtering and sorting options
- Auto-refresh lobby every few seconds

### 4.7 Local Storage Management

- Store multiplayer game tracking data in browser local storage:\n  + Game room ID
  + Session ID
  + Game type (private/public)
  + Player role (host/guest)
  + Player name
  + Opponent name
  + Selected category\n  + Game status (waiting/waiting_public/active/completed)\n  + Last updated timestamp
- Update local storage in real-time as game progresses
- Check local storage on page load:\n  + If active game found, prompt user to continue
  + If waiting game found, show status and allow cancellation
- Implement local storage cleanup:\n  + Remove completed games after 24 hours
  + Remove abandoned games after 1 hour of inactivity
- Sync local storage with database to ensure consistency

### 4.8 IP Geolocation Tracking

- Capture user's IP address when game session starts
- Use IP geolocation service to determine user's location:\n  + Country
  + Region/State
  + City
- Store geolocation data in database linked to session ID
- Handle cases where geolocation data is unavailable or blocked
- Ensure compliance with privacy regulations\n
### 4.9 Admin Dashboard

- Route: /lokka\n- Authentication required:\n  + Username: mamayilokka
  + Password: EHDZDWick@261221
- Dashboard features:
  + Display list of all game sessions with session IDs
  + Show game type (Human thinks, AI thinks, or 1v1 Multiplayer), multiplayer type (private/public), category, and outcome for each session
  + Display user geolocation data (country, region, city) for each session
  + View detailed game data: all questions and answers in chronological order
  + Display secret word for AI thinks mode and multiplayer games
  + For multiplayer sessions: show both player names, role assignments, game type (private/public), and rematch history
  + **1v1 Multiplayer game statistics**: Display total number of multiplayer games (separated by private/public), win/loss ratios, average questions per game, and other relevant metrics
  + **Public lobby statistics**: Show total public games created, average wait time, join rate\n  + **Rematch handling**: Each rematch is logged and counted as a new game in statistics, with clear indication of rematch sequence (e.g., 'Game 1', 'Rematch 1', 'Rematch 2')
  + **Pagination**: Display 10 session records per page with navigation controls (Previous/Next buttons and page numbers)
  + Filter and search functionality by date, game type, multiplayer type, category, or location
  + Simple, clean interface consistent with overall design aesthetic

### 4.10 Theme Switcher

- Fixed position theme switcher button always visible in top right corner across all pages
- Allow users to toggle between different color themes
- Save theme preference in browser local storage
- Apply theme changes instantly with smooth transitions
- Maintain Neubrutalism design principles across all theme variations

## 5. SEO Optimization Requirements

### 5.1 Title Tag

- Implement keyword-rich title tag: 'GLITCHGUESS: AI20Questions Game - Free Multiplayer Guessing Game Online'
- Ensure title is under 60 characters for optimal display in search results
- Include primary keywords: AI guessing game, 20 questions, multiplayer, free online game
\n### 5.2 Meta Description

- Write compelling meta description with call-to-action: 'Challenge the AI or a friend in GLITCHGUESS, the free online20 Questions game with multiplayer mode. Test your knowledge and guessing skills. Start playing now!'
- Keep meta description between 150-160 characters
- Include primary keywords and action-oriented language

### 5.3 H1 Heading Structure

- Use single H1 heading for main title: 'GLITCHGUESS'\n- Implement proper heading hierarchy with H2 and H3 tags for sub-sections:\n  + H2: 'How to Play', 'Game Modes', 'Features'
  + H3: Mode-specific sections, feature details\n- Ensure headings are descriptive and keyword-relevant

### 5.4 Body Content Enhancement

- Add engaging introductory text block (2-3 paragraphs) on homepage describing:\n  + Game features and benefits (e.g., 'Test your knowledge', 'Challenge friends', 'AI-powered gameplay')
  + What makes GLITCHGUESS unique (Neubrutalism design, multiple game modes, real-time multiplayer)
  + Target audience appeal (casual gamers, trivia enthusiasts, party game seekers)
- Include natural keyword integration throughout content
- Maintain conversational and engaging tone

### 5.5 Keyword Targeting

- Primary keywords to target:
  + AI guessing game
  + Free20 questions online
  + Multiplayer trivia game
  + Online party game
  + Guessing game with friends
  + 20 questions AI
- Integrate keywords naturally in:\n  + Page titles and headings
  + Body content and descriptions
  + Button labels and CTAs where appropriate
  + Alt text for images

### 5.6 Image Optimization

- Implement descriptive Alt Text for all images:\n  + App icon/logo: 'GLITCHGUESS logo - AI 20 Questions guessing game'
  + Game interface screenshots: 'GLITCHGUESS gameplay interface showing question history and answer buttons'
  + Multiplayer screens: 'GLITCHGUESS multiplayer mode - play with friends online'
  + Category selection: 'Choose category for GLITCHGUESS - Animals, Objects, People, Movies, Places'\n- Ensure all images have relevant, keyword-rich alt text
- Optimize image file sizes for fast loading

### 5.7 Structured Data Markup

- Implement Schema.org markup for:
  + VideoGame schema with properties: name, description, genre, gamePlatform\n  + WebApplication schema for online game functionality
  + AggregateRating schema (when user ratings are available)
- Include JSON-LD structured data in page head

### 5.8 URL Structure

- Use clean, descriptive URLs:
  + Homepage: /
  + How to Play: /how-to-play
  + Game modes: /play/human-thinks, /play/ai-thinks, /play/multiplayer
  + Lobby: /lobby\n- Avoid dynamic parameters in main navigation URLs

## 6. Reference Images\n
- image.png: Opponent joined notification screen showing player names and game start prompt (Alt text: 'GLITCHGUESS multiplayer - opponent joined notification screen')
- image.png: Waiting screen for opponent to set secret word with loading indicator (Alt text: 'GLITCHGUESS waiting screen - opponent setting secret word')
- image.png: Ready to start screen showing role assignment and game instructions (Alt text: 'GLITCHGUESS game start - role assignment screen for multiplayer mode')
- image.png: Private game waiting screen with shareable link, copy and share buttons (Alt text: 'GLITCHGUESS private game - shareable link and waiting screen')
- image.png: Game interface with question input and answer buttons (Alt text: 'GLITCHGUESS gameplay interface - question input and Yes/No/Sometimes answer buttons')
- image.png: Database table showing game questions and answers (Alt text: 'GLITCHGUESS admin dashboard - game questions and answers database table')