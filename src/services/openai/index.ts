import i18n from '../../i18n';

const BACKEND_API_URL = 'http://localhost:3001/api/chat';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function sendMessageToOpenAI({
  personaContext,
  chatHistory,
  userMessage,
  model = 'gpt-3.5-turbo',
  maxTokens = 512,
  temperature = 0.7,
  retries = 2,
}: {
  personaContext: string;
  chatHistory: OpenAIMessage[];
  userMessage: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  retries?: number;
}): Promise<string> {
  const language = i18n.language || 'en';
  const languageInstruction = `Please respond in ${language}.`;
  const finalPersonaContext = `${personaContext}\n${languageInstruction}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log('Sending request to backend:', {
        personaContext: finalPersonaContext,
        userMessage,
        attempt: attempt + 1,
      });

      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaContext: finalPersonaContext,
          chatHistory,
          userMessage,
          model,
          maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const responseData = await response.json();
      console.log('Backend Response:', responseData);

      if (!responseData.message) {
        throw new Error('Invalid response format from backend');
      }

      return responseData.message;
    } catch (err) {
      console.error('Error in sendMessageToOpenAI:', err);
      if (attempt === retries) {
        if (err instanceof Error) {
          if (err.message.includes('Failed to fetch')) {
            throw new Error('Could not connect to the backend server. Please make sure it is running.');
          }
          throw new Error(`Failed to get response after ${retries} retries: ${err.message}`);
        }
        throw new Error(`Failed to get response after ${retries} retries`);
      }
      await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
    }
  }
  throw new Error('Failed to get response after retries');
} 