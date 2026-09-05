import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AiService } from '../../services/aiService';

const AiAssistantTab = ({ data, user }) => {
  const { language, t } = useLanguage();
  const role = (user?.role || 'senior').toLowerCase();

  const getInitialGreeting = (lang, userName, userRole) => {
    const r = (userRole || 'senior').toLowerCase();
    const name = userName || (lang === 'hi' ? 'साथी' : lang === 'mr' ? 'मित्रा' : 'Friend');

    if (r === 'caretaker') {
      if (lang === 'hi') {
        return `🤝 **नमस्ते ${name} जी!** मैं **सुश्रुत मित्र**, आपका समर्पित केयरगिवर साथी हूँ।\n\nकिसी बुजुर्ग की देखरेख करना अत्यंत पुण्य, पर भावनात्मक और शारीरिक रूप से चुनौतीपूर्ण कार्य है। यदि वरिष्ठ सदस्य गुस्सा कर रहे हों, दवा न ले रहे हों, या आपको मानसिक थकान व तनाव महसूस हो रहा हो, तो मैं आपकी हर कदम पर व्यावहारिक सलाह व संबल देने के लिए यहाँ हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?`;
      }
      if (lang === 'mr') {
        return `🤝 **नमस्कार ${name}!** मी **सुश्रुत मित्र**, तुमचा समर्पित केअरटेकर मार्गदर्शक.\n\nज्येष्ठांची काळजी घेणे हे अत्यंत मोलाचे पण दमवणारे काम आहे. वरिष्ठ व्यक्ती रागावत असतील, औषध घेण्यास नकार देत असतील, किंवा तुम्हाला स्वतःला मानसिक विश्रांती हवी असेल, तर मी सदैव आपल्यासोबत आहे. आज मी आपल्याला कशी मदत करू?`;
      }
      return `🤝 **Namaste ${name}!** I am **Sushruta Mitra**, your specialized Caregiver Partner.\n\nCaring for an elder is one of the most compassionate yet emotionally taxing responsibilities. Whether you are dealing with challenging moods, medicine refusal, safe transfers, or simply feeling overwhelmed and need emotional support for yourself, I am here for you 24/7. How can I support your caregiving journey today?`;
    }

    if (r === 'doctor') {
      if (lang === 'hi') {
        return `🩺 **सादर प्रणाम डॉ. ${name}!** मैं **सुश्रुत क्लिनिकल एआई** हूँ, आपका जेरियाट्रिक फिजिशियन कोपायलट।\n\nमैं बीयर्स क्राइटेरिया (Beers Criteria), पॉलीफार्मेसी ड्रग इंटरैक्शन, रीनल डोज़ एडजस्टमेंट, और SBAR क्लिनिकल समरी ड्राफ्टिंग में सहायता के लिए सक्रिय हूँ।`;
      }
      if (lang === 'mr') {
        return `🩺 **सस्नेह नमस्कार डॉ. ${name}!** मी **सुश्रुत क्लिनिकल एआय**, तुमचा जेरियाट्रिक फिजिशियन कोपायलट.\n\nबीयर्स क्रायटेरिया (Beers Criteria) तपासणी, पॉलीफार्मसी ड्रग परस्परसंवाद, रेनल डोस ॲडजस्टमेंट आणि SBAR क्लिनिकल ट्रान्झिशन समरीसाठी मी सज्ज आहे.`;
      }
      return `🩺 **Greetings Dr. ${name}!** I am **Sushruta Clinical AI**, your geriatric physician copilot.\n\nI am equipped to assist with Beers Criteria screening, polypharmacy interaction audits, renal/hepatic dosing considerations, and drafting structured SBAR transition summaries. How can I assist your clinical workflow today?`;
    }

    // Senior citizen (Default)
    const elderHonorific = userName || (lang === 'hi' ? 'दादाजी / दादीजी' : lang === 'mr' ? 'आजी / आजोबा' : 'Friend');
    if (lang === 'hi') {
      return `🙏 नमस्ते ${elderHonorific} जी! मैं आपका स्वास्थ्य और भावनात्मक साथी **सुश्रुत मित्र** हूँ। आज आपकी सेहत कैसी है? आप मुझसे अपनी दवाइयों, ब्लड प्रेशर, खान-पान या मन की कोई भी बात साझा कर सकते हैं।`;
    }
    if (lang === 'mr') {
      return `🙏 नमस्कार ${elderHonorific}! मी तुमचा आरोग्य व भावनिक साथीदार **सुश्रुत मित्र**. आज तुमची तब्येत कशी आहे? तुम्हाला औषधे, बीपी, आहार किंवा मनातील काहीही विचारण्यासाठी मी नेहमी उपलब्ध आहे.`;
    }
    return `🙏 Namaste ${elderHonorific}! I am **Sushruta Mitra**, your caring health and emotional companion. How are you feeling today? You can ask me about your medications, blood pressure, diet, or just talk to me about how your day is going.`;
  };

  const [messages, setMessages] = useState(() => [
    { id: 1, sender: 'bot', text: getInitialGreeting(language, user?.name, role) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('sushruta_gemini_key') || '');
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Update initial greeting if language or role changes and only 1 message exists
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 1) {
      setMessages([{ id: 1, sender: 'bot', text: getInitialGreeting(language, user?.name, role) }]);
    }
  }, [language, user?.name, role]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Handle Speech Recognition Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Text-to-Speech (Voice Output)
  const speakText = (text, id) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingId === id) {
        setSpeakingId(null);
        return;
      }
      
      // Strip markdown bold/bullets for clean audio
      const cleanText = text.replace(/[*_#•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95; // Slightly slower for seniors
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const patientContext = {
      name: user?.name,
      role: user?.role,
      meds: data?.meds || [],
      vitals: data?.vitals || {},
      age: data?.user?.age || 65
    };

    try {
      const botReply = await AiService.generateResponse({
        userMessage: query,
        patientContext,
        language,
        conversationHistory: messages
      });

      const botMsg = { id: Date.now() + 1, sender: 'bot', text: botReply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: "I apologize, I could not process your request right now. Please try again." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveGeminiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('sushruta_gemini_key', geminiKey.trim());
    setShowKeyModal(false);
    alert(geminiKey.trim() ? "Google Gemini API Key Saved!" : "Reverted to Local Intelligent Engine.");
  };

  // Simple Markdown Parser for UI Bubbles
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Bold replacement
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="p-3 md:p-6 h-[calc(100vh-70px)] flex flex-col animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-t-3xl p-4 border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-md">
            <i className={`ph-fill ${role === 'doctor' ? 'ph-stethoscope' : role === 'caretaker' ? 'ph-heart-handshake' : 'ph-robot'} text-2xl`}></i>
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              {role === 'caretaker' ? t('aiTitleCaretaker') : role === 'doctor' ? t('aiTitleDoctor') : t('aiTitle')}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {localStorage.getItem('sushruta_gemini_key') ? 'Gemini 1.5' : 'Hybrid AI'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {role}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {role === 'caretaker' ? t('aiSubtitleCaretaker') : role === 'doctor' ? t('aiSubtitleDoctor') : t('aiSubtitle')}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-2 text-slate-400 hover:text-blue-700 rounded-xl hover:bg-slate-100 transition"
            title="Configure Gemini Cloud API Key (Optional)"
          >
            <i className="ph-bold ph-gear text-xl"></i>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto custom-scroll flex flex-col space-y-4">
        
        {/* Quick Starter Chips */}
        {messages.length <= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 animate-fade-in">
            {role === 'caretaker' ? (
              <>
                <button
                  onClick={() => handleSendMessage(t('chipCaretakerUnkind'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipCaretakerUnkind')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipCaretakerBurnout'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipCaretakerBurnout')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipCaretakerSBAR'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipCaretakerSBAR')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipCaretakerSafety'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipCaretakerSafety')}
                </button>
              </>
            ) : role === 'doctor' ? (
              <>
                <button
                  onClick={() => handleSendMessage(t('chipDoctorInteractions'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipDoctorInteractions')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipDoctorHTN'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipDoctorHTN')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipDoctorDelirium'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipDoctorDelirium')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipDoctorSBAR'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipDoctorSBAR')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSendMessage(t('chipMeds'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipMeds')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipEmotional'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipEmotional')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipBP'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipBP')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chipDiet'))}
                  className="text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-green-500 hover:bg-green-50 transition text-xs md:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                  {t('chipDiet')}
                </button>
              </>
            )}
          </div>
        )}

        {/* Message History */}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] md:max-w-[75%] p-4 rounded-3xl relative text-sm md:text-base shadow-sm animate-slide-up leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-900 text-white rounded-br-none self-end ml-auto'
                : 'bg-white text-slate-800 rounded-bl-none self-start mr-auto border border-slate-100'
            }`}
          >
            {renderFormattedText(m.text)}

            {/* Read Aloud Button for Bot Messages */}
            {m.sender === 'bot' && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => speakText(m.text, m.id)}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    speakingId === m.id
                      ? 'bg-blue-100 text-blue-900 animate-pulse'
                      : 'text-slate-400 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  <i className={`ph-fill ${speakingId === m.id ? 'ph-stop-circle' : 'ph-speaker-high'} text-sm`}></i>
                  {speakingId === m.id ? t('stopReading') : t('readAloud')}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-bl-none self-start w-20 flex items-center justify-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Form with Voice Support */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="bg-white p-3 md:p-4 rounded-b-3xl border-t flex items-center gap-2 shadow-lg">
        {/* Voice Input Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-center ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-red-200 shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title={isListening ? t('aiListening') : "Tap to speak"}
        >
          <i className={`ph-bold ${isListening ? 'ph-microphone-slash' : 'ph-microphone'} text-xl`}></i>
        </button>

        {/* Text Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening 
              ? t('aiListening') 
              : role === 'caretaker' 
              ? t('aiPlaceholderCaretaker') 
              : role === 'doctor' 
              ? t('aiPlaceholderDoctor') 
              : t('aiPlaceholder')
          }
          className="flex-1 p-3 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 transition text-sm md:text-base"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-blue-900 text-white px-5 py-3 rounded-2xl hover:bg-blue-800 transition shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-50 cursor-pointer"
        >
          <i className="ph-bold ph-paper-plane-right text-xl"></i>
        </button>
      </form>

      {/* Optional Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <i className="ph-fill ph-sparkle text-yellow-500"></i>
                Google Gemini API Key
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="ph-bold ph-x text-lg"></i>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Sushruta Mitra includes an intelligent built-in clinical engine that works 100% offline. If you'd like to enable Google Gemini 1.5 Flash Cloud LLM, paste your free Gemini API key below:
            </p>
            <form onSubmit={saveGeminiKey} className="space-y-4">
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900 text-sm"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition shadow-md"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AiAssistantTab;