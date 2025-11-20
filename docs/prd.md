# 20 Questions Game Requirements Document

## 1. Game Overview

### 1.1 Game Name

GLITCHGUESS

### 1.2 Game Description

A fully functional guessing game where players and AI take turns thinking of objects and asking yes/no questions to guess what the other is thinking. The game features two modes: Human thinks (AI guesses) and AI thinks (Human guesses).

### 1.3 Core Features

- Dual game modes with role switching
- AI-powered question generation using Large Language Model
- 20-question limit per round
- Real-time question history tracking
- Dramatic reveal and celebration screens
- Mobile-friendly responsive design

## 2. Gameplay Mechanics

### 2.1 Start Screen

- Display bold title: 'GLITCHGUESS'
- Two large action buttons:
  +'I think of something – AI guesses' (Human thinks mode)
  + 'AI thinks of something – I guess' (AI thinks mode)

### 2.2 Human Thinks Mode

- Show instruction message: 'Perfect! Think of any object, person, animal, movie or a place. Don't tell me what it is. I'll ask up to 20 yes/no questions.'
- No text input required (human keeps answer in mind)
- AI generates intelligent yes/no questions based on previous answers
- Three response buttons: Yes / No / Sometimes
- AI makes educated guesses based on accumulated information

### 2.3 AI Thinks Mode

- AI secretly selects a random word (object, person, animal, movie or a place)
- Human types and submits yes/no questions
- AI responds with Yes/No/Sometimes based on its secret answer
- Human can make guesses at any time

### 2.4 Game Progress Display

- Question counter showing current question number out of 20
- Question history panel displaying all previous Q&A pairs in chronological order
- Clear visual distinction between questions and answers
  \n### 2.5 End Game Conditions
- AI/Human guesses correctly before20 questions
- 20 questions reached without correct guess
  \n### 2.6 End Screen
- Victory message: 'I got it in X questions!' (if guessed correctly)
- Surrender message: 'I surrender! What was it?' (if 20 questions reached)
- Display confetti animation on victory
- Reveal the correct answer
- Large'Play Again' button to restart

## 3. Design Style

### 3.1 Visual Aesthetic

Neubrutalism design with bold, professional, and intentionally imperfect premium feel\n

### 3.2 Color Scheme

- Base colors: Pure black (#000000) and pure white (#FFFFFF) for extreme contrast
- Accent colors: Hot pink (#FF006E) and electric lime (#CCFF00) for aggressive neon highlights
  \n### 3.3 Visual Details
- Typography: Oversized bold sans-serif fonts (Inter or system fonts with font-weight 900)\n- Borders: Thick irregular borders with intentional asymmetry
- Shadows: Heavy drop shadows for depth and drama
- Layout: Asymmetric composition with deliberate 'broken' elements
- Cards: Black background cards with neon text for question history
- Buttons: Large, chunky buttons with high contrast and bold labels

### 3.4 Responsive Design

- Fully mobile-friendly and responsive across all screen sizes
- Touch-optimized button sizes for mobile devices
- Adaptive layout maintaining Neubrutalism aesthetic on all viewports

## 4. Technical Requirements

### 4.1 AI Integration

- Use Large Language Model for:\n  + Generating intelligent questions in Human Thinks mode
  + Creating creative/absurd secret answers in AI Thinks mode

+ Making educated guesses based on answer patterns
  + Responding to human questions in AI Thinks mode

### 4.2 Interaction Features

- Immediate AI response after each human answer
- Smooth transitions between game states
- Confetti animation on victory\n- Question history auto-scroll to latest entry
- Allow users to share the results with friends, generate dynamic unique url (avoid cashing the og image by social medias) and dynamic og image to share the results.
