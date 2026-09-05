import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = ({ variant = 'default' }) => {
  const { language, setLanguage } = useLanguage();

  const options = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'mr', label: 'मराठी', short: 'MR' }
  ];

  if (variant === 'pills') {
    return (
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {options.map(opt => (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              language === opt.code
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  // Default compact dropdown
  return (
    <div className="relative inline-flex items-center">
      <i className="ph-bold ph-translate text-slate-400 absolute left-2 pointer-events-none text-sm"></i>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="pl-7 pr-2 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg outline-none cursor-pointer transition"
      >
        <option value="en">English (EN)</option>
        <option value="hi">हिन्दी (HI)</option>
        <option value="mr">मराठी (MR)</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
