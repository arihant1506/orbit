import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { WeekSchedule, ScheduleSlot } from '../types';
import { AlertTriangle, Award, Activity, Crosshair } from 'lucide-react';

interface WeeklyReportProps {
  schedule: WeekSchedule;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({ schedule }) => {
  // Aggregate data
  const categoryStats: Record<string, { total: number; completed: number }> = {};
  
  Object.values(schedule).flat().forEach((slot: ScheduleSlot) => {
    if (!categoryStats[slot.category]) {
      categoryStats[slot.category] = { total: 0, completed: 0 };
    }
    categoryStats[slot.category].total += 1;
    if (slot.isCompleted) {
      categoryStats[slot.category].completed += 1;
    }
  });

  const chartData = Object.keys(categoryStats).map(cat => {
    const { total, completed } = categoryStats[cat];
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return {
      name: cat,
      completed,
      total,
      percentage,
      fullMark: 100,
    };
  }).filter(d => d.name !== 'Logistics');

  const sortedByPerf = [...chartData].sort((a, b) => a.percentage - b.percentage);
  const worstCategory = sortedByPerf[0];
  const bestCategory = sortedByPerf[sortedByPerf.length - 1];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-bold text-slate-800 dark:text-white font-mono uppercase tracking-widest text-xs mb-1">{label}</p>
          <p className="text-xl font-black text-cyan-500 dark:text-cyan-400">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WEAKNESS */}
        <div className="group relative overflow-hidden bg-white/50 dark:bg-slate-900/40 border border-red-200 dark:border-red-500/20 p-6 rounded-3xl hover:border-red-400 dark:hover:border-red-500/40 transition-all duration-300 shadow-sm">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/10 dark:group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">Critical Failure</h3>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">
            {worstCategory?.name || 'N/A'}
          </div>
          <p className="text-xs text-slate-500 mb-4 font-mono">
             PERFORMANCE AT {worstCategory?.percentage || 0}%
          </p>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${worstCategory?.percentage || 0}%` }}></div>
          </div>
        </div>

        {/* STRENGTH */}
        <div className="group relative overflow-hidden bg-white/50 dark:bg-slate-900/40 border border-green-200 dark:border-green-500/20 p-6 rounded-3xl hover:border-green-400 dark:hover:border-green-500/40 transition-all duration-300 shadow-sm">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/10 dark:group-hover:bg-green-500/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400">
              <Award className="w-5 h-5" />
            </div>
             <h3 className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">Dominating</h3>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">
            {bestCategory?.name || 'ALL'}
          </div>
          <p className="text-xs text-slate-500 mb-4 font-mono">
             PERFORMANCE AT {bestCategory?.percentage || 0}%
          </p>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: `${bestCategory?.percentage || 0}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-sm">
        <h3 className="text-sm font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> System Consistency
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{fill: '#94a3b8', fontFamily: 'Space Grotesk'}}
                dy={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(148, 163, 184, 0.1)', radius: 8}} />
              <Bar dataKey="percentage" radius={[6, 6, 6, 6]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.percentage < 50 ? '#ef4444' : entry.percentage < 80 ? '#38bdf8' : '#39ff14'} 
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden shadow-sm">
         <div className="absolute top-0 right-0 p-6 opacity-20">
           <Crosshair className="w-16 h-16 text-purple-500 animate-spin-slow" />
         </div>
         <h3 className="text-sm font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Life Balance Matrix</h3>
         <p className="text-xs text-slate-500 dark:text-slate-600 mb-6 font-mono">OPTIMIZE FOR MAXIMUM SYNCHRONIZATION</p>
         <div className="h-72 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} strokeDasharray="3 3" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Grotesk' }} 
                />
                <Radar 
                  name="Stats" 
                  dataKey="percentage" 
                  stroke="#d946ef" 
                  strokeWidth={3}
                  fill="#d946ef" 
                  fillOpacity={0.2} 
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};