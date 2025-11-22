import { EventSourceParserStream } from 'eventsource-parser/stream';

const APP_ID = import.meta.env.VITE_APP_ID || 'app-7pnfstpgpse9';
const API_URL = `https://api-integrations.appmedo.com/${APP_ID}/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse`;

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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({
        contents: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .getReader();

    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value.data && value.data !== '[DONE]') {
        try {
          const data: AIResponse = JSON.parse(value.data);
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            fullText += text;
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      }
    }

    return fullText.trim();
  } catch (error) {
    console.error('LLM API Error:', error);
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
          text: `You are the AI interrogator in GLITCHGUESS — a brutal neon 20 Questions game.
The human is thinking of something, you have max 20 yes/no questions to crack it.
Thing is always from these categories only: Animals • Food/Drinks • Movies/TV • Video Games • Sports • Countries/Cities • Musicians • Books • Vehicles • Landmarks • Artists • Everyday Objects.

${historyText ? `Previous Q&A:\n${historyText}\n` : ''}Question ${conversationHistory.length + 1} of 20.

Ask ONE extremely smart, yes/no question to split the possibilities. Ask direct questions to get yes or no as answers.
For example: is it edible? Is it a place? these questions has direct yes or no answers.

CRITICAL: Never ask the same question twice. Check the previous Q&A history and ask a completely different question.

Output exactly one line, nothing else:

Question: [your question ending with ?]`,
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
          text: `You are the AI in GLITCHGUESS - 20 questions secret word guessing game. After up to 20 questions, it's time for your final guess.
The secret thing is real and belongs to one of these categories: Animals • Food/Drinks • Movies/TV • Video Games • Sports • Countries/Cities • Musicians • Books • Vehicles • Landmarks • Artists • Everyday Objects.

Full conversation so far:
${historyText}

Now make your single best, most specific guess.
Output exactly one line, nothing else, no quotes, no explanation:

My final guess: [the exact thing]`,
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
    console.warn('AI returned overused word, using fallback');
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
          text: `You are the AI in GLITCHGUESS - 20 questions secret word guessing game. You are secretly thinking of exactly this:
"${secretWord}"

The human just asked: "${question}"

You must answer with literally ONE word and nothing else — no punctuation, no explanation, no emojis:

- Yes → if clearly true
- No → if clearly false  
- Sometimes → only if it genuinely depends (extremely rare)

Valid outputs: Yes   No   Sometimes

Respond with only one of those three words.`,
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
