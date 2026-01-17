import React, { useState, useRef } from 'react';
import { MockBackend } from '../../services/mockBackend';

const InsuranceTab = ({ data, refreshData }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Ensure insuranceDocs array exists
  const myPolicies = data.insuranceDocs || [];

  // --- FILE UPLOAD LOGIC (Safe Mode < 500KB) ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit file size to prevent LocalStorage quota exceeded errors
    if (file.size > 500000) {
      alert("⚠️ File too large! Please upload a file smaller than 500KB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString(),
        content: event.target.result, // Data URL (Base64)
        type: file.type.includes('image') ? 'Image' : 'PDF'
      };

      const currentData = MockBackend.getData();
      const updatedDocs = [newDoc, ...(currentData.insuranceDocs || [])];
      MockBackend.updateData({ ...currentData, insuranceDocs: updatedDocs });
      
      setUploading(false);
      refreshData();
      alert("Policy Document Saved!");
    };
    reader.readAsDataURL(file);
  };

  const deletePolicy = (id) => {
    if(confirm("Delete this document permanently?")) {
      const currentData = MockBackend.getData();
      const updatedDocs = currentData.insuranceDocs.filter(d => d.id !== id);
      MockBackend.updateData({ ...currentData, insuranceDocs: updatedDocs });
      refreshData();
    }
  };

  // --- PRIVATE INSURERS LINKS ---
  const insurers = [
    { name: "Star Health", url: "https://www.starhealth.in/", color: "bg-blue-50 text-blue-700 border-blue-200", icon: "ph-star" },
    { name: "HDFC Ergo", url: "https://www.hdfcergo.com/health-insurance", color: "bg-red-50 text-red-700 border-red-200", icon: "ph-shield" },
    { name: "Niva Bupa", url: "https://www.nivabupa.com/", color: "bg-green-50 text-green-700 border-green-200", icon: "ph-first-aid" },
    { name: "ICICI Lombard", url: "https://www.icicilombard.com/health-insurance", color: "bg-purple-50 text-purple-700 border-purple-200", icon: "ph-umbrella" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <i className="ph-fill ph-file-lock text-3xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Insurance Vault</h1>
          <p className="text-slate-500">Secure your policies & access benefits</p>
        </div>
      </div>

      {/* 1. MY POLICY UPLOAD SECTION */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <i className="ph-fill ph-files text-indigo-500"></i> My Policies
          </h3>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <i className="ph-bold ph-upload-simple"></i> Upload Policy
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
          />
        </div>

        {uploading && <div className="text-center text-sm text-indigo-500 animate-pulse mb-4">Uploading secure document...</div>}

        {/* LIST OF UPLOADED POLICIES */}
        <div className="grid gap-3">
          {myPolicies.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <i className="ph-duotone ph-file-plus text-3xl text-slate-400 mb-2"></i>
              <p className="text-sm text-slate-500">No policies uploaded yet.<br/>Keep your documents safe here.</p>
            </div>
          ) : (
            myPolicies.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-md transition group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm">
                    <i className={`ph-fill ${doc.type === 'Image' ? 'ph-image' : 'ph-file-pdf'}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">{doc.name}</h4>
                    <p className="text-xs text-slate-400">Added: {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.type === 'Image' && (
                    <a href={doc.content} download={doc.name} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-blue-500 shadow-sm hover:bg-blue-50 transition" title="Download">
                      <i className="ph-bold ph-download-simple"></i>
                    </a>
                  )}
                  <button onClick={() => deletePolicy(doc.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-400 shadow-sm hover:bg-red-50 transition" title="Delete">
                    <i className="ph-bold ph-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. PMJAY HERO CARD (GOLD) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-50 to-amber-100 border border-amber-200 p-1 shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        
        <div className="bg-white/40 backdrop-blur-md rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-200/50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-amber-300/50">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Government Scheme
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Ayushman Bharat (PM-JAY)</h2>
            <p className="text-slate-600 mb-6 font-medium">
              Get cashless treatment up to <span className="text-amber-700 font-black text-lg">₹5 Lakhs</span> per family per year for secondary and tertiary care hospitalization.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="https://pmjay.gov.in/" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition flex items-center gap-2">
                Check Eligibility <i className="ph-bold ph-arrow-up-right"></i>
              </a>
              <a href="https://beneficiary.nha.gov.in/" target="_blank" rel="noopener noreferrer" className="bg-white text-slate-800 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-amber-50 transition border border-amber-200">
                Download Card
              </a>
            </div>
          </div>
          
          {/* Decorative Badge */}
          <div className="w-40 h-40 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex flex-col items-center justify-center text-white shadow-xl border-4 border-white/50 shrink-0 rotate-3 hover:rotate-0 transition-transform">
            <span className="text-sm font-bold opacity-90">Cover</span>
            <span className="text-4xl font-black">₹5L</span>
            <span className="text-xs font-bold bg-black/20 px-2 py-0.5 rounded mt-1">FREE</span>
          </div>
        </div>
      </div>

      {/* 3. TOP PROVIDERS GRID */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><i className="ph-fill ph-shield-check"></i></span>
            Trusted Partners
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Links</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {insurers.map((ins) => (
            <a 
              key={ins.name} 
              href={ins.url} 
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative p-6 rounded-[24px] border border-white/50 bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between h-48`}
            >
              {/* Decorative Background Blob */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500 ${ins.color.replace('text-', 'bg-').split(' ')[1]}`}></div>

              {/* Icon & Badge */}
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${ins.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`ph-fill ${ins.icon}`}></i>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <i className="ph-bold ph-arrow-up-right"></i>
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10">
                <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-indigo-900 transition-colors">{ins.name}</h4>
                <p className="text-xs text-slate-400 font-medium group-hover:text-slate-500 flex items-center gap-1">
                  Official Portal 
                  <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 inline-flex"><i className="ph-bold ph-arrow-right ml-1"></i></span>
                </p>
              </div>
              
              {/* Bottom Stripe */}
              <div className={`absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${ins.color.replace('text-', 'bg-').split(' ')[1]}`}></div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default InsuranceTab;