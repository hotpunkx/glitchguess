const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

interface Message {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface AIResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

async function callLLM(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: AIResponse = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No text content in API response');
    }

    return text.trim();
  } catch (error) {
    throw error;
  }
}

export async function generateAIQuestion(
  conversationHistory: Array<{ question: string; answer: string }>
): Promise<string> {
  const historyText = conversationHistory
    .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
    .join('\n');

  const messages: Message[] = [
    {
      role: 'user',
      parts: [
        {
          text: `You are the AI interrogator in GLITCHGUESS — a 20 Questions game.
The human is thinking of a single thing from Categories: Animals, Food, Movies, Games, Sports, Countries, Musicians, Books, Vehicles, Landmarks, Artists, Objects.

**Game State:**
${historyText ? `Previous Q&A:\n${historyText}\n` : 'This is the start of the game.'}
Question ${conversationHistory.length + 1} of 20.

**STRATEGY:**
1.  **Eliminate categories early.** Focus on broad traits (Living? Man-made? Entertainment? Physical?).
2.  **Be Deductive.** Analyze EVERY previous answer.
3.  **No Repetition.**
4.  **Formatting.** Output EXACTLY: 
Thinking: [Short internal monologue, max 10 words, e.g., "Ruling out man-made objects based on Q2."]
Question: [One smart yes/no question ending with ?]`,
        },
      ],
    },
  ];

  return await callLLM(messages);
}

export async function generateAIGuess(
  conversationHistory: Array<{ question: string; answer: string }>
): Promise<string> {
  const historyText = conversationHistory
    .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
    .join('\n');

  const messages: Message[] = [
    {
      role: 'user',
      parts: [
        {
          text: `You are the AI in GLITCHGUESS. Time for your final, specific guess.
Review history:
${historyText}

**Formatting.** Output EXACTLY:
Thinking: [Short internal monologue about your deduction.]
My final guess: [Specific thing, e.g., Eiffel Tower]`,
        },
      ],
    },
  ];

  return await callLLM(messages);
}

export async function generateSecretWord(): Promise<string> {
  // Add randomization to prevent API caching and encourage variety
  const randomSeed = Math.floor(Math.random() * 1000000);
  const timestamp = Date.now();
  
  // Rotate through different category emphases to encourage variety
  const categoryGroups = [
    'Animals (like Tiger, Penguin, Dolphin)',
    'Food & Drinks (like Sushi, Coffee, Hamburger)',
    'Movies/TV Shows (like Titanic, Breaking Bad, Avatar)',
    'Video Games (like Minecraft, Zelda, Fortnite)',
    'Sports/Athletes (like Basketball, Serena Williams, Soccer)',
    'Countries/Cities (like Tokyo, Brazil, London)',
    'Musicians/Bands (like The Beatles, Mozart, Taylor Swift)',
    'Famous Books (like Harry Potter, 1984, The Hobbit)',
    'Vehicles (like Helicopter, Bicycle, Submarine)',
    'Famous Artists (like Picasso, Van Gogh, Michelangelo)',
    'Common Objects (like Smartphone, Guitar, Laptop)'
  ];
  
  // Randomly select 4-5 categories to emphasize (changes each time)
  const shuffled = categoryGroups.sort(() => Math.random() - 0.5);
  const selectedCategories = shuffled.slice(0, 5).join(' | ');
  
  const messages: Message[] = [
    {
      role: 'user',
      parts: [
        {
          text: `You are the AI in GLITCHGUESS - 20 questions secret word guessing game and must now secretly choose what the human will guess.

[Session ID: ${timestamp}-${randomSeed}]

Pick ONE famous, concrete, guessable thing from these categories:
${selectedCategories}

CRITICAL RULES:
1. Choose RANDOMLY - use true randomness, not patterns
2. AVOID: Paris, Eiffel Tower, Taj Mahal (overused)
3. Prefer variety: animals, food, movies, games, objects
4. Must be famous and universally known
5. Must be concrete (not abstract concepts)

Good examples: Panda · Coca-Cola · Titanic · Super Mario · Basketball · Tokyo · The Beatles · Harry Potter · Helicopter · Picasso · Smartphone · Tiger · Pizza · Minecraft

Output ONLY the thing (1–2 words max), nothing else at all — no quotes, no category, no text before or after.`,
        },
      ],
    },
  ];

  const response = await callLLM(messages);
  // Clean up response: remove HTML entities, extra whitespace, quotes, etc.
  const cleaned = response
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/["""'']/g, '')
    .trim()
    .replace(/\s+/g, ' ');
  
  // If AI still returns Paris or Eiffel Tower, use fallback
  const normalized = cleaned.toLowerCase();
  if (normalized.includes('paris') || normalized.includes('eiffel')) {
    const fallbacks = [
      'Tiger', 'Pizza', 'Minecraft', 'Basketball', 'Sushi',
      'Titanic', 'Guitar', 'Penguin', 'Coffee', 'Helicopter'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
  
  return cleaned;
}

export async function answerQuestion(secretWord: string, question: string): Promise<string> {
  const messages: Message[] = [
    {
      role: 'user',
      parts: [
        {
          text: `You are the player in GLITCHGUESS - 20 questions secret word guessing game.
You are secretly thinking of exactly this:
"${secretWord}"

The AI interrogator just asked: "${question}"

**CRITICAL GUIDELINES FOR ANSWERING:**
1.  **Strict One-Word Output:** You must answer with literally ONE word and nothing else (no punctuation, no explanation, no quotes, no emojis).
2.  **Human Context & Scale:** When the question involves physical attributes (size, weight, state of matter, location), think like a human considering the **typical, real-world context** of the **"${secretWord}"**.
    * *Example:* If the secret word is "Elephant" and the question is "Is it heavy?", the answer is "Yes" (compared to a human scale). If the word is "Water Bottle" and the question is "Is it big?", the answer is "No" (compared to a human scale).
    * *Example:* If the secret word is "Water" and the question is "Is it a liquid?", the answer is "Sometimes" (as water can be solid, liquid, or gas, though liquid is the most common state, "Sometimes" is technically more accurate).
3.  **Answer Options:**
    * **Yes** → if clearly and generally true in the real world.
    * **No** → if clearly and generally false in the real world.
    * **Sometimes** → only if the answer genuinely depends on context, state, or circumstance (use this extremely sparingly and only when ambiguity is inherent to the object, e.g., "water," "cloud," "money").

Valid outputs: Yes | No | Sometimes

Respond with only one of those three words based on the secret word and the question.`,
        },
      ],
    },
  ];

  const response = await callLLM(messages);
  const normalized = response.toLowerCase().trim();

  if (normalized.includes('yes')) return 'Yes';
  if (normalized.includes('sometimes') || normalized.includes('maybe')) return 'Sometimes';
  return 'No';
}
