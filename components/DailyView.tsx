import React, { useState, useEffect } from 'react';
import { ScheduleSlot, Category } from '../types';
import { Check, Zap, Target, Terminal, Cpu, Dumbbell, Palette, Coffee, Briefcase, Activity, Sparkles, Flame, Moon, Anchor, Radio, Sun, Sunset, Sunrise } from 'lucide-react';

interface DailyViewProps {
  dayName: string;
  slots: ScheduleSlot[];
  onToggleSlot: (day: string, slotId: string) => void;
}

// --- Icons & Labels ---
const getCategoryIcon = (cat: Category) => {
  switch (cat) {
    case 'Physical': return <Flame className="w-3 h-3" />;
    case 'Academic': return <Cpu className="w-3 h-3" />;
    case 'Coding': return <Terminal className="w-3 h-3" />;
    case 'Creative': return <Palette className="w-3 h-3" />;
    case 'Rest': return <Moon className="w-3 h-3" />;
    case 'Logistics': return <Anchor className="w-3 h-3" />;
    default: return <Activity className="w-3 h-3" />;
  }
};

const getProtocolLabel = (cat: Category) => {
   switch (cat) {
    case 'Physical': return "HYPER // KINETIC";
    case 'Academic': return "NEURO // LINK";
    case 'Coding': return "MATRIX // DIVE";
    case 'Creative': return "VISION // SYNTH";
    case 'Rest': return "ZEN // RESTORE";
    case 'Logistics': return "BASE // OPS";
    default: return "SYS // TASK";
  }
};

// --- Aesthetic Engine ---
const THEME_CONFIG: Record<Category, {
  containerStyle: string; // Background, Border, Inset Shadow (The "Edge Tint")
  textColor: string;
  dimColor: string;
  fillGradient: string;
  dropShadow: string;
  accentBg: string;
  ring: string;
  checkboxBase: string;
  transition: string; 
}> = {
  Physical: {
    containerStyle: 'bg-orange-50/80 dark:bg-slate-900/40 border-orange-300 dark:border-orange-500/40 shadow-[inset_0_0_40px_-5px_rgba(249,115,22,0.4)] dark:shadow-[inset_0_0_60px_-20px_rgba(249,115,22,0.25)]',
    textColor: 'text-orange-900 dark:text-orange-400',
    dimColor: 'text-orange-800/70 dark:text-orange-400/50',
    fillGradient: 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500',
    dropShadow: 'shadow-[0_4px_20px_-4px_rgba(249,115,22,0.4)] dark:shadow-[0_0_25px_-5px_rgba(249,115,22,0.2)]',
    accentBg: 'bg-orange-200 dark:bg-orange-500/20',
    ring: 'group-hover:ring-orange-500',
    checkboxBase: 'bg-orange-100/80 dark:bg-black/20',
    transition: 'duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]' 
  },
  Academic: {
    containerStyle: 'bg-cyan-50/80 dark:bg-slate-900/40 border-cyan-300 dark:border-cyan-500/40 shadow-[inset_0_0_40px_-5px_rgba(6,182,212,0.4)] dark:shadow-[inset_0_0_60px_-20px_rgba(6,182,212,0.25)]',
    textColor: 'text-cyan-900 dark:text-cyan-400',
    dimColor: 'text-cyan-800/70 dark:text-cyan-400/50',
    fillGradient: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500',
    dropShadow: 'shadow-[0_4px_20px_-4px_rgba(6,182,212,0.4)] dark:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)]',
    accentBg: 'bg-cyan-200 dark:bg-cyan-500/20',
    ring: 'group-hover:ring-cyan-400',
    checkboxBase: 'bg-cyan-100/80 dark:bg-black/20',
    transition: 'duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]' 
  },
  Coding: {
    containerStyle: 'bg-emerald-50/80 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-500/40 shadow-[inset_0_0_40px_-5px_rgba(16,185,129,0.4)] dark:shadow-[inset_0_0_60px_-20px_rgba(16,185,129,0.25)]',
    textColor: 'text-emerald-900 dark:text-emerald-400',
    dimColor: 'text-emerald-800/70 dark:text-emerald-400/50',
    fillGradient: 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500',
    dropShadow: 'shadow-[0_4px_20px_-4px_rgba(16,185,129,0.4)] dark:shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]',
    accentBg: 'bg-emerald-200 dark:bg-emerald-500/20',
    ring: 'group-hover:ring-emerald-400',
    checkboxBase: 'bg-emerald-100/80 dark:bg-black/20',
    transition: 'duration-500 ease-[steps(10,end)]'
  },
  Creative: {
    containerStyle: 'bg-fuchsia-50/80 dark:bg-slate-900/40 border-fuchsia-300 dark:border-fuchsia-500/40 shadow-[inset_0_0_40px_-5px_rgba(217,70,239,0.4)] dark:shadow-[inset_0_0_60px_-20px_rgba(217,70,239,0.25)]',
    textColor: 'text-fuchsia-900 dark:text-fuchsia-400',
    dimColor: 'text-fuchsia-800/70 dark:text-fuchsia-400/50',
    fillGradient: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500',
    dropShadow: 'shadow-[0_4px_20px_-4px_rgba(217,70,239,0.4)] dark:shadow-[0_0_25px_-5px_rgba(217,70,239,0.2)]',
    accentBg: 'bg-fuchsia-200 dark:bg-fuchsia-500/20',
    ring: 'group-hover:ring-fuchsia-400',
    checkboxBase: 'bg-fuchsia-100/80 dark:bg-black/20',
    transition: 'duration-[1000ms] ease-[cubic-bezier(0.45,0,0.55,1)]'
  },
  Rest: {
    containerStyle: 'bg-indigo-50/80 dark:bg-slate-900/40 border-indigo-300 dark:border-indigo-500/40 shadow-[inset_0_0_40px_-5px_rgba(99,102,241,0.4)] dark:shadow-[inset_0_0_60px_-20px_rgba(99,102,241,0.25)]',
    textColor: 'text-indigo-900 dark:text-indigo-400',
    dimColor: 'text-indigo-800/70 dark:text-indigo-400/50',
    fillGradient: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500',
    dropShadow: 'shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)] dark:shadow-[0_0_25px_-5px_rgba(99,102,241,0.2)]',
    accentBg: 'bg-indigo-200 dark:bg-indigo-500/20',
    ring: 'group-hover:ring-indigo-400',
    checkboxBase: 'bg-indigo-100/80 dark:bg-black/20',
    transition: 'duration-[1500ms] ease-in-out'
  },
  Logistics: {
    containerStyle: 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-300 dark:border-slate-500/40 shadow-[inset_0_0_40px_-5px_rgba(148,163,184,0.4)] dark:shadow-[inset_0_0_60px_-20px_rgba(148,163,184,0.25)]',
    textColor: 'text-slate-800 dark:text-slate-400',
    dimColor: 'text-slate-600 dark:text-slate-500',
    fillGradient: 'bg-gradient-to-r from-slate-400 via-gray-400 to-slate-400',
    dropShadow: 'shadow-[0_4px_20px_-4px_rgba(148,163,184,0.4)] dark:shadow-[0_0_25px_-5px_rgba(148,163,184,0.2)]',
    accentBg: 'bg-slate-200 dark:bg-slate-500/10',
    ring: 'group-hover:ring-slate-400',
    checkboxBase: 'bg-slate-100/80 dark:bg-black/20',
    transition: 'duration-500 ease-out'
  },
};

export const DailyView: React.FC<DailyViewProps> = ({ dayName, slots, onToggleSlot }) => {
  const [greeting, setGreeting] = useState<{ text: string, icon: React.ReactNode, subtext: string }>({ 
    text: '', icon: null, subtext: '' 
  });

  // Time-based Greeting Logic
  useEffect(() => {
    const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
          setGreeting({ 
            text: "GOOD MORNING", 
            icon: <Sunrise className="w-4 h-4 text-orange-400 animate-pulse-slow" />,
            subtext: "INITIALIZING PROTOCOLS" 
          });
        } else if (hour >= 12 && hour < 17) {
          setGreeting({ 
            text: "GOOD AFTERNOON", 
            icon: <Sun className="w-4 h-4 text-yellow-400 animate-spin-slow" />,
            subtext: "SYSTEMS OPERATIONAL" 
          });
        } else if (hour >= 17 && hour < 22) {
          setGreeting({ 
            text: "GOOD EVENING", 
            icon: <Sunset className="w-4 h-4 text-purple-400 animate-pulse" />,
            subtext: "REVIEW & DEBRIEF" 
          });
        } else {
          setGreeting({ 
            text: "NIGHT OPS", 
            icon: <Moon className="w-4 h-4 text-indigo-400" />,
            subtext: "STANDBY MODE" 
          });
        }
    };
    
    updateGreeting();
    // Update every minute just in case the boundary is crossed while app is open
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-950/50 p-8 text-center text-slate-400 dark:text-slate-500 animate-pulse">
        <Target className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-mono text-sm uppercase tracking-widest">No Objectives Found // Standby</p>
      </div>
    );
  }

  const completed = slots.filter(s => s.isCompleted).length;
  const total = slots.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="animate-fade-in-up">
      {/* Header Dashboard */}
      <div className="relative mb-6 sm:mb-10 p-6 sm:p-8 rounded-[2rem] bg-slate-900 dark:bg-slate-950 border border-slate-700 dark:border-white/5 overflow-hidden shadow-2xl ring-1 ring-white/5">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-50%] right-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-600/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow"></div>
           <div className="absolute bottom-[-50%] left-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-cyan-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
        </div>
        
        {/* Top Row: Title & Percentage */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] mb-2 sm:mb-3 opacity-80">
              <Zap className="w-3 h-3" />
              <span>Orbit Interface v3.2</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white uppercase font-sans drop-shadow-xl">
              {dayName}
            </h2>
          </div>
          <div className="flex items-center justify-between sm:block sm:text-right">
             <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Synchronization</div>
            <div className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600 font-mono tracking-tighter leading-none">
              {progress}%
            </div>
          </div>
        </div>

        {/* --- GREETING BAR SLOT (UPSIDE PROGRESS BAR) --- */}
        <div className="relative z-10 mb-3 flex flex-wrap items-center gap-3">
             {/* Time-Aware Greeting Slot */}
             <div className="flex-1 min-w-[200px] animate-typewriter px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 group hover:bg-white/10 transition-colors">
                  {greeting.icon}
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-black font-mono uppercase tracking-widest text-white group-hover:text-cyan-200 transition-colors">
                      {greeting.text}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-[0.2em]">
                       {greeting.subtext}
                    </span>
                  </div>
             </div>
             
             {/* Pilot Badge */}
             <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-md flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200">
                     Pilot:
                  </span>
                  <span className="text-sm font-black italic bg-clip-text text-transparent bg-[linear-gradient(110deg,#e9d5ff,45%,#ffffff,55%,#e9d5ff)] bg-[length:250%_100%] animate-shimmer drop-shadow-[0_0_8px_rgba(216,180,254,0.6)]">
                     ARIHANT
                  </span>
             </div>
        </div>

        {/* Liquid Progress Bar */}
        <div className="h-2 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Slot List */}
      <div className="space-y-4 sm:space-y-5 pb-32">
        {slots.map((slot) => {
          const isDone = slot.isCompleted;
          const theme = THEME_CONFIG[slot.category] || THEME_CONFIG.Logistics;
          
          // Time parsing
          const rawStart = slot.timeRange.split(' - ')[0];
          const match = rawStart.match(/^(\d{1,2}:\d{2})\s?([AP]M)?/i);
          let timeDigits = rawStart;
          let timeMeridian = '';
          if (match) {
             timeDigits = match[1];
             timeMeridian = match[2] || (slot.timeRange.includes('PM') && !slot.timeRange.includes('AM') ? 'PM' : 'AM');
          } else if (rawStart.toLowerCase().includes('all day')) {
             timeDigits = "ALL";
             timeMeridian = "DAY";
          }

          return (
            <div 
              key={slot.id}
              onClick={() => onToggleSlot(dayName, slot.id)}
              className={`
                group relative cursor-pointer select-none
                transform transition-all duration-500
                ${isDone ? 'scale-[0.99] opacity-90' : 'hover:-translate-y-1 hover:scale-[1.01]'}
              `}
            >
               {/* Main Card Container */}
               <div 
                 className={`
                   relative overflow-hidden rounded-2xl
                   border transition-all
                   ${theme.containerStyle}
                   ${theme.dropShadow}
                   backdrop-blur-md
                 `}
               >
                 {/* --- WIPE OUT ANIMATION LAYER --- */}
                 <div 
                   className={`
                     absolute inset-0 z-0 
                     ${theme.fillGradient} 
                     transition-transform origin-left
                     ${theme.transition}
                     ${isDone ? 'scale-x-100' : 'scale-x-0'}
                   `}
                 >
                   {/* Internal shine/wave effect for the liquid fill */}
                   <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                 </div>

                 {/* --- CONTENT LAYER --- */}
                 <div className="relative z-10 p-0 flex items-stretch min-h-[80px] sm:min-h-[90px]">
                    
                    {/* Checkbox Strip */}
                    <div className={`
                      w-12 sm:w-16 flex flex-col items-center justify-center border-r border-slate-900/5 dark:border-white/5 
                      ${theme.checkboxBase}
                    `}>
                        <div className={`
                           w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center transition-all duration-500
                           rounded-lg border-2
                           ${isDone 
                             ? 'bg-white border-white text-slate-900 scale-110 rotate-3 shadow-lg' 
                             : `bg-white/50 dark:bg-slate-900/50 border-slate-400/50 dark:border-slate-600 text-transparent group-hover:border-slate-500 dark:group-hover:border-white/50 ${theme.ring}`}
                        `}>
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[4]" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex items-center pl-3 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-4 min-w-0">
                        <div className="flex flex-col flex-1 min-w-0">
                           {/* Row: Category + Time (Mobile) */}
                           <div className="flex items-center justify-between mb-1.5 sm:mb-1">
                               <div className={`
                                 flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase
                                 transition-colors duration-300
                                 ${isDone ? 'text-white/90' : theme.textColor}
                               `}>
                                   <span className={`p-1 rounded-sm shadow-sm ${isDone ? 'bg-white/20' : theme.accentBg}`}>
                                      {getCategoryIcon(slot.category)}
                                   </span>
                                   <span className="font-bold truncate">{getProtocolLabel(slot.category)}</span>
                               </div>
                               
                               {/* Mobile Time Display */}
                               <div className={`
                                 sm:hidden text-[10px] font-bold font-mono tracking-wider
                                 ${isDone ? 'text-white/80' : theme.dimColor}
                               `}>
                                  {timeDigits} {timeMeridian}
                               </div>
                           </div>

                           {/* Title */}
                           <h3 className={`
                             font-sans font-bold text-lg sm:text-xl leading-snug tracking-tight mb-1 break-words
                             transition-colors duration-300
                             ${isDone ? 'text-white drop-shadow-md' : 'text-slate-900 dark:text-slate-100 group-hover:text-black dark:group-hover:text-white'}
                           `}>
                             {slot.title}
                           </h3>
                           
                           {/* Description / Notes */}
                           {(!isDone || slot.notes) && (
                             <div className={`
                               text-[10px] sm:text-xs font-mono flex flex-wrap items-center gap-2 mt-0.5
                               transition-colors duration-300
                               ${isDone ? 'text-white/80' : theme.dimColor}
                             `}>
                               {slot.description && <span className="truncate max-w-full">{slot.description}</span>}
                               {slot.notes && (
                                 <span className="flex items-center gap-1 opacity-80 whitespace-nowrap">
                                   <Sparkles className="w-2 h-2" /> {slot.notes}
                                 </span>
                               )}
                             </div>
                           )}
                        </div>

                        {/* Large Time Display (Desktop Only) */}
                        <div className="text-right pl-4 border-l border-slate-900/5 dark:border-white/5 hidden sm:block shrink-0 ml-4">
                           <div className={`
                             text-3xl font-black font-mono tracking-tighter leading-none
                             transition-colors duration-300
                             ${isDone ? 'text-white drop-shadow-sm' : theme.textColor}
                           `}>
                              {timeDigits}
                           </div>
                           <div className={`
                             text-[10px] font-bold tracking-[0.3em] uppercase mt-1
                             transition-colors duration-300
                             ${isDone ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}
                           `}>
                             {timeMeridian}
                           </div>
                        </div>
                    </div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};