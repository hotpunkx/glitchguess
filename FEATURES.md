# GLITCHGUESS - Feature List

## 🎮 Core Game Features

### Two Game Modes
1. **Human Thinks Mode**: AI asks questions to guess what you're thinking
2. **AI Thinks Mode**: You ask questions to guess what the AI is thinking

### Game Mechanics
- 20 questions maximum per game
- Three answer options: Yes / No / Sometimes
- Real-time question history tracking
- Question counter display
- Win/Lose conditions with dramatic reveals

## 🎨 Design Features

### Neubrutalism Style
- Bold, high-contrast design
- Pure black (#000000) and white (#FFFFFF) base colors
- Hot pink (#FF006E) and electric lime (#CCFF00) accents
- Thick irregular borders with intentional asymmetry
- Heavy drop shadows for depth and drama
- Oversized bold typography

### Responsive Design
- Fully mobile-friendly
- Touch-optimized button sizes
- Adaptive layout for all screen sizes
- Maintains aesthetic across all viewports

### Animations
- CSS-based confetti animation on victory
- Glitch animation on title text
- Smooth hover transitions on buttons
- White text hover effect on action buttons

## 🤖 AI Features

### Intelligent Question Generation
- AI generates strategic yes/no questions
- Questions adapt based on previous answers
- Follows fair game category rules

### Smart Answer System
- AI responds accurately to human questions
- Considers context and ambiguity
- Provides "Sometimes" for edge cases

### Fair Game Categories
The AI only thinks of items from these 12 categories:
- 🐾 Animals
- 🍎 Food & Drinks
- 🎬 Movies & TV Shows
- 🎮 Video Games
- 🏆 Sports & Athletes
- 🌍 Countries & Cities
- 🎵 Musicians & Bands
- 📚 Famous Books
- 🚗 Vehicles
- 🏛️ Famous Landmarks
- 🎨 Famous Artists
- 🔧 Common Objects

## 🎯 Smart Guessing Features

### Fuzzy Matching Algorithm
- **Levenshtein Distance**: Calculates similarity between words
- **Spelling Forgiveness**: 
  - Words ≤5 characters: 1 character difference allowed
  - Words 6-10 characters: 2 character differences allowed
  - Words >10 characters: 3 character differences allowed
- **Examples**:
  - "Loin" → Matches "Lion" ✅
  - "Efel Tower" → Matches "Eiffel Tower" ✅
  - "Picaso" → Matches "Picasso" ✅

### Question Format Normalization
Automatically removes common question formatting:
- "Is it a Lion?" → "Lion"
- "It is Lion" → "Lion"
- "It's a Lion?" → "Lion"
- "Lion?" → "Lion"

### Give Up Feature
- **"Give Up & See Answer"** button in AI Thinks Mode
- Allows users to end the game early
- Reveals the correct answer immediately
- Available at any time during the game

## 📱 User Experience Features

### Question History
- Displays all previous Q&A pairs
- Reverse chronological order (newest first)
- Clear visual distinction between questions and answers
- Auto-scroll to latest entry
- Shows question numbers

### End Screen
- Victory or defeat message
- Displays final question count
- Shows correct answer
- Confetti animation on victory
- "Play Again" button
- "Share Result" button

### Share Functionality
- Native share API support
- Clipboard fallback for unsupported browsers
- Shareable game results with:
  - Winner information
  - Question count
  - Correct answer
  - Game URL

## 🔧 Technical Features

### AI Integration
- Large Language Model API integration
- Streaming response support
- Error handling and fallbacks
- Loading states and animations

### Performance
- Efficient rendering
- Optimized animations
- Fast response times
- Minimal dependencies

### Accessibility
- Keyboard navigation support
- Enter key to submit
- Clear visual feedback
- High contrast design
- Touch-friendly interface

## 🎲 Game Rules

### Fair Play Guidelines
1. Choose items from the 12 fair game categories
2. Avoid overly specific or obscure items
3. Items must be guessable within 20 questions
4. Use "Sometimes" for ambiguous answers

### Winning Conditions
- **Win**: Guess correctly before 20 questions
- **Lose**: Reach 20 questions without correct guess
- **Give Up**: Voluntarily end game to see answer

## 🚀 Future Enhancement Ideas

- Multiplayer mode
- Difficulty levels
- Custom categories
- Leaderboards
- Achievement system
- Sound effects
- Multiple language support
- Game statistics tracking
- Hint system
- Time-based challenges

---

**GLITCHGUESS** - Where AI meets classic guessing games! 🎮✨
