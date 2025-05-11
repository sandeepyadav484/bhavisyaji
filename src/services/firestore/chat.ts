import { ChatSession, ChatMessage } from '../../models/chat';
import { v4 as uuidv4 } from 'uuid';

// Mock in-memory store for demo
const chatSessions: Record<string, ChatSession> = {};

export async function createChatSession(userId: string, personaId: string): Promise<ChatSession> {
  const sessionId = uuidv4();
  const now = Date.now();
  const session: ChatSession = {
    sessionId,
    userId,
    personaId,
    messages: [],
    createdAt: now,
    updatedAt: now,
    status: 'active',
    lastAccessed: now,
  };
  chatSessions[sessionId] = session;
  // TODO: Replace with Firestore integration
  return session;
}

export async function fetchChatSession(sessionId: string): Promise<ChatSession | null> {
  // TODO: Replace with Firestore fetch
  return chatSessions[sessionId] || null;
}

export async function saveMessage(sessionId: string, message: ChatMessage): Promise<void> {
  const session = chatSessions[sessionId];
  if (!session) throw new Error('Session not found');
  session.messages.push(message);
  session.updatedAt = Date.now();
  // TODO: Save to Firestore
}

export async function updateSessionMetadata(sessionId: string, data: Partial<ChatSession>): Promise<void> {
  const session = chatSessions[sessionId];
  if (!session) throw new Error('Session not found');
  Object.assign(session, data);
  session.updatedAt = Date.now();
  // TODO: Update in Firestore
}

// For real-time updates, you would set up Firestore listeners in the real implementation. 