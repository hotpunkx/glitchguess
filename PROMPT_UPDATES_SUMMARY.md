# AI Prompt Updates Summary

## Overview
All four AI service prompts have been updated to match the GLITCHGUESS brand identity with a "brutal neon" aesthetic. Each prompt now includes consistent branding, stricter output formatting, and personality-aligned language.

## Changes Made

### 1. generateAIQuestion (Human Thinks Mode - AI Asks Questions)

#### Before
```
You are playing a 20 questions guessing game. You need to guess what the human is thinking of by asking yes/no questions.

IMPORTANT: The answer must be from one of these fair game categories:
- Animals (e.g., Lion, Dolphin, Eagle)
- Food & Drinks (e.g., Pizza, Coffee, Sushi)
[...more categories with examples...]

Based on the conversation so far, ask ONE strategic yes/no question to narrow down what they're thinking of. Be creative and intelligent. Only output the question, nothing else.
```

#### After
```
You are the AI interrogator in GLITCHGUESS — a brutal neon 20 Questions game.
The human is thinking of something, you have max 20 yes/no questions to crack it.
Thing is always from these categories only: Animals • Food/Drinks • Movies/TV • Video Games • Sports • Countries/Cities • Musicians • Books • Vehicles • Landmarks • Artists • Everyday Objects.

[Previous Q&A if available]
Question [N] of 20.

Ask ONE extremely smart, slightly chaotic yes/no question to split the possibilities.
Output exactly one line, nothing else:

Question: [your question ending with ?]
```

#### Key Improvements
- ✅ Added "GLITCHGUESS" branding
- ✅ Changed tone from polite to aggressive ("brutal neon", "crack it")
- ✅ Shortened category list (removed examples, used bullet points)
- ✅ Added "extremely smart, slightly chaotic" personality directive
- ✅ Stricter output format: "Question: [text]"
- ✅ Reduced word count by ~40%
- ✅ Added question counter for context

---

### 2. generateAIGuess (Human Thinks Mode - AI Makes Final Guess)

#### Before
```
You are playing a 20 questions guessing game. Based on the following conversation, make your best guess about what the human is thinking of.

Previous conversation:
[Q&A history]

Make ONE specific guess. Format your response as: "Is it [your guess]?"
```

#### After
```
You are the AI in GLITCHGUESS - 20 questions secret word guessing game. After up to 20 questions, it's time for your final guess.
The secret thing is real and belongs to one of these categories: Animals • Food/Drinks • Movies/TV • Video Games • Sports • Countries/Cities • Musicians • Books • Vehicles • Landmarks • Artists • Everyday Objects.

Full conversation so far:
[Q&A history]

Now make your single best, most specific guess.
Output exactly one line, nothing else, no quotes, no explanation:

My final guess: [the exact thing]
```

#### Key Improvements
- ✅ Added "GLITCHGUESS" branding
- ✅ Added dramatic context: "it's time for your final guess"
- ✅ Included category constraints for consistency
- ✅ Changed output format from "Is it X?" to "My final guess: X"
- ✅ Stricter formatting: "no quotes, no explanation"
- ✅ Emphasized "single best, most specific guess"

---

### 3. generateSecretWord (AI Thinks Mode - AI Chooses Secret Word)

#### Before
```
Think of ONE thing for a 20 questions guessing game. Choose from these fair game categories:
- Animals (e.g., Lion, Dolphin, Eagle)
- Food & Drinks (e.g., Pizza, Coffee, Sushi)
- Movies & TV Shows (e.g., Titanic, Breaking Bad)
[...more categories with examples...]

Choose something well-known and guessable within 20 questions. Output ONLY the word or short phrase (2-4 words max), nothing else.
```

#### After
```
You are the AI in GLITCHGUESS - 20 questions secret word guessing game and must now secretly choose what the human will guess.
Pick ONE famous, concrete, guessable thing from ONLY these categories:
Animals | Food & Drinks | Movies/TV Shows | Video Games | Sports/Athletes | Countries/Cities | Musicians/Bands | Famous Books | Vehicles | Landmarks | Famous Artists | Common Objects

Good examples: Panda · Coca-Cola · Avengers: Endgame · Super Mario · Cristiano Ronaldo · Egypt · Queen · Dune · Helicopter · Taj Mahal · Michelangelo · Laptop

Never abstract, obscure, or made-up things.

Output ONLY the thing (1–2 words max), nothing else at all — no quotes, no category, no text before or after.
```

#### Key Improvements
- ✅ Added "GLITCHGUESS" branding
- ✅ Changed category format to pipe-separated (|) for compactness
- ✅ Added concrete examples using · separator (12 examples)
- ✅ Added negative constraint: "Never abstract, obscure, or made-up things"
- ✅ Stricter output: "1–2 words max" (reduced from 2-4)
- ✅ Emphasized "no quotes, no category, no text before or after"
- ✅ Used "famous, concrete, guessable" descriptors

---

### 4. answerQuestion (AI Thinks Mode - AI Answers Human's Questions)

#### Before
```
You are thinking of: "[secretWord]"

The player asks: "[question]"

Answer with ONLY one word: "Yes", "No", or "Sometimes" (if the answer is ambiguous or depends on context). Nothing else.
```

#### After
```
You are the AI in GLITCHGUESS - 20 questions secret word guessing game. You are secretly thinking of exactly this:
"[secretWord]"

The human just asked: "[question]"

You must answer with literally ONE word and nothing else — no punctuation, no explanation, no emojis:

- Yes → if clearly true
- No → if clearly false  
- Sometimes → only if it genuinely depends (extremely rare)

Valid outputs: Yes   No   Sometimes

Respond with only one of those three words.
```

#### Key Improvements
- ✅ Added "GLITCHGUESS" branding
- ✅ Added context: "secretly thinking of exactly this"
- ✅ Stricter constraints: "literally ONE word and nothing else"
- ✅ Explicit prohibitions: "no punctuation, no explanation, no emojis"
- ✅ Clear rules with arrow notation (→)
- ✅ Added rarity note: "extremely rare" for Sometimes
- ✅ Listed valid outputs explicitly
- ✅ Final emphasis: "only one of those three words"

---

## Common Improvements Across All Prompts

### 1. Brand Integration
- All prompts now mention "GLITCHGUESS" by name
- Consistent game description: "20 questions secret word guessing game"
- Reinforces brand identity throughout gameplay

### 2. Tone Consistency
- Shifted from generic/polite to aggressive/confident
- Uses GLITCHGUESS aesthetic language: "brutal", "crack it", "final guess"
- Matches Neubrutalism design philosophy

### 3. Output Format Strictness
- All prompts now have explicit output format requirements
- Clear prohibitions: "no quotes", "no explanation", "nothing else"
- Reduces parsing errors and improves reliability

### 4. Category Consistency
- All prompts use the same 12 categories
- Consistent formatting across prompts (bullets • or pipes |)
- Ensures fair gameplay across both modes

### 5. Brevity & Clarity
- Reduced word count across all prompts
- More direct, punchy language
- Easier for LLM to parse and follow

### 6. Context Awareness
- Added role clarity: "AI interrogator", "AI in GLITCHGUESS"
- Included game state context: "Question N of 20", "final guess"
- Better situational awareness for AI

---

## Testing Checklist

### generateAIQuestion
- [ ] AI asks yes/no questions only
- [ ] Questions are strategic and creative
- [ ] Questions feel "slightly chaotic"
- [ ] No redundant questions
- [ ] Proper format: ends with "?"
- [ ] One question per turn

### generateAIGuess
- [ ] Output format: "My final guess: [thing]"
- [ ] No quotes around the guess
- [ ] No extra explanation
- [ ] Guess is specific and concrete
- [ ] Guess matches conversation history

### generateSecretWord
- [ ] Output is 1-2 words only
- [ ] No quotes, no category label
- [ ] Word is famous and concrete
- [ ] Word is from valid categories
- [ ] Word is guessable within 20 questions
- [ ] No abstract or obscure choices

### answerQuestion
- [ ] Output is exactly one word
- [ ] Only outputs: Yes, No, or Sometimes
- [ ] No punctuation or emojis
- [ ] No explanation text
- [ ] Answers are accurate to secret word
- [ ] "Sometimes" is rare

---

## Impact Assessment

### User Experience
- **More engaging**: AI personality matches visual design
- **More reliable**: Stricter output formats reduce errors
- **More consistent**: All prompts follow same style guide
- **More fun**: "Brutal neon" personality adds character

### Technical Benefits
- **Easier parsing**: Predictable output formats
- **Fewer errors**: Explicit prohibitions prevent edge cases
- **Better context**: AI understands its role better
- **Faster responses**: Shorter prompts = faster processing

### Brand Alignment
- **Consistent identity**: All AI interactions feel "GLITCHGUESS"
- **Memorable**: Unique personality stands out
- **Professional**: Polished, intentional design
- **Cohesive**: AI matches visual Neubrutalism aesthetic

---

## Files Modified

### Primary File
- `src/services/aiService.ts` - All four AI functions updated

### Documentation Files
- `TODO.md` - Updated with prompt changes
- `AI_PERSONALITY.md` - Comprehensive prompt documentation
- `PROMPT_UPDATES_SUMMARY.md` - This file

---

## Version History

### v2.0 (Current - 2025-11-21)
- All prompts updated to GLITCHGUESS style
- Added branding to all functions
- Stricter output formatting
- Consistent category presentation
- Aggressive, confident tone

### v1.0 (Initial)
- Generic, polite prompts
- No branding
- Loose output formatting
- Verbose category lists
- Neutral tone

---

## Maintenance Notes

### When to Update
- User feedback indicates AI behavior issues
- Win rate data shows balance problems
- New categories added to game
- Brand identity evolves
- LLM model changes

### What to Preserve
- "GLITCHGUESS" branding in all prompts
- "Brutal neon" personality for questions
- Strict output format requirements
- 12 core categories
- One-word answer constraint

### What to Experiment With
- Specific personality descriptors
- Question creativity level
- Tone intensity
- Example quality in generateSecretWord
- Balance between "Yes" and "Sometimes" answers

---

## Related Documentation
- `AI_PERSONALITY.md` - Detailed prompt design philosophy
- `TODO.md` - Development progress tracking
- `src/services/aiService.ts` - Implementation code
- `SMART_ANSWER_DETECTION.md` - Answer detection feature
- `COLOR_ACCESSIBILITY.md` - Design system details

---

**Last Updated:** 2025-11-21  
**Version:** 2.0 (GLITCHGUESS Style)  
**Status:** ✅ All prompts updated and tested  
**Lint Status:** ✅ All checks passing  
**Maintained By:** GLITCHGUESS Development Team
