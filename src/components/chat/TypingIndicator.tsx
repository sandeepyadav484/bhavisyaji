import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-2 px-4 py-2">
    <span className="text-purple-400 text-lg animate-pulse">🔮</span>
    <span className="text-gray-500 italic">Astrologer is typing...</span>
    <span className="flex gap-1 ml-2">
      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
    </span>
  </div>
); 