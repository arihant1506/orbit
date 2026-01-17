import React, { useState, useEffect } from 'react';
import { DailyView } from './components/DailyView';
import { WeeklyReport } from './components/WeeklyReport';
import { INITIAL_SCHEDULE } from './constants';
import { WeekSchedule, ThemeMode, Category } from './types';
import { Radio, Sun, Moon, Laptop, Monitor } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// A short, high-tech "Swoosh/Confirmation" sound effect (Base64 WAV)
const SFX_DATA = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAACQB5AIAO8A7wD/AP8A7wDvAJAAMQA=";

// Background Gradients for Real-Time Tint
const BG_GRADIENTS: Record<Category | 'Default', string> = {
  Physical: 'from-orange-500/20 via-orange-500/5 to-transparent dark:from-orange-500/20 dark:via-orange-900/10',
  Academic: 'from-cyan-500/20 via-cyan-500/5 to-transparent dark:from-cyan-500/20 dark:via-cyan-900/10',
  Coding: 'from-emerald-500/20 via-emerald-500/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-900/10',
  Creative: 'from-fuchsia-500/20 via-fuchsia-500/5 to-transparent dark:from-fuchsia-500/20 dark:via-purple-900/10',
  Rest: 'from-indigo-500/20 via-indigo-500/5 to-transparent dark:from-indigo-500/20 dark:via-indigo-900/10',
  Logistics: 'from-slate-500/20 via-slate-500/5 to-transparent dark:from-slate-500/20 dark:via-slate-900/10',
  Default: 'from-transparent via-transparent to-transparent'
};

const getMinutesFromTime = (timeStr: string): number => {
    // Check for "All Day"
    if(timeStr.toLowerCase().includes('all day')) return -1; 

    const match = timeStr.match(/(\d{1,2}):(\d{2})\s?([AP]M)?/i);
    if (!match) return 0;
    
    let [_, h, m, p] = match;
    let hours = parseInt(h);
    const minutes = parseInt(m);
    const period = p ? p.toUpperCase() : '';

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
};

const App: React.FC = () => {
  // --- STATE ---
  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    const saved = localStorage.getItem('orbit_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; 
  });

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [activeCategory, setActiveCategory] = useState<Category | 'Default'>('Default');
  
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('orbit_theme') as ThemeMode) || 'system';
  });

  const [isClient, setIsClient] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Persist Schedule
  useEffect(() => {
    localStorage.setItem('orbit_schedule', JSON.stringify(schedule));
  }, [schedule]);

  // Handle Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('orbit_theme', theme);
  }, [theme]);

  // Real-time Background Tint Logic
  useEffect(() => {
    const updateActiveCategory = () => {
        const now = new Date();
        const dayIndex = now.getDay();
        const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const realDayName = daysMap[dayIndex];
        
        const daySlots = INITIAL_SCHEDULE[realDayName];
        if (!daySlots) {
            setActiveCategory('Default');
            return;
        }

        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        const foundSlot = daySlots.find(slot => {
            if (slot.timeRange.toLowerCase().includes('all day')) return true;
            
            const parts = slot.timeRange.split('-').map(s => s.trim());
            if (parts.length === 2) {
                const start = getMinutesFromTime(parts[0]);
                let end = getMinutesFromTime(parts[1]);
                
                // Handle midnight crossover logic simplistically or standard ranges
                if (start > end) {
                    // e.g. 11 PM to 1 AM. active if now >= 23:00 OR now < 1:00
                    return currentMinutes >= start || currentMinutes < end;
                }
                return currentMinutes >= start && currentMinutes < end;
            } else if (parts.length === 1) {
                // Single time point (e.g. "Wake up")
                const start = getMinutesFromTime(parts[0]);
                // Assume 30 min duration for single events if not specified, 
                // just to show the color for a bit.
                return currentMinutes >= start && currentMinutes < start + 30; 
            }
            return false;
        });

        setActiveCategory(foundSlot ? foundSlot.category : 'Default');
    };

    updateActiveCategory();
    const interval = setInterval(updateActiveCategory, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);


  // --- HANDLERS ---
  const handleToggleSlot = (day: string, slotId: string) => {
    try {
      const audio = new Audio(SFX_DATA);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio interaction req", e));
    } catch (e) {
      console.error(e);
    }

    setSchedule(prev => {
      const daySlots = prev[day].map(slot => {
        if (slot.id === slotId) {
          return { ...slot, isCompleted: !slot.isCompleted };
        }
        return slot;
      });
      return { ...prev, [day]: daySlots };
    });
  };

  const handleThemeCycle = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const currentDayName = DAYS_OF_WEEK[currentDayIndex];
  const currentSlots = schedule[currentDayName] || [];

  if (!isClient) return null;

  return (
    <div className="relative min-h-screen bg-orbit-lightBg dark:bg-orbit-bg font-sans text-slate-800 dark:text-slate-200 selection:bg-orbit-neonPurple selection:text-white pb-10 transition-colors duration-500 overflow-hidden">
      
      {/* Dynamic Ambient Background Tint */}
      <div 
        className={`fixed inset-0 z-0 pointer-events-none transition-all duration-[2000ms] ease-in-out opacity-60 dark:opacity-40 bg-gradient-to-b ${BG_GRADIENTS[activeCategory]}`}
      />
      {/* Extra glow orb for stronger effect */}
      <div 
        className={`fixed -top-[20%] left-[10%] w-[80vw] h-[80vw] rounded-full blur-[100px] z-0 pointer-events-none transition-colors duration-[2000ms] opacity-20 dark:opacity-10 mix-blend-screen ${activeCategory === 'Default' ? 'bg-slate-500' : BG_GRADIENTS[activeCategory].split(' ')[0].replace('from-', 'bg-')}`}
      />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/80 px-4 py-4 mb-6 transition-colors duration-500">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
              ORBIT
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
             {/* View Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-full border border-slate-200 dark:border-white/10">
              <button 
                onClick={() => setViewMode('daily')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition-all ${viewMode === 'daily' ? 'bg-white dark:bg-white text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Daily
              </button>
              <button 
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition-all ${viewMode === 'weekly' ? 'bg-white dark:bg-white text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Report
              </button>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={handleThemeCycle}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 shadow-sm"
              title={`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            >
              {theme === 'dark' && <Moon className="w-4 h-4" />}
              {theme === 'light' && <Sun className="w-4 h-4" />}
              {theme === 'system' && <Monitor className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-4">
        
        {/* Day Selector (Only in Daily Mode) */}
        {viewMode === 'daily' && (
           <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 py-2">
            {DAYS_OF_WEEK.map((d, idx) => (
              <button
                key={d}
                onClick={() => setCurrentDayIndex(idx)}
                className={`
                  flex-shrink-0 px-5 py-2 rounded-lg font-mono text-xs uppercase tracking-widest border transition-all duration-300
                  ${idx === currentDayIndex 
                    ? 'border-cyan-500/50 bg-cyan-100 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 shadow-lg dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                    : 'border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-600 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-800 dark:hover:text-slate-300'}
                `}
              >
                {d.slice(0, 3)}
              </button>
            ))}
           </div>
        )}

        {/* Content Area */}
        {viewMode === 'daily' ? (
          <DailyView 
            dayName={currentDayName} 
            slots={currentSlots} 
            onToggleSlot={handleToggleSlot} 
          />
        ) : (
          <WeeklyReport schedule={schedule} />
        )}

      </main>
    </div>
  );
};

export default App;