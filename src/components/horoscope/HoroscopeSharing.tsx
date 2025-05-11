import React from 'react';

interface HoroscopeSharingProps {
  shareUrl: string;
  text?: string;
}

const HoroscopeSharing: React.FC<HoroscopeSharingProps> = ({ shareUrl, text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied!');
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={handleCopy}
        className="px-3 py-1 rounded bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-700"
      >
        Copy Link
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text || 'Check out my horoscope!')}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-bold shadow hover:bg-blue-600"
      >
        Share on Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 rounded bg-blue-700 text-white text-xs font-bold shadow hover:bg-blue-800"
      >
        Share on Facebook
      </a>
    </div>
  );
};

export default HoroscopeSharing; 