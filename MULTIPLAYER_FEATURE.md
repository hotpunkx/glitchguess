# 1v1 Multiplayer Feature Documentation

## Overview

The 1v1 Multiplayer feature allows two players to play GLITCHGUESS together in real-time. One player thinks of a word, and the other player asks yes/no questions to guess it. After the game ends, players can request a rematch with switched roles.

## Features

### Game Creation & Joining
- **Create Game**: Player 1 enters their name and creates a game
- **Shareable Link**: Unique 6-character game code (e.g., "ABC123")
- **Copy & Share**: Built-in buttons to copy link or use native share API
- **Join Game**: Player 2 can join using the shared link

### Real-Time Gameplay
- **Live Updates**: Both players see updates instantly using Supabase Realtime
- **Role Assignment**: System randomly assigns who thinks and who guesses
- **Question Flow**:
  - Guesser types and submits questions
  - Thinker sees questions and answers Yes/No/Sometimes
  - Both players see question history in real-time
- **20 Question Limit**: Game ends after 20 questions or correct guess

### Rematch System
- **Request Rematch**: Either player can request a rematch after game ends
- **Mutual Agreement**: Both players must agree to start rematch
- **Role Switching**: Roles automatically switch in rematch
- **Seamless Transition**: New game starts immediately when both agree

## Technical Implementation

### Database Schema

#### multiplayer_games Table
```sql
- id (uuid): Primary key
- game_code (text): Unique 6-character shareable code
- player1_name (text): First player's name
- player2_name (text): Second player's name (null until joined)
- player1_session (text): Player 1's browser session ID
- player2_session (text): Player 2's browser session ID
- current_thinker (text): 'player1' or 'player2'
- game_status (text): 'waiting', 'active', 'ended'
- secret_word (text): The word being guessed
- question_count (integer): Current question number
- is_won (boolean): Whether game was won
- player1_rematch (boolean): Player 1 wants rematch
- player2_rematch (boolean): Player 2 wants rematch
- created_at, started_at, ended_at (timestamptz)
```

#### multiplayer_questions Table
```sql
- id (uuid): Primary key
- game_id (uuid): Foreign key to multiplayer_games
- question_number (integer): Question order
- question_text (text): The question
- answer (text): 'Yes', 'No', 'Sometimes', or 'pending'
- created_at (timestamptz)
```

### Real-Time Synchronization

**Supabase Realtime** is used for live updates:
- Game state changes (player joins, game ends, rematch requests)
- New questions and answers
- Both players subscribe to their game's updates

### API Functions

Located in `src/db/multiplayerApi.ts`:

- `createMultiplayerGame()`: Create new game with unique code
- `joinMultiplayerGame()`: Join existing game by code
- `getMultiplayerGame()`: Fetch game by ID
- `getMultiplayerGameByCode()`: Fetch game by code
- `addMultiplayerQuestion()`: Add new question
- `updateQuestionAnswer()`: Update pending question with answer
- `getMultiplayerQuestions()`: Get all questions for a game
- `updateSecretWord()`: Set the secret word
- `endMultiplayerGame()`: Mark game as ended
- `requestRematch()`: Request rematch
- `createRematchGame()`: Create new game with switched roles
- `subscribeToGame()`: Subscribe to game updates
- `subscribeToQuestions()`: Subscribe to question updates

### Components

#### Pages
- **MultiplayerCreatePage**: Enter name and create game
- **MultiplayerGamePage**: Main multiplayer game container
  - Handles waiting room
  - Handles join screen
  - Renders gameplay or end screen based on game status

#### Components
- **MultiplayerGameplay**: Active gameplay component
  - Thinker view: Answer questions
  - Guesser view: Ask questions
  - Real-time question history
- **MultiplayerEndScreen**: Game results and rematch
  - Shows winner/loser
  - Displays secret word
  - Rematch request system
  - Confetti animation for winner

### Routes

```typescript
/multiplayer/create          - Create new game
/multiplayer/game/:gameId    - Active game (with ?code= param for joining)
```

### Session Management

- Each player gets a unique session ID stored in localStorage
- Session ID is used to identify which player is which
- Persists across page refreshes

## User Flow

### Creating a Game
1. Click "1v1 MULTIPLAYER" on home screen
2. Enter your name
3. Click "CREATE GAME"
4. Wait in lobby with shareable link
5. Copy or share link with friend

### Joining a Game
1. Open shared link
2. See game code and Player 1's name
3. Enter your name
4. Click "JOIN GAME"
5. Game starts automatically

### Playing as Thinker
1. Enter your secret word
2. Wait for opponent to ask questions
3. Answer Yes/No/Sometimes for each question
4. See question history update in real-time

### Playing as Guesser
1. Wait for opponent to set secret word
2. Type and submit questions
3. See opponent's answers in real-time
4. Try to guess within 20 questions

### Rematch
1. Game ends with results screen
2. Click "REQUEST REMATCH"
3. Wait for opponent to accept
4. New game starts with switched roles

## Design Patterns

### Neubrutalism Theme
- Consistent with main game design
- Bold typography and high contrast
- Thick borders and dramatic shadows
- Neon accent colors (pink and lime)

### Mobile Responsive
- Fully optimized for mobile devices
- Touch-friendly buttons
- Adaptive layouts
- Native share API support

### Error Handling
- Toast notifications for errors
- Graceful degradation if realtime fails
- Clear error messages for users

## Future Enhancements

Possible improvements:
- Game history and statistics
- Friend system
- Private/public game modes
- Spectator mode
- Chat functionality
- Custom time limits
- Tournament mode
- Leaderboards

## Testing Checklist

- [ ] Create game successfully
- [ ] Copy link works
- [ ] Share button works (on mobile)
- [ ] Join game with valid code
- [ ] Join game with invalid code shows error
- [ ] Real-time updates work for both players
- [ ] Thinker can set secret word
- [ ] Guesser can ask questions
- [ ] Thinker can answer questions
- [ ] Question history updates in real-time
- [ ] Game ends after 20 questions
- [ ] Game ends on correct guess
- [ ] Rematch request works
- [ ] Both players must agree for rematch
- [ ] Roles switch in rematch
- [ ] Page refresh maintains game state
- [ ] Confetti shows for winner
- [ ] Mobile responsive design works
