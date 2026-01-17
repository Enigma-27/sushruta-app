import React, { useEffect, useState } from 'react';

const Toast = ({ msg, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (msg) {
      setVisible(true);
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose(); // Optional callback to clear state in parent
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg, onClose]);

  if (!visible || !msg) return null;

  // Determine styles based on type ('success' or 'error')
  const bgColors = type === 'error' ? 'bg-red-500' : 'bg-emerald-600';
  const iconClass = type === 'error' ? 'ph-warning-circle' : 'ph-check-circle';

  return (
    <div className={`fixed top-6 right-6 ${bgColors} text-white px-6 py-4 rounded-xl shadow-2xl z-[70] animate-fade-in flex items-center gap-3 border border-white/20`}>
      <i className={`ph-bold ${iconClass} text-xl`}></i>
      <span className="font-medium">{msg}</span>
    </div>
  );
};

export default Toast;