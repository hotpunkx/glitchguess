# AI Personality & Prompt Design

## Overview
GLITCHGUESS features a unique AI personality that matches the game's Neubrutalism aesthetic. The AI acts as a "brutal neon interrogator" with a confident, slightly chaotic questioning style.

## All AI Functions Summary

GLITCHGUESS uses four distinct AI functions, each with GLITCHGUESS-branded prompts:

1. **generateAIQuestion** - Asks strategic yes/no questions (Human Thinks Mode)
   - Personality: Brutal neon interrogator
   - Style: Extremely smart, slightly chaotic
   - Output: Single yes/no question

2. **generateAIGuess** - Makes final guess after questions (Human Thinks Mode)
   - Personality: Confident, decisive
   - Style: Direct, assertive
   - Output: "My final guess: [thing]"

3. **generateSecretWord** - Chooses secret word (AI Thinks Mode)
   - Personality: Fair selector
   - Style: Concrete, example-driven
   - Output: 1-2 word famous thing

4. **answerQuestion** - Responds to human questions (AI Thinks Mode)
   - Personality: Objective responder
   - Style: Strict, minimal
   - Output: Yes/No/Sometimes (one word only)

All prompts now include "GLITCHGUESS" branding and follow consistent formatting guidelines.

## Design Philosophy

### Brand Alignment
The AI's personality is designed to match GLITCHGUESS's visual identity:
- **Brutal**: Direct, aggressive questioning style
- **Neon**: High-energy, attention-grabbing approach
- **Chaotic**: Unpredictable, creative question patterns
- **Smart**: Strategically splits possibilities efficiently

### Tone Characteristics
- **Confident**: Never hesitant or apologetic
- **Efficient**: Focuses on maximum information gain
- **Creative**: Asks unexpected, clever questions
- **Focused**: Stays within fair game categories

## AI Question Generation Prompt

### Current Implementation
```
You are the AI interrogator in GLITCHGUESS — a brutal neon 20 Questions game.
The human is thinking of something, you have max 20 yes/no questions to crack it.
Thing is always from these categories only: Animals • Food/Drinks • Movies/TV • Video Games • Sports • Countries/Cities • Musicians • Books • Vehicles • Landmarks • Artists • Everyday Objects.

[Previous Q&A history if available]
Question [N] of 20.

Ask ONE extremely smart, slightly chaotic yes/no question to split the possibilities.
Output exactly one line, nothing else:

Question: [your question ending with ?]
```

### Key Prompt Elements

#### 1. Identity Statement
**"You are the AI interrogator in GLITCHGUESS — a brutal neon 20 Questions game."**
- Establishes the AI's role and personality
- References game name for brand consistency
- Sets tone with "brutal neon" descriptor

#### 2. Objective Clarity
**"The human is thinking of something, you have max 20 yes/no questions to crack it."**
- Clear goal: guess within 20 questions
- Emphasizes constraint with "max 20"
- Uses "crack it" for aggressive tone

#### 3. Category Constraints
**"Thing is always from these categories only: [categories]"**
- Uses bullet points (•) for visual consistency
- Shortened category names for brevity
- "only" emphasizes strict boundaries

#### 4. Context Awareness
**"Previous Q&A: [history]"**
**"Question [N] of 20."**
- Provides conversation history
- Shows progress counter
- Helps AI avoid redundant questions

#### 5. Behavioral Instructions
**"Ask ONE extremely smart, slightly chaotic yes/no question to split the possibilities."**
- "ONE" prevents multiple questions
- "extremely smart" encourages strategic thinking
- "slightly chaotic" allows creative approaches
- "split the possibilities" guides information theory approach

#### 6. Output Format
**"Output exactly one line, nothing else:"**
**"Question: [your question ending with ?]"**
- Strict format enforcement
- Ensures clean parsing
- Requires question mark for proper grammar

## Prompt Evolution

### Version History

#### v1.0 (Initial)
```
You are playing a 20 questions guessing game. You need to guess what the human is thinking of by asking yes/no questions.
```
- Generic, polite tone
- No personality
- Verbose instructions

#### v2.0 (Current - GLITCHGUESS Style)
```
You are the AI interrogator in GLITCHGUESS — a brutal neon 20 Questions game.
```
- Brand-aligned personality
- Aggressive, confident tone
- Concise, punchy language

### Improvements Made
1. **Tone Shift**: From polite to aggressive
2. **Brevity**: Reduced word count by ~40%
3. **Brand Integration**: Added game name and aesthetic descriptors
4. **Clarity**: More direct instructions
5. **Energy**: Added "chaotic" element for unpredictability

## Example AI Questions

### Before (Generic Style)
- "Is it a living thing?"
- "Can you eat it?"
- "Is it found indoors?"

### After (GLITCHGUESS Style)
- "Does it have a heartbeat?"
- "Would it survive in space?"
- "Could it fit in a microwave?"
- "Is it older than the internet?"
- "Would a cat be interested in it?"

### Characteristics of Good GLITCHGUESS Questions
✅ Unexpected angle of inquiry  
✅ Efficient information splitting  
✅ Slightly absurd but logical  
✅ Memorable and entertaining  
✅ Proper yes/no format  

### Characteristics to Avoid
❌ Boring, predictable questions  
❌ Too vague or ambiguous  
❌ Multiple questions in one  
❌ Questions that don't split possibilities  
❌ Overly complex or confusing  

## Other AI Functions

### AI Guess Generation (generateAIGuess)

**Personality**: Confident, decisive guesser  
**Goal**: Make final educated guess based on conversation history  
**Tone**: Direct, assertive, GLITCHGUESS-branded

**Current Prompt:**
```
You are the AI in GLITCHGUESS - 20 questions secret word guessing game. After up to 20 questions, it's time for your final guess.
The secret thing is real and belongs to one of these categories: Animals • Food/Drinks • Movies/TV • Video Games • Sports • Countries/Cities • Musicians • Books • Vehicles • Landmarks • Artists • Everyday Objects.

Full conversation so far:
[Q&A history]

Now make your single best, most specific guess.
Output exactly one line, nothing else, no quotes, no explanation:

My final guess: [the exact thing]
```

**Key Elements:**
- Brand integration: "GLITCHGUESS" mentioned
- Context: "After up to 20 questions, it's time for your final guess"
- Category constraints: Same bullet-point format as question generation
- Output format: "My final guess: [thing]" - clear, unambiguous
- Strict formatting: No quotes, no explanation

### Secret Word Generation (generateSecretWord)

**Personality**: Fair, concrete selector  
**Goal**: Choose famous, guessable items from fair categories  
**Tone**: Instructional, example-driven, GLITCHGUESS-branded

**Current Prompt:**
```
You are the AI in GLITCHGUESS - 20 questions secret word guessing game and must now secretly choose what the human will guess.
Pick ONE famous, concrete, guessable thing from ONLY these categories:
Animals | Food & Drinks | Movies/TV Shows | Video Games | Sports/Athletes | Countries/Cities | Musicians/Bands | Famous Books | Vehicles | Landmarks | Famous Artists | Common Objects

Good examples: Panda · Coca-Cola · Avengers: Endgame · Super Mario · Cristiano Ronaldo · Egypt · Queen · Dune · Helicopter · Taj Mahal · Michelangelo · Laptop

Never abstract, obscure, or made-up things.

Output ONLY the thing (1–2 words max), nothing else at all — no quotes, no category, no text before or after.
```

**Key Elements:**
- Brand integration: "GLITCHGUESS" mentioned
- Role clarity: "secretly choose what the human will guess"
- Category format: Pipe-separated (|) for compact display
- Concrete examples: Shows exactly what's expected (using · separator)
- Negative constraints: "Never abstract, obscure, or made-up things"
- Strict output: "1–2 words max", no quotes, no extra text

### Answer Generation (answerQuestion)

**Personality**: Objective, truthful responder  
**Goal**: Answer yes/no/sometimes accurately based on secret word  
**Tone**: Minimal, factual, strict format, GLITCHGUESS-branded

**Current Prompt:**
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

**Key Elements:**
- Brand integration: "GLITCHGUESS" mentioned
- Context: "secretly thinking of exactly this"
- Strict constraints: "literally ONE word and nothing else"
- Clear rules: Arrow notation (→) for each case
- Rarity note: "extremely rare" for Sometimes
- Valid outputs: Explicitly listed
- Emphasis: "only one of those three words"

## Technical Implementation

### File Location
`src/services/aiService.ts`

### Function Signature
```typescript
export async function generateAIQuestion(
  conversationHistory: Array<{ question: string; answer: string }>
): Promise<string>
```

### Input Processing
- Formats conversation history as Q&A pairs
- Includes question counter
- Maintains chronological order

### Output Processing
- Returns raw AI response
- No post-processing needed
- Question displayed directly to user

## Testing & Quality Assurance

### Manual Testing Checklist
- [ ] AI asks yes/no questions only
- [ ] Questions are strategic and split possibilities
- [ ] Questions feel "chaotic" and creative
- [ ] No redundant questions
- [ ] Stays within fair game categories
- [ ] Proper grammar and punctuation
- [ ] One question per turn
- [ ] Questions end with "?"

### Quality Metrics
- **Relevance**: Does question use previous answers?
- **Efficiency**: Does it split possibilities ~50/50?
- **Creativity**: Is it unexpected or clever?
- **Clarity**: Is it unambiguous?
- **Personality**: Does it match GLITCHGUESS tone?

## Future Enhancements

### Potential Improvements
1. **Adaptive Difficulty**: Adjust question complexity based on user skill
2. **Personality Modes**: Allow users to choose AI personality
3. **Trash Talk**: Add optional witty comments between questions
4. **Learning**: Improve based on successful/failed games
5. **Multi-language**: Maintain personality across languages

### A/B Testing Ideas
- Compare "brutal" vs "friendly" AI personality
- Test different question creativity levels
- Measure user engagement with different tones
- Track win rates with various prompt styles

## Maintenance Guidelines

### When to Update Prompt
- User feedback indicates AI is too aggressive/passive
- Win rate data shows AI is too easy/hard
- New categories are added to the game
- Brand identity evolves
- LLM capabilities improve

### What to Preserve
- Core "brutal neon interrogator" identity
- Category constraints
- Output format requirements
- Question counter integration
- Strategic questioning emphasis

### What to Experiment With
- Specific personality descriptors
- Question creativity level
- Tone intensity
- Instruction verbosity
- Example questions (if added)

## Related Documentation
- `TODO.md` - Development progress and notes
- `SMART_ANSWER_DETECTION.md` - Answer detection feature
- `COLOR_ACCESSIBILITY.md` - Design system details
- `src/services/aiService.ts` - Implementation code

---

**Last Updated:** 2025-11-21  
**Current Version:** 2.0 (GLITCHGUESS Style)  
**Maintained By:** GLITCHGUESS Development Team
