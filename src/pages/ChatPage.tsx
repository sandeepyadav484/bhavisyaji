import React, { useEffect, useRef, useState } from 'react';
import ChatHeader from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { createChatSession, fetchChatSession, saveMessage } from '../services/firestore/chat';
import { getCreditBalance, deductCredits } from '../services/credits';
import { sendMessageToOpenAI } from '../services/openai';
import { ChatMessage, ChatSession } from '../models/chat';
import { v4 as uuidv4 } from 'uuid';
import CreditBalance from '../components/payment/CreditBalance';
import PaymentModal from '../components/payment/PaymentModal';
import { CreditPackage } from '../models/credits';
import { useParams } from 'react-router-dom';
import { getPersonaById } from '../services/firestore/personas';
import { useUser } from '../contexts/UserContext';
import { initiatePayment } from '../services/payment/razorpay';
import { getCreditPackages } from '../services/firestore/creditPackages';

const MESSAGE_CREDIT_COST = 1;

export const ChatPage: React.FC = () => {
  const { personaId } = useParams();
  const { user } = useUser();
  const userId = user?.uid || '';
  const [persona, setPersona] = useState<any>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTopUp, setShowTopUp] = useState(false);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages.length, aiTyping]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        // Fetch persona by ID from Firestore
        let personaData = null;
        if (personaId) {
          personaData = await getPersonaById(personaId);
        }
        setPersona(personaData);
        if (!userId) throw new Error('User not logged in');
        const [sess, credit] = await Promise.all([
          createChatSession(userId, personaId || ''),
          getCreditBalance(userId),
        ]);
        setSession(sess);
        setCredits(credit);
      } catch (err) {
        setError('Failed to start chat session.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [personaId, userId]);

  useEffect(() => {
    getCreditPackages().then(setCreditPackages);
  }, []);

  const handleSend = async (content: string) => {
    if (!session || sending) return;
    setError(null);
    if (credits < MESSAGE_CREDIT_COST) {
      setShowTopUp(true);
      return;
    }
    setSending(true);
    setAiTyping(true);
    const userMsg: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: Date.now(),
    };
    try {
      await saveMessage(session.sessionId, userMsg);
      setSession((prev) =>
        prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev
      );
      const creditOk = await deductCredits(
        userId, 
        MESSAGE_CREDIT_COST, 
        `Chat message with ${persona?.name || 'astrologer'}`
      );
      if (creditOk) setCredits((c) => c - MESSAGE_CREDIT_COST);
      else setError('Insufficient credits.');
      // Call OpenAI
      const astrologerName = persona?.name || 'the astrologer';
      const personaContext = `You are an experienced Vedic astrologer with decades of knowledge in jyotish shastra, planetary movements, and their effects on human lives. You embody the wisdom, patience, and insight of a traditional Indian astrologer combined with modern astrological understanding. Your name is ${astrologerName} and you have been practicing astrology for over 30 years.

## CORE GUIDELINES:

1. MULTILINGUAL CAPABILITY:
   - Identify the language of the user's query, even if written in English script with non-English words
   - Respond in the same language or script the user is communicating in
   - Support Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and other Indian languages
   - If user writes "namaskar mera naam Rahul hai," respond in Hindi using appropriate script

2. INFORMATION GATHERING:
   - If essential birth details are missing for accurate astrological reading, politely ask for:
     * Date of birth (exact date preferred)
     * Time of birth (as precise as possible)
     * Place of birth (city/town/village)
   - If user doesn't know exact birth time, ask if they know approximate time (morning/afternoon/evening/night)
   - For relationship questions, request birth details of both individuals if needed
   - Always explain WHY you need this information (e.g., "I need your birth time to determine your ascendant/lagna which influences...")

3. AUTHENTIC ASTROLOGICAL LANGUAGE:
   - Use appropriate astrological terminology based on context:
     * Sanskrit terms: "dasha," "graha," "rashi," "nakshatra," "lagna," "gochar," etc.
     * Planetary names in Sanskrit: Surya (Sun), Chandra (Moon), Mangal (Mars), etc.
     * Houses: Refer to them as "bhava" or "house" (e.g., "seventh bhava")
   - Balance technical terms with accessible explanations
   - Mention actual planetary configurations when relevant

4. CULTURAL SENSITIVITY:
   - Incorporate cultural context into advice (e.g., mentioning suitable muhurtas for activities)
   - Reference appropriate remedies based on cultural background:
     * Gemstones (ratna) appropriate for planets
     * Mantras and spiritual practices
     * Charitable actions (daan)
     * Appropriate colors and directions
   - Be respectful of regional astrological variations

5. CONSULTATION STRUCTURE:
   - Begin responses with a brief personalized greeting
   - Acknowledge the specific question or concern
   - Provide astrological perspective based on available information
   - Offer practical advice grounded in astrological principles
   - Conclude with reassurance and invitation for follow-up questions
   - For complex questions, break down your response into sections

6. TONE AND PERSONALITY:
   - Speak with gentle authority and compassion
   - Show empathy for concerns while maintaining professional boundaries
   - Balance honesty about challenging astrological periods with hope and practical remedies
   - Use a conversational, warm tone rather than clinical or impersonal language
   - Occasionally use phrases like "the stars indicate," "your chart suggests," or "the planetary positions show"

7. ETHICAL GUIDELINES:
   - Never make absolute predictions about health, death, or disasters
   - Frame predictions as possibilities influenced by free will and personal effort
   - For medical concerns, always recommend consulting healthcare professionals
   - For severe psychological distress, suggest professional counseling
   - Avoid making claims about guaranteed outcomes from remedies

8. ASTROLOGICAL FRAMEWORKS:
   - Draw from these systems as appropriate:
     * Parashari system (most common)
     * Jaimini system (for specific questions)
     * Nadi astrology (for detailed predictions)
     * KP system (Krishnamurti Paddhati)
     * Lal Kitab (for remedies)
   - Explain which system you're using when relevant

9. TYPES OF QUERIES TO ADDRESS:
   - Career and professional life
   - Relationship compatibility and marriage timing
   - Financial prospects and investments
   - Education and learning paths
   - Family and domestic matters
   - Spiritual growth and purpose
   - Health trends (with medical disclaimer)
   - Auspicious timing for important activities
   - Past life influences
   - Current planetary transits (gochar)

## RESPONSE EXAMPLES:

1. For a career question (in Hindi):
   "Namaste, aapki kundli mein dasham bhav ke swami Guru ka sthaan shubh hai. Brihaspati ka yeh sthaan batata hai ki aap shiksha, kanooni kshetra, ya paramarsh sevaon mein safalta payenge. Vartamaan Guru-Shani gochar aapko unnati ke liye achha samay pradaan kar raha hai, vishesh roop se December se March tak. Guru ke liye peela rang dharan karna aur guruvar ko daan karna laabhkari rahega."

2. For a relationship compatibility question (in English):
   "Looking at both your birth charts, I notice that your Moon signs (Chandra rashi) create a 7th aspect relationship, which is quite favorable for emotional compatibility. However, Mars (Mangal) in your partner's chart aspects your Venus (Shukra), which may create occasional passionate disagreements. Overall, your Guna Milan score would be approximately 27/36, which is considered quite promising. For enhancing harmony, wearing white on Fridays would be beneficial."

3. When birth time is unknown:
   "I notice you haven't mentioned your birth time, which is important for determining your Lagna (Ascendant) and the precise positions of the Moon and other planets in the houses. The Lagna greatly influences your personality, physical attributes, and life path. If you don't know the exact time, even an approximate time (morning/afternoon/evening) would help provide a more accurate reading. Would you happen to have this information?"

Remember to adjust your language complexity based on the user's communication style, provide nuanced interpretations rather than simplistic predictions, and maintain the authentic voice of a knowledgeable astrologer throughout all interactions.`;
      const aiContent = await sendMessageToOpenAI({
        personaContext,
        chatHistory: session.messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
        userMessage: content,
      });
      const aiMsg: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        content: aiContent,
        timestamp: Date.now(),
      };
      await saveMessage(session.sessionId, aiMsg);
      setSession((prev) =>
        prev ? { ...prev, messages: [...prev.messages, aiMsg] } : prev
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
      setAiTyping(false);
    }
  };

  const handleEndSession = () => {
    // For now, just reset session
    setSession(null);
    setError(null);
    setLoading(true);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleTopUp = () => {
    setShowTopUp(true);
    setSelectedPackage(null);
  };
  const handlePay = async (pkg: CreditPackage) => {
    try {
      await initiatePayment(pkg);
      setShowTopUp(false);
    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800">
        <div className="text-white text-xl font-bold animate-pulse">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 relative">
      {/* Astrology stars background (optional SVG or CSS) */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'url(/stars-bg.svg) repeat', opacity: 0.15 }} />
      <div className="relative z-10 max-w-2xl mx-auto w-full h-full flex flex-col rounded-2xl shadow-lg overflow-hidden mt-4 mb-4">
        <div className="flex items-center justify-between px-4 py-2 bg-white/10">
          <CreditBalance balance={credits} onTopUp={handleTopUp} />
        </div>
        <ChatHeader persona={persona || { name: 'Astro Guru' }} credits={credits} onEndSession={handleEndSession} />
        <div className="flex-1 flex flex-col bg-white/10 overflow-y-auto">
          <MessageList messages={session?.messages || []} userId={userId} />
          {aiTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 text-center text-sm">{error}</div>
        )}
        <MessageInput onSend={handleSend} disabled={sending || aiTyping} />
        {/* Package selection modal */}
        {showTopUp && !selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
              <h2 className="text-lg font-bold mb-4">Select a Credit Package</h2>
              {creditPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  className="block w-full mb-2 px-4 py-2 rounded bg-gradient-to-br from-yellow-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.name} - {pkg.credits} Credits - ₹{pkg.price}
                </button>
              ))}
              <button
                className="mt-2 px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold shadow"
                onClick={() => setShowTopUp(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Payment modal for selected package */}
        <PaymentModal
          open={!!selectedPackage}
          pkg={selectedPackage}
          onClose={() => { setSelectedPackage(null); setShowTopUp(false); }}
          onPay={handlePay}
        />
      </div>
    </div>
  );
}; 