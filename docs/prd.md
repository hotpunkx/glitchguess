# 20 Questions Game Requirements Document
\n## 1. Game Overview\n
### 1.1 Game Name
\nGLITCHGUESS

### 1.2 Game Description\n
A fully functional guessing game where players and AI take turns thinking of objects and asking yes/no questions to guess what the other is thinking. The game features two modes: Human thinks (AI guesses) and AI thinks (Human guesses).
\n### 1.3 Core Features

- Dual game modes with role switching
- Category selection system for fair gameplay
- AI-powered question generation using Large Language Model
- 20-question limit per round
- Real-time question history tracking
- Dramatic reveal and celebration screens
- Mobile-friendly responsive design
- How to Play instructional page

## 2. Gameplay Mechanics

### 2.1 Start Screen

- Display bold title: 'GLITCHGUESS'
- Show 'How to Play' link/button in top corner leading to instructional page
- Show category selection section with instruction: 'Choose a category for a fair game:'
- Category options displayed as large clickable cards:
  + Animals
  + Objects
  + People (Famous)
  + Movies
  + Places
- Two large action buttons (enabled after category selection):
  + 'I think of something – AI guesses' (Human thinks mode)
  + 'AI thinks of something – I guess' (AI thinks mode)

### 2.2 How to Play Page

- Display page title: 'HOW TO PLAY'
- Game overview section explaining the core concept:\n  + This is a 20 questions guessing game between you and AI
  + Choose a category to keep the game fair and fun
  + Take turns thinking of something and guessing\n- Mode explanations:
  + **Human Thinks Mode**: You think of something in the chosen category, AI asks up to 20 yes/no questions to guess it
  + **AI Thinks Mode**: AI thinks of something in the chosen category, you ask yes/no questions and make guesses
- Game rules:
  + Maximum 20 questions per round
  + Answer with Yes/No/Sometimes
  + All answers must be within the selected category
  + Make your final guess anytime during the game
- 'Back to Home' button to return to start screen
- Maintain Neubrutalism design theme throughout the page

### 2.3 Human Thinks Mode

- Display selected category at top of screen
- Show instruction message: 'Perfect! Think of any [CATEGORY] within the selected category. Don't tell me what it is. I'll ask up to 20 yes/no questions.'
- No text input required (human keeps answer in mind)
- AI generates intelligent yes/no questions based on selected category and previous answers
- Three response buttons: Yes / No / Sometimes
- AI makes educated guesses based on accumulated information and category constraints\n
### 2.4 AI Thinks Mode
\n- Display selected category at top of screen
- AI secretly selects a random word strictly within the chosen category (animal, object, famous person, movie, or place)
- Human types and submits yes/no questions
- AI responds with Yes/No/Sometimes based on its secret answer
- Human can make guesses at any time

### 2.5 Game Progress Display

- Question counter showing current question number out of 20\n- Question history panel displaying all previous Q&A pairs in chronological order
- Clear visual distinction between questions and answers

### 2.6 End Game Conditions

- AI/Human guesses correctly before 20 questions
- 20 questions reached without correct guess

### 2.7 End Screen\n
- Victory message: 'I got it in X questions!' (if guessed correctly)
- Surrender message: 'I surrender! What was it?' (if 20 questions reached)
- Display confetti animation on victory
- Reveal the correct answer
- Large 'Play Again' button to restart

## 3. Design Style

### 3.1 Visual Aesthetic

Neubrutalism design with bold, professional, and intentionally imperfect premium feel

### 3.2 Color Scheme

- Base colors: Pure black (#000000) and pure white (#FFFFFF) for extreme contrast
- Accent colors: Hot pink (#FF006E) and electric lime (#CCFF00) for aggressive neon highlights\n
### 3.3 Visual Details

- Typography: Oversized bold sans-serif fonts (Inter or system fonts with font-weight 900)
- Borders: Thick irregular borders with intentional asymmetry
- Shadows: Heavy drop shadows for depth and drama
- Layout: Asymmetric composition with deliberate 'broken' elements
- Cards: Black background cards with neon text for question history
- Buttons: Large, chunky buttons with high contrast and bold labels
- Category cards: Distinct visual style with neon borders and hover effects
- How to Play page: Same Neubrutalism aesthetic with bold headings, neon accents, and chunky text blocks

### 3.4 Responsive Design
\n- Fully mobile-friendly and responsive across all screen sizes
- Touch-optimized button sizes for mobile devices
- Adaptive layout maintaining Neubrutalism aesthetic on all viewports

## 4. Technical Requirements

### 4.1 AI Integration

- Use Large Language Model for:
  + Generating intelligent questions in Human Thinks mode strictly within selected category
  + Creating creative/absurd secret answers in AI Thinks mode strictly within selected category\n  + Making educated guesses based on answer patterns and category constraints
  + Responding to human questions in AI Thinks mode
- AI must strictly follow category rules to ensure answers are guessable within 20 questions

### 4.2 Interaction Features

- Immediate AI response after each human answer
- Smooth transitions between game states
- Confetti animation on victory\n- Question history auto-scroll to latest entry
- Allow users to share the results with friends, generate dynamic unique url (avoid caching the og image by social medias) and dynamic og image to share the results
- Navigation between home page and How to Play page with smooth transitions