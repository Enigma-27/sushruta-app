import React, { useState } from 'react';
import { MockBackend } from '../../services/mockBackend';

const MedicineTab = ({ data, refreshData, userRole }) => {
  // 1. Role Logic
  const role = (userRole || 'senior').toLowerCase();
  const isDoctor = role === 'doctor';
  const isCaretaker = role === 'caretaker';
  const isSenior = !isDoctor && !isCaretaker;

  // Senior & Caretaker can mark meds as taken
  const canTakeMed = isSenior || isCaretaker; 

  // 2. State
  const [isAdding, setIsAdding] = useState(false); // Doctor Modal
  const [editingMed, setEditingMed] = useState(null); // Caretaker Modal
  
  // Doctor Form State
  const [newMed, setNewMed] = useState({
    name: '',
    dose: '', 
    instructions: '', 
    time: '', 
    category: 'Daily Routine'
  });

  // --- HANDLERS ---

  // Doctor: Add New Medicine
  const handleAddMed = () => {
    if (!newMed.name || !newMed.dose) return alert("Please enter Name and Dosage");
    
    const newEntry = {
      id: Date.now(),
      name: newMed.name,
      dose: newMed.dose,
      instructions: newMed.instructions,
      schedule: newMed.time,
      category: newMed.category,
      taken: false,
      stock: 0,
      expiry: 'N/A',
      type: newMed.dose.toLowerCase().includes('ml') ? 'Syrup' : 'Tablet'
    };

    const updatedMeds = [...data.meds, newEntry];
    MockBackend.updateData({ ...data, meds: updatedMeds });
    refreshData();
    setIsAdding(false);
    setNewMed({ name: '', dose: '', instructions: '', time: '', category: 'Daily Routine' });
  };

  // Caretaker: Update Stock
  const handleUpdateStock = () => {
    if (!editingMed) return;
    
    // Get values directly from DOM for simplicity in this modal structure
    const stockVal = document.getElementById('edit-stock').value;
    const expiryVal = document.getElementById('edit-expiry').value;

    const updatedMeds = data.meds.map(m => {
      if (m.id === editingMed.id) {
        return { ...m, stock: parseInt(stockVal), expiry: expiryVal };
      }
      return m;
    });

    MockBackend.updateData({ ...data, meds: updatedMeds });
    refreshData();
    setEditingMed(null);
  };

  // Senior & Caretaker: Take Medicine
  const toggleMed = (id) => {
    const newMeds = data.meds.map(m => {
      if (m.id === id) {
        const isTaking = !m.taken;
        // Decrease stock if taking, increase if untaking (undo)
        const newStock = typeof m.stock === 'number' 
          ? (isTaking ? m.stock - 1 : m.stock + 1) 
          : m.stock;
        return { ...m, taken: isTaking, stock: newStock };
      }
      return m;
    });
    MockBackend.updateData({ ...data, meds: newMeds });
    refreshData();
  };

  const dailyMeds = data.meds.filter(m => m.category === 'Daily Routine').sort((a, b) => a.taken - b.taken);
  const sosMeds = data.meds.filter(m => m.category === 'As Needed').sort((a, b) => a.taken - b.taken);

  // --- SINGLE CARD COMPONENT ---
  const MedCard = ({ m, type }) => (
    <div 
      key={m.id} 
      // Caretaker Click body to Edit (Inventory)
      onClick={() => isCaretaker && setEditingMed(m)}
      className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-2xl transition-all gap-4 bg-white shadow-sm
        ${isCaretaker ? 'cursor-pointer hover:border-blue-400 hover:shadow-md' : 'hover:border-amber-200'}
      `}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className={`p-3 rounded-full shrink-0 ${m.taken ? 'bg-slate-100 text-slate-400' : (type === 'sos' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}`}>
          <i className={`ph-fill ${m.type === 'Syrup' ? 'ph-drop' : 'ph-pill'} text-xl`}></i>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className={`font-bold text-lg truncate ${m.taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            {m.name}
          </h4>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1 items-center">
            <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{m.dose}</span>
            {m.schedule && <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{m.schedule}</span>}
            
            <span className={`${type === 'sos' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} px-2 py-0.5 rounded font-bold`}>
              {m.instructions || (type === 'sos' ? 'Emergency' : 'Routine')}
            </span>
            
            {(typeof m.stock === 'number' || m.stock === 0) && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.stock < 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                Stock: {m.stock}
              </span>
            )}
            {m.expiry && (
              <span className="text-slate-400 text-[10px] font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                Exp: {m.expiry}
              </span>
            )}
            {isCaretaker && <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded"><i className="ph-bold ph-pencil-simple"></i> Edit Stock</span>}
          </div>
        </div>
      </div>
      
      {/* BUTTON: VISIBLE FOR SENIOR AND CARETAKER */}
      {canTakeMed && (
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMed(m.id); }} 
          className={`w-full md:w-auto px-8 py-3 md:py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm 
          ${m.taken 
            ? 'bg-slate-100 text-slate-400 cursor-default' 
            : (type === 'sos' 
              ? 'bg-white border-2 border-red-500 text-red-600 hover:bg-red-50' 
              : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200'
            )
          }`}
        >
          {m.taken ? (
            <span className="flex items-center justify-center gap-2"><i className="ph-bold ph-check-circle"></i> Taken</span>
          ) : (
            type === 'sos' ? 'Record Use' : 'Take Now'
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32 max-w-4xl mx-auto relative">
      
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <i className="ph-fill ph-prescription text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Medicine Cabinet</h1>
            {isDoctor && <p className="text-xs text-blue-600 font-bold">Doctor Mode: Add Prescriptions</p>}
            {isCaretaker && <p className="text-xs text-green-600 font-bold">Caretaker Mode: Manage & Assist</p>}
          </div>
        </div>
        
        {/* DOCTOR: Add Prescription Button */}
        {isDoctor && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-blue-700 flex items-center gap-2"
          >
            <i className="ph-bold ph-plus"></i> Add Rx
          </button>
        )}
      </div>
      
      {/* Daily Routine Section */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg text-slate-600 px-1 flex items-center gap-2">
          <i className="ph-fill ph-sun-horizon text-amber-500"></i> Daily Schedule
        </h3>
        <div className="grid gap-4">
          {dailyMeds.length > 0 ? (
            dailyMeds.map(m => <MedCard m={m} type="daily" key={m.id} />)
          ) : (
            <p className="text-slate-400 italic p-4 text-center">No daily medicines scheduled.</p>
          )}
        </div>
      </section>

      {/* SOS Section */}
      <section className="space-y-4 pt-4">
        <h3 className="font-bold text-lg text-slate-600 px-1 flex items-center gap-2">
          <i className="ph-fill ph-first-aid text-red-500"></i> As Needed / SOS
        </h3>
        <div className="grid gap-4">
          {sosMeds.length > 0 ? (
            sosMeds.map(m => <MedCard m={m} type="sos" key={m.id} />)
          ) : (
            <p className="text-slate-400 italic p-4 text-center">No emergency medicines listed.</p>
          )}
        </div>
      </section>

      {/* --- DOCTOR MODAL: ADD PRESCRIPTION --- */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="ph-bold ph-prescription text-blue-600"></i> Add Prescription
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Medicine Name</label>
                <input 
                  className="w-full border rounded-lg p-2 font-bold text-slate-700 bg-slate-50"
                  placeholder="e.g. Metformin"
                  value={newMed.name}
                  onChange={e => setNewMed({...newMed, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Dosage</label>
                  <input 
                    className="w-full border rounded-lg p-2 bg-slate-50"
                    placeholder="e.g. 500mg / 1 Tab"
                    value={newMed.dose}
                    onChange={e => setNewMed({...newMed, dose: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Timing</label>
                  <select 
                    className="w-full border rounded-lg p-2 bg-slate-50"
                    value={newMed.time}
                    onChange={e => setNewMed({...newMed, time: e.target.value})}
                  >
                    <option value="">Select Time</option>
                    <option value="Before Breakfast">Before Breakfast</option>
                    <option value="After Breakfast">After Breakfast</option>
                    <option value="Before Lunch">Before Lunch</option>
                    <option value="After Lunch">After Lunch</option>
                    <option value="Before Dinner">Before Dinner</option>
                    <option value="After Dinner">After Dinner</option>
                    <option value="Bedtime">Bedtime</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Instructions</label>
                <input 
                  className="w-full border rounded-lg p-2 bg-slate-50"
                  placeholder="e.g. Take with warm water"
                  value={newMed.instructions}
                  onChange={e => setNewMed({...newMed, instructions: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={() => setNewMed({...newMed, category: 'Daily Routine'})}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm ${newMed.category === 'Daily Routine' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >Daily</button>
                  <button 
                    onClick={() => setNewMed({...newMed, category: 'As Needed'})}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm ${newMed.category === 'As Needed' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >SOS / Needed</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Cancel</button>
              <button onClick={handleAddMed} className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">Save Prescription</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CARETAKER MODAL: EDIT STOCK --- */}
      {editingMed && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="ph-bold ph-package text-green-600"></i> Manage Inventory
            </h3>
            <p className="text-sm text-slate-500 font-medium">Updating: <span className="text-slate-800 font-bold">{editingMed.name}</span></p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Current Stock</label>
                <input 
                  type="number"
                  className="w-full border rounded-lg p-3 font-bold text-slate-700 bg-slate-50"
                  defaultValue={editingMed.stock}
                  id="edit-stock"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Expiry Date</label>
                <input 
                  type="text"
                  className="w-full border rounded-lg p-3 font-bold text-slate-700 bg-slate-50"
                  defaultValue={editingMed.expiry}
                  placeholder="e.g. Dec 2025"
                  id="edit-expiry"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingMed(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Cancel</button>
              <button 
                onClick={handleUpdateStock} 
                className="flex-1 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTab;