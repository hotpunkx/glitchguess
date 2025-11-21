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
- [x] All lint checks passing

## Notes
- Using Large Language Model API for AI functionality
- Neubrutalism design: Black/White base with Hot Pink/Electric Lime accents
- Mobile-first responsive design
- CSS-based confetti instead of library due to installation issues
- Question history displays in reverse chronological order (newest first)
- Fair game categories ensure items are guessable within 20 questions:
  * Animals, Food & Drinks, Movies & TV Shows, Video Games
  * Sports & Athletes, Countries & Cities, Musicians & Bands
  * Famous Books, Vehicles, Famous Landmarks, Famous Artists, Common Objects
