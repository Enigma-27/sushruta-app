import React from 'react';

const GovernmentSchemesTab = () => {
  const schemes = [
    {
      id: 'pmjay',
      name: "Ayushman Bharat",
      fullName: "Pradhan Mantri Jan Arogya Yojana",
      desc: "The world's largest health insurance assurance scheme. Get cashless treatment up to ₹5 Lakhs per family per year.",
      url: "https://pmjay.gov.in/",
      icon: "ph-shield-check",
      // Gold/Premium Theme
      theme: "from-yellow-50 to-amber-100 border-amber-200",
      accent: "text-amber-700 bg-amber-200/50",
      badge: "₹5 Lakh Coverage"
    },
    {
      id: 'esanjeevani',
      name: "eSanjeevani OPD",
      fullName: "National Teleconsultation Service",
      desc: "Connect with doctors via live video call from home. Completely free service by the Ministry of Health.",
      url: "https://esanjeevani.mohfw.gov.in/",
      icon: "ph-video-camera",
      // Digital/Tech Theme
      theme: "from-fuchsia-50 to-purple-100 border-purple-200",
      accent: "text-purple-700 bg-purple-200/50",
      badge: "Free Video Consult",
      pulse: true
    },
    {
      id: 'abha',
      name: "ABHA Health ID",
      fullName: "Ayushman Bharat Health Account",
      desc: "Create your unique 14-digit Health ID. Store prescriptions, reports, and diagnoses digitally in one secure place.",
      url: "https://abha.abdm.gov.in/",
      icon: "ph-fingerprint",
      // Security/ID Theme
      theme: "from-cyan-50 to-blue-100 border-blue-200",
      accent: "text-blue-700 bg-blue-200/50",
      badge: "Digital Health Card"
    },
    {
      id: 'pmbjp',
      name: "Jan Aushadhi Kendra",
      fullName: "PM Bhartiya Janaushadhi Pariyojana",
      desc: "Purchase high-quality generic medicines at 50% to 90% lower prices than branded alternatives.",
      url: "https://janaushadhi.gov.in/",
      icon: "ph-pill",
      // Medical/Green Theme
      theme: "from-emerald-50 to-teal-100 border-teal-200",
      accent: "text-teal-700 bg-teal-200/50",
      badge: "Save 90% Costs"
    },
    {
      id: 'rvy',
      name: "Rashtriya Vayoshri",
      fullName: "Assisted Living Devices Scheme",
      desc: "Free physical aids (wheelchairs, hearing aids, spectacles, walking sticks) for senior citizens belonging to BPL category.",
      url: "https://disabilityaffairs.gov.in/content/page/rashtriya-vayoshri-yojana.php",
      icon: "ph-person-simple-walk",
      // Welfare/Orange Theme
      theme: "from-orange-50 to-red-100 border-red-200",
      accent: "text-red-700 bg-red-200/50",
      badge: "Free Walking Aids"
    },
    {
      id: 'nsap', 
      name: "Old Age Pension",
      fullName: "National Social Assistance Programme",
      desc: "Monthly pension scheme for senior citizens (Indira Gandhi National Old Age Pension Scheme) to ensure financial protection.",
      url: "https://nsap.nic.in/",
      icon: "ph-bank", 
      // Welfare/Orange Theme
      theme: "from-orange-50 to-red-100 border-red-200",
      accent: "text-red-700 bg-red-200/50",
      badge: "Monthly Pension"
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
      
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="h-10 w-auto opacity-90" alt="Emblem" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Government Benefits</h1>
            <p className="text-slate-500 font-medium">Official welfare schemes & digital services</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-3 text-xs md:text-sm text-blue-800 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <i className="ph-fill ph-info text-xl shrink-0"></i>
        <span>Links direct to <strong>official .gov.in</strong> portals. Please check eligibility before applying.</span>
      </div>

      {/* Innovative Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <a 
            key={scheme.id}
            href={scheme.url}
            target="_blank" 
            rel="noopener noreferrer"
            className={`group relative bg-gradient-to-br ${scheme.theme} p-1 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
          >
            <div className="bg-white/60 backdrop-blur-xl h-full w-full rounded-[20px] p-6 flex flex-col relative overflow-hidden">
              
              {/* Decorative Background Icon */}
              <i className={`ph-fill ${scheme.icon} absolute -bottom-6 -right-6 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500`}></i>

              {/* Top Section */}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${scheme.accent}`}>
                  <i className={`ph-fill ${scheme.icon} ${scheme.pulse ? 'animate-pulse' : ''}`}></i>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${scheme.accent}`}>
                  {scheme.pulse && <span className="w-1.5 h-1.5 bg-current rounded-full animate-ping"></span>}
                  {scheme.badge}
                </span>
              </div>

              {/* Content Section */}
              <div className="mb-6 relative z-10">
                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">
                  {scheme.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {scheme.fullName}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {scheme.desc}
                </p>
              </div>

              {/* Bottom Button */}
              <div className="mt-auto flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                <span className="border-b-2 border-transparent group-hover:border-blue-600">Open Official Portal</span>
                <i className="ph-bold ph-arrow-up-right transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
              </div>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
};

export default GovernmentSchemesTab;