import React, { useState, useEffect, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  isSunday, addMonths, subMonths, min, max,
  startOfDay, isToday, addYears, subYears
} from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import { 
  Trash2, Plus, X, SunMoon, ChevronLeft, ChevronRight, 
  Image as ImageIcon, Calendar as CalendarIcon
} from 'lucide-react';

const COLORS = [
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Violet', value: '#8b5cf6' },
];

const STORAGE_KEY = 'DIVINE_CALENDAR_V3';

export default function DivineWallCalendar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [theme, setTheme] = useState('light');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1470&auto=format&fit=crop');
  const [notes, setNotes] = useState([]);
  
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNote, setActiveNote] = useState({ text: '', color: COLORS[0].value, type: 'range' });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setNotes(data.notes || []);
      setTheme(data.theme || 'light');
      setHeroImage(data.heroImage || heroImage);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, theme, heroImage }));
    }
  }, [notes, theme, heroImage, isLoaded]);

  const isDark = theme === 'dark';
  const monthKey = format(currentDate, 'yyyy-MM');
  
  const currentMonthNotes = useMemo(() => 
    notes.filter(n => n.monthKey === monthKey).sort((a, b) => a.id - b.id),
  [notes, monthKey]);

  const handleDayInteraction = (day) => {
    const target = startOfDay(day);
    if (!isSelecting) {
      setSelectionStart(target);
      setIsSelecting(true);
    } else {
      const range = [selectionStart, target].sort((a, b) => a - b);
      setActiveNote({ 
        ...activeNote, 
        startDate: format(range[0], 'yyyy-MM-dd'), 
        endDate: format(range[1], 'yyyy-MM-dd'),
        type: 'range'
      });
      setIsModalOpen(true);
      setIsSelecting(false);
      setSelectionStart(null);
    }
  };

  const getDayStatus = (date) => {
    const target = startOfDay(date);
    const today = isToday(target);
    let inSelection = false;
    if (isSelecting && selectionStart && hoverDate) {
      const start = min([selectionStart, hoverDate]);
      const end = max([selectionStart, hoverDate]);
      inSelection = target >= start && target <= end;
    }
    const activeNoteMatch = notes.find(n => 
      n.type === 'range' && 
      target >= startOfDay(new Date(n.startDate)) && 
      target <= startOfDay(new Date(n.endDate))
    );
    return { today, inSelection, activeNoteMatch };
  };

  if (!isLoaded) return null;

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fcfcfc] text-slate-900'} p-4 md:p-10 font-sans flex items-center justify-center`}>
      
      {/* The Core Fix: min-h and max-h applied to the main container. 
        This locks the aspect ratio/size so it NEVER stretches the page.
      */}
      <main className={`relative w-full max-w-[1440px] h-[90vh] min-h-[700px] max-h-[900px] flex flex-col lg:flex-row rounded-[40px] overflow-hidden shadow-2xl border ${isDark ? 'border-white/10 bg-[#0a0a0a]' : 'border-black/5 bg-white'} backdrop-blur-3xl`}>
        
        {/* HERO SECTION */}
        <section className="relative w-full lg:w-[40%] h-[300px] lg:h-full shrink-0 group overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img key={heroImage} src={heroImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full object-cover" />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
          
          {/* HIGH CONTRAST CONTROL CENTER */}
          <div className="absolute top-6 left-6 flex gap-3 z-50">
            <button 
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:bg-black/80 hover:scale-105 transition-all"
            >
              <SunMoon size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Theme</span>
            </button>
            <label className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:bg-black/80 hover:scale-105 transition-all cursor-pointer">
              <ImageIcon size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Change Cover</span>
              <input type="file" className="hidden" onChange={e => e.target.files[0] && setHeroImage(URL.createObjectURL(e.target.files[0]))} />
            </label>
          </div>

          <div className="absolute bottom-12 left-10 text-white pointer-events-none">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{format(currentDate, 'MMM')}</h1>
            <h2 className="text-4xl md:text-6xl font-black opacity-80 uppercase tracking-tighter leading-none">{format(currentDate, 'yyyy')}</h2>
          </div>
        </section>

        {/* CALENDAR & NOTES SECTION */}
        <section className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* CALENDAR PANEL */}
          <div className="flex-1 p-6 lg:p-10 border-b md:border-b-0 md:border-r border-black/5 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div className="flex items-center gap-2">
                 <button onClick={() => {setDirection(-1); setCurrentDate(subMonths(currentDate, 1))}} className="p-3 hover:bg-black/5 rounded-2xl transition-colors"><ChevronLeft size={20}/></button>
                 <span className="text-xl font-black uppercase tracking-widest w-32 text-center">{format(currentDate, 'MMMM')}</span>
                 <button onClick={() => {setDirection(1); setCurrentDate(addMonths(currentDate, 1))}} className="p-3 hover:bg-black/5 rounded-2xl transition-colors"><ChevronRight size={20}/></button>
              </div>
              <div className="flex bg-black/5 p-1.5 rounded-2xl">
                <button onClick={() => setCurrentDate(subYears(currentDate, 1))} className="px-3 py-2 text-[10px] font-black hover:bg-white rounded-xl transition-all shadow-sm">PREV YR</button>
                <button onClick={() => setCurrentDate(addYears(currentDate, 1))} className="px-3 py-2 text-[10px] font-black hover:bg-white rounded-xl transition-all shadow-sm ml-1">NEXT YR</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4 text-center mb-4 shrink-0">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
                <span key={i} className={`text-[10px] md:text-xs font-black opacity-30 uppercase ${i === 6 ? 'text-rose-500' : ''}`}>{d}</span>
              ))}
            </div>

            <div className="flex-1 relative">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={monthKey}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -40 }}
                  className="grid grid-cols-7 gap-2 md:gap-4"
                >
                  {Array.from({ length: getDay(startOfMonth(currentDate)) === 0 ? 6 : getDay(startOfMonth(currentDate)) - 1 }).map((_, i) => <div key={i} />)}
                  {eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) }).map((day) => {
                    const { today, inSelection, activeNoteMatch } = getDayStatus(day);
                    return (
                      <button
                        key={day.toString()}
                        onClick={() => handleDayInteraction(day)}
                        onMouseEnter={() => isSelecting && setHoverDate(day)}
                        className={`
                          relative aspect-square rounded-2xl flex flex-col items-center justify-center text-sm md:text-base font-bold transition-all
                          ${today ? 'ring-2 ring-sky-500 ring-offset-4' : ''}
                          ${inSelection ? 'bg-sky-500 text-white scale-105 shadow-xl shadow-sky-500/30' : ''}
                          ${activeNoteMatch ? 'text-white' : 'hover:bg-black/5'}
                          ${isSunday(day) && !inSelection && !activeNoteMatch ? 'text-rose-500' : ''}
                        `}
                        style={activeNoteMatch ? { backgroundColor: activeNoteMatch.color, boxShadow: `0 8px 16px ${activeNoteMatch.color}44` } : {}}
                      >
                        {format(day, 'd')}
                        {today && <span className="absolute bottom-2 w-1.5 h-1.5 bg-sky-500 rounded-full" />}
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* DYNAMIC NOTES PANEL (STRICT SCROLLING BOUNDARIES) */}
          <div className={`w-full md:w-[380px] flex flex-col h-[400px] lg:h-full shrink-0 ${isDark ? 'bg-white/5' : 'bg-slate-50/50'}`}>
            <div className="p-8 pb-4 flex justify-between items-center shrink-0 border-b border-black/5">
              <h3 className="text-xs font-black tracking-[0.2em] opacity-40 uppercase">Itinerary</h3>
              <button onClick={() => { setActiveNote({ ...activeNote, type: 'month' }); setIsModalOpen(true); }} className="p-2.5 bg-sky-500 text-white rounded-full shadow-lg shadow-sky-500/30 hover:scale-110 transition-transform">
                <Plus size={18} />
              </button>
            </div>

            {/* Sidebar Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {currentMonthNotes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-10">
                    <CalendarIcon size={40} strokeWidth={1.5} />
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest">No entries yet</p>
                  </div>
                ) : (
                  currentMonthNotes.map(note => (
                    <motion.div 
                      key={note.id}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className={`relative flex flex-col p-5 rounded-[20px] border transition-all ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-[20px]" style={{ backgroundColor: note.color }} />
                      
                      <div className="flex justify-between items-start mb-3 pl-2">
                        {note.type === 'range' ? (
                          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-[9px] font-black uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: note.color }} />
                            {format(new Date(note.startDate), 'MMM d')} — {format(new Date(note.endDate), 'd')}
                          </div>
                        ) : (
                          <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Month Goal</div>
                        )}
                        <button onClick={() => setNotes(n => n.filter(x => x.id !== note.id))} className="text-rose-500 opacity-50 hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* INDIVIDUAL NOTE SCROLLING: Stops giant notes from breaking the layout */}
                      <div className="pl-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                        <p className={`text-sm leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {note.text}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }} className={`w-full max-w-lg rounded-[40px] ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'} shadow-2xl p-8`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Add Note</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X/></button>
              </div>
              <textarea 
                className={`w-full p-5 rounded-[24px] border h-40 outline-none focus:ring-4 ring-sky-500/10 mb-6 transition-all resize-none custom-scrollbar ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-black/5'}`}
                placeholder="Write your plans here..."
                value={activeNote.text}
                onChange={e => setActiveNote({...activeNote, text: e.target.value})}
              />
              <div className="flex gap-3 mb-8">
                {COLORS.map(c => (
                  <button key={c.value} onClick={() => setActiveNote({...activeNote, color: c.value})} className={`w-8 h-8 rounded-full transition-transform ${activeNote.color === c.value ? 'scale-125 ring-4 ring-sky-500/20' : 'hover:scale-110'}`} style={{ backgroundColor: c.value }} />
                ))}
              </div>
              <button onClick={() => { setNotes([...notes, { ...activeNote, id: Date.now(), monthKey }]); setIsModalOpen(false); setActiveNote({ text: '', color: COLORS[0].value, type: 'range' }); }} className="w-full py-4 bg-sky-500 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-sky-500/30">Save Note</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.3); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150, 150, 150, 0.5); }
      `}</style>
    </div>
  );
}
