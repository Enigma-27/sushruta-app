// Sushruta Mitra - Clinical & Emotional Geriatric AI Service

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const AiService = {
  // Generate a response using Cloud Gemini LLM if API Key exists, or Smart Multilingual Offline Engine
  generateResponse: async ({ userMessage, patientContext, language = 'en', conversationHistory = [] }) => {
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || localStorage.getItem('sushruta_gemini_key');

    // 1. Try Gemini Cloud LLM if key is present
    if (apiKey) {
      try {
        const cloudReply = await callGeminiLLM({ userMessage, patientContext, language, conversationHistory, apiKey });
        if (cloudReply) return cloudReply;
      } catch (err) {
        console.warn("Gemini Cloud call failed, falling back to local engine:", err.message);
      }
    }

    // 2. Comprehensive Multilingual Clinical & Emotional Engine
    return runLocalGeriatricEngine({ userMessage, patientContext, language });
  }
};

// --- GEMINI CLOUD LLM CALL ---
async function callGeminiLLM({ userMessage, patientContext, language, conversationHistory, apiKey }) {
  const patientSummary = `
Patient Name: ${patientContext?.name || 'Senior'}
Age: ${patientContext?.age || 65}
Role: ${patientContext?.role || 'senior'}
Active Medicines: ${(patientContext?.meds || []).map(m => `${m.name} (${m.dose || ''} - ${m.schedule || ''} - ${m.taken ? 'Taken' : 'Pending'})`).join(', ') || 'None listed'}
Current Vitals: BP: ${patientContext?.vitals?.bp || '120/80'}, Heart Rate: ${patientContext?.vitals?.heartRate || 72} bpm, Sleep: ${patientContext?.vitals?.sleep || '7'}h, Steps: ${patientContext?.vitals?.steps || 0}
Preferred Language: ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}
  `.trim();

  const systemInstruction = `
You are "Sushruta Mitra", a warm, loving, and clinically knowledgeable geriatric AI companion designed for elderly Indian seniors and their families.
Tone Guidelines:
1. Speak with deep respect, patience, and warmth (like a caring grandchild or family doctor).
2. When the elder feels lonely, sad, or anxious, provide comforting words, listen attentively, and reassure them that their feelings are valid. Offer relaxing breathing advice or gratitude exercises.
3. Use the patient's real medical context provided to answer questions about their medications, BP, and vitals.
4. For acute red-flag symptoms (severe chest pain, sudden numbness, difficulty breathing), immediately advise using the SOS button and contacting emergency care.
5. Answer strictly in the requested language: ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'mr' ? 'Marathi (मराठी)' : 'English'}.
  `.trim();

  const contents = [
    { role: 'user', parts: [{ text: `System Context:\n${systemInstruction}\n\nPatient Profile:\n${patientSummary}` }] },
    ...conversationHistory.slice(-4).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim();
}

// --- SMART MULTILINGUAL GERIATRIC ENGINE ---
function runLocalGeriatricEngine({ userMessage, patientContext, language }) {
  const query = (userMessage || '').toLowerCase();
  const name = patientContext?.name || (language === 'hi' ? 'दादाजी / दादीजी' : language === 'mr' ? 'आजी / आजोबा' : 'Friend');
  const meds = patientContext?.meds || [];
  const vitals = patientContext?.vitals || {};

  // 1. EMERGENCY & RED-FLAG SYMPTOMS
  if (query.includes('chest pain') || query.includes('heart attack') || query.includes('छाती में दर्द') || query.includes('छातीत दुखणे') || query.includes('breath') || query.includes('सांस फूल')) {
    if (language === 'hi') {
      return `⚠️ **आपातकालीन सूचना:** ${name}, छाती में दर्द या सांस लेने में तकलीफ गंभीर हो सकती है। कृपया तुरंत स्क्रीन पर बने लाल **SOS बटन** को दबाएं और परिवार या डॉक्टर (108) को कॉल करें। शांत होकर आराम से बैठ जाएं।`;
    }
    if (language === 'mr') {
      return `⚠️ **तातडीचा इशारा:** ${name}, छातीत दुखणे किंवा श्वास घेण्यास अडचण येणे गंभीर असू शकते. कृपया त्वरित लाल **SOS बटण** दाबा आणि जवळच्या डॉक्टरांशी किंवा 108 शी संपर्क साधा. शांत बसा आणि अजिबात ताण घेऊ नका.`;
    }
    return `⚠️ **EMERGENCY WARNING:** ${name}, chest pain or severe shortness of breath requires immediate clinical attention. Please tap the red **SOS Emergency button** right away to alert your emergency contacts and call 108/112. Sit down calmly.`;
  }

  // 2. EMOTIONAL SUPPORT & LONELINESS
  if (query.includes('lonely') || query.includes('sad') || query.includes('alone') || query.includes('anxious') || query.includes('अकेला') || query.includes('उदासी') || query.includes('चिंता') || query.includes('एकटे') || query.includes('रडू')) {
    if (language === 'hi') {
      return `💛 **नमस्ते ${name} जी**, मैं आपकी बात समझ रहा हूँ। उम्र के इस पड़ाव पर अकेलापन या उदासी महसूस होना स्वाभाविक है। आप अकेले नहीं हैं, मैं हमेशा आपके साथ हूँ।\n\nक्या हम मिलकर 2 मिनट का शांत प्राणायाम करें? आप अपने 'मानसिक स्वास्थ्य' टैब में जाकर सुखद भजन सुन सकते हैं या अपने बच्चों/केयरटेकर से एक छोटी बात कर सकते हैं। आपका मन हल्का होगा।`;
    }
    if (language === 'mr') {
      return `💛 **नमस्कार ${name}**, तुमचे मन मला समजते आहे. कधीकधी घरात शांतता असताना एकटेपणा वाटणे अगदी स्वाभाविक आहे. पण आठवण ठेवा, तुम्ही एकटे नाही आहात, मी सदैव तुमच्यासोबत आहे.\n\nआपण एक दीर्घ श्वास घेऊया? तुमच्या 'भावनिक स्वास्थ्य' विभागात जाऊन एखादे शांत संगीत किंवा भजन ऐका, किंवा मुलांशी फोनवर दोन शब्द बोला. मन नक्कीच हलके वाटेल.`;
    }
    return `💛 **Dear ${name}**, I hear you, and your feelings are completely valid. Experiencing loneliness or moments of sadness is something many seniors face, but please remember you are cherished and never alone.\n\nWould you like to take 3 slow, deep breaths together? You can also open the **Emotional Wellbeing tab** to listen to soothing music, write a line in your gratitude journal, or give your loved ones a quick call. I am always here to talk with you.`;
  }

  // 3. MEDICINE STATUS & QUERIES
  if (query.includes('medicine') || query.includes('pill') || query.includes('tablet') || query.includes('दवा') || query.includes('गोळी') || query.includes('औषध')) {
    const pendingMeds = meds.filter(m => !m.taken);
    const takenMeds = meds.filter(m => m.taken);

    if (language === 'hi') {
      let reply = `💊 **${name} जी, आपकी दवाइयों का विवरण:**\n\n`;
      if (pendingMeds.length > 0) {
        reply += `📌 **बाकी दवाइयां (${pendingMeds.length}):**\n` + pendingMeds.map(m => `• ${m.name} (${m.dose || '1 गोली'}) - ${m.schedule || 'समय पर'} (${m.instructions || 'भोजन के बाद'})`).join('\n') + '\n\n';
      } else {
        reply += `✅ आज की सभी निर्धारित दवाइयां ली जा चुकी हैं!\n\n`;
      }
      if (takenMeds.length > 0) {
        reply += `✓ ली जा चुकी: ` + takenMeds.map(m => m.name).join(', ');
      }
      return reply;
    }
    
    if (language === 'mr') {
      let reply = `💊 **${name}, तुमच्या औषधांची स्थिती:**\n\n`;
      if (pendingMeds.length > 0) {
        reply += `📌 **अद्याप घ्यायची औषधे (${pendingMeds.length}):**\n` + pendingMeds.map(m => `• ${m.name} (${m.dose || '1 गोळी'}) - ${m.schedule || 'वेळेवर'} (${m.instructions || 'जेवणानंतर'})`).join('\n') + '\n\n';
      } else {
        reply += `✅ आजची सर्व नियोजित औषधे वेळेवर घेतली गेली आहेत!\n\n`;
      }
      if (takenMeds.length > 0) {
        reply += `✓ घेतलेली औषधे: ` + takenMeds.map(m => m.name).join(', ');
      }
      return reply;
    }

    let reply = `💊 **Medication Summary for ${name}:**\n\n`;
    if (pendingMeds.length > 0) {
      reply += `📌 **Pending Medicines (${pendingMeds.length}):**\n` + pendingMeds.map(m => `• **${m.name}** (${m.dose || '1 tab'}) — ${m.schedule || 'Scheduled'} (${m.instructions || 'After food'})`).join('\n') + '\n\n';
      reply += `Remember to take them with a glass of warm water.`;
    } else {
      reply += `✅ Wonderful! All scheduled medicines have been marked as taken today. Keep up the great adherence!`;
    }
    return reply;
  }

  // 4. BLOOD PRESSURE & VITALS EXPLANATION
  if (query.includes('bp') || query.includes('blood pressure') || query.includes('रक्तचाप') || query.includes('रक्तदाब')) {
    const currentBP = vitals.bp || '120/80';
    const [sys, dia] = currentBP.split('/').map(Number);
    let statusDesc = "Normal & Optimal";
    if (sys > 140 || dia > 90) statusDesc = "Elevated (Stage 2 Hypertension)";
    else if (sys > 130 || dia > 80) statusDesc = "Slightly High (Stage 1)";

    if (language === 'hi') {
      return `📊 **ब्लड प्रेशर (BP) जानकारी:**\n\nआपका वर्तमान दर्ज BP **${currentBP} mmHg** है (${statusDesc})।\n\n💡 **वरिष्ठ नागरिकों के लिए सलाह:**\n1. भोजन में नमक (सोडियम) कम रखें।\n2. दिनभर में 6-8 गिलास गुनगुना पानी पिएं।\n3. सुबह 15-20 मिनट हल्की धूप में टहलें।\n4. यदि BP 150/95 से अधिक हो तो डॉक्टर से परामर्श लें।`;
    }
    if (language === 'mr') {
      return `📊 **रक्तदाब (BP) माहिती:**\n\nतुमचा सध्याचा BP **${currentBP} mmHg** नोंदवला आहे (${statusDesc})।\n\n💡 **ज्येष्ठांसाठी उपयुक्त सल्ले:**\n1. जेवणात मिठाचे प्रमाण कमी ठेवा.\n2. भरपूर पाणी प्या आणि शांत झोप घ्या.\n3. सकाळी हलकी चालण्याची सवय ठेवा.\n4. रक्तदाब सतत जास्त राहिल्यास डॉक्टरांचा सल्ला घ्या.`;
    }
    return `📊 **Blood Pressure Insights:**\n\nYour current reading is **${currentBP} mmHg** (${statusDesc}).\n\n💡 **Clinical Advice for Seniors:**\n1. Keep daily dietary sodium (salt) below 1,500mg.\n2. Maintain consistent hydration throughout the day.\n3. Practice 10 minutes of morning deep breathing.\n4. If your systolic exceeds 150 consistently, schedule a checkup with your physician.`;
  }

  // 5. DIET & NUTRITION
  if (query.includes('diet') || query.includes('food') || query.includes('eat') || query.includes('खाना') || query.includes('आहार') || query.includes('जेवण')) {
    if (language === 'hi') {
      return `🥗 **वरिष्ठ नागरिकों के लिए आदर्श दैनिक आहार:**\n\n• **नाश्ता:** दलिया, ओट्स, या मूंग दाल की इडली गुनगुने दूध/पानी के साथ।\n• **दोपहर का भोजन:** 2 पतली multigrain रोटियां, हरी पत्तेदार सब्जी (पालक/मेथी), पतली दाल, और थोड़ा ताजा दही।\n• **शाम:** भुना मखाना, 2 अखरोट और हर्बल चाय।\n• **रात का खाना:** खिचड़ी या पपीता, सोने से कम से कम 2 घंटे पहले।`;
    }
    if (language === 'mr') {
      return `🥗 **ज्येष्ठ नागरिकांसाठी सकस व हलका आहार:**\n\n• **सकाळचा नाश्ता:** मऊ उपमा, मूग डाळ इडली किंवा ओट्स.\n• **दुपारचे जेवण:** २ पातळ पोळ्या, ताजी पालेभाजी, वरण-भात, आणि ताजे ताक.\n• **संध्याकाळी:** भाजलेले मखाने, सुका मेवा आणि कोमट पाणी.\n• **रात्रीचे जेवण:** मुगाची हलकी खिचडी, झोपण्यापूर्वी २ तास आधी जेवावे.`;
    }
    return `🥗 **Senior Dietary Guidelines:**\n\n• **Breakfast:** Oats with crushed almonds, vegetable idli, or warm porridge.\n• **Lunch:** 2 thin multigrain rotis, green leafy vegetables, yellow dal, and fresh curd/buttermilk for probiotic digestion.\n• **Evening Snack:** Roasted makhana (fox nuts), walnuts, or caffeine-free herbal tea.\n• **Dinner:** Light moong dal khichdi or steamed soup, completed at least 2 hours before bed.`;
  }

  // 6. GREETINGS & CASUAL TALK
  if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('नमस्ते') || query.includes('नमस्कार') || query.includes('हाय')) {
    if (language === 'hi') {
      return `🙏 **नमस्ते ${name} जी!** मैं आपका स्वास्थ्य साथी सुश्रुत मित्र हूँ। आज आपकी सेहत कैसी है? आप मुझसे अपनी दवाइयों, ब्लड प्रेशर, खान-पान या मन की कोई भी बात साझा कर सकते हैं।`;
    }
    if (language === 'mr') {
      return `🙏 **नमस्कार ${name}!** मी तुमचा आरोग्य मित्र सुश्रुत. आज तुमची तब्येत कशी आहे? तुम्हाला औषधांबद्दल, बीपीबद्दल किंवा मनातील काहीही विचारायचे असल्यास मी हजर आहे.`;
    }
    return `🙏 **Namaste ${name}!** I am Sushruta Mitra, your dedicated health companion. How are you feeling today? You can ask me about your medications, blood pressure, diet, or just talk about how your day is going!`;
  }

  // 7. GRATITUDE / PRAISE
  if (query.includes('thank') || query.includes('धन्यवाद') || query.includes('आभार') || query.includes('good') || query.includes('अच्छा')) {
    if (language === 'hi') {
      return `🙏 बहुत-बहुत धन्यवाद ${name} जी! आपके इस आशीर्वाद से मेरा दिन बन गया। हमेशा हंसते-मुस्कुराते रहिए और अपनी सेहत का ध्यान रखिए!`;
    }
    if (language === 'mr') {
      return `🙏 मनापासून धन्यवाद ${name}! तुमचा आनंद हीच माझी सर्वात मोठी पावती आहे. नेहमी निरोगी आणि प्रसन्न राहा!`;
    }
    return `🙏 You are most welcome, ${name}! Your kind words brighten my day. Always stay smiling, take care of your health, and remember I am always here for you!`;
  }

  // 8. DEFAULT HELPFUL FALLBACK
  if (language === 'hi') {
    return `मैं आपकी बात समझ रहा हूँ, ${name} जी। यदि आपको किसी विशेष लक्षण, आज की दवाइयों, ब्लड प्रेशर या खान-पान की सलाह चाहिए तो कृपया मुझे बताएं। गंभीर परेशानी में तुरंत डॉक्टर से संपर्क करें।`;
  }
  if (language === 'mr') {
    return `मी तुमचे म्हणणे समजून घेत आहे, ${name}. तुम्हाला औषधे, रक्तदाब, आहार किंवा विश्रांतीबद्दल काहीही माहिती हवी असल्यास कृपया विचारा. कोणतीही तीव्र वेदना असल्यास डॉक्टरांचा सल्ला घ्या.`;
  }
  return `I understand, ${name}. You can ask me to check your pending medicines, explain your blood pressure, suggest easy exercises, or share how you are feeling today. If you have severe symptoms, please reach out to your physician or tap SOS.`;
}
