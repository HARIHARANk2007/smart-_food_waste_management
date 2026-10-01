import React, { useState } from 'react';
import { ChatMessage, Language, UserRole } from '../types';
import { getTranslation } from '../utils/translations';
import { Bot, Send, Sparkles, X, User, Globe } from 'lucide-react';

interface AiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentRole: UserRole;
  isDarkMode?: boolean;
}

export const AiChatbotModal: React.FC<AiChatbotModalProps> = ({
  isOpen,
  onClose,
  language,
  currentRole,
  isDarkMode = false
}) => {
  const t = getTranslation(language);

  const initialMessage: ChatMessage = {
    id: 'msg_0',
    sender: 'bot',
    text: language === 'ta' 
      ? 'வணக்கம்! நான் EcoResQ AI உணவு உதவி மையம். உணவுப் பாதுகாப்பு, எப்.எஸ்.எஸ்.ஏ.ஐ விதிகள், உணவு எடுக்கும் நேரம் குறித்து என்ன கேட்க வேண்டும்?'
      : 'Hello! I am EcoResQ AI Food Safety & Rescue Assistant. Ask me about food safety rules, FSSAI guidelines, pickup timing, or Tamil guidelines.',
    timestamp: 'Just now',
    suggestions: language === 'ta'
      ? ['சமைத்த உணவு எவ்வளவு நேரம் புதியதாக இருக்கும்?', 'தொண்டு நிறுவனம் உணவை எவ்வாறு சேகரிப்பது?', 'தமிழ்நாட்டில் உள்ள உணவு மீட்பு விதிகள்']
      : ['How long is cooked rice safe to consume?', 'FSSAI guidelines for catering surplus', 'How to claim food as an NGO?']
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          lang: language,
          role: currentRole
        })
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'I am happy to assist you with surplus food donation protocols and safety.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const fallbackMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: 'Surplus cooked food kept at 60°C or above is safe for up to 4 hours under FSSAI donation guidelines. Keep containers covered.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`max-w-xl w-full h-[600px] rounded-3xl border shadow-2xl flex flex-col relative overflow-hidden ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-[#2E7D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{t.chatbotTitle}</h3>
              <p className="text-[11px] text-[#E8F5E9]">Gemini 3.6 Flash • English & Tamil</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                  🤖
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl p-3.5 space-y-1.5 ${
                m.sender === 'user'
                  ? 'bg-[#2E7D32] text-white rounded-br-none font-medium shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                <span className="text-[9px] opacity-60 block text-right">{m.timestamp}</span>

                {/* Prompt Suggestions */}
                {m.suggestions && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-200 dark:border-slate-700 mt-2">
                    {m.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="px-2.5 py-1 rounded-lg bg-[#E8F5E9] dark:bg-[#1B5E20]/50 text-[#2E7D32] dark:text-[#81C784] border border-[#2E7D32]/20 font-semibold hover:bg-[#C8E6C9]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                  👤
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              Gemini AI is generating advice...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.chatPromptPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
