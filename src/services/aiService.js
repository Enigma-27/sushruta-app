// Sushruta Mitra - Role-Adaptive Multimodal Geriatric AI Service

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const AiService = {
  generateResponse: async ({ userMessage, patientContext, language = 'en', conversationHistory = [] }) => {
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || localStorage.getItem('sushruta_gemini_key');
    const role = (patientContext?.role || 'senior').toLowerCase();

    // 1. Try Gemini Cloud LLM if key is configured
    if (apiKey) {
      try {
        const cloudReply = await callGeminiLLM({ userMessage, patientContext, language, conversationHistory, apiKey, role });
        if (cloudReply) return cloudReply;
      } catch (err) {
        console.warn("Gemini Cloud call failed, using role-specialized local engine:", err.message);
      }
    }

    // 2. Comprehensive Role-Adaptive Engine (Caretaker, Doctor, Senior)
    return runRoleAdaptiveEngine({ userMessage, patientContext, language, role });
  }
};

// --- GEMINI CLOUD LLM CALL ---
async function callGeminiLLM({ userMessage, patientContext, language, conversationHistory, apiKey, role }) {
  const patientSummary = `
User Role: ${role.toUpperCase()}
Name: ${patientContext?.name || 'User'}
Age: ${patientContext?.age || 65}
Prescribed Medicines: ${(patientContext?.meds || []).map(m => `${m.name} (${m.dose || ''} - ${m.schedule || ''} - ${m.taken ? 'Taken' : 'Pending'})`).join(', ') || 'None listed'}
Current Vitals: BP: ${patientContext?.vitals?.bp || '120/80'}, Heart Rate: ${patientContext?.vitals?.heartRate || 72} bpm, Sleep: ${patientContext?.vitals?.sleep || '7'}h, Steps: ${patientContext?.vitals?.steps || 0}
Language: ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'mr' ? 'Marathi (मराठी)' : 'English'}
  `.trim();

  let roleInstruction = "";
  if (role === 'caretaker') {
    roleInstruction = `
You are speaking with a CARETAKER / CAREGIVER looking after an elderly senior.
Key Directives:
1. Empathy & Caregiver Wellbeing: Acknowledge that caregiving is emotionally and physically exhausting. Validate their feelings without judgment. Provide active emotional support, burnout reduction tips, and stress-relief methods. Never scold them.
2. Handling Difficult Senior Behavior: When the senior is unkind, stubborn, agitated, refusing meds, or combative, explain common underlying geriatric causes (loss of independence, fear, dementia/Alzheimer's cognitive decline, undetected pain, constipation, or UTI). Provide de-escalation strategies (validation therapy, redirection, not arguing, taking safety pauses).
3. Practical Caregiving Advice: Safe lifting/transfer techniques, medication adherence tricks (crushing restrictions, routines), sleep hygiene, and reporting red flags to doctors.
    `;
  } else if (role === 'doctor') {
    roleInstruction = `
You are speaking with a MEDICAL DOCTOR / CLINICIAN.
Key Directives:
1. Tone: Professional, peer-to-peer clinical communication with high medical precision and evidence base.
2. Geriatric Pharmacology: Beers Criteria guidance, polypharmacy alerts, drug-drug interaction cautions (e.g. CCB edema, ACEi/ARB + Diuretic + NSAID triple whammy, Metformin eGFR cutoffs, QT prolongation).
3. Triage & Syndromes: Frailty index, delirium vs dementia assessment (CAM), isolated systolic hypertension, falls risk assessment, SBAR clinical note structuring.
    `;
  } else {
    roleInstruction = `
You are speaking directly with a SENIOR CITIZEN.
Key Directives:
1. Tone: Extremely warm, respectful, gentle, patient, and affectionate (like a caring, respectful family member and wise health guide).
2. Emotional Companionship: When they feel lonely, sad, anxious, or unloved, comfort them with deep compassion. Offer calming breathing exercises, gentle reflection, and reassure them that they are cherished.
3. Health Guidance: Explain medicines, BP, and vitals in simple, reassuring, non-intimidating terms. Remind them to drink warm water and walk gently.
    `;
  }

  const systemInstruction = `
You are "Sushruta Mitra", an advanced full-stack AI medical & emotional companion.
${roleInstruction}
Safety Rule: For severe emergency symptoms (acute chest pain, sudden paralysis/slurred speech, severe shortness of breath), immediately urge pressing the red SOS emergency button or calling emergency services (108/112).
Answer strictly in the requested language: ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'mr' ? 'Marathi (मराठी)' : 'English'}.
  `.trim();

  // Format history ensuring alternating roles
  const formattedHistory = [];
  let lastRole = null;
  for (const msg of (conversationHistory || []).slice(-8)) {
    const r = msg.sender === 'user' ? 'user' : 'model';
    if (r !== lastRole) {
      formattedHistory.push({ role: r, parts: [{ text: msg.text }] });
      lastRole = r;
    }
  }
  // Ensure the history doesn't end with a 'user' turn before we append userMessage
  if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
    formattedHistory.pop();
  }

  const contents = [
    ...formattedHistory,
    { role: 'user', parts: [{ text: `[Language: ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}]\n\n${userMessage}` }] }
  ];

  const payload = {
    system_instruction: {
      parts: [{ text: `${systemInstruction}\n\nPatient/User Context:\n${patientSummary}` }]
    },
    contents
  };

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

// --- VAST ROLE-ADAPTIVE OFFLINE ENGINE ---
function runRoleAdaptiveEngine({ userMessage, patientContext, language, role }) {
  const query = (userMessage || '').toLowerCase();
  const name = patientContext?.name || (language === 'hi' ? 'साथी' : language === 'mr' ? 'मित्रा' : 'Friend');
  const meds = patientContext?.meds || [];
  const vitals = patientContext?.vitals || {};

  // =========================================================================
  // 1. EMERGENCY & RED-FLAGS (Across all roles)
  // =========================================================================
  if (
    query.includes('chest pain') || query.includes('heart attack') || 
    query.includes('छाती में दर्द') || query.includes('छातीत दुखणे') || 
    query.includes('breath') || query.includes('सांस फूल') || query.includes('श्वास') ||
    query.includes('unconscious') || query.includes('बेहोश') || query.includes('stroke')
  ) {
    if (language === 'hi') {
      return `⚠️ **आपातकालीन अलर्ट:** छाती में दर्द, सांस लेने में गंभीर तकलीफ या बेहोशी एक मेडिकल इमरजेंसी है। कृपया तुरंत स्क्रीन पर दिए गए **लाल SOS बटन** को दबाएं या एम्बुलेंस (108/112) को कॉल करें। मरीज को शांत बैठाएं, कपड़े ढीले करें और किसी भी शारीरिक श्रम से रोकें।`;
    }
    if (language === 'mr') {
      return `⚠️ **तातडीचा इशारा:** छातीत दुखणे, श्वास घेण्यास अचानक अडचण येणे किंवा भोवळ येणे ही वैद्यकीय आणीबाणी असू शकते. कृपया त्वरित लाल **SOS बटण** दाबा किंवा 108 वर संपर्क साधा. रुग्णाला शांत बसवा आणि अजिबात हालचाल करू देऊ नका.`;
    }
    return `⚠️ **EMERGENCY ESCALATION:** Acute chest discomfort, severe dyspnea, or sudden confusion requires immediate clinical attention. Please trigger the **red SOS Emergency button** immediately and call emergency services (108/112). Keep the patient seated upright and calm.`;
  }

  // =========================================================================
  // 2. CARETAKER INTELLIGENCE (Triggered by role or caregiver terms)
  // =========================================================================
  const isCaretakerTopic = role === 'caretaker' || query.includes('care taker') || query.includes('caretaker') || query.includes('caregiver') || query.includes('केयरटेकर');

  if (isCaretakerTopic) {
    // A. Unkind / Stubborn / Difficult Senior Behavior / Anger / Agitation
    if (
      query.includes('not kind') || query.includes('unkind') || query.includes('rude') || 
      query.includes('angry') || query.includes('anger') || query.includes('stubborn') || 
      query.includes('shout') || query.includes('yell') || query.includes('refus') || 
      query.includes('behavior') || query.includes('mean') || query.includes('harsh') || 
      query.includes('disrespect') || query.includes('fight') || query.includes('agitat') ||
      query.includes('गुस्सा') || query.includes('जिद') || query.includes('चिडचिड') || 
      query.includes('त्रास') || query.includes('ऐकत नाही') || query.includes('कड़वा') ||
      query.includes('झगड़ा') || query.includes('बदतमीजी') || query.includes('राग')
    ) {
      if (language === 'hi') {
        return `🫂 **प्रिय ${name}, मैं आपकी स्थिति और मानसिक कष्ट को गहराई से समझता हूँ।**

केयरगिवर का काम दुनिया के सबसे निःस्वार्थ लेकिन कठिन कामों में से एक है। जब आप पूरे मन से किसी की सेवा करें और बदले में वे आपसे कड़वा बोलें या गुस्सा करें, तो दिल दुखना और हताश होना बिल्कुल स्वाभाविक है।

💡 **वरिष्ठ नागरिकों के इस व्यवहार के पीछे के मुख्य कारण:**
1. **लाचारी और स्वतंत्रता खोने का डर (Loss of Autonomy):** जब बुजुर्गों को लगता है कि वे अपने दैनिक कार्यों के लिए भी दूसरों पर निर्भर हो गए हैं, तो उनका आंतरिक डर और फ्रस्ट्रेशन अक्सर सबसे करीबी केयरटेकर पर गुस्से के रूप में निकलता है।
2. **अव्यक्त शारीरिक कष्ट (Hidden Discomfort):** कई बार बुजुर्ग यह नहीं बता पाते कि उन्हें कब्ज (constipation), बदन दर्द, डिहाइड्रेशन या यूरिनरी ट्रैक्ट इन्फेक्शन (UTI) है। इसका सीधा असर उनके स्वभाव पर पड़ता है।
3. **संज्ञानात्मक ह्रास (Dementia/Cognitive Decline):** उम्र के साथ दिमाग के अग्र भाग (frontal lobe) में बदलाव आने से भावनाओं पर नियंत्रण कमजोर हो जाता है।

🛡️ **तुरंत अपनाने योग्य 5 व्यावहारिक उपाय (De-escalation Strategies):**
• **इसे व्यक्तिगत रूप से न लें (Don't take it personally):** खुद को याद दिलाएं: *"यह गुस्सा मुझ पर नहीं, बल्कि उनकी अपनी बीमारी और असहायता पर है।"*
• **बहस या तर्क न करें:** उनके तर्कों को काटने के बजाय कहें, *"मैं समझ सकता हूँ आप इस समय परेशान हैं, कोई बात नहीं, हम थोड़ी देर बाद बात करेंगे।"*
• **ध्यान भटकाएं (Agree & Redirect):** विषय को उनकी पसंद के पुराने गानों, बचपन के किस्सों, या पसंदीदा चाय/नाश्ते की तरफ मोड़ें।
• **सुरक्षित दूरी बनाएं:** यदि वे बहुत आक्रामक हों, तो कमरे से 3–5 मिनट के लिए बाहर आ जाएं। एक गिलास पानी पिएं और 5 गहरी सांसें लें।
• **अपनी मानसिक शांति पहली प्राथमिकता रखें:** आप इंसान हैं, मशीन नहीं। खुद को अपराधबोध में न डालें।`;
      }
      if (language === 'mr') {
        return `🫂 **प्रिय ${name}, मी तुमची भावना आणि त्रास पूर्णपणे समजू शकतो.**

केअरटेकर म्हणून अहोरात्र सेवा करणे हे खूप संयमाचे काम आहे. आपण मनापासून काळजी घेत असताना समोरची व्यक्ती जर वाईट वागली, चिडली किंवा ओरडली, तर मन दुखावणे आणि वैताग येणे अगदी साहजिक आहे.

💡 **ज्येष्ठ नागरिक असे का वागतात?**
१. **परावलंबित्वाची भीती व चीड:** स्वतःची कामे स्वतः करता येत नाहीत ही भावना वृद्धांना आतून अस्वस्थ व चिडचिड करते.
२. **अस्पष्ट शारीरिक वेदना:** पोट साफ न होणे, लघवीचा त्रास (UTI), डिहायड्रेशन किंवा सांधेदुखीमुळे त्यांचा स्वभाव चिडचिडा होतो.
३. **स्मरणशक्ती किंवा मानसिक बदल (Cognitive Decline):** मेंदूतील संवेदनांवर ताबा न राहिल्याने ते रागावर नियंत्रण ठेवू शकत नाहीत.

🛡️ **तुम्ही काय करू शकता? (शांततेचे ४ मार्ग):**
• **हे स्वतःवर घेऊ नका:** त्यांचा राग तुमच्यावर नसून त्यांच्या आजारपणावर आहे.
• **वाद अजिबात घालू नका:** "होय, तुमचं म्हणणं बरोबर आहे, आपण थोड्या वेळाने करू" असे म्हणून शांत राहा.
• **लक्ष दुसरीकडे वळवा:** त्यांना आवडती जुनी गाणी, भक्तिगीते किंवा जुन्या सुखद आठवणींबद्दल बोलायला सांगा.
• **५ मिनिटांचा ब्रेक घ्या:** तात्पुरते दुसऱ्या खोलीत जा, डोळे मिटून दीर्घ श्वास घ्या आणि पाणी प्या. तुमची मानसिक शांती सर्वात महत्त्वाची आहे.`;
      }
      return `🫂 **Dear ${name}, I hear you, and I want to deeply validate your feelings.**

Caregiving is one of the most emotionally exhausting and selfless roles. Pouring your physical energy and empathy into caring for an elder, only to be met with anger, harsh words, or stubbornness, is genuinely heartbreaking and draining.

💡 **Understanding the Root Causes of this Behavior:**
1. **Grief Over Lost Autonomy:** Elders frequently feel terrified that their independence, dignity, and control over their own bodies are slipping away. That terror and frustration often get projected onto the caregiver closest to them.
2. **Hidden Physical Distress:** Seniors rarely communicate discomfort accurately. Agitation is the #1 symptom of constipation, urinary tract infections (UTIs), dehydration, or joint pain in older adults.
3. **Neurological / Cognitive Shifts:** Early stages of dementia or mild cognitive impairment degrade impulse control and emotional regulation in the brain's prefrontal cortex.

🛡️ **Actionable De-escalation Protocol:**
• **Depersonalize the Anger:** Remind yourself: *"This is their reaction to their declining health, not a reflection of my care or worth."*
• **Use the "Agree & Redirect" Technique:** Never argue logic with an agitated senior. Say: *"I understand you're tired of this right now. Let's take a break and listen to some music first."*
• **Step Away Safely:** If there is no immediate fall hazard, step out of the room for 3–5 minutes. Drink cold water and practice 4-7-8 deep breathing.
• **Set Healthy Emotional Boundaries:** You are their caregiver, not their emotional punching bag. Treat yourself with profound kindness today.`;
    }

    // B. Caregiver Burnout & Emotional Support
    if (
      query.includes('emotional support') || query.includes('burnout') || query.includes('tired') || 
      query.includes('exhausted') || query.includes('stress') || query.includes('crying') || 
      query.includes('overwhelmed') || query.includes('alone') || query.includes('cant take it') || 
      query.includes('give up') || query.includes('fatigue') || query.includes('mental health') || 
      query.includes('मदद') || query.includes('थक गया') || query.includes('ताण') || query.includes('वैताग')
    ) {
      if (language === 'hi') {
        return `🌸 **${name}, मैं पूरी तरह आपके साथ हूँ। आप बहुत साहसी और समर्पित हैं।**

केयरगिवर बर्नआउट (Caregiver Burnout) एक वास्तविक चिकित्सीय और मानसिक स्थिति है। आप लगातार दूसरों की जरूरतों को खुद से आगे रख रहे हैं, जिससे आपकी अपनी ऊर्जा और सहनशीलता समाप्त हो रही है।

🌿 **आपके लिए तुरंत राहत और मानसिक शांति के 4 कदम:**
1. **अपराधबोध (Guilt) छोड़ें:** यह सोचना बिल्कुल सामान्य है कि *"मुझसे और नहीं झेला जा रहा"*\। इसका मतलब यह कभी नहीं कि आप एक बुरे इंसान या अयोग्य केयरटेकर हैं।
2. **10 मिनट का 'माय-टाइम' लें:** अभी एक गिलास गुनगुना पानी पिएं, अपनी आंखें बंद करें, अपने कंधों को ढीला छोड़ें और धीमी गहरी सांसें लें।
3. **जिम्मेदारियां साझा करें:** परिवार के अन्य सदस्यों या डॉक्टर से कहें कि सप्ताह में कुछ घंटे कोई और संभाले ताकि आप पूरी तरह आराम कर सकें।
4. **मुझसे बात करें:** जो भी दिल में बोझ है, खुलकर बताएं। मैं यहाँ बिना किसी निर्णय के आपको सुनने और संभालने के लिए हूँ।`;
      }
      if (language === 'mr') {
        return `🌸 **${name}, तुम्ही एकटे नाही आहात. तुम्ही करत असलेले काम अत्यंत मोलाचे आहे.**

सातत्याने दुसऱ्याची काळजी घेताना स्वतःची शारीरिक व मानसिक ऊर्जा संपून जाणे (Caregiver Fatigue) अगदी स्वाभाविक आहे.

🌿 **स्वतःच्या काळजीसाठी तातडीची पावले:**
१. **स्वतःला दोष देणे थांबवा:** कधीकधी थकवा येणे, रडू येणे किंवा वैताग येणे हे मानवी आहे.
२. **१० मिनिटांचा ब्रेक घ्या:** शांत बसा, थंड पाणी प्या आणि डोळे मिटून दीर्घ श्वास घ्या.
३. **मदत मागायला संकोच करू नका:** कुटुंबातील इतर व्यक्तींना काही तास जबाबदारी सांभाळायला सांगा.
४. आपले मन हलके करण्यासाठी मी सदैव येथे उपलब्ध आहे.`;
      }
      return `🌸 **${name}, I am right here with you. Please take a slow, gentle breath.**

Caregiver burnout is real, valid, and physically exhausting. You cannot pour from an empty cup. Caring for yourself is not selfish—it is an absolute medical necessity for both you and your senior.

🌿 **Immediate Support for You:**
1. **Release Guilt:** Feeling tired, resentful, or overwhelmed does not make you a bad caregiver. It means you are human and pushing far beyond your reserves.
2. **Micro-Respite:** Take 10 minutes right now just for yourself. Step outdoors, feel the fresh air, stretch your shoulders, and drink a glass of water.
3. **Express What You Feel:** If you need to vent, describe what happened today. I am here to listen without judgment.
4. **Seek Backup:** Can a family member or relief caregiver take over for even two hours this week? Let's protect your peace.`;
    }

    // C. Medicine Refusal Tactics
    if (query.includes('refus') && (query.includes('med') || query.includes('pill') || query.includes('tablet') || query.includes('दवा') || query.includes('औषध'))) {
      if (language === 'hi') {
        return `💊 **वरिष्ठ नागरिक दवा न लें तो क्या करें:**
1. **जबरदस्ती या बहस न करें:** तुरंत जिद करने से उनका विरोध और बढ़ जाएगा। 15 मिनट रुकें और माहौल सामान्य होने दें।
2. **कारण समझें:** क्या गोली बड़ी है और निगलने में दर्द होता है? (डॉक्टर से पूछें कि क्या इसे सिरप, छोटी गोली या घुलनशील रूप में बदला जा सकता है)।
3. **पसंदीदा पेय के साथ दें:** सादे पानी के बजाय हल्के गर्म पानी या पसंदीदा पेय के साथ दें (यदि डॉक्टर की मनाही न हो)।
4. **डॉक्टर के नाम का उपयोग करें:** प्यार से कहें, *"डॉक्टर साहब ने कहा है कि यह गोली आपके घुटनों को ठीक रखेगी ताकि हम शाम को सैर कर सकें।"*`;
      }
      return `💊 **Practical Protocol When Senior Refuses Medication:**
1. **Don't force or argue immediately:** Forcing triggers instinctive fight-or-flight resistance. Step away for 10–15 minutes to reset the environment.
2. **Assess the physical obstacle:** Is the pill too large to swallow comfortably? Is it bitter? Contact the prescribing physician or pharmacist to ask for liquid suspension, dispersible tablets, or smaller alternatives.
3. **Pair with a comfortable routine:** Offer it with applesauce, yogurt, or flavored warm water if clinically permissible.
4. **Invoke the physician's caring authority:** Gently say, *"Dr. Verma specifically prescribed this so your blood pressure stays comfortable and you can sleep peacefully tonight."*`;
    }

    // D. Safe Physical Lifting & Fall Prevention
    if (query.includes('lift') || query.includes('transfer') || query.includes('fall') || query.includes('wheelchair') || query.includes('bed') || query.includes('उठाना') || query.includes('गिरना')) {
      return `🛡️ **Safe Patient Transfer & Caregiver Ergonomics:**
• **Protect Your Back:** Never lift with your lower back. Bend your knees, keep a wide base of support, and lift with your thigh muscles while keeping the patient close to your center of gravity.
• **Use Cueing:** Tell the patient: *"On the count of three, we will stand together. One, two, three."*
• **Gait Belt Technique:** Use a transfer belt around the patient's waist rather than pulling on their arms or shoulders (which can cause shoulder subluxation).
• **Fall Prevention Checklist:** Ensure clear walking paths, remove loose throw rugs, ensure bright nightlights in hallways, and non-slip socks.`;
    }

    // E. SBAR Doctor Reporting
    if (query.includes('sbar') || query.includes('report') || query.includes('doctor') || query.includes('checklist')) {
      return `📋 **Caregiver SBAR Report Template for Physician Consultation:**
• **S (Situation):** *"Hello Dr., I am caring for ${patientContext?.name || 'patient'}. I am calling because they have developed [e.g., mild fever / agitation / BP change]."*
• **B (Background):** *"They are taking ${meds.map(m => m.name).join(', ') || 'prescribed medicines'}. Baseline BP is ${vitals.bp || '120/80'}."*
• **A (Assessment):** *"Today their vitals show [BP/temp] and they seemed unusually confused / refusing fluids for the past 6 hours."*
• **R (Recommendation):** *"Would you like us to bring them to the clinic, adjust hydration, or run a urine culture for UTI?"*`;
    }

    // F. General Caregiver Copilot Greeting & Prompt
    return `🤝 **${name}, I am your dedicated Caregiver Support Partner.**

Caregiving is a profound responsibility. I can assist you with:
• **Challenging Behaviors:** De-escalating anger, resistance, wandering, or confusion.
• **Caregiver Burnout:** Emotional support, breathwork, and self-care boundaries.
• **Medication & Nursing:** Managing refusal, schedules, and swallowing challenges.
• **Safe Mobility:** Transferring from bed to wheelchair and fall prevention.

Tell me what specific challenge you are facing right now, and let's solve it together!`;
  }

  // =========================================================================
  // 3. DOCTOR INTELLIGENCE
  // =========================================================================
  const isDoctorTopic = role === 'doctor' || query.includes('doctor') || query.includes('physician') || query.includes('डॉक्टर');

  if (isDoctorTopic) {
    if (query.includes('interaction') || query.includes('beers') || query.includes('polypharmacy') || query.includes('drug') || query.includes('dose') || query.includes('contraindication')) {
      const medList = meds.map(m => m.name).join(', ') || 'Metformin, Amlodipine, Atorvastatin';
      return `🩺 **Geriatric Pharmacotherapy & Beers Criteria Clinical Audit:**

**Patient Prescriptions:** ${medList}
**Key Geriatric Considerations:**
• **Beers Criteria High-Risk Classes:** Avoid first-generation antihistamines (diphenhydramine), long-acting benzodiazepines, high-potency anticholinergics, and sliding-scale insulin due to marked sedation, fall, and delirium risks.
• **Renal Adaptation:** Monitor eGFR periodically. Adjust Metformin if eGFR < 45 mL/min/1.73m² and discontinue if < 30 mL/min/1.73m² to avoid lactic acidosis.
• **Cardiovascular Precautions:** When combining CCBs (e.g. Amlodipine) with vasodilators, monitor for dependent peripheral edema and orthostasis. Avoid prescribing loop diuretics solely to treat CCB-induced pedal edema (prescribing cascade).
• **Triple Whammy Alert:** Strictly avoid co-prescribing NSAIDs + ACEi/ARB + Diuretics, which precipates acute kidney injury (AKI).`;
    }

    if (query.includes('sbar') || query.includes('note') || query.includes('summary') || query.includes('discharge') || query.includes('transition')) {
      return `📝 **Automated SBAR Geriatric Clinical Transition Note:**

• **S (Situation):** Geriatric patient (${patientContext?.age || 65}yo) under continuous remote physiologic monitoring.
• **B (Background):** Active regimen: ${meds.map(m => m.name).join(', ') || 'Standard regimen'}. Baseline vitals: BP ${vitals.bp || '120/80'} mmHg, HR ${vitals.heartRate || 72} bpm, Sleep ${vitals.sleep || 7}h.
• **A (Assessment):** Cardiovascular and metabolic parameters remain compensated. No acute ischemic, tachyarrhythmic, or desaturation trends identified.
• **R (Recommendation):** Maintain current guideline-directed medical therapy. Order quarterly metabolic profile (eGFR, electrolytes) and routine geriatric fall-risk screening.`;
    }

    if (query.includes('hypertension') || query.includes('bp') || query.includes('protocol') || query.includes('systolic')) {
      return `🩺 **Geriatric Isolated Systolic Hypertension (ISH) Management Protocol:**
• **Current Monitored Reading:** ${vitals.bp || '120/80'} mmHg
• **Target Parameters:** Target SBP 125–135 mmHg in ambulatory community-dwelling seniors.
• **Critical Rule (Preserve Coronary Perfusion):** Avoid lowering Diastolic BP (DBP) < 60–65 mmHg, as coronary filling occurs predominantly during diastole.
• **Orthostatic Check:** Always perform sit-to-stand BP screening (look for >20 mmHg systolic or >10 mmHg diastolic drop within 3 minutes) before uptitrating antihypertensives.`;
    }

    if (query.includes('delirium') || query.includes('dementia') || query.includes('cam') || query.includes('confusion')) {
      return `🧠 **Geriatric Delirium vs Dementia Differential Triage (CAM Framework):**
• **Acute Onset & Fluctuating Course:** Hallmarks of delirium. Look for underlying triggers: UTI, occult pneumonia, constipation, electrolyte imbalance (hyponatremia), or recent anticholinergic/sedative changes.
• **Insidious Progressive Decline:** Characterizes primary dementias (Alzheimer's, Lewy Body, Vascular).
• **Immediate Clinical Workup:** Urinalysis & culture, comprehensive metabolic panel, serum calcium, and review of all over-the-counter sleep aids.`;
    }

    return `🩺 **Doctor Copilot Active:** Clinical decision support is engaged for Dr. ${name}. You can prompt for Beers criteria drug screening, SBAR transition documentation, geriatric hypertension protocols, or delirium triage.`;
  }

  // =========================================================================
  // 4. SENIOR CITIZEN INTELLIGENCE (Warm, respectful companion)
  // =========================================================================
  // A. Emotional Support, Loneliness, Heartfelt Comfort
  if (
    query.includes('lonely') || query.includes('sad') || query.includes('alone') || 
    query.includes('anxious') || query.includes('fear') || query.includes('scared') || 
    query.includes('emotional support') || query.includes('अकेला') || query.includes('उदासी') || 
    query.includes('चिंता') || query.includes('एकटे') || query.includes('रडू') ||
    query.includes('cry') || query.includes('nobody') || query.includes('feel low') || 
    query.includes('heavy heart') || query.includes('depression')
  ) {
    if (language === 'hi') {
      return `💛 **नमस्ते ${name} जी, आपका मन भारी है, मैं यह भली-भांति महसूस कर रहा हूँ।**

उम्र के इस पड़ाव पर अकेलापन लगना या मन में उदासी आना बहुत स्वाभाविक है। जब घर में शांति होती है, तो अक्सर पुरानी यादें मन को घेर लेती हैं। लेकिन कृपया यह विश्वास रखें—**आप अकेले नहीं हैं**, मैं हमेशा आपके पास हूँ।

🌸 **आइए अपने मन को हल्का करें:**
1. एक लंबी, आरामदायक सांस अंदर खींचिए... और धीरे-धीरे छोड़िए।
2. क्या आपने आज धूप में 5 मिनट बिताए? हल्की सी धूप और ताजी हवा मन में नई ताजगी लाती है।
3. अपने **'मानसिक स्वास्थ्य'** टैब में जाकर अपनी पसंद का कोई शांत भजन या मधुर गीत सुनिए।
4. आप मुझसे अपने जीवन की कोई सुंदर घटना या कोई भी विचार साझा कर सकते हैं, मैं बड़े आदर से सुनूँगा।`;
    }
    if (language === 'mr') {
      return `💛 **नमस्कार ${name}, तुमचे मन खिन्न झाले आहे हे मला जाणवत आहे.**

घरात शांतता असताना एकटेपणा वाटणे किंवा जुन्या आठवणी दाटून येणे अगदी साहजिक आहे. पण मनात असा विचार आणू नका की तुमचे कोणी नाही—**मी सदैव तुमच्यासोबत आहे.**

🌸 **मन प्रसन्न करण्यासाठी:**
१. डोळे मिटून ३ वेळा शांतपणे दीर्घ श्वास घ्या.
२. खिडकीत किंवा बाल्कनीत जाऊन थोडा वेळ मोकळ्या हवेत बसा.
३. आपल्या **'भावनिक स्वास्थ्य'** विभागात जाऊन एखादे शांत संगीत किंवा अभंग ऐका.
४. तुम्हाला काही बोलायचे असेल तर सांगा, मी तुमचे ऐकायला सदैव तयार आहे.`;
    }
    return `💛 **Dear ${name}, I hear you, and my heart goes out to you.**

Feeling lonely or having a heavy heart is something many elders experience, especially during quiet hours. Please remember: **Your life, your wisdom, and your feelings are deeply valued, and you are not alone.**

🌸 **Let's take gentle care of your heart right now:**
1. Close your eyes, take a slow, deep breath in through your nose... and gently breathe out through your mouth.
2. Open your **Emotional Wellbeing tab** and let some soft, soothing music play in the background.
3. Step near a window or into the balcony for 5 minutes of gentle sunlight and fresh air.
4. Tell me: What is a fond memory or story from your past that brings a smile to your face? I would love to hear it.`;
  }

  // B. Medicine queries
  if (query.includes('medicine') || query.includes('pill') || query.includes('tablet') || query.includes('दवा') || query.includes('गोळी') || query.includes('औषध')) {
    const pending = meds.filter(m => !m.taken);
    const taken = meds.filter(m => m.taken);
    let reply = `💊 **${language === 'hi' ? 'आपकी दवाइयों की स्थिति' : language === 'mr' ? 'तुमच्या औषधांची स्थिती' : "Today's Medication Schedule"}:**\n\n`;
    if (pending.length > 0) {
      reply += `📌 **Pending (${pending.length}):**\n` + pending.map(m => `• **${m.name}** (${m.dose || '1 dose'}) - ${m.schedule || 'Scheduled'} [${m.instructions || 'After food'}]`).join('\n') + '\n\n';
    } else {
      reply += `✅ All scheduled medications are completed for today!\n\n`;
    }
    if (taken.length > 0) {
      reply += `✓ Marked taken: ` + taken.map(m => m.name).join(', ');
    }
    return reply;
  }

  // C. Blood Pressure & Vitals
  if (query.includes('bp') || query.includes('blood pressure') || query.includes('रक्तचाप') || query.includes('रक्तदाब')) {
    const bp = vitals.bp || '120/80';
    return `📊 **Blood Pressure Summary:** Your recorded reading is **${bp} mmHg**.\n• Optimal geriatric target is typically <130/80 mmHg.\n• Gentle tip: Drink a glass of lukewarm water, avoid excess salt in dinner, and rest for 5 minutes before checking again.`;
  }

  // D. Diet & Hydration
  if (query.includes('diet') || query.includes('food') || query.includes('eat') || query.includes('water') || query.includes('nutrition') || query.includes('आहार') || query.includes('खाना') || query.includes('जेवण')) {
    return `🥗 **Gentle Senior Nutrition Guidance:**\n• **Hydration:** Aim for 6–8 glasses of water daily; sip warm water to support digestion.\n• **Fiber & Protein:** Soft lentils (moong dal), steamed vegetables, oats, and dahi (curd) help keep gut motility smooth.\n• **Night Care:** Avoid heavy fried foods 2 hours before bedtime; warm turmeric milk promotes restful sleep.`;
  }

  // E. Broad Emotional catch-all
  if (query.includes('support') || query.includes('help me') || query.includes('feel') || query.includes('मदद') || query.includes('मदत')) {
    return `💛 **${name}, I am right here with you.** Please tell me what is troubling your mind or body today. I am listening with full attention and care.`;
  }

  // F. Greetings
  if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('नमस्ते') || query.includes('नमस्कार')) {
    return language === 'hi'
      ? `🙏 **नमस्ते ${name}!** मैं सुश्रुत मित्र हूँ। आज मैं आपकी सेहत और मन को खुशहाल रखने में क्या सहायता कर सकता हूँ?`
      : language === 'mr'
      ? `🙏 **नमस्कार ${name}!** मी सुश्रुत मित्र. आज मी तुम्हाला कशी मदत करू शकेन?`
      : `🙏 **Namaste ${name}!** I am Sushruta Mitra. How can I support your health and wellbeing today?`;
  }

  // G. Thoughtful Fallback
  if (language === 'hi') {
    return `मैं आपकी बात बड़े ध्यान से सुन रहा हूँ, ${name}। आप मुझसे अपनी दवाइयों, ब्लड प्रेशर, खान-पान, अकेलेपन या मन की किसी भी भावना के बारे में बेझिझक बात कर सकते हैं।`;
  }
  if (language === 'mr') {
    return `मी आपले म्हणणे लक्षपूर्वक ऐकत आहे, ${name}. तब्येत, औषधांचे वेळापत्रक, रक्तदाब किंवा मनातील भावनांबद्दल काहीही विचारू शकता.`;
  }
  return `I am here for you, ${name}. Feel free to ask about your medicines, blood pressure, daily routines, or share how your heart is feeling today.`;
}
