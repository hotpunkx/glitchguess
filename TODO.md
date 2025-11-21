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
  - [x] generateAIQuestion: "brutal neon interrogator" style
  - [x] generateAIGuess: "final guess" format with clear output
  - [x] generateSecretWord: concrete examples, strict output format
  - [x] answerQuestion: strict one-word responses
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
