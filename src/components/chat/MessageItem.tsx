import React from 'react';
import clsx from 'clsx';
import { ChatMessage } from '../../models/chat';

interface MessageItemProps {
  message: ChatMessage;
  isUser: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isUser }) => {
  return (
    <div className={clsx(
      'flex mb-2',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div
        className={clsx(
          'max-w-xs px-4 py-2 rounded-2xl shadow-md relative',
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-700 text-white rounded-br-none'
            : 'bg-white/80 text-gray-900 border border-purple-200 rounded-bl-none',
          'whitespace-pre-line'
        )}
        style={{
          backgroundImage: !isUser
            ? 'url("/stars-bg.svg")' // Optional: add a subtle astrology background for AI
            : undefined,
        }}
      >
        <span>{message.content}</span>
        <span className="block text-xs text-right mt-1 opacity-60">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}; 