/*
# Add is_guess field to multiplayer_questions

This migration adds a boolean field to track whether a question is a formal guess
(from the "Make a Guess" button) vs a regular question.

## Changes
- Add `is_guess` boolean field (default false) to multiplayer_questions table
- This allows proper detection of guesses vs regular questions that happen to start with "Is it"

## Why This Fix Is Needed
- Bug: Regular questions starting with "Is it" (like "Is it alive?") were being treated as guesses
- This caused the game to end prematurely after the first question
- With this field, we can accurately distinguish formal guesses from regular questions
*/

ALTER TABLE multiplayer_questions
ADD COLUMN IF NOT EXISTS is_guess boolean DEFAULT false NOT NULL;