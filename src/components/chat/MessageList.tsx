import React from 'react';
import { ChatMessage } from '../../models/chat';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  userId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, userId }) => {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-4">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} isUser={msg.sender === 'user'} />
      ))}
    </div>
  );
}; 