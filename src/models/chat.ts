export type ChatSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: number; // Unix epoch ms
  read?: boolean;
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  personaId: string;
  messages: ChatMessage[];
  createdAt: number; // Unix epoch ms
  updatedAt: number; // Unix epoch ms
  status?: 'active' | 'closed';
  lastAccessed?: number;
} 