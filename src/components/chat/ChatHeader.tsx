import React from 'react';

interface Persona {
  name: string;
  avatarUrl?: string;
  specialization?: string;
  languages?: string[];
}

interface ChatHeaderProps {
  persona: Persona;
  onEndSession?: () => void;
  credits: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ persona, onEndSession, credits }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 shadow-md rounded-t-2xl">
    <div className="flex items-center gap-3">
      <img
        src={persona.avatarUrl || '/astrologer-avatar.png'}
        alt={persona.name}
        className="w-12 h-12 rounded-full border-2 border-yellow-400 shadow"
      />
      <div>
        <div className="font-bold text-white text-lg flex items-center gap-2">
          {persona.name}
          <span className="text-yellow-300 text-xl">★</span>
        </div>
        {persona.specialization && (
          <div className="text-purple-200 text-xs">{persona.specialization}</div>
        )}
        {persona.languages && (
          <div className="text-purple-300 text-xs mt-1">{persona.languages.join(', ')}</div>
        )}
      </div>
    </div>
    <div className="flex flex-col items-end gap-1">
      <div className="text-xs text-yellow-200 font-semibold">Credits: {credits}</div>
      {onEndSession && (
        <button
          onClick={onEndSession}
          className="text-xs px-3 py-1 rounded bg-gradient-to-br from-pink-500 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-transform"
        >
          End Session
        </button>
      )}
    </div>
  </div>
);

export default ChatHeader; 