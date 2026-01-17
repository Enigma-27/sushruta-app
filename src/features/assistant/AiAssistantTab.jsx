import React, { useState, useEffect, useRef } from 'react';

const AiAssistantTab = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Namaste! I am your health assistant. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI Delay & Logic
    setTimeout(() => {
      let responseText = "I see. It's best to consult your doctor for persistent symptoms.";
      const lower = userMsg.text.toLowerCase();

      // Simple keyword matching logic
      if (lower.includes('headache') || lower.includes('head hurts')) {
        responseText = "For a headache, try drinking a glass of water and resting in a quiet, dark room. Check your blood pressure if possible.";
      } else if (lower.includes('chest pain')) {
        responseText = "⚠️ Chest pain can be serious. Please use the SOS button immediately or call emergency services if it persists.";
      } else if (lower.includes('dizzy')) {
        responseText = "Sit down slowly to avoid falling. Drink water. If you are diabetic, check your sugar levels.";
      } else if (lower.includes('thank')) {
        responseText = "You are welcome! Take care.";
      } else if (lower.includes('hi') || lower.includes('hello')) {
        responseText = "Hello! How can I help you with your health today?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: responseText }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-t-2xl p-4 border-b flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white">
          <i className="ph-fill ph-robot text-xl"></i>
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Sushruta Assistant</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full block"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50 p-4 overflow-y-auto custom-scroll flex flex-col space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] p-3 md:p-4 rounded-2xl relative text-sm md:text-base shadow-sm animate-slide-up ${
              m.sender === 'user'
                ? 'bg-blue-900 text-white rounded-br-none self-end ml-auto'
                : 'bg-white text-slate-800 rounded-bl-none self-start mr-auto border border-slate-200'
            }`}
          >
            {m.text}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none self-start w-16 flex items-center justify-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="bg-white p-4 rounded-b-2xl border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your symptoms or question..."
          className="flex-1 p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg flex items-center justify-center"
        >
          <i className="ph-bold ph-paper-plane-right text-xl"></i>
        </button>
      </form>
    </div>
  );
};

export default AiAssistantTab;