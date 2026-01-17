import React, { useState } from 'react';

const RightPanel = ({ reminders = [], isOpen, closeMenu, onAddReminder, onDeleteReminder }) => {
  // Responsive Classes
  const classes = isOpen
    ? "absolute inset-y-0 right-0 z-40 w-80 bg-white border-l shadow-2xl transform translate-x-0 transition-transform duration-300"
    : "absolute inset-y-0 right-0 z-40 w-80 bg-white border-l shadow-xl transform translate-x-full transition-transform duration-300 lg:static lg:translate-x-0";

  // State for Calendar & Form
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [newEvent, setNewEvent] = useState('');
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [selectedReminderId, setSelectedReminderId] = useState(null);

  // Time Utility
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  };

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const startDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  // Create array for calendar grid
  const totalSlots = [...Array(startDay).fill(null), ...[...Array(daysInMonth)].map((_, i) => i + 1)];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const monthName = now.toLocaleString('default', { month: 'long' });

  // Filtering Logic
  const daysReminders = reminders.filter(r => r.day === selectedDay);
  const waterReminders = daysReminders.filter(r => r.text === "Drink Water");
  const otherReminders = daysReminders.filter(r => r.text !== "Drink Water");

  // Show upcoming water reminder
  let nextWaterReminder = null;
  if (selectedDay === now.getDate()) {
    nextWaterReminder = waterReminders.find(r => parseTime(r.time) > currentMinutes && !r.completed);
  } else if (selectedDay > now.getDate()) {
    nextWaterReminder = waterReminders[0];
  }

  // Combine lists
  let filteredReminders = [...otherReminders];
  if (nextWaterReminder) {
    filteredReminders.push(nextWaterReminder);
  }

  // Sort by time
  filteredReminders.sort((a, b) => {
    if (a.completed === b.completed) {
      return parseTime(a.time) - parseTime(b.time);
    }
    return a.completed ? 1 : -1;
  });

  const handleAdd = () => {
    if (newEvent && hour && minute) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
      onAddReminder(newEvent, timeStr, selectedDay);
      setNewEvent('');
    }
  };

  const handleDelete = () => {
    if (selectedReminderId) {
      onDeleteReminder(selectedReminderId);
      setSelectedReminderId(null);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div onClick={closeMenu} className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"></div>}
      
      <aside className={classes + " flex flex-col h-full"}>
        {/* Mobile Header for Panel */}
        <div className="p-4 border-b flex justify-between items-center lg:hidden">
          <h3 className="font-bold text-slate-800">Schedule</h3>
          <button onClick={closeMenu}><i className="ph-bold ph-x text-xl"></i></button>
        </div>

        <div className="p-6 overflow-y-auto h-full space-y-6">
          
          {/* Calendar Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <i className="ph-bold ph-calendar-blank text-blue-600"></i>
                {monthName} {now.getFullYear()}
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Today: {now.getDate()}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d}>{d}</span>)}
              {totalSlots.map((d, i) => {
                if (d === null) return <span key={i}></span>;
                const isSelected = d === selectedDay;
                const isToday = d === now.getDate();
                return (
                  <span
                    key={i}
                    onClick={() => setSelectedDay(d)}
                    className={`p-2 rounded-lg cursor-pointer transition relative
                      ${isSelected ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-slate-100'}
                      ${isToday && !isSelected ? 'text-blue-600 font-bold border border-blue-200' : ''}
                    `}
                  >
                    {d}
                    {isToday && !isSelected && <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ADD REMINDER FORM */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-600 mb-2">Create Reminder for Day {selectedDay}</h4>
            <div className="space-y-4">
              <div className="relative">
                <i className="ph-bold ph-pencil-simple absolute left-3 top-3 text-slate-400"></i>
                <input
                  value={newEvent}
                  onChange={e => setNewEvent(e.target.value)}
                  placeholder="Task Name (e.g. Yoga)"
                  className="w-full pl-10 p-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={hour}
                  onChange={e => setHour(e.target.value)}
                  placeholder="HH"
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2 px-3 rounded-xl outline-none focus:border-blue-500 text-center no-spinner"
                  maxLength="2"
                />
                <span className="text-slate-400 font-bold">:</span>
                <input
                  type="number"
                  value={minute}
                  onChange={e => setMinute(e.target.value)}
                  placeholder="MM"
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2 px-3 rounded-xl outline-none focus:border-blue-500 text-center no-spinner"
                  maxLength="2"
                />
                <div className="flex bg-slate-200 rounded-xl p-1 gap-1">
                  <button onClick={() => setPeriod('AM')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'AM' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>AM</button>
                  <button onClick={() => setPeriod('PM')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'PM' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>PM</button>
                </div>
              </div>
              <button onClick={handleAdd} className="w-full bg-blue-900 text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-800 transition flex justify-center items-center gap-2">
                Add to Schedule <i className="ph-bold ph-plus"></i>
              </button>
            </div>
          </div>

          {/* Reminder List */}
          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><i className="ph-fill ph-bell-ringing"></i> Schedule ({selectedDay}th)</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scroll pr-2">
              {filteredReminders.map((r, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedReminderId(r.id === selectedReminderId ? null : r.id)}
                  className={`flex gap-3 bg-white p-3 rounded-xl shadow-sm border items-center fade-in cursor-pointer transition-all
                      ${r.completed ? 'opacity-50 border-slate-100 bg-slate-50' : 'border-slate-100'}
                      ${r.id === selectedReminderId ? 'ring-2 ring-red-400 bg-red-50' : 'hover:border-blue-200'}
                  `}
                >
                  <div className={`p-2 rounded-full ${r.completed ? 'bg-green-100 text-green-600' : (r.text === "Drink Water" ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-600')}`}>
                    <i className={`ph-bold ${r.completed ? 'ph-check' : (r.text === "Drink Water" ? 'ph-drop' : 'ph-clock')}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${r.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{r.text}</p>
                    <p className="text-xs text-slate-500">{r.time}</p>
                  </div>
                  {r.id === selectedReminderId && <i className="ph-bold ph-check-circle text-red-500 text-xl"></i>}
                </div>
              ))}
              {filteredReminders.length === 0 && <p className="text-xs text-center text-slate-400">No reminders for this day</p>}
            </div>
            {selectedReminderId && (
              <button
                onClick={handleDelete}
                className="w-full mt-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition flex items-center justify-center gap-2 fade-in"
              >
                <i className="ph-bold ph-trash"></i> Delete Selected
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default RightPanel;