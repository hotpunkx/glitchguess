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
          text: `You are playing a 20 questions guessing game. You need to guess what object, person, animal, movie, or place the human is thinking of by asking yes/no questions.

${historyText ? `Previous conversation:\n${historyText}\n\n` : ''}

Based on the conversation so far, ask ONE strategic yes/no question to narrow down what they're thinking of. Be creative and intelligent. Only output the question, nothing else.`,
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
          text: `You are playing a 20 questions guessing game. Based on the following conversation, make your best guess about what the human is thinking of.

Previous conversation:
${historyText}

Make ONE specific guess. Format your response as: "Is it [your guess]?"`,
        },
      ],
    },
  ];

  return await callLLM(messages);
}

export async function generateSecretWord(): Promise<string> {
  const messages: Message[] = [
    {
      role: 'user',
      parts: [
        {
          text: 'Think of ONE random object, person, animal, movie, or place for a guessing game. Be creative and interesting. Output ONLY the word or short phrase (2-4 words max), nothing else.',
        },
      ],
    },
  ];

  return await callLLM(messages);
}

export async function answerQuestion(secretWord: string, question: string): Promise<string> {
  const messages: Message[] = [
    {
      role: 'user',
      parts: [
        {
          text: `You are thinking of: "${secretWord}"

The player asks: "${question}"

Answer with ONLY one word: "Yes", "No", or "Sometimes" (if the answer is ambiguous or depends on context). Nothing else.`,
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
