import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 

const ChartModal = ({ type, history, currentVal, close }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const labels = [];
      for (let i = 6; i > 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
      }
      labels.push("Today");

      const cleanHistory = history.map(h => Number(h) || 0);
      const finalVal = Number(currentVal) || 0;
      const finalData = [...cleanHistory, finalVal];
      const maxValue = Math.max(...finalData);
      const suggestedMax = maxValue + (maxValue * 0.2);

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: type,
            data: finalData,
            borderColor: type.includes('Heart') ? '#EF4444' : type.includes('Sleep') ? '#8B5CF6' : '#0F766E',
            backgroundColor: type.includes('Heart') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 118, 110, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, suggestedMax: suggestedMax }
          }
        }
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [type, history, currentVal]);

  return (
    <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative animate-slide-up shadow-2xl">
        <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <i className="ph-bold ph-x text-xl"></i>
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">{type} History</h3>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartModal;