import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 p-2 bg-gradient-to-t from-purple-900/80 to-indigo-800/80">
      <input
        type="text"
        className="flex-1 rounded-full px-4 py-2 border-none focus:ring-2 focus:ring-indigo-400 bg-white/90 text-gray-900 placeholder-gray-400 shadow"
        placeholder="Type your message... ✨"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="ml-2 px-4 py-2 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}; 