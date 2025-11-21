# AI Personality & Prompt Design

## Overview
GLITCHGUESS features a unique AI personality that matches the game's Neubrutalism aesthetic. The AI acts as a "brutal neon interrogator" with a confident, slightly chaotic questioning style.

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

### Secret Word Generation
**Personality**: Neutral, fair selector
**Goal**: Choose guessable items from fair categories
**Tone**: Straightforward, no personality needed

### Answer Generation
**Personality**: Objective, truthful responder
**Goal**: Answer yes/no/sometimes accurately
**Tone**: Minimal, factual

### Guess Generation
**Personality**: Confident guesser
**Goal**: Make educated guess based on history
**Tone**: Direct, assertive

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
