import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // App Branding
    appName: "SUSHRUTA",
    tagline: "Ancient Wisdom, Modern Care",
    activeUser: "Active User",
    cloudOnline: "Backend Online",
    localMode: "Local Offline Mode",
    
    // Navigation
    navDashboard: "Dashboard",
    navAssistant: "AI Assistant",
    navGPS: "Live Location",
    navMeds: "Medicines",
    navWellness: "Wellness & Diet",
    navJoy: "Emotional Wellbeing",
    navReports: "Reports",
    navAppointments: "Appointments",
    navPatientRequests: "Patient Requests",
    navInsurance: "Insurance",
    navShop: "Buy Medicines",
    navGov: "Govt. Schemes",
    navProfile: "My Profile",
    logout: "Logout",
    
    // Auth
    welcomeBack: "Welcome Back",
    accessDashboard: "Access your health dashboard",
    mobileNumber: "Mobile Number",
    password: "Password",
    loginBtn: "Login",
    newToSushruta: "New to Sushruta?",
    createAccount: "Create Account",
    chooseProfile: "Choose your Profile",
    seniorCitizen: "Senior Citizen",
    seniorDesc: "I want to manage my health & connect.",
    caretaker: "Caretaker",
    caretakerDesc: "I am looking after a senior member.",
    doctor: "Doctor",
    doctorDesc: "I am a medical professional.",
    fullName: "Full Name",
    confirmPassword: "Confirm Password",
    signUpBtn: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    quickDemoAccess: "One-Click Demo Access",
    
    // Dashboard & Vitals
    dailyHealthScore: "Daily Health Score",
    asPerWHO: "As per WHO",
    bp: "Blood Pressure",
    heartRate: "Heart Rate",
    steps: "Daily Steps",
    sleep: "Sleep Rest",
    exerciseRecorded: "Exercise Recorded",
    markExerciseDone: "Mark Exercise as Done",
    sosEmergency: "SOS EMERGENCY",
    confirmEmergency: "CONFIRM EMERGENCY?",
    sosSubtitle: "Press in case of immediate assistance",
    sosConfirmSubtitle: "Tap again immediately to alert contacts",
    alertBtn: "ALERT",
    yesAlertBtn: "YES, ALERT!",
    patientSafetyStatus: "Patient Safety Status",
    noActiveAlerts: "Currently monitoring senior. No active alerts.",
    
    // Medicine Tab
    medicinesSchedule: "Medicine Schedule",
    routineMeds: "Routine Medicines",
    asNeededMeds: "Emergency & As-Needed",
    prescribeMed: "Prescribe Medicine",
    takeNow: "Take Now",
    taken: "Taken",
    stock: "Stock",
    editStock: "Edit Stock",
    
    // Appointments
    bookAppointment: "Book Appointment",
    doctorName: "Doctor Name",
    specialization: "Specialization",
    date: "Date",
    time: "Time",
    reason: "Reason",
    submitBooking: "Submit Booking",
    pendingRequests: "Pending Requests",
    confirm: "Confirm",
    reject: "Reject",
    
    // AI Assistant - General & Senior
    aiTitle: "Sushruta Mitra - Senior Companion",
    aiSubtitle: "Your loving, patient companion for health and heartfelt conversation",
    aiPlaceholder: "Ask anything about your health, feelings, or medicines...",
    aiListening: "Listening... speak now",
    aiTypeOrSpeak: "Type or use the microphone to talk",
    readAloud: "Listen",
    stopReading: "Stop",
    chipMeds: "💊 Review my today's medicines",
    chipEmotional: "💛 I feel lonely / want emotional comfort",
    chipBP: "📊 Explain my Blood Pressure reading",
    chipDiet: "🥗 Gentle diet & hydration advice",

    // AI Assistant - Caretaker Specialization
    aiTitleCaretaker: "Sushruta Mitra - Caregiver Partner",
    aiSubtitleCaretaker: "Specialized guidance for senior care, challenging behaviors & caregiver wellbeing",
    aiPlaceholderCaretaker: "Ask about senior behaviors, burnout, medicine refusal, or safe transfers...",
    chipCaretakerUnkind: "🤝 Senior is angry or refusing medicines",
    chipCaretakerBurnout: "💆 Caregiver burnout & emotional support",
    chipCaretakerSBAR: "📋 How to report patient symptoms to doctor",
    chipCaretakerSafety: "🛡️ Safe physical transfer & fall prevention",

    // AI Assistant - Doctor Specialization
    aiTitleDoctor: "Sushruta Clinical AI - Physician Copilot",
    aiSubtitleDoctor: "Evidence-based geriatric pharmacotherapy, drug interactions & triage",
    aiPlaceholderDoctor: "Inquire about Beers criteria, polypharmacy, renal dosing, or SBAR notes...",
    chipDoctorInteractions: "💊 Geriatric Drug Interactions & Beers Criteria",
    chipDoctorHTN: "🩺 Isolated Systolic HTN in elderly protocol",
    chipDoctorDelirium: "🧠 Delirium vs Dementia clinical assessment",
    chipDoctorSBAR: "📝 Draft an SBAR clinical transition note",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    loading: "Loading...",
  },
  
  hi: {
    // App Branding
    appName: "सुश्रुत",
    tagline: "प्राचीन ज्ञान, आधुनिक देखभाल",
    activeUser: "सक्रिय उपयोगकर्ता",
    cloudOnline: "क्लाउड सर्वर कनेक्टेड",
    localMode: "लोकल ऑफलाइन मोड",
    
    // Navigation
    navDashboard: "डैशबोर्ड",
    navAssistant: "एआई सहायक",
    navGPS: "लाइव लोकेशन",
    navMeds: "दवाइयां",
    navWellness: "स्वास्थ्य और आहार",
    navJoy: "मानसिक व भावनात्मक स्वास्थ्य",
    navReports: "मेडिकल रिपोर्ट्स",
    navAppointments: "डॉक्टर अपॉइंटमेंट",
    navPatientRequests: "मरीज अनुरोध",
    navInsurance: "बीमा / इन्शुरन्स",
    navShop: "दवाइयां खरीदें",
    navGov: "सरकारी योजनाएं",
    navProfile: "मेरी प्रोफाइल",
    logout: "लॉग आउट",
    
    // Auth
    welcomeBack: "पुनः स्वागत है",
    accessDashboard: "अपने स्वास्थ्य डैशबोर्ड में प्रवेश करें",
    mobileNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    loginBtn: "लॉग इन करें",
    newToSushruta: "सुश्रुत पर नए हैं?",
    createAccount: "खाता बनाएं",
    chooseProfile: "अपनी भूमिका चुनें",
    seniorCitizen: "वरिष्ठ नागरिक (सीनियर)",
    seniorDesc: "मैं अपना स्वास्थ्य प्रबंधित करना चाहता हूँ।",
    caretaker: "देखभालकर्ता (केयरटेकर)",
    caretakerDesc: "मैं किसी वरिष्ठ नागरिक की देखभाल कर रहा हूँ।",
    doctor: "चिकित्सक (डॉक्टर)",
    doctorDesc: "मैं एक प्रमाणित डॉक्टर हूँ।",
    fullName: "पूरा नाम",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    signUpBtn: "पंजीकरण करें",
    alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
    quickDemoAccess: "एक-क्लिक डेमो लॉगिन",
    
    // Dashboard & Vitals
    dailyHealthScore: "दैनिक स्वास्थ्य स्कोर",
    asPerWHO: "WHO मानकों के अनुसार",
    bp: "रक्तचाप (BP)",
    heartRate: "हृदय गति (Heart Rate)",
    steps: "आज के कदम",
    sleep: "नींद की अवधि",
    exerciseRecorded: "व्यायाम दर्ज किया गया",
    markExerciseDone: "व्यायाम पूर्ण मार्क करें",
    sosEmergency: "आपातकालीन SOS",
    confirmEmergency: "क्या आपातकाल है?",
    sosSubtitle: "तत्काल सहायता के लिए दबाएं",
    sosConfirmSubtitle: "परिजनों को सूचित करने के लिए दोबारा दबाएं",
    alertBtn: "अलर्ट भेजें",
    yesAlertBtn: "हाँ, अलर्ट भेजें!",
    patientSafetyStatus: "मरीज सुरक्षा स्थिति",
    noActiveAlerts: "वरिष्ठ सदस्य सुरक्षित हैं। कोई आपात अलर्ट नहीं।",
    
    // Medicine Tab
    medicinesSchedule: "दवाइयों की समय-सारणी",
    routineMeds: "दैनिक दिनचर्या की दवाइयां",
    asNeededMeds: "आवश्यकता पड़ने पर / आपातकालीन",
    prescribeMed: "दवा का नुस्खा लिखें",
    takeNow: "अभी लें",
    taken: "ली जा चुकी है",
    stock: "शेष गोलियां",
    editStock: "स्टॉक अपडेट करें",
    
    // Appointments
    bookAppointment: "अपॉइंटमेंट बुक करें",
    doctorName: "डॉक्टर का नाम",
    specialization: "विशेषज्ञता",
    date: "तारीख",
    time: "समय",
    reason: "कारण / समस्या",
    submitBooking: "अनुरोध भेजें",
    pendingRequests: "प्रतीक्षारत अनुरोध",
    confirm: "स्वीकार करें",
    reject: "अस्वीकार करें",
    
    // AI Assistant - General & Senior
    aiTitle: "सुश्रुत मित्र - वरिष्ठ साथी",
    aiSubtitle: "आपकी स्वास्थ्य व भावनात्मक देखभाल का सच्चा मित्र",
    aiPlaceholder: "अपने स्वास्थ्य, दवा या मन की बात यहाँ लिखें या बोलें...",
    aiListening: "सुन रहा हूँ... कृपया बोलिए",
    aiTypeOrSpeak: "टाइप करें या माइक से बोलें",
    readAloud: "सुनें",
    stopReading: "रोकें",
    chipMeds: "💊 मेरी आज की दवाइयां बताएं",
    chipEmotional: "💛 मुझे अकेलापन या चिंता लग रही है",
    chipBP: "📊 मेरे ब्लड प्रेशर का अर्थ समझाएं",
    chipDiet: "🥗 वरिष्ठ नागरिकों के लिए हल्का व पौष्टिक आहार",

    // AI Assistant - Caretaker Specialization
    aiTitleCaretaker: "सुश्रुत मित्र - केयरगिवर साथी",
    aiSubtitleCaretaker: "वरिष्ठ देखभाल, कठिन व्यवहार समाधान एवं केयरगिवर मानसिक संबल",
    aiPlaceholderCaretaker: "वरिष्ठ नागरिक के व्यवहार, तनाव, दवा न लेना या देखभाल संबंधित सवाल पूछें...",
    chipCaretakerUnkind: "🤝 वरिष्ठ नागरिक गुस्सा कर रहे हैं या दवा नहीं ले रहे",
    chipCaretakerBurnout: "💆 केयरगिवर तनाव एवं भावनात्मक संबल",
    chipCaretakerSBAR: "📋 डॉक्टर को मरीज के लक्षण कैसे रिपोर्ट करें",
    chipCaretakerSafety: "🛡️ मरीज को सुरक्षित उठाना व गिरने से बचाना",

    // AI Assistant - Doctor Specialization
    aiTitleDoctor: "सुश्रुत क्लिनिकल एआई - फिजिशियन कोपायलट",
    aiSubtitleDoctor: "वृद्धावस्था फार्माकोथेरेपी, ड्रग इंटरैक्शन एवं क्लिनिकल ट्राइएज",
    aiPlaceholderDoctor: "बीयर्स क्राइटेरिया, पॉलीफार्मेसी, रीनल डोज़ या क्लिनिकल नोट्स पूछें...",
    chipDoctorInteractions: "💊 वृद्धावस्था ड्रग इंटरैक्शन एवं बीयर्स क्राइटेरिया",
    chipDoctorHTN: "🩺 बुजुर्गों में आइसोलेटेड सिस्टोलिक बीपी प्रोटोकॉल",
    chipDoctorDelirium: "🧠 डेलिरियम बनाम डिमेंशिया क्लिनिकल मूल्यांकन",
    chipDoctorSBAR: "📝 एसबीएआर (SBAR) क्लिनिकल समरी तैयार करें",
    
    // Common
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    loading: "लोड हो रहा है...",
  },
  
  mr: {
    // App Branding
    appName: "सुश्रुत",
    tagline: "प्राचीन ज्ञान, आधुनिक काळजी",
    activeUser: "सक्रिय वापरकर्ता",
    cloudOnline: "क्लाउड सर्व्हर कनेक्टेड",
    localMode: "लोकल ऑफलाइन मोड",
    
    // Navigation
    navDashboard: "डॅशबोर्ड",
    navAssistant: "एआय सहाय्यक",
    navGPS: "थेट स्थान (GPS)",
    navMeds: "औषधे",
    navWellness: "आरोग्य आणि आहार",
    navJoy: "भावनिक व मानसिक स्वास्थ्य",
    navReports: "वैद्यकीय अहवाल",
    navAppointments: "डॉक्टर भेट",
    navPatientRequests: "रुग्ण विनंत्या",
    navInsurance: "विमा (इन्शुरन्स)",
    navShop: "औषधे खरेदी करा",
    navGov: "शासकीय योजना",
    navProfile: "माझे प्रोफाइल",
    logout: "बाहेर पडा (Logout)",
    
    // Auth
    welcomeBack: "पुन्हा स्वागत आहे",
    accessDashboard: "आरोग्य डॅशबोर्ड उघडा",
    mobileNumber: "मोबाईल नंबर",
    password: "पासवर्ड",
    loginBtn: "लॉग इन करा",
    newToSushruta: "सुश्रुतवर नवीन आहात?",
    createAccount: "नवीन खाते तयार करा",
    chooseProfile: "तुमची भूमिका निवडा",
    seniorCitizen: "ज्येष्ठ नागरिक",
    seniorDesc: "मला माझे आरोग्य व औषधे सांभाळायची आहेत.",
    caretaker: "काळजीवाहक (केअरटेकर)",
    caretakerDesc: "मी ज्येष्ठ नागरिकांची काळजी घेत आहे.",
    doctor: "डॉक्टर",
    doctorDesc: "मी वैद्यकीय व्यावसायिक आहे.",
    fullName: "पूर्ण नाव",
    confirmPassword: "पासवर्ड पुन्हा टाका",
    signUpBtn: "नोंदणी करा",
    alreadyHaveAccount: "आधीपासून खाते आहे का?",
    quickDemoAccess: "एक-क्लिक डेमो प्रवेश",
    
    // Dashboard & Vitals
    dailyHealthScore: "दैनिक आरोग्य गुण (Score)",
    asPerWHO: "WHO मानकांनुसार",
    bp: "रक्तदाब (BP)",
    heartRate: "हृदयाचे ठोके (Pulse)",
    steps: "आजची पावले",
    sleep: "झोपेचा वेळ",
    exerciseRecorded: "व्यायाम नोंदवला गेला",
    markExerciseDone: "व्यायाम पूर्ण चिन्हांकित करा",
    sosEmergency: "तातडीचा SOS",
    confirmEmergency: "आणीबाणी आहे का?",
    sosSubtitle: "तातडीच्या मदतीसाठी दाबा",
    sosConfirmSubtitle: "कुटुंबीयांना कळवण्यासाठी पुन्हा दाबा",
    alertBtn: "अलर्ट पाठवा",
    yesAlertBtn: "होय, तात्काळ मदत पाठवा!",
    patientSafetyStatus: "रुग्ण सुरक्षा स्थिती",
    noActiveAlerts: "सध्या ज्येष्ठ सुरक्षित आहेत. कोणतीही आणीबाणी नाही.",
    
    // Medicine Tab
    medicinesSchedule: "औषधांचे वेळापत्रक",
    routineMeds: "दररोजची औषधे",
    asNeededMeds: "गरज पडल्यास / तातडीची औषधे",
    prescribeMed: "नवीन औषध लिहा",
    takeNow: "आत्ता घ्या",
    taken: "घेतले",
    stock: "शिल्लक गोळ्या",
    editStock: "साठा अद्ययावत करा",
    
    // Appointments
    bookAppointment: "भेट बुक करा",
    doctorName: "डॉक्टरांचे नाव",
    specialization: "तज्ज्ञता",
    date: "दिनांक",
    time: "वेळ",
    reason: "तक्रार / कारण",
    submitBooking: "विनंती पाठवा",
    pendingRequests: "प्रलंबित विनंत्या",
    confirm: "मंजूर करा",
    reject: "नाकारा",
    
    // AI Assistant - General & Senior
    aiTitle: "सुश्रुत मित्र - ज्येष्ठ साथीदार",
    aiSubtitle: "तुमचा प्रेमळ आरोग्य व भावनिक मार्गदर्शक",
    aiPlaceholder: "तुमचे आरोग्य, औषधे किंवा मनातील भावना येथे बोला किंवा लिहा...",
    aiListening: "ऐकत आहे... कृपया बोला",
    aiTypeOrSpeak: "टाइप करा किंवा माइकने बोला",
    readAloud: "ऐका",
    stopReading: "थांबवा",
    chipMeds: "💊 माझी आजची औषधे तपासा",
    chipEmotional: "💛 मला एकटेपणा किंवा चिंता वाटतेय",
    chipBP: "📊 माझ्या ब्लड प्रेशरचा अर्थ काय आहे?",
    chipDiet: "🥗 ज्येष्ठ नागरिकांसाठी हलका व पौष्टिक आहार",

    // AI Assistant - Caretaker Specialization
    aiTitleCaretaker: "सुश्रुत मित्र - केअरटेकर मार्गदर्शक",
    aiSubtitleCaretaker: "ज्येष्ठांची काळजी, कठीण वागणूक हाताळणी व केअरटेकर भावनिक आधार",
    aiPlaceholderCaretaker: "ज्येष्ठांचा स्वभाव, केअरटेकर ताण, औषध न घेणे याबद्दल विचारा...",
    chipCaretakerUnkind: "🤝 ज्येष्ठ व्यक्ती रागावत आहेत किंवा औषध घेत नाहीत",
    chipCaretakerBurnout: "💆 केअरटेकर थकवा व भावनिक आधार",
    chipCaretakerSBAR: "📋 डॉक्टरांना रुग्णाची लक्षणे कशी सांगायची",
    chipCaretakerSafety: "🛡️ रुग्णाला सुरक्षित उचलणे व तोल जाण्यापासून रोखणे",

    // AI Assistant - Doctor Specialization
    aiTitleDoctor: "सुश्रुत क्लिनिकल एआय - फिजिशियन साथी",
    aiSubtitleDoctor: "वृद्धावस्था औषधोपचार, औषधी परस्परसंवाद व क्लिनिकल ट्राइएज",
    aiPlaceholderDoctor: "बीयर्स निकष, पॉलीफार्मसी, रेनल डोस किंवा क्लिनिकल नोटबद्दल विचारा...",
    chipDoctorInteractions: "💊 ज्येष्ठ रुग्णांमधील औषध परस्परसंवाद (Beers Criteria)",
    chipDoctorHTN: "🩺 वृद्धांमधील सिस्टोलिक बीपी उपचार प्रोटोकॉल",
    chipDoctorDelirium: "🧠 डेलिरियम विरूद्ध डिमेंशिया क्लिनिकल तपासणी",
    chipDoctorSBAR: "📝 SBAR क्लिनिकल समरी तयार करा",
    
    // Common
    save: "जतन करा",
    cancel: "रद्द करा",
    delete: "हटवा",
    loading: "लोड होत आहे...",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('sushruta_language') || 'en';
  });

  const setLanguage = (lang) => {
    if (['en', 'hi', 'mr'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('sushruta_language', lang);
    }
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
